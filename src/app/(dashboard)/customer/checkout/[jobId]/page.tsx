"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useJob } from "@/hooks/useJobs";
import { useCheckout } from "@/hooks/usePayments";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { ShieldCheck, CreditCard, Lock } from "lucide-react";
import { toast } from "@/components/ui/Toast";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  
  const { data: job, isLoading, isError, refetch } = useJob(jobId);
  const { mutate: initializeCheckout, isPending: isCheckingOut } = useCheckout();

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-8">
        <Skeleton className="h-24 w-full" />
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="h-96 w-full md:w-2/3" />
          <Skeleton className="h-64 w-full md:w-1/3" />
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <ErrorState 
          title="Failed to load job details" 
          message="We couldn't retrieve the checkout information. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  // Ensure job is ready for checkout (must have an accepted application / agreed price)
  const acceptedApp = job.applications?.find(a => a.status === "ACCEPTED");
  
  if (!acceptedApp) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <ErrorState 
          title="Checkout Not Available" 
          message="You cannot checkout for this job yet because a worker has not been hired."
          onRetry={() => router.push(`/customer/jobs/${job.id}`)}
          retryLabel="Go back to Job"
        />
      </div>
    );
  }

  const basePrice = acceptedApp.proposedPrice || 0;
  const platformFee = basePrice * 0.05; // 5% fee assumption
  const totalPrice = basePrice + platformFee;

  const handleCheckout = () => {
    initializeCheckout({ jobId: job.id }, {
      onSuccess: (res) => {
        // Redirect to Chapa checkout URL
        window.location.href = res.checkoutUrl;
      },
      onError: (err) => {
        toast.error(err.message || "Failed to initialize payment.");
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <PageHeader 
        title="Secure Checkout" 
        subtitle="Review job details and lock in payment to start work."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Job & Worker Details */}
        <div className="flex-1 space-y-6">
          <div className="bg-surface border border-border rounded-md shadow-xs p-6">
            <h3 className="font-serif font-bold text-lg text-ink mb-4 border-b border-border pb-4">
              Job Summary
            </h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-ink-muted">Title</span>
                <p className="font-semibold text-ink">{job.title}</p>
              </div>
              
              <div>
                <span className="text-sm text-ink-muted">Hired Professional</span>
                <p className="font-semibold text-ink">{acceptedApp.worker?.user?.name || "Worker"}</p>
              </div>

              <div>
                <span className="text-sm text-ink-muted">Category</span>
                <p className="text-ink">{job.category?.name || "Service"}</p>
              </div>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="bg-primary/5 border border-primary/20 rounded-md p-6">
            <div className="flex items-center gap-3 mb-3 text-primary-dark font-bold">
              <ShieldCheck size={24} />
              <h4>Payment Protection Guarantee</h4>
            </div>
            <p className="text-sm text-ink-secondary">
              Your payment is held securely in escrow until the job is completed and you are satisfied with the work. The professional is only paid when you approve.
            </p>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-surface border border-border rounded-md shadow-xs overflow-hidden sticky top-6">
            <div className="bg-surface-alt p-6 border-b border-border">
              <h3 className="font-serif font-bold text-xl text-ink">Order Summary</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-ink-secondary">
                <span>Service Price</span>
                <PriceDisplay amount={basePrice} size="sm" />
              </div>
              <div className="flex justify-between items-center text-ink-secondary">
                <span>Platform Fee (5%)</span>
                <PriceDisplay amount={platformFee} size="sm" />
              </div>
              
              <div className="border-t border-border pt-4 mt-4 flex justify-between items-center font-bold text-lg text-ink">
                <span>Total</span>
                <PriceDisplay amount={totalPrice} size="lg" className="text-primary-dark" />
              </div>
            </div>

            <div className="p-6 bg-surface-alt/50 border-t border-border space-y-4">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full"
                onClick={handleCheckout}
                isLoading={isCheckingOut}
              >
                Pay with Chapa
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-ink-muted">
                <Lock size={12} />
                <span>Secured by Chapa Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
