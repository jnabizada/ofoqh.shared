using Ofoqh.Workflow.Diagnostics.Models;

namespace Ofoqh.Workflow.Diagnostics.Abstractions;

public interface IWorkflowFailureException
{
    IReadOnlyList<WorkflowFailureChainEntry> FailureChain { get; }
}
