using Xunit;
using Ofoqh.Workflow.Diagnostics.Parsing;

namespace Ofoqh.Workflow.Diagnostics.Tests.Parsing;

public sealed class WorkflowProblemDetailsParserTests
{
    [Fact]
    public void Parse_ReturnsStructuredProblem_WhenPayloadMatchesContract()
    {
        const string payload = """
        {
          "type": "https://httpstatuses.com/403",
          "title": "Forbidden",
          "status": 403,
          "detail": "Missing required scope.",
          "instance": "/api/tenant/invites",
          "traceId": "idp-trace",
          "errors": {
            "scope": ["idp:tenant:write is required"]
          },
          "downstreamService": "identity"
        }
        """;

        var result = WorkflowProblemDetailsParser.Parse(payload);

        Assert.NotNull(result);
        Assert.Equal("Forbidden", result!.Title);
        Assert.Equal(403, result.Status);
        Assert.Equal("idp-trace", result.TraceId);
        Assert.Equal("idp:tenant:write is required", result.Errors!["scope"][0]);
        Assert.Equal("identity", result.Extensions!["downstreamService"]);
    }

    [Fact]
    public void Parse_ReturnsNull_WhenPayloadIsNotJsonObject()
    {
        var result = WorkflowProblemDetailsParser.Parse("[]");

        Assert.Null(result);
    }
}
