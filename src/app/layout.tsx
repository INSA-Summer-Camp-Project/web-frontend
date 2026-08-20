import type { Metadata } from "next";
import { Public_Sans, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import "./globals.css";
import { Toaster } from "@/components/ui/Toast";
import { AuthProvider } from "@/providers/AuthProvider";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ServiceHub – Professional & Trustworthy Service Marketplace",
  description:
    "Connect with trusted local professionals or offer your services to customers in your area. Powered by Telegram for instant, secure communication.",
  keywords: [
    "service marketplace",
    "hire professionals",
    "local services",
    "ServiceHub",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${fraunces.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-ink font-sans">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#FFFFFF",
                color: "#1C1917",
                border: "1px solid #E7E5E4",
                borderRadius: "6px",
                boxShadow: "0 4px 12px rgba(28, 25, 23, 0.10)",
                fontSize: "14px",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
