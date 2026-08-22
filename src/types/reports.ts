export type ReportReason = "INAPPROPRIATE" | "SPAM" | "SCAM" | "OTHER";

export interface Report {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: "USER" | "JOB" | "REVIEW";
  reason: ReportReason;
  description: string;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  createdAt: string;
}

export interface CreateReportPayload {
  targetId: string;
  targetType: "USER" | "JOB" | "REVIEW";
  reason: ReportReason;
  description: string;
}

export interface UpdateReportStatusPayload {
  status: "RESOLVED" | "DISMISSED";
}
