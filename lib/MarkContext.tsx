"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { LayoutGroup } from "framer-motion";

interface MarkCtx {
  markInNavbar: boolean;
  setMarkInNavbar: (v: boolean) => void;
}

const MarkContext = createContext<MarkCtx>({
  markInNavbar: false,
  setMarkInNavbar: () => {},
});

export function MarkProvider({ children }: { children: ReactNode }) {
  const [markInNavbar, setMarkInNavbar] = useState(false);
  return (
    <MarkContext.Provider value={{ markInNavbar, setMarkInNavbar }}>
      <LayoutGroup id="brand">{children}</LayoutGroup>
    </MarkContext.Provider>
  );
}

export const useMark = () => useContext(MarkContext);
