import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "{{PROJECT_NAME}}",
  description: "A Next.js + Stripe SaaS starter by NullPointerCo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
