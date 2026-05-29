namespace Ofoqh.Workflow.Diagnostics.Models;

public sealed record WorkflowFailureChainReport(
    string Summary,
    IReadOnlyList<WorkflowFailureChainEntry> FailureChain
    );
