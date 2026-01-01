import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Business Intelligence AI Agent",
  description:
    "Analyze business communications for intent, risk, and recommended actions."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
