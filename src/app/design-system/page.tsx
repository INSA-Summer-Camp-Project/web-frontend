"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Rating } from "@/components/ui/Rating";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { Mail, ShieldAlert, CheckCircle, XCircle } from "lucide-react";

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(3.5);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-16">
      <div>
        <h1 className="text-4xl font-serif font-bold text-ink mb-4">
          ServiceHub Design System
        </h1>
        <p className="text-ink-muted text-lg">
          A visual showcase of all components based on Figma design tokens.
        </p>
      </div>

      <hr className="border-border" />

      {/* BUTTONS */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-serif text-ink">Buttons</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-ink-muted">Primary</h3>
            <Button variant="primary">Default</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button variant="primary" isLoading>
              Loading
            </Button>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-ink-muted">Secondary</h3>
            <Button variant="secondary">Default</Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
            <Button variant="secondary" isLoading>
              Loading
            </Button>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-ink-muted">Outline</h3>
            <Button variant="outline">Default</Button>
            <Button variant="outline" disabled>
              Disabled
            </Button>
            <Button variant="outline" isLoading>
              Loading
            </Button>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-ink-muted">Ghost</h3>
            <Button variant="ghost">Default</Button>
            <Button variant="ghost" disabled>
              Disabled
            </Button>
            <Button variant="ghost" isLoading>
              Loading
            </Button>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-ink-muted">
              Destructive
            </h3>
            <Button variant="destructive">Default</Button>
            <Button variant="destructive" disabled>
              Disabled
            </Button>
            <Button variant="destructive" isLoading>
              Loading
            </Button>
          </div>
        </div>
      </section>

      {/* INPUTS */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-serif text-ink">Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Input label="Default" placeholder="Enter text..." />
          <Input
            label="With Icon"
            placeholder="Email address"
            leftIcon={<Mail size={18} />}
          />
          <Input
            label="Error State"
            placeholder="Invalid input"
            error="This field is required"
            rightIcon={<ShieldAlert size={18} />}
          />
          <Input label="Disabled" placeholder="Cannot type here" disabled />
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
          />
        </div>
      </section>

      {/* BADGES & AVATARS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-serif text-ink">Badges</h2>
          <div className="flex flex-wrap gap-4">
            <Badge variant="success" leftIcon={<CheckCircle size={14} />}>
              Success
            </Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error" leftIcon={<XCircle size={14} />}>
              Error
            </Badge>
            <Badge variant="primary">Info</Badge>
            <Badge variant="default">Neutral</Badge>
            <Badge variant="accent">Accent</Badge>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-serif text-ink">Avatars</h2>
          <div className="flex items-end gap-6">
            <Avatar size="sm" name="Sarah Marshall" />
            <Avatar size="md" name="Mark Doe" />
            <Avatar size="lg" name="Liam Gallagher" />
            <Avatar size="xl" name="Xander Lin" />
          </div>
        </div>
      </section>

      {/* RATINGS */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-serif text-ink">Ratings</h2>
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-semibold text-ink-muted mb-2">
              Readonly (Display)
            </h3>
            <Rating value={4.5} readonly allowHalf size="lg" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-muted mb-2">
              Interactive (Current: {rating})
            </h3>
            <Rating value={rating} onChange={setRating} allowHalf size="lg" />
          </div>
        </div>
      </section>

      {/* OVERLAYS */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-serif text-ink">
          Overlays (Modals & Toasts)
        </h2>
        <div className="flex gap-4">
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            Open Modal
          </Button>
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Design System Modal"
            description="This modal uses Radix UI under the hood for full accessibility, focus trapping, and screen reader support."
          >
            <div className="py-4 text-ink-secondary text-sm">
              You can put any content here. Forms, confirmations, or detailed
              information.
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setModalOpen(false)}>
                Confirm
              </Button>
            </div>
          </Modal>

          <Button
            variant="outline"
            onClick={() => toast("Standard notification")}
          >
            Default Toast
          </Button>
          <Button
            className="bg-success text-success-text hover:bg-success-light"
            onClick={() => toast.success("Job posted successfully!")}
          >
            Success Toast
          </Button>
          <Button
            variant="destructive"
            onClick={() => toast.error("Failed to connect to server.")}
          >
            Error Toast
          </Button>
        </div>
      </section>

      <div className="pb-24"></div>
    </div>
  );
}
