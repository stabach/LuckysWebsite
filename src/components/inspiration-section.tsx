import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { inspirationSetups } from "@/lib/catalog";

export function InspirationSection({ full = false }: { full?: boolean }) {
  const setups = full ? inspirationSetups : inspirationSetups.slice(0, 3);

  return (
    <section className="bg-black py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-champagne">
              Display your collection
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-white text-balance sm:text-5xl">
              Inspiration for shelves that feel collected, not stored.
            </h2>
          </div>
          {!full ? (
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-white/70 transition hover:text-white focus-ring"
              href="/inspiration"
            >
              View inspiration
              <ArrowRight size={16} />
            </Link>
          ) : null}
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {setups.map((setup, index) => (
            <article
              key={setup.id}
              className="group relative min-h-[430px] overflow-hidden border border-white/12 bg-white/[0.035] p-5"
            >
              <div className="absolute inset-0 opacity-90">
                <div className="absolute inset-x-8 top-8 h-px bg-gold-line" />
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
                <div
                  className="absolute inset-6 border border-white/10"
                  style={{
                    background:
                      index === 0
                        ? "linear-gradient(135deg, #050505, #17120a 42%, #d6b35f 43%, #050505 45%)"
                        : index === 1
                          ? "linear-gradient(135deg, #f8f6ef, #f8f6ef 35%, #d6b35f 36%, #111 38%)"
                          : "linear-gradient(135deg, #080808, #252525 38%, #d6b35f 39%, #050505 41%)"
                  }}
                />
                <ShelfGraphic variant={index} />
              </div>

              <div className="relative z-10 flex min-h-[390px] flex-col justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-champagne">{setup.room}</p>
                  <h3 className="mt-4 max-w-xs text-2xl font-semibold text-white">{setup.title}</h3>
                </div>
                <div>
                  <p className="text-sm leading-6 text-white/64">{setup.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {setup.protectedItems.map((item) => (
                      <span
                        key={item}
                        className="border border-white/12 bg-black/62 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-white/58"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShelfGraphic({ variant }: { variant: number }) {
  const rows = variant === 1 ? 2 : 3;

  return (
    <div className="absolute inset-8 top-24 grid content-end gap-6 opacity-80">
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="relative h-24 border-b-[8px] border-[#2a2012]">
          <div className="absolute bottom-2 left-4 right-4 flex items-end justify-center gap-3">
            {Array.from({ length: variant === 2 ? 5 : 4 }, (_, item) => (
              <span
                key={item}
                className="block border border-white/25 bg-black/65 shadow-gold"
                style={{
                  width: item % 2 === 0 ? 42 : 30,
                  height: item % 3 === 0 ? 68 : 48
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
