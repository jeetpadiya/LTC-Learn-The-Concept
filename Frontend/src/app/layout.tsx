import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LTC (Learn The Concept) — Data Structures & Algorithms",
  description: "Instructional 3D visualization and deep conceptual breakdown for algorithms and data structures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}
