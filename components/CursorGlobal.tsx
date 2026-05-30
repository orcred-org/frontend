"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@/lib/ThemeContext";

const Cursor = dynamic(() => import("./Cursor"), { ssr: false });

export default function CursorGlobal() {
  const { theme } = useTheme();
  if (theme === "light") return null;
  return <Cursor />;
}
