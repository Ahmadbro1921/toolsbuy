import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DemoRoleBanner } from "@/components/demo-role-banner";
import { getCurrentUserSession, getSiteSettings } from "@/lib/supabase/store";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aihub.local";
  const baseUrl = rawUrl.replace(/\/+$/, "");

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${settings.branding.name} — ${settings.branding.tagline}`,
      template: `%s | ${settings.branding.name}`,
    },
    description: settings.branding.description,
    keywords: [
      "AI tools",
      "AI directory",
      "Artificial Intelligence software",
      "best AI tools",
      "ChatGPT alternatives",
      "LLM models",
      "generative AI",
      "AI productivity tools",
      "machine learning apps",
      "developer AI tools",
      "free AI tools",
    ],
    authors: [{ name: settings.branding.name, url: baseUrl }],
    creator: settings.branding.name,
    publisher: settings.branding.name,
    alternates: {
      canonical: "./",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      siteName: settings.branding.name,
      title: `${settings.branding.name} — ${settings.branding.tagline}`,
      description: settings.branding.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.branding.name} — ${settings.branding.tagline}`,
      description: settings.branding.description,
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentUserSession();
  const settings = await getSiteSettings();
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aihub.local";
  const baseUrl = rawUrl.replace(/\/+$/, "");

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: settings.branding.name,
        description: settings.branding.description,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/tools?query={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: settings.branding.name,
        url: baseUrl,
        logo: `${baseUrl}/favicon.ico`,
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
        <ThemeProvider>
          <Navbar session={session} />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <DemoRoleBanner session={session} />
        </ThemeProvider>
      </body>
    </html>
  );
}
