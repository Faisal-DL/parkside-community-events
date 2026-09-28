import type { Metadata } from "next";
import { scenario } from "@/lib/scenario";
import "./globals.css";

export const metadata: Metadata = {
  title: scenario.name,
  description: scenario.heroDescription,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
