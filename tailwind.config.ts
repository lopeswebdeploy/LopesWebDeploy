import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Brand color system - MySide inspired */
        "brand-coral": {
          DEFAULT: "hsl(var(--brand-coral))",
          light: "hsl(var(--brand-coral-light))",
          dark: "hsl(var(--brand-coral-dark))",
        },
        "brand-navy": {
          DEFAULT: "hsl(var(--brand-navy))",
          light: "hsl(var(--brand-navy-light))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backgroundImage: {
        "gradient-luxury": "var(--gradient-luxury)",
        "gradient-hero": "var(--gradient-hero)",
        "gradient-card": "var(--gradient-card)",
      },
      fontFamily: {
        luxury: ["var(--font-luxury)"],
        body: ["var(--font-body)"],
      },
      boxShadow: {
        "luxury": "var(--shadow-luxury)",
        "card-luxury": "var(--shadow-card)",
        "hero": "var(--shadow-hero)",
      },
      spacing: {
        "luxury": "var(--space-luxury)",
        "section": "var(--space-section)",
        // Mobile-first spacing scale
        "mobile-xs": "0.5rem",    // 8px
        "mobile-sm": "0.75rem",   // 12px
        "mobile-md": "1rem",      // 16px
        "mobile-lg": "1.5rem",    // 24px
        "mobile-xl": "2rem",      // 32px
        "mobile-2xl": "3rem",     // 48px
        "mobile-3xl": "4rem",     // 64px
      },
      fontSize: {
        // Mobile-first typography scale
        "mobile-xs": ["0.75rem", { lineHeight: "1rem" }],      // 12px
        "mobile-sm": ["0.875rem", { lineHeight: "1.25rem" }],  // 14px
        "mobile-base": ["1rem", { lineHeight: "1.5rem" }],     // 16px
        "mobile-lg": ["1.125rem", { lineHeight: "1.75rem" }],  // 18px
        "mobile-xl": ["1.25rem", { lineHeight: "1.75rem" }],   // 20px
        "mobile-2xl": ["1.5rem", { lineHeight: "2rem" }],      // 24px
        "mobile-3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
        "mobile-4xl": ["2.25rem", { lineHeight: "2.5rem" }],   // 36px
        "mobile-5xl": ["3rem", { lineHeight: "1" }],           // 48px
        "mobile-6xl": ["3.75rem", { lineHeight: "1" }],        // 60px
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
