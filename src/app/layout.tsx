import type { Metadata } from "next";
import React from "react";
import { Google_Sans_Flex } from "next/font/google";
import '@mdxeditor/editor/style.css';
import "./globals.css";
import { Providers } from "./providers";
import { StoreProvider } from "@/providers/storeProvider";

const googleSansFlex = Google_Sans_Flex({
  subsets: ["latin", "vietnamese"],
  weight: "variable",
  variable: "--font-google-sans-flex",
});

export const metadata: Metadata = {
  title: "SCEX Manager",
  description: "SCEX Manager",
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
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
