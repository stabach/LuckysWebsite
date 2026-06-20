import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-obsidian px-4 text-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-champagne">Not found</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">This display case is empty.</h1>
        <Link
          className="mt-8 inline-flex border border-champagne bg-champagne px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-black focus-ring"
          href="/"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
