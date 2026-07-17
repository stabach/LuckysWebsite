import type { Metadata } from "next";
import { CalendarDays, Clock, Download, MapPin, Navigation } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { storeEvents, type StoreEvent } from "@/data/events";
import {
  formatEventDateRange,
  formatEventTimeRange,
  getEventTiming,
  getGoogleCalendarUrl,
  getPublishedEvents,
  isEventPickupEligible
} from "@/lib/events";
import { getEventStructuredData } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Events",
  description: "Verified Lucky's Loot event dates and event-pickup availability.",
  alternates: { canonical: "/events" }
};

export const dynamic = "force-dynamic";

export default function EventsPage() {
  const now = new Date();
  const publishedEvents = getPublishedEvents(storeEvents);
  const currentEvents = publishedEvents.filter((event) => getEventTiming(event, now) !== "past");
  const pastEvents = publishedEvents
    .filter((event) => getEventTiming(event, now) === "past")
    .reverse();

  return (
    <div className="info-page">
      {publishedEvents.length ? (
        <JsonLd data={publishedEvents.map(getEventStructuredData)} />
      ) : null}
      <header className="info-hero section-shell">
        <p className="eyebrow">On the show floor</p>
        <h1>Meet Lucky’s Loot in person.</h1>
        <p>
          Confirmed shows and event pickup locations are listed here. Please confirm your pickup
          order in advance so I can bring the correct quantity.
        </p>
      </header>

      <section className="info-section section-shell" aria-labelledby="upcoming-events-title">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Calendar</p>
            <h2 id="upcoming-events-title">Upcoming events</h2>
          </div>
        </div>

        {currentEvents.length ? (
          <div className="event-card-grid">
            {currentEvents.map((event) => (
              <EventCard key={event.id} event={event} now={now} />
            ))}
          </div>
        ) : (
          <div className="verified-empty-state">
            <CalendarDays aria-hidden="true" size={32} />
            <div>
              <h3>The next verified date is still being lined up.</h3>
              <p>
                No future event currently has a confirmed schedule and pickup window. Event pickup
                stays unavailable in Your Loot until one is eligible.
              </p>
            </div>
            <Link className="button button-secondary" href="/contact?topic=event-pickup">
              Ask about event pickup
            </Link>
          </div>
        )}
      </section>

      {pastEvents.length ? (
        <section className="info-section section-shell" aria-labelledby="past-events-title">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Archive</p>
              <h2 id="past-events-title">Past events</h2>
            </div>
          </div>
          <div className="event-card-grid is-past">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} now={now} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function EventCard({ event, now }: { event: StoreEvent; now: Date }) {
  const timing = getEventTiming(event, now);
  const pickupEligible = isEventPickupEligible(event, now);

  return (
    <article className="event-card">
      <div className="event-card-image">
        <Image src={event.image} alt={`${event.title} event artwork`} fill sizes="(min-width: 900px) 50vw, 100vw" />
        <span>{timing === "today" ? "Happening today" : timing}</span>
      </div>
      <div className="event-card-copy">
        <p className="eyebrow">{formatEventDateRange(event)}</p>
        <h3>{event.title}</h3>
        <dl>
          <div>
            <Clock aria-hidden="true" size={17} />
            <dt className="sr-only">Time</dt>
            <dd>{formatEventTimeRange(event)}</dd>
          </div>
          <div>
            <MapPin aria-hidden="true" size={17} />
            <dt className="sr-only">Location</dt>
            <dd>
              <strong>{event.venue}</strong>
              <span>{event.address}</span>
            </dd>
          </div>
        </dl>
        <div className={`event-pickup-state ${pickupEligible ? "is-eligible" : ""}`}>
          {pickupEligible
            ? "Event pickup is eligible for this date."
            : event.pickupEnabled
              ? "The event-pickup cutoff has passed."
              : "Event pickup is not offered for this date."}
        </div>
        <div className="event-card-actions">
          <a className="button button-primary" href={event.mapUrl} target="_blank" rel="noreferrer">
            <Navigation aria-hidden="true" size={16} /> Directions
          </a>
          <a className="button button-secondary" href={`/events/${event.slug}/calendar`}>
            <Download aria-hidden="true" size={16} /> Download ICS
          </a>
          <a className="text-link" href={getGoogleCalendarUrl(event)} target="_blank" rel="noreferrer">
            Add to Google Calendar
          </a>
        </div>
      </div>
    </article>
  );
}
