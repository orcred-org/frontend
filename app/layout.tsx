import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";

const inter = Inter({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Pruv | The Standard for AI/ML Intelligence",
  description: "Get your AI/ML project reviewed by a senior engineer. Walk away with a credential that actually means something.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className={`${inter.className} bg-white text-on-background selection:bg-accent-orange selection:text-white grainy-overlay`}>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
