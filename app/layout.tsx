import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import CursorGlobal from "@/components/CursorGlobal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Orcred | The Standard for AI/ML Intelligence",
  description: "Get your AI/ML project reviewed by a senior engineer. Walk away with a credential that actually means something.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="selection:bg-accent-orange selection:text-white">
        <LenisProvider>
          <Navbar />
          {children}
          <Footer />
          <CursorGlobal />
        </LenisProvider>
      </body>
    </html>
  );
}
