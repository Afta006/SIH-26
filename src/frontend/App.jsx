import { useState } from "react";
import { C } from "./theme";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProblemSection from "./components/ProblemSection";
import PipelineSection from "./components/PipelineSection";
import ResultsSection from "./components/ResultsSection";
import LiveDemoSection from "./components/LiveDemoSection";
import Footer from "./components/Footer";
import Reveal from "./components/Reveal";

export default function App() {
  const [navOpen, setNavOpen] = useState(false);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

  return (
    <div
      style={{
        background: C.bgDeep,
        color: C.text,
        minHeight: "100%",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Navbar
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        scrollTo={scrollTo}
      />

      <Hero scrollTo={scrollTo} />
      <Reveal><ProblemSection /></Reveal>
      <Reveal><PipelineSection /></Reveal>
      <Reveal><ResultsSection /></Reveal>
      <Reveal><LiveDemoSection /></Reveal>
      <footer
  style={{
    marginTop: "80px",
    borderTop: "1px solid #1C3A52",
    background: "#081521",
    padding: "48px 0 24px",
  }}
>
  <div
    style={{
      maxWidth: "1100px",
      margin: "0 auto",
      padding: "0 24px",
    }}
  >
    {/* Main Footer */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gap: "50px",
        paddingBottom: "40px",
      }}
    >
      {/* Brand */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "14px",
          }}
        >
          <span
            style={{
              fontSize: "24px",
              color: "#3FA9A0",
            }}
          >
            ≋
          </span>

          <span
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#EAF4F4",
            }}
          >
            OceanEmbed
          </span>
        </div>

        <p
          style={{
            color: "#7C96A8",
            fontSize: "14px",
            lineHeight: "1.7",
            maxWidth: "430px",
            margin: 0,
          }}
        >
          Satellite embedding-based reconstruction of subsurface ocean
          temperature using advanced data-driven techniques.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h4
          style={{
            color: "#EAF4F4",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          QUICK LINKS
        </h4>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <a href="#" className="oe-footer-link">
            Home
          </a>

          <a href="#live-demo" className="oe-footer-link">
            Live Demo
          </a>

          <a href="#results" className="oe-footer-link">
            Results
          </a>
        </div>
      </div>

      {/* Project */}
      <div>
        <h4
          style={{
            color: "#EAF4F4",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          PROJECT
        </h4>

        <p
          style={{
            color: "#7C96A8",
            fontSize: "14px",
            lineHeight: "1.7",
            margin: "0 0 8px",
          }}
        >
          SIH Problem Statement
        </p>

        <p
          style={{
            color: "#3FA9A0",
            fontSize: "14px",
            fontWeight: "600",
            margin: "0 0 8px",
          }}
        >
          #26066
        </p>

        <p
          style={{
            color: "#7C96A8",
            fontSize: "14px",
            margin: 0,
          }}
        >
          Team Unknown Variable
        </p>
      </div>
    </div>

    {/* Bottom */}
    <div
      style={{
        borderTop: "1px solid #1C3A52",
        paddingTop: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          color: "#5F788A",
          fontSize: "13px",
        }}
      >
        © 2026 OceanEmbed. All rights reserved.
      </span>

      <span
        style={{
          color: "#5F788A",
          fontSize: "13px",
        }}
      >
        NSUT · New Delhi
      </span>
    </div>
  </div>
</footer>
    </div>
  );
}