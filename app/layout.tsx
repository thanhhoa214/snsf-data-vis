import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SNSF - Swiss National Science Foundation",
  description:
    "Dashboard for the Swiss National Science Foundation, powered by Next.js",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <TooltipProvider>
          {children}
          {modal}
        </TooltipProvider>
      </body>
    </html>
  );
}
