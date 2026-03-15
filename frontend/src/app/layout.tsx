import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

const fontMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin", "vietnamese"],
});

export async function generateMetadata(): Promise<Metadata> {
  let title = "UpMonitor - Realtime Monitoring";
  let description = "Advanced website monitoring system";
  let favicon = "/favicon.ico";
  let ogImage = "";
  let siteName = "UpMonitor";

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const res = await fetch(`${API_URL}/api/public/settings`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.website_name) siteName = data.website_name;
      if (data.seo_title) title = data.seo_title;
      if (data.seo_description) description = data.seo_description;
      if (data.public_favicon) favicon = data.public_favicon;
      if (data.public_image_website) ogImage = data.public_image_website;
    }
  } catch (error) {
    console.error("Failed to fetch public settings for metadata", error);
  }

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    icons: {
      icon: favicon,
    },
    openGraph: {
      siteName: siteName,
      images: ogImage ? [ogImage] : [],
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`} suppressHydrationWarning>
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
