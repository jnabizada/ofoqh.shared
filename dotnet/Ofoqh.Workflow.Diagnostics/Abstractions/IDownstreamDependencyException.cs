namespace Ofoqh.Workflow.Diagnostics.Abstractions;

public interface IDownstreamDependencyException : IWorkflowFailureException
{
    string DependencyName { get; }

    string Operation { get; }

    int? StatusCode { get; }

    bool IsTimeout { get; }
}
