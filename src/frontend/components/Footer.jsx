import { Waves } from "lucide-react";
import { C } from "../theme";

export default function Footer() {
  return (
    <div className="px-6 md:px-12 py-10 max-w-6xl mx-auto" style={{ borderTop: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 oe-display font-semibold mb-2">
        <Waves size={16} color={C.teal} /> OceanEmbed
      </div>
      <p className="text-xs" style={{ color: C.dim }}>
        Satellite embedding-based reconstruction of subsurface ocean temperature — SIH Problem Statement #26066.
      </p>
      
      <p className="text-xs mt-1" style={{ color: C.dim }}>Team Unknown Variable · NSUT, New Delhi</p>
    </div>
  );
}
