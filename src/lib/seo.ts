import type { Product } from "@/lib/catalog-schema";
import type { StoreEvent } from "@/data/events";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function absoluteUrl(path: string) {
  return new URL(path, `${getSiteUrl()}/`).toString();
}

export function getProductStructuredData(product: Product) {
  const image = product.images.find((media) => media.type === "image");

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    sku: product.sku,
    image: image ? [absoluteUrl(image.src)] : undefined,
    brand: {
      "@type": "Brand",
      name: "Lucky’s Loot"
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: "USD",
      price: (product.priceCents / 100).toFixed(2),
      availability: getSchemaAvailability(product.stockStatus)
    }
  };
}

export function getEventStructuredData(event: StoreEvent) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.startAt,
    endDate: event.endAt,
    eventStatus:
      event.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [absoluteUrl(event.image)],
    location: {
      "@type": "Place",
      name: event.venue,
      address: event.address
    },
    organizer: {
      "@type": "Organization",
      name: "Lucky’s Loot",
      url: absoluteUrl("/")
    },
    url: absoluteUrl("/events")
  };
}

export function getBreadcrumbStructuredData(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function getFaqStructuredData(
  items: ReadonlyArray<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

function getSchemaAvailability(status: Product["stockStatus"]) {
  switch (status) {
    case "out_of_stock":
      return "https://schema.org/OutOfStock";
    case "low_stock":
      return "https://schema.org/LimitedAvailability";
    case "made_to_order":
      return "https://schema.org/PreOrder";
    default:
      return "https://schema.org/InStock";
  }
}
