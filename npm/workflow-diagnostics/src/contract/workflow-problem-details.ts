export type WorkflowProblemSnapshot = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  traceId?: string;
  errors?: Record<string, string[]>;
  extensions?: Record<string, string | null | undefined>;
};

export type WorkflowFailureChainEntry = {
  service: string;
  operation: string;
  status?: number;
  traceId?: string;
  requestId?: string;
  instance?: string;
  message?: string;
  timestampUtc?: string;
  problem?: WorkflowProblemSnapshot | null;
};

export type WorkflowFailureChainReport = {
  summary: string;
  failureChain: readonly WorkflowFailureChainEntry[];
};
