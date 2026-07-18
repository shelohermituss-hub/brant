import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Money",
  description: "Reproduction de référence visuelle — Phase 1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col items-center bg-neutral-200">
        <div className="w-full max-w-[430px] min-h-dvh bg-surface-muted flex flex-col relative overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
