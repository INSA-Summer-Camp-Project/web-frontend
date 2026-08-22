import React from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Star, Briefcase, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkerProfile } from "@/types";

export interface WorkerCardProps {
  worker: WorkerProfile;
  className?: string;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  worker,
  className,
}) => {
  const displayName = worker.user?.name || "Professional";
  const avatarSrc = worker.user?.photoUrl || worker.user?.avatarUrl;
  const rating = Number(worker.ratingAvg || 0).toFixed(1);
  const jobsCompleted = worker._count?.completedJobs || 0;
  
  // Get first 3 categories
  const categories = worker.services?.slice(0, 3).map((s) => s.category.name) || [];

  return (
    <div 
      className={cn(
        "bg-surface border border-border rounded-md shadow-xs overflow-hidden hover:shadow-sm transition-shadow flex flex-col",
        className
      )}
    >
      <div className="p-5 flex-1">
        <div className="flex items-start gap-4">
          <Avatar src={avatarSrc} name={displayName} size="xl" />
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-lg font-bold text-ink truncate">
                {displayName}
              </h3>
              
              <div className="flex items-center gap-1 bg-surface-alt px-1.5 py-0.5 rounded-sm text-sm font-semibold">
                <Star size={14} className="text-warning fill-warning" />
                <span>{rating}</span>
              </div>
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {categories.map((cat) => (
                  <Badge key={cat} variant="default" className="text-[10px]">
                    {cat}
                  </Badge>
                ))}
              </div>
            )}
            
            <p className="text-sm text-ink-secondary mt-3 line-clamp-2 leading-relaxed">
              {worker.bio || "No description provided."}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <Briefcase size={16} />
            <span>{jobsCompleted} jobs done</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <MapPin size={16} />
            <span>Local Area</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-surface-alt border-t border-border flex gap-3">
        <Link href={`/worker/${worker.id}`} className="flex-1">
          <Button variant="outline" className="w-full bg-surface">
            View Profile
          </Button>
        </Link>
        <Link href={`/customer/jobs/new?workerId=${worker.id}`} className="flex-1">
          <Button variant="primary" className="w-full">
            Hire Me
          </Button>
        </Link>
      </div>
    </div>
  );
};
