import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailExperience } from "@/components/product-detail-experience";
import { getProductBySlug, products } from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product"
    };
  }

  return {
    title: product.name,
    description: product.summary
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailExperience product={product} />;
}
