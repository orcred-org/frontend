"use client";

export default function StandardSection() {
  return (
    <section className="bg-black text-white py-24 sm:py-32 lg:py-section-gap px-6 sm:px-10 lg:px-margin-edge overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="grid grid-cols-12 h-full w-full">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="border-r border-white/20" />
          ))}
          <div />
        </div>
      </div>

      <div className="max-w-container-max mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-8 md:col-start-3 text-center space-y-8 sm:space-y-12 lg:space-y-16">
            <p className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight text-white/30 hover:text-white transition-colors duration-500 cursor-default tracking-tight">
              A credential that&apos;s earned.
            </p>
            <p className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight text-white/60 hover:text-white transition-colors duration-500 cursor-default tracking-tight">
              A credential backed by real engineers.
            </p>
            <p className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight text-white cursor-default tracking-tight">
              A credential that changes who gets hired.
            </p>
            <div className="pt-10 sm:pt-14 lg:pt-20">
              <span className="font-label-sm text-accent-orange uppercase tracking-[0.5em] font-bold block mb-4 text-[10px] sm:text-[11px]">
                BUILT BY ENGINEERS. FOR ENGINEERS.
              </span>
              <div className="w-16 h-1 bg-accent-orange mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}