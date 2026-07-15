import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogPage } from "@/components/catalog/catalog-page";
import {
  getCategoryBySlug,
  getCollectionBySlug,
  getProductsByCategory,
  getProductsByCollection
} from "@/lib/catalog";

const requiredCollectionSlugs = [
  "acrylic-cases",
  "slab-protection",
  "toploader-binders",
  "protect-sealed-product",
  "protect-graded-cards"
] as const;

export function generateStaticParams() {
  return requiredCollectionSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  const collection = getCollectionBySlug(slug);
  const record = category ?? collection;
  if (!record) return {};

  return {
    title: record.name,
    description: record.description,
    alternates: { canonical: `/collections/${slug}` }
  };
}

export default async function CollectionPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ fit?: string; q?: string }>;
}) {
  const { slug } = await params;
  const { fit, q } = await searchParams;
  const category = getCategoryBySlug(slug);
  const collection = getCollectionBySlug(slug);

  if (!category && !collection) notFound();

  const products = category
    ? getProductsByCategory(category.id)
    : getProductsByCollection(collection!.id);
  const title = category?.name ?? collection!.name;
  const description = category?.description ?? collection!.description;

  return (
    <CatalogPage
      title={title}
      description={description}
      products={products}
      breadcrumb={title}
      initialQuery={q}
      initialFit={fit}
    />
  );
}
