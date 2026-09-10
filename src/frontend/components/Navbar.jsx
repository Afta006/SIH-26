import { Menu, X, Sun, Moon } from "lucide-react";
import { C } from "../theme";
import { NAV_LINKS } from "../data/constants";
import { useState } from "react";

export default function Navbar({ navOpen, setNavOpen, scrollTo }) {
  const [mode, setMode] = useState("dark");

  const toggleTheme = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);

    document.documentElement.setAttribute("data-theme", newMode);
  };

  return (
    <>
      <div
        className="flex items-center justify-between px-6 md:px-12 py-4 sticky top-0 z-50"
        style={{
          background: "var(--oe-bg-deep)",
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {/* LOGO */}
        <div className="flex items-center gap-2 oe-display font-semibold">
          <img
            src={mode === "dark" ? "/image_2026-09-10_175751338-removebg-preview.png" : "/image_2026-09-10_175751338-removebg-preview.png"}
            alt="OceanEmbed"
            className="w-9 h-9 object-contain"
          />

          <span>OceanEmbed</span>
        </div>

        <div className="flex items-center gap-3">

          {/* NAVIGATION LINKS */}
          <div
            className="hidden md:flex gap-6 text-sm"
            style={{ color: C.dim }}
          >
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="oe-navlink"
                style={{ color: C.dim }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* THEME BUTTON */}
          <button
            onClick={toggleTheme}
            type="button"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: C.text,
              background: C.bgCard,
              border: `1px solid ${C.border}`,
            }}
          >
            {mode === "dark" ? (
              <Sun size={17} />
            ) : (
              <Moon size={17} />
            )}
          </button>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden"
            onClick={() => setNavOpen(!navOpen)}
            style={{ color: C.text }}
          >
            {navOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      {navOpen && (
        <div
          className="md:hidden flex flex-col"
          style={{
            background: C.bgPanel,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                scrollTo(l.id);
                setNavOpen(false);
              }}
              className="text-left px-6 py-3 text-sm"
              style={{
                color: C.dim,
                borderTop: `1px solid ${C.border}`,
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
