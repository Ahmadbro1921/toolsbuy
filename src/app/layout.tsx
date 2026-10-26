import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DemoRoleBanner } from "@/components/demo-role-banner";
import { getCurrentUserSession, getSiteSettings } from "@/lib/supabase/store";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: settings.branding.name + " — " + settings.branding.tagline,
      template: `%s | ${settings.branding.name}`,
    },
    description: settings.branding.description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://aihub.local"),
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: settings.branding.name,
      title: settings.branding.name + " — " + settings.branding.tagline,
      description: settings.branding.description,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.branding.name,
      description: settings.branding.description,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentUserSession();

  return (
    <html lang="en" suppressHydrationWarning>
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
