"use client";

import React, { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { jobKeys } from "@/hooks/useJobs";
import { useVerifyPayment } from "@/hooks/usePayments";
import { Spinner } from "@/components/ui/Spinner";

export default function CheckoutSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const jobId = params.jobId as string;
  const txRef = searchParams.get("tx_ref");

  const { data, isLoading, isError } = useVerifyPayment(txRef);
  const status = data?.status;

  useEffect(() => {
    // Invalidate job data so it refetches and shows updated status
    if (jobId && status === "PAID") {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: jobKeys.customerJobs() });
    }
  }, [jobId, status, queryClient]);

  let content;

  if (!txRef) {
    content = (
      <div className="space-y-4">
        <XCircle size={40} className="text-error mx-auto" />
        <h1 className="text-2xl font-serif font-bold text-ink">Invalid Request</h1>
        <p className="text-ink-secondary">Missing transaction reference.</p>
      </div>
    );
  } else if (isLoading) {
    content = (
      <div className="space-y-4 flex flex-col items-center">
        <Spinner size="lg" />
        <h1 className="text-2xl font-serif font-bold text-ink">Verifying Payment...</h1>
        <p className="text-ink-secondary">Please wait while we confirm your payment.</p>
      </div>
    );
  } else if (isError || status === "FAILED") {
    content = (
      <div className="space-y-4">
        <XCircle size={40} className="text-error mx-auto" />
        <h1 className="text-2xl font-serif font-bold text-ink">Payment Failed</h1>
        <p className="text-ink-secondary">There was an issue processing your payment.</p>
      </div>
    );
  } else if (status === "PENDING") {
    content = (
      <div className="space-y-4">
        <Clock size={40} className="text-warning mx-auto" />
        <h1 className="text-2xl font-serif font-bold text-ink">Payment Pending</h1>
        <p className="text-ink-secondary">Your payment is still being processed.</p>
      </div>
    );
  } else {
    content = (
      <div className="space-y-4">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={40} className="text-success" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-ink">Payment Successful!</h1>
        <p className="text-ink-secondary">
          Your payment has been securely escrowed. The worker has been notified to begin the job.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-surface border border-border shadow-md rounded-lg p-8 max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
        
        {content}

        {txRef && (
          <div className="text-xs text-ink-muted bg-surface-alt p-2 rounded-sm font-mono">
            Ref: {txRef}
          </div>
        )}

        <div className="pt-6 border-t border-border flex flex-col gap-3">
          <Link href={`/customer/jobs/${jobId}`}>
            <Button variant="primary" className="w-full">
              View Job Dashboard
            </Button>
          </Link>

          <Link href="/customer/dashboard">
            <Button
              variant="outline"
              className="w-full border-transparent hover:bg-surface-alt"
            >
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
