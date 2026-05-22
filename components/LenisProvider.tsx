"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 0.8,
    });

    // Start paused — PageLoader will fire 'lenis:start' when the screen clears
    lenis.stop();

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const onStart = () => lenis.start();
    const onStop  = () => lenis.stop();
    document.addEventListener("lenis:start", onStart);
    document.addEventListener("lenis:stop",  onStop);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      document.removeEventListener("lenis:start", onStart);
      document.removeEventListener("lenis:stop",  onStop);
    };
  }, []);

  return <>{children}</>;
}
