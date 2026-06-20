import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Lucky's Loot creates premium display and protection products for serious collectors."
};

export default function AboutPage() {
  return (
    <div className="bg-obsidian pt-16">
      <section className="border-b border-white/10 bg-black py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-champagne">
            About Lucky&apos;s Loot
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold text-white text-balance sm:text-6xl">
            Built for collectors who care how the room feels.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/62">
            Lucky&apos;s Loot exists for collectors who see display as part of the collection.
            Protection matters, but presentation is the thing that turns sealed products,
            slabs, binders, and shelves into a personal showroom.
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {[
          ["Premium quality", "Materials, tolerances, and finishes are chosen for a collector room."],
          ["Collector-focused design", "Fitment and display posture matter as much as storage utility."],
          ["Presentation matters", "Acrylic, lighting, and shelf spacing should make the collection feel intentional."]
        ].map(([title, description]) => (
          <article key={title} className="border border-white/12 bg-white/[0.035] p-6">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/58">{description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
