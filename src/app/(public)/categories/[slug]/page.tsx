import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getTools, getCategories, getCurrentUserSession } from "@/lib/supabase/store";
import { DirectoryFilter } from "@/components/directory-filter";
import { FolderTree, ArrowLeft } from "lucide-react";

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) {
    return { title: "Category Not Found" };
  }

  const rawUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aihub.local";
  const baseUrl = rawUrl.replace(/\/+$/, "");
  const canonicalUrl = `${baseUrl}/categories/${category.slug}`;

  return {
    title: `Best ${category.name} AI Tools & Software — AI Hub`,
    description: `Explore the top verified AI tools in ${category.name}. Compare capabilities, features, and pricing tiers.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Best ${category.name} AI Tools — AI Hub`,
      description: `Explore the top verified AI tools in ${category.name}. Compare capabilities, features, and pricing tiers.`,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Best ${category.name} AI Tools — AI Hub`,
      description: `Explore the top verified AI tools in ${category.name}. Compare capabilities, features, and pricing tiers.`,
    },
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const session = await getCurrentUserSession();
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const allCategories = await getCategories();
  const { tools } = await getTools({
    categoryId: category.id,
    publishedOnly: true,
    limit: 100,
  });

  const rawUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aihub.local";
  const baseUrl = rawUrl.replace(/\/+$/, "");

  // Schema.org Breadcrumbs & CollectionPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} AI Tools`,
    description: category.description || `Curated tools specifically focused on ${category.name}.`,
    url: `${baseUrl}/categories/${category.slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Categories",
          item: `${baseUrl}/categories`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: category.name,
          item: `${baseUrl}/categories/${category.slug}`,
        },
      ],
    },
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/categories"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> All Categories
      </Link>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <FolderTree className="w-3.5 h-3.5" />
          <span>Category Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {category.name}
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          {category.description || `Curated tools specifically focused on ${category.name}.`}
        </p>
      </div>

      <DirectoryFilter
        initialTools={tools}
        categories={allCategories}
        isSignedIn={Boolean(session)}
      />
    </div>
  );
}
