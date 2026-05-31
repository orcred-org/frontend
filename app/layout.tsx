import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import CursorGlobal from "@/components/CursorGlobal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Orcred | The Standard for AI/ML Intelligence",
  description: "Get your AI/ML project reviewed by a senior engineer in a live 45-minute session. Walk away with a verified credential scored out of 100. 40–60% pass rate by design.",
  metadataBase: new URL("https://orcred.com"),
  openGraph: {
    title: "Orcred | The Standard for AI/ML Intelligence",
    description: "Get your AI/ML project reviewed by a senior engineer in a live 45-minute session. Walk away with a verified credential scored out of 100.",
    url: "https://orcred.com",
    siteName: "Orcred",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Orcred | The Standard for AI/ML Intelligence",
    description: "Live technical verification for AI/ML engineers. One session. One score. A credential that holds.",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  themeColor: "#eb4511",
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
