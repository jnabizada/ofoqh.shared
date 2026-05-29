namespace Ofoqh.Workflow.Diagnostics.Models;

public sealed record WorkflowProblemSnapshot(
    string? Type = null,
    string? Title = null,
    int? Status = null,
    string? Detail = null,
    string? Instance = null,
    string? TraceId = null,
    IReadOnlyDictionary<string, IReadOnlyList<string>>? Errors = null,
    IReadOnlyDictionary<string, string?>? Extensions = null
    );
