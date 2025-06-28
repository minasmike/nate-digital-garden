import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from '@/components/theme-provider';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nate's Digital Garden - AI-Enhanced Substack Archive",
  description: "Automatically curated collection of Nate's Substack writings with AI-powered search and semantic discovery.",
  keywords: ['digital garden', 'substack', 'AI search', 'writing', 'blog'],
  authors: [{ name: 'Nate' }],
  creator: 'Nate',
  publisher: 'Nate',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: "Nate's Digital Garden",
    description: 'AI-enhanced archive of Nate\'s writings',
    siteName: "Nate's Digital Garden",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Nate's Digital Garden",
    description: 'AI-enhanced archive of Nate\'s writings',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-50 font-sans antialiased dark:bg-slate-900`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
