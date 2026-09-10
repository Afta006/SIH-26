import { C } from "../theme";

export default function Skeleton({ lines = 0, block = false, height = 200, className = "" }) {
  const pulse = { background: C.bgCard, borderRadius: 8, animation: "oe-pulse 1.4s ease-in-out infinite" };

  if (block) {
    return <div className={className} style={{ ...pulse, height, width: "100%" }} />;
  }

  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{ ...pulse, height: 14, width: i === lines - 1 ? "60%" : "100%", marginBottom: 8 }}
        />
      ))}
    </div>
  );
}