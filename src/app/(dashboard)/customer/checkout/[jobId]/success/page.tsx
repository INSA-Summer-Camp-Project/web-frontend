"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { jobKeys } from "@/hooks/useJobs";

export default function CheckoutSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const jobId = params.jobId as string;
  const txRef = searchParams.get("tx_ref");

  // In a real app, we might want to poll our backend here to confirm 
  // the webhook successfully processed the payment before showing this.
  // For MVP, we assume if they hit this, Chapa redirected them successfully.
  
  useEffect(() => {
    // Invalidate job data so it refetches and shows updated status
    if (jobId) {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: jobKeys.customerJobs() });
    }
  }, [jobId, queryClient]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-surface border border-border shadow-md rounded-lg p-8 max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
        
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={40} className="text-success" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-bold text-ink">
            Payment Successful!
          </h1>
          <p className="text-ink-secondary">
            Your payment has been securely escrowed. The worker has been notified to begin the job.
          </p>
        </div>

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
            <Button variant="outline" className="w-full border-transparent hover:bg-surface-alt">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
