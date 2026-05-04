import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { Suspense } from "react";

// Professional sans-serif for UI elements
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Clean font for body text and data tables
const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ምርት tech | Agricultural Contract Operations",
  description: "Professional enterprise platform for agricultural trade and contract management in Ethiopia.",
  authors: [{ name: "Selamawit Mesfin" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-teal-100">
        {/* 
          AuthProvider: Manages Supabase session state globally.
          Suspense: Prevents hydration mismatch when components use useSearchParams() 
          inside the Login/Signup flows.
        */}
        <AuthProvider>
          <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center bg-white">
              <div className="h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <main className="flex-grow">
              {children}
            </main>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}