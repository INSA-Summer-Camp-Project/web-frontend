export type ReportReason =
  "SCAM" | "INAPPROPRIATE_BEHAVIOR" | "NO_SHOW" | "POOR_QUALITY" | "OTHER";

export interface Report {
  id: string;
  reporterId: string;
  reportedId: string;
  jobId?: string | null;
  reason: ReportReason;
  description: string;
  status: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
  createdAt: string;
  updatedAt?: string;
  reporter?: {
    id: string;
    name: string;
  };
  reported?: {
    id: string;
    name: string;
  };
  job?: {
    id: string;
    title: string;
  };
}

export interface CreateReportPayload {
  reportedId?: string;
  reportedUserId?: string; // alias
  jobId?: string | null;
  reason: ReportReason;
  description: string;
}

export interface UpdateReportStatusPayload {
  status: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
}
