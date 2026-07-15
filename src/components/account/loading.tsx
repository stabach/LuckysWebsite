export function AccountLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 pb-16 pt-28 text-[#e7e0cf] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[24px] border border-[rgba(255,244,215,0.13)] bg-[#0d1712] p-6 sm:p-8">
          <div className="h-3 w-32 animate-pulse rounded bg-[#f4c451]/30" />
          <div className="mt-5 h-10 w-full max-w-xl animate-pulse rounded bg-white/10" />
          <div className="mt-4 h-4 w-full max-w-2xl animate-pulse rounded bg-white/10" />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div className="h-32 animate-pulse rounded-[16px] border border-[rgba(255,244,215,0.13)] bg-[#0d1712]" key={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
