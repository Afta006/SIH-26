import { useEffect } from "react";
import { X } from "lucide-react";
import { C } from "../theme";
import { createPortal } from "react-dom";

export default function Modal({ open, onClose, title, icon, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="oe-modal-title"
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(4,10,16,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        animation: "oe-fade-in 0.15s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="oe-modal-panel"
        style={{
          background: C.bgPanel,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          maxWidth: 520,
          width: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
          padding: 28,
        }}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {icon}
            <h3 id="oe-modal-title" className="oe-display text-xl">{title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="oe-cta shrink-0"
            style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 999, padding: 6, color: C.text }}
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}