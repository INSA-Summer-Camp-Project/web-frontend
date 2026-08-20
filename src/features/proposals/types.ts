export type ProposalStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface Proposal {
  id: string;
  jobId: string;
  workerId: string;
  proposedPrice: number;
  estimatedTime: number;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
  worker?: {
    id: string;
    user: {
      id: string;
      name: string;
      avatarUrl?: string | null;
    };
  };
}

export interface CreateProposalPayload {
  jobId: string;
  proposedPrice: number;
  estimatedTime: number;
}
