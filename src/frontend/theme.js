export const C = {
  bgDeep: "var(--oe-bg-deep)",
  bgPanel: "var(--oe-bg-panel)",
  bgCard: "var(--oe-bg-card)",
  border: "var(--oe-border)",
  teal: "var(--oe-teal)",
  tealSoft: "var(--oe-teal-soft)",
  coral: "var(--oe-coral)",
  amber: "var(--oe-amber)",
  amberSoft: "var(--oe-amber-soft)",
  text: "var(--oe-text)",
  dim: "var(--oe-dim)",
};

export function applyTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
}