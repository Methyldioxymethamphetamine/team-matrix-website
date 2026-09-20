import type { Metadata } from "next";
import AdminPanel from "@/components/AdminPanel";

// Keeps this page out of search results — it's still reachable at /admin for
// anyone who has the URL, this just stops it from being indexed/crawled.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return <AdminPanel />;
}
