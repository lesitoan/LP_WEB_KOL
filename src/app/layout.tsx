import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { Providers } from "./providers";
import { StoreProvider } from "@/providers/storeProvider";

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
      <body className="font-sans antialiased">
        <StoreProvider>
          <Providers>{children}</Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
