import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Diagram Editor",
  description:
    "Drag components onto an infinite canvas, connect them with clean lines, set live status and export a PNG. Free, no sign-up, saved in your browser.",
  alternates: { canonical: "/editor" },
  openGraph: { url: "/editor", title: "Diagram Editor | System Design Visualizer", images: [OG_IMAGE] },
  twitter: { images: [OG_IMAGE] },
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
