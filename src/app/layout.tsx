import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { PageTransition } from "@/components/layout/page-transition";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Sòlid",
  description: "Sòlid — tontine digitale haïtienne",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${dmSans.variable} h-full antialiased`}>
      <body className="h-svh overflow-hidden flex flex-col items-center bg-neutral-200">
        <div className="w-full max-w-[430px] h-svh bg-surface flex flex-col relative overflow-hidden">
          <PageTransition>{children}</PageTransition>
        </div>
      </body>
    </html>
  );
}
