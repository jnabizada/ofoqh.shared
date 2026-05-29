namespace Ofoqh.Workflow.Diagnostics.Models;

public sealed record WorkflowFailureChainEntry(
    string Service,
    string Operation,
    int? Status = null,
    string? TraceId = null,
    string? RequestId = null,
    string? Instance = null,
    string? Message = null,
    DateTimeOffset? TimestampUtc = null,
    WorkflowProblemSnapshot? Problem = null
    );
