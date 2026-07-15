import { storeEvents } from "@/data/events";
import { createEventCalendar, getEventBySlug } from "@/lib/events";

export const dynamic = "force-dynamic";

type CalendarRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: CalendarRouteProps) {
  const { slug } = await params;
  const event = getEventBySlug(storeEvents, slug);

  if (!event || event.status !== "published") {
    return new Response("Event not found.", { status: 404 });
  }

  return new Response(createEventCalendar(event), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="luckys-loot-${event.slug}.ics"`,
      "Cache-Control": "public, max-age=300"
    }
  });
}
