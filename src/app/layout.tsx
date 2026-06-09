import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";

export const metadata: Metadata = {
  title: "AmarBazar | Premium Bangladesh eCommerce",
  description: "Frontend-only premium single-vendor eCommerce experience for Bangladesh.",
  keywords: ["AmarBazar", "Bangladesh ecommerce", "online shopping", "Daraz alternative"],
  openGraph: {
    title: "AmarBazar",
    description: "Premium Bangladesh-focused eCommerce frontend.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
