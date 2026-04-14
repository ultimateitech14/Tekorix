import type { Metadata } from "next";
import { Inter, Manrope, Space_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { tekorixBrand } from "@/lib/constants/branding";
import { publicBrandContent } from "@/lib/constants/public-content";
import { env } from "@/lib/env";
import { seoSiteName } from "@/lib/seo";
import "./globals.css";

const display = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const mono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: seoSiteName,
    template: `%s | ${seoSiteName}`,
  },
  description: publicBrandContent.defaultMetaDescription,
  icons: {
    icon: [{ url: tekorixBrand.logo.src, type: "image/png" }],
    shortcut: [tekorixBrand.logo.src],
    apple: [{ url: tekorixBrand.logo.src, type: "image/png" }],
  },
  openGraph: {
    siteName: seoSiteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${display.variable} ${sans.variable} ${mono.variable} min-h-screen bg-[#E6F1FF] text-slate-900 antialiased`}
      >
        {children}
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  );
}
