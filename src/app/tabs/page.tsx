import type { Metadata } from "next";
import { TabViewer } from "@/components/tabs/tab-viewer";

export const metadata: Metadata = {
  title: "Tabs",
  description: "Gitartabs for øvelser og generering fra akkordprogresjoner.",
};

export default function TabsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Tabs
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          ASCII-tabs for vanlige øvelser, pluss genererte tabs fra
          akkordprogresjoner med fingring.
        </p>
      </header>
      <TabViewer />
    </div>
  );
}
