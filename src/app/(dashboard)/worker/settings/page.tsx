import { SettingsView } from "@/components/features/settings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Worker Portal",
};

export default function WorkerSettingsPage() {
  return <SettingsView />;
}
