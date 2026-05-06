export interface DesignTokens {
  // Color system (60-30-10 rule)
  colorBackground: string      // 60% neutral background
  colorSurface: string         // 30% surface for cards, panels
  colorPrimary: string         // Primary text / Main color
  colorSecondary: string       // Secondary text
  colorBorder: string          // Borders
  colorAccent: string          // Single brand accent color
  colorAccentHover: string     // Accent hover state

  // Typography (max 2 font families + scale)
  fontDisplay: string          // Emotional headings (48-96px)
  fontHeading: string          // Section headings (24-40px)
  fontBody: string             // Body text (16-18px)
  fontCaption: string          // Labels, captions (12-14px)
  fontMono: string             // Monospace for code
  
  // Typography Scale (Specific sizes for premium look)
  fontSizeDisplay: string
  fontSizeHeading: string
  fontSizeBody: string
  lineHeightBody: string
  lineHeightHeading: string

  // Spacing (multiples of 8px)
  spacingUnit: string          // Base unit: 8px
  spacingSection: string       // Between sections: 80-160px
  spacingElement: string       // Between elements: 16-24px
  spacingCard: string          // Between cards: 24-32px
  spacingButtonVertical: string
  spacingButtonHorizontal: string

  // Layout
  maxWidthContent: string
  maxWidthText: string
  gridColumns: string
  gridGutter: string
  horizontalPaddingMobile: string
  horizontalPaddingTablet: string
  horizontalPaddingDesktop: string

  // Visual details
  borderRadius: string         // Base radius (from site.json)
  borderRadiusSmall: string
  borderRadiusMedium: string
  borderRadiusLarge: string
  shadowStyle: string          // soft, medium, hard (from site.json)
  shadowResting: string
  shadowHover: string
  transitionDuration: string
  transitionTiming: string

  // Image ratios
  imageRatioHero: string
  imageRatioCard: string
  imageRatioAvatar: string

  [key: string]: string
}

// Presets for premium design
export const PRESETS: Record<string, DesignTokens> = {
  warm_minimalism: {
    colorBackground: "#F8F7F4", // Warm White
    colorSurface: "#FFFFFF",
    colorPrimary: "#1A1A1A", // Near Black
    colorSecondary: "#6B6B6B",
    colorBorder: "#E5E3DE",
    colorAccent: "#C9A96E", // Premium Gold (Fixed)
    colorAccentHover: "#B8945A", // Darker Gold
    
    fontDisplay: "Playfair Display", // Display (Elegant)
    fontHeading: "Inter", // Heading (Clean)
    fontBody: "Inter", // Body (Readable)
    fontCaption: "Inter",
    fontMono: "JetBrains Mono", // Mono (Technical)
    
    fontSizeDisplay: "72px",
    fontSizeHeading: "32px",
    fontSizeBody: "17px",
    lineHeightBody: "1.7",
    lineHeightHeading: "1.3",
    
    spacingUnit: "8px",
    spacingSection: "120px",
    spacingElement: "24px",
    spacingCard: "32px",
    spacingButtonVertical: "16px",
    spacingButtonHorizontal: "32px",
    
    maxWidthContent: "1280px",
    maxWidthText: "680px",
    gridColumns: "12",
    gridGutter: "32px",
    horizontalPaddingMobile: "24px",
    horizontalPaddingTablet: "48px",
    horizontalPaddingDesktop: "80px",
    
    borderRadius: "8",
    borderRadiusSmall: "6px",
    borderRadiusMedium: "12px",
    borderRadiusLarge: "16px",
    shadowStyle: "soft",
    shadowResting: "0 4px 24px rgba(0,0,0,0.06)",
    shadowHover: "0 10px 40px rgba(0,0,0,0.1)",
    transitionDuration: "200ms",
    transitionTiming: "ease-out",
    
    imageRatioHero: "16:9",
    imageRatioCard: "4:3",
    imageRatioAvatar: "1:1",
  },

  // Restaurant Modern - warm, appetizing, elegant
  restaurant_modern: {
    colorBackground: "#FFF8F0",
    colorSurface: "#FFFFFF",
    colorPrimary: "#2C1810",
    colorSecondary: "#8B7355",
    colorBorder: "#E6D5C3",
    colorAccent: "#D4A574",
    colorAccentHover: "#C08A5A",
    
    fontDisplay: "Playfair Display",
    fontHeading: "Playfair Display",
    fontBody: "Lato",
    fontCaption: "Lato",
    fontMono: "Roboto Mono",
    
    fontSizeDisplay: "80px",
    fontSizeHeading: "36px",
    fontSizeBody: "18px",
    lineHeightBody: "1.8",
    lineHeightHeading: "1.4",
    
    spacingUnit: "8px",
    spacingSection: "140px",
    spacingElement: "28px",
    spacingCard: "36px",
    spacingButtonVertical: "18px",
    spacingButtonHorizontal: "36px",
    
    maxWidthContent: "1200px",
    maxWidthText: "700px",
    gridColumns: "12",
    gridGutter: "30px",
    horizontalPaddingMobile: "20px",
    horizontalPaddingTablet: "50px",
    horizontalPaddingDesktop: "90px",
    
    borderRadius: "12",
    borderRadiusSmall: "8px",
    borderRadiusMedium: "16px",
    borderRadiusLarge: "24px",
    shadowStyle: "warm",
    shadowResting: "0 4px 20px rgba(44,24,16,0.08)",
    shadowHover: "0 8px 30px rgba(44,24,16,0.12)",
    transitionDuration: "180ms",
    transitionTiming: "ease-in-out",
    
    imageRatioHero: "21:9",
    imageRatioCard: "3:2",
    imageRatioAvatar: "1:1",
  },

  // Other presets will be added here...
}

export function generateCssVariables(tokens: DesignTokens): string {
  return `
    :root {
      /* Color system */
      --color-background: ${tokens.colorBackground};
      --color-surface: ${tokens.colorSurface};
      --color-primary: ${tokens.colorPrimary};
      --color-secondary: ${tokens.colorSecondary};
      --color-border: ${tokens.colorBorder};
      --color-accent: ${tokens.colorAccent};
      --color-accent-hover: ${tokens.colorAccentHover};
      
      /* Typography */
      --font-display: '${tokens.fontDisplay}', serif;
      --font-heading: '${tokens.fontHeading}', sans-serif;
      --font-body: '${tokens.fontBody}', sans-serif;
      --font-caption: '${tokens.fontCaption}', sans-serif;
      --font-mono: '${tokens.fontMono}', monospace;
      
      /* Typography Scale */
      --font-size-display: ${tokens.fontSizeDisplay};
      --font-size-heading: ${tokens.fontSizeHeading};
      --font-size-body: ${tokens.fontSizeBody};
      --line-height-body: ${tokens.lineHeightBody};
      --line-height-heading: ${tokens.lineHeightHeading};
      
      /* Spacing (8px base) */
      --spacing-unit: ${tokens.spacingUnit};
      --spacing-section: ${tokens.spacingSection};
      --spacing-element: ${tokens.spacingElement};
      --spacing-card: ${tokens.spacingCard};
      --spacing-btn-vertical: ${tokens.spacingButtonVertical};
      --spacing-btn-horizontal: ${tokens.spacingButtonHorizontal};
      
      /* Layout */
      --max-width-content: ${tokens.maxWidthContent};
      --max-width-text: ${tokens.maxWidthText};
      --grid-columns: ${tokens.gridColumns};
      --grid-gutter: ${tokens.gridGutter};
      --horizontal-padding-mobile: ${tokens.horizontalPaddingMobile};
      --horizontal-padding-tablet: ${tokens.horizontalPaddingTablet};
      --horizontal-padding-desktop: ${tokens.horizontalPaddingDesktop};
      
      /* Visual details */
      --radius: ${tokens.borderRadius}px;
      --radius-sm: ${tokens.borderRadiusSmall};
      --radius-md: ${tokens.borderRadiusMedium};
      --radius-lg: ${tokens.borderRadiusLarge};
      --shadow-resting: ${tokens.shadowResting};
      --shadow-hover: ${tokens.shadowHover};
      --transition-duration: ${tokens.transitionDuration};
      --transition-timing: ${tokens.transitionTiming};
      
      /* Image ratios */
      --image-ratio-hero: ${tokens.imageRatioHero};
      --image-ratio-card: ${tokens.imageRatioCard};
      --image-ratio-avatar: ${tokens.imageRatioAvatar};
    }
  `
}