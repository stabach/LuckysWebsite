import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin",
  description: "Lucky's Loot admin management architecture."
};

export default function AdminPage() {
  return <AdminDashboard />;
}
