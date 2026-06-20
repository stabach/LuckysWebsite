import type { Metadata } from "next";
import { CalendarDays, Clock, MapPin, Navigation } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const events = [
  {
    title: "Clear Lake Card Show Vol. 5",
    date: "June 13th-14th",
    times: ["Saturday - 10:00AM - 5:00PM", "Sunday - 10:00AM - 5:00PM"],
    venue: "McWhirter Elementary",
    address: "300 Pennsylvania Ave, Webster, TX 77598",
    image: "/old-site/events/clear-lake-card-show-vol-5.jpg",
    directions:
      "https://www.google.com/maps/search/?api=1&query=300%20Pennsylvania%20Ave%2C%20Webster%2C%20TX%2077598"
  },
  {
    title: "Syndicate Card Show",
    date: "June 27th-28th",
    times: ["Saturday - 10:00AM - 6:00PM", "Sunday - 10:00AM - 5:00PM"],
    venue: "Westin Galleria Houston (Grand Ballroom)",
    address: "5060 W Alabama St, Houston, TX 77056",
    image: "/old-site/events/syndicate-card-show.png",
    directions:
      "https://www.google.com/maps/search/?api=1&query=5060%20W%20Alabama%20St%2C%20Houston%2C%20TX%2077056"
  }
];

export const metadata: Metadata = {
  title: "Upcoming Events",
  description:
    "See where Lucky's Loot will be setting up next for card shows, pickups, and trading card supplies."
};

export default function EventsPage() {
  return (
    <main className="simple-storefront relative min-h-screen overflow-hidden bg-[#070707] pt-24 text-[#e7e0cf]">
      <div className="retro-stars pointer-events-none absolute inset-0 opacity-70" />
      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-pixel text-[0.68rem] uppercase leading-6 tracking-[0.12em] text-[#d4af37]">
            Where to find us next
          </p>
          <h1 className="section-gold-title mt-5 font-pixel text-3xl uppercase leading-[1.35] sm:text-5xl">
            Upcoming Events
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#d8cfbd]">
            Come shop Lucky&apos;s Loot in person, check out supplies before you buy, and grab show-day pickup
            items while we&apos;re set up.
          </p>
        </div>

        <div className="mt-14 grid gap-7 lg:grid-cols-2">
          {events.map((event) => (
            <article
              key={event.title}
              className="group overflow-hidden rounded-[8px] border border-[#d4af37]/24 bg-black/58 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#101010]">
                <Image
                  src={event.image}
                  alt={`${event.title} flyer`}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.025]"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/10 to-transparent" />
              </div>

              <div className="p-6 sm:p-7">
                <p className="mb-4 inline-flex items-center gap-2 rounded-[8px] border border-[#d4af37]/46 bg-[#111111] px-3 py-2 font-pixel text-[0.58rem] uppercase leading-5 text-[#d4af37]">
                  <CalendarDays size={15} />
                  {event.date}
                </p>
                <h2 className="font-pixel text-xl uppercase leading-9 text-[#f0d05a] sm:text-2xl">
                  {event.title}
                </h2>

                <div className="mt-6 grid gap-4 text-sm leading-7 text-[#dfd5c4]">
                  <div className="flex gap-3">
                    <Clock className="mt-1 shrink-0 text-[#d4af37]" size={18} />
                    <div>
                      {event.times.map((time) => (
                        <p key={time}>{time}</p>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="mt-1 shrink-0 text-[#d4af37]" size={18} />
                    <div>
                      <p className="font-semibold text-[#fff4bd]">{event.venue}</p>
                      <p>{event.address}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={event.directions}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[#d4af37] bg-[#d4af37] px-5 text-xs font-black uppercase tracking-[0.08em] text-black shadow-[0_10px_26px_rgba(212,175,55,0.18)] transition hover:bg-[#fff4bd] focus-ring"
                  >
                    <Navigation size={16} />
                    Directions
                  </a>
                  <Link
                    href="/products"
                    className="inline-flex min-h-12 items-center justify-center rounded-[8px] border border-[#d4af37]/46 px-5 font-pixel text-[0.65rem] uppercase leading-5 text-[#d4af37] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10 focus-ring"
                  >
                    Shop Before The Show
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
