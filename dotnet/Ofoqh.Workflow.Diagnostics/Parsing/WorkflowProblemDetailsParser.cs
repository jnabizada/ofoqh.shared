using System.Text.Json;
using Ofoqh.Workflow.Diagnostics.Models;

namespace Ofoqh.Workflow.Diagnostics.Parsing;

public static class WorkflowProblemDetailsParser
{
    public static async Task<WorkflowProblemSnapshot?> ReadFromHttpResponseAsync(
        HttpResponseMessage response,
        CancellationToken cancellationToken = default
        )
    {
        var payload = await response.Content.ReadAsStringAsync(cancellationToken);
        return Parse(payload);
    }

    public static WorkflowProblemSnapshot? Parse(string? payload)
    {
        if (string.IsNullOrWhiteSpace(payload))
        {
            return null;
        }

        try
        {
            using var document = JsonDocument.Parse(payload);
            if (document.RootElement.ValueKind is not JsonValueKind.Object)
            {
                return null;
            }

            var root = document.RootElement;
            var type = ReadString(root, "type");
            var title = ReadString(root, "title");
            var status = ReadInt(root, "status");
            var detail = ReadString(root, "detail");
            var instance = ReadString(root, "instance");
            var traceId = ReadString(root, "traceId");
            var errors = ReadErrors(root);
            var extensions = ReadExtensions(root);

            if (type is null &&
                title is null &&
                status is null &&
                detail is null &&
                instance is null &&
                traceId is null &&
                errors is null)
            {
                return null;
            }

            return new WorkflowProblemSnapshot(
                type,
                title,
                status,
                detail,
                instance,
                traceId,
                errors,
                extensions
                );
        }
        catch (JsonException)
        {
            return null;
        }
    }

    private static string? ReadString(JsonElement element, string propertyName)
    {
        return element.TryGetProperty(propertyName, out var property) && property.ValueKind == JsonValueKind.String
            ? property.GetString()
            : null;
    }

    private static int? ReadInt(JsonElement element, string propertyName)
    {
        return element.TryGetProperty(propertyName, out var property) && property.TryGetInt32(out var value)
            ? value
            : null;
    }

    private static IReadOnlyDictionary<string, IReadOnlyList<string>>? ReadErrors(JsonElement root)
    {
        if (!root.TryGetProperty("errors", out var errorsElement) || errorsElement.ValueKind is not JsonValueKind.Object)
        {
            return null;
        }

        var result = new Dictionary<string, IReadOnlyList<string>>(StringComparer.OrdinalIgnoreCase);
        foreach (var property in errorsElement.EnumerateObject())
        {
            var values = property.Value.ValueKind switch
            {
                JsonValueKind.Array => property.Value
                    .EnumerateArray()
                    .Where(item => item.ValueKind == JsonValueKind.String)
                    .Select(item => item.GetString())
                    .Where(item => !string.IsNullOrWhiteSpace(item))
                    .Cast<string>()
                    .ToArray(),
                JsonValueKind.String when !string.IsNullOrWhiteSpace(property.Value.GetString()) => [property.Value.GetString()!],
                _ => [],
            };

            if (values.Length > 0)
            {
                result[property.Name] = values;
            }
        }

        return result.Count > 0 ? result : null;
    }

    private static IReadOnlyDictionary<string, string?>? ReadExtensions(JsonElement root)
    {
        var knownProperties = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "type",
            "title",
            "status",
            "detail",
            "instance",
            "traceId",
            "errors"
        };

        Dictionary<string, string?>? result = null;
        foreach (var property in root.EnumerateObject())
        {
            if (knownProperties.Contains(property.Name))
            {
                continue;
            }

            result ??= new Dictionary<string, string?>(StringComparer.OrdinalIgnoreCase);
            result[property.Name] = property.Value.ValueKind switch
            {
                JsonValueKind.String => property.Value.GetString(),
                JsonValueKind.Null => null,
                _ => property.Value.GetRawText(),
            };
        }

        return result;
    }
}
