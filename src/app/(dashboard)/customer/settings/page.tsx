import { SettingsView } from "@/components/features/settings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Customer Portal",
};

export default function CustomerSettingsPage() {
  return <SettingsView />;
}
