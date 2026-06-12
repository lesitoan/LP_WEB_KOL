import type { Metadata } from "next";
import React from "react";
import { Google_Sans_Flex } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { StoreProvider } from "@/providers/storeProvider";

const googleSansFlex = Google_Sans_Flex({
  subsets: ["latin", "vietnamese"],
  weight: "variable",
  variable: "--font-google-sans-flex",
});

export const metadata: Metadata = {
  title: "Manager Dashboard",
  description: "Next.js port of the lovable-next-app dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${googleSansFlex.variable} antialiased`}>
        <StoreProvider>
          <Providers>{children}</Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
