import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // DESIGN.md Section 3: Color System
        primary: {
          DEFAULT: "#1D4ED8", // Trust Blue - Primary actions, links, active states
          dark: "#1E40AF", // Primary hover/pressed states
          light: "#DBEAFE", // Primary-tinted backgrounds, selected chips
        },
        accent: {
          DEFAULT: "#D97706", // Warm Amber - Ratings, highlights, featured content
          light: "#FEF3C7", // Accent-tinted backgrounds
          text: "#92400E", // WCAG AA Badge text
        },
        success: {
          DEFAULT: "#16A34A", // Completed jobs, verified badges, success states
          light: "#DCFCE7", // Success backgrounds
          text: "#15803D", // WCAG AA Badge text
        },
        warning: {
          DEFAULT: "#EA580C", // Pending states, attention required
          light: "#FFF7ED", // Warning backgrounds
          text: "#C2410C", // WCAG AA Badge text
        },
        info: {
          DEFAULT: "#4F6D7A", // Neutral informational states
          light: "#E4ECEF", // Info-tinted backgrounds
        },
        error: {
          DEFAULT: "#DC2626", // Errors, destructive actions
          light: "#FEF2F2", // Error backgrounds
          text: "#B91C1C", // WCAG AA Badge text
        },
        ink: {
          DEFAULT: "#1C1917", // Primary text — warm near-black
          secondary: "#44403C", // Secondary text, labels
          muted: "#78716C", // Captions, metadata, placeholder
        },
        background: "#FAFAF9", // App background — warm off-white
        surface: {
          DEFAULT: "#FFFFFF", // Cards, sheets, modals
          alt: "#F5F5F4", // Alternate surface, input backgrounds
        },
        border: {
          DEFAULT: "#E7E5E4", // Default borders/dividers
          strong: "#A8A29E", // Emphasized borders, focus states (WCAG AA compliant)
        },
      },
      fontFamily: {
        // DESIGN.md Section 4: Typography
        display: ["var(--font-fraunces)", "Fraunces", "Georgia", "serif"],
        serif: ["var(--font-fraunces)", "Fraunces", "Georgia", "serif"],
        body: [
          "var(--font-public-sans)",
          "Public Sans",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        sans: [
          "var(--font-public-sans)",
          "Public Sans",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        mono: ["var(--font-ibm-plex-mono)", "IBM Plex Mono", "monospace"],
      },
      fontSize: {
        // DESIGN.md Section 4: Type Scale
        hero: ["3rem", { lineHeight: "3.5rem", fontWeight: "600" }], // 48px / 56px
        "hero-mobile": [
          "2.25rem",
          { lineHeight: "2.75rem", fontWeight: "600" },
        ], // 36px / 44px
        h1: ["2.25rem", { lineHeight: "2.75rem", fontWeight: "600" }], // 36px / 44px
        "h1-mobile": ["1.75rem", { lineHeight: "2.25rem", fontWeight: "600" }], // 28px / 36px
        h2: ["1.75rem", { lineHeight: "2.25rem", fontWeight: "500" }], // 28px / 36px
        "h2-mobile": ["1.5rem", { lineHeight: "2rem", fontWeight: "500" }], // 24px / 32px
        h3: ["1.375rem", { lineHeight: "1.875rem", fontWeight: "500" }], // 22px / 30px
        "h3-mobile": ["1.25rem", { lineHeight: "1.75rem", fontWeight: "500" }], // 20px / 28px
        h4: ["1.125rem", { lineHeight: "1.625rem", fontWeight: "700" }], // 18px / 26px
        "h4-mobile": ["1rem", { lineHeight: "1.5rem", fontWeight: "700" }], // 16px / 24px
        "body-lg": ["1rem", { lineHeight: "1.5rem", fontWeight: "400" }], // 16px / 24px
        body: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400" }], // 14px / 20px
        caption: ["0.75rem", { lineHeight: "1rem", fontWeight: "500" }], // 12px / 16px
        button: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "600" }], // 14px / 20px
      },
      spacing: {
        // DESIGN.md Section 5: Spacing Scale (Base: 4px)
        "space-xs": "4px",
        "space-sm": "8px",
        "space-md": "16px",
        "space-lg": "24px",
        "space-xl": "32px",
        "space-2xl": "48px",
        "space-3xl": "64px",
      },
      borderRadius: {
        // DESIGN.md Section 6: Radius
        sm: "6px",
        md: "10px",
        lg: "16px",
        full: "9999px",
      },
      boxShadow: {
        // DESIGN.md Section 6: Elevation
        sm: "0 1px 2px rgba(28, 25, 23, 0.06)",
        md: "0 4px 12px rgba(28, 25, 23, 0.10)",
        lg: "0 12px 32px rgba(28, 25, 23, 0.16)",
      },
      zIndex: {
        // DESIGN.md Section 7: Z-Index
        "layer-base": "0",
        "layer-sticky": "10",
        "layer-dropdown": "20",
        "layer-modal": "30",
        "layer-toast": "40",
        "layer-critical": "50",
      },
      transitionDuration: {
        // DESIGN.md Section 8: Motion
        "motion-fast": "120ms",
        "motion-normal": "200ms",
        "motion-slow": "300ms",
      },
    },
  },
  plugins: [],
};

export default config;
