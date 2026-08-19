import React from "react";

export interface NavLink {
  label: string;
  href: string;
}

export interface StepItem {
  icon: React.ReactNode;
  step: string;
  title: string;
  description: string;
}

export interface ServiceItem {
  icon: React.ReactNode;
  label: string;
}

export interface PerkItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  initials: string;
  rating: number;
  text: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface FooterLinkGroups {
  [category: string]: string[];
}
