import type { WorkflowFailureChainEntry } from "../contract/workflow-problem-details";

export const WORKFLOW_PROBLEM_EXTENSIONS = {
  failureChain: "failureChain",
  operatorMessage: "operatorMessage",
  userMessage: "userMessage",
  technicalDetails: "technicalDetails",
  downstreamService: "downstreamService",
  downstreamOperation: "downstreamOperation"
} as const;

export function extractWorkflowFailureChain(problem: Record<string, unknown> | null | undefined): WorkflowFailureChainEntry[] {
  const raw = problem?.[WORKFLOW_PROBLEM_EXTENSIONS.failureChain];
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .filter(item => !!item && typeof item === "object")
    .map(item => item as WorkflowFailureChainEntry);
}

export function summarizeWorkflowFailureChain(problem: Record<string, unknown> | null | undefined): string | null {
  const chain = extractWorkflowFailureChain(problem);
  if (chain.length === 0) {
    return null;
  }

  return chain
    .map(entry => {
      const summary = entry.problem?.detail ?? entry.problem?.title ?? entry.message ?? "Dependency failure";
      return `${entry.service}.${entry.operation}: ${summary}`;
    })
    .join(" -> ");
}
