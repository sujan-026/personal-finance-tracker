/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Core Palette
        primary: "#1a365d", // deep blue for trust and professionalism
        secondary: "#0d9488", // teal accent for interactive elements
        background: "#f9fafb", // light gray for the main background
        card: "#ffffff", // white for card backgrounds
        // Accent Gradients for Charts
        expense: {
          from: "#ef4444",
          to: "#b91c1c",
        },
        income: {
          from: "#10b981",
          to: "#047857",
        },
        // Category-specific colors (example palette of 8 colors)
        category: {
          1: "#6b7280",
          2: "#4b5563",
          3: "#374151",
          4: "#1f2937",
          5: "#d97706",
          6: "#f59e0b",
          7: "#84cc16",
          8: "#22c55e",
        },
      },
      fontFamily: {
        // Using the default shadcn/ui system with Inter and monospace
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system"],
        mono: ["ui-monospace", "SFMono-Regular"],
      },
      letterSpacing: {
        tighter: "-0.02em",
      },
    },
  },
  plugins: [import("@tailwindcss/typography")],
};
