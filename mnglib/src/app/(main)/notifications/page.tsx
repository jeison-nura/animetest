import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function NotificationsPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="font-display text-2xl font-bold text-ink-muted">
        Notifications — coming soon
      </h1>
    </div>
  );
}
