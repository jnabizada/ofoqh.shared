namespace Ofoqh.Workflow.Diagnostics.Headers;

public static class WorkflowHeaders
{
    public const string CorrelationId = "X-Correlation-Id";
    public const string RequestId = "X-Request-Id";
    public const string CausationId = "X-Causation-Id";
    public const string WorkflowFailureChain = "X-Workflow-Failure-Chain";
}
