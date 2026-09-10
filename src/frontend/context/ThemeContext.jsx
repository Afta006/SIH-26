import { createContext, useContext, useLayoutEffect, useState } from "react";
import { applyTheme } from "../theme";

const ThemeContext = createContext(null);

function getInitialMode() {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem("oe-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode);

  // Mutate the shared C object BEFORE this render's children render,
  // so every component reading C.xxx (even the very first render)
  // sees the correct palette.
  applyTheme(mode);

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    window.localStorage.setItem("oe-theme", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}