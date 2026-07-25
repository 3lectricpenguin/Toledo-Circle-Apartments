# Toledo Circle Apartments landing page - Design Specification

This document establishes the visual design system, typography, layout hierarchy, color tokens, and image generation assets for the Toledo Circle Apartments landing page. The design focuses on creating a modern, warm, and welcoming atmosphere.

---

## 1. Brand Vision & Design Principles

*   **Warm & Welcoming:** Avoid sterile, cold, or generic corporate apartment designs. Every touchpoint should feel like a cozy, inviting home.
*   **Modern & Elegant:** Clean geometric shapes, generous whitespace, and high-quality serif headers combined with minimalist layout structures.
*   **Earthy & Organic:** Emphasize natural textures and colors (clay, leaves, warm sand) to connect residents with comfortable living.

---

## 2. Color Palette & Design Tokens

The color tokens are categorized to ensure consistency across the application. Avoid cool blues or sterile grays.

| Token Name | Hex Code | Usage | Visual Description |
| :--- | :--- | :--- | :--- |
| `--color-terracotta-primary` | `#C05C46` | Primary accents, buttons, highlighted headers | Warm, earthy red-clay tone |
| `--color-terracotta-hover` | `#A64834` | Hover states for primary elements | Deeper, rich burnt-terracotta |
| `--color-terracotta-light` | `#F6EBE8` | Tinted background alerts, tag fills | Soft, warm pinkish-terracotta tint |
| `--color-sage-secondary` | `#7A8B7B` | Secondary accents, tags, secondary button borders | Calming, organic muted green |
| `--color-forest-dark` | `#3D5240` | Footer background, text icons, high-contrast badges | Rich, dark green foliage tone |
| `--color-cream-bg` | `#FAF8F5` | Primary site background | Soft, inviting off-white |
| `--color-sand-card` | `#F3ECE3` | Cards, hero containers, alternate sections | Warm, light-beige sand texture |
| `--color-cream-border` | `#EAE0D5` | Divider lines, input borders, structural edges | Soft beige separator |
| `--color-charcoal-text` | `#222222` | Primary body text, main headings | Soft black (easier on eyes than #000) |
| `--color-charcoal-muted` | `#555555` | Secondary text, captions, labels | Muted dark gray |

---

## 3. Typography System

The typography scale is designed to create a clear visual hierarchy, mixing a classic serif for display and a clean sans-serif for reading.

*   **Primary Headings (Display, H1, H2):** `Playfair Display` (Serif)
*   **Body & UI Controls (H3, H4, Body, Buttons):** `Outfit` or `Inter` (Sans-serif)

### Typography Scale

*   **H1 (Hero Heading):** `Playfair Display`, Bold (700), `48px` / Line Height `1.2`
*   **H2 (Section Heading):** `Playfair Display`, Semi-Bold (600), `36px` / Line Height `1.3`
*   **H3 (Card / Subsection Heading):** `Outfit`, Medium (500), `24px` / Line Height `1.4`
*   **H4 (Small Heading / Label):** `Outfit`, Semi-Bold (600), `18px` / Line Height `1.4`
*   **Body Text (Paragraphs):** `Outfit`, Regular (400), `16px` / Line Height `1.6`
*   **UI Small (Metadata, Captions):** `Outfit`, Regular (400), `14px` / Line Height `1.5`
*   **Button Text:** `Outfit`, Semi-Bold (600), `16px` (Uppercase or Medium Tracking)

---

## 4. Layout & Grid System

*   **Grid Structure:** Standard 12-column grid for desktop layout (max-width `1200px`) with `24px` gutters. Responsive down to 4 columns on mobile.
*   **Spacing Scale (Tailwind equivalent):**
    *   Section spacing: `96px` to `128px` top/bottom padding to give elements room to breathe.
    *   Component spacing: `24px` to `32px` padding within cards and interactive modules.
*   **Card Elements:**
    *   Background: `--color-sand-card` (`#F3ECE3`) or solid White (`#FFFFFF`).
    *   Borders: `1px solid --color-cream-border` (`#EAE0D5`).
    *   Corners: `Border-radius: 12px` (rounded but structured).
    *   Shadows: Very soft, diffuse elevation shadow:
        `box-shadow: 0 4px 20px -2px rgba(90, 80, 70, 0.08);`
*   **Transitions & Interactions:**
    *   All hover states should use standard cubic-bezier curves for transitions:
        `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);`
    *   *Hover Effect for Cards:* Subtly lift by `4px` and deepen shadow:
        `transform: translateY(-4px); box-shadow: 0 10px 25px -5px rgba(90, 80, 70, 0.12);`
    *   *Hover Effect for Buttons:* Fill transitions or soft scaling.

---

## 5. UI Components Guidelines

### Primary Button
*   **Background:** `--color-terracotta-primary` (`#C05C46`)
*   **Text Color:** `--color-cream-bg` (`#FAF8F5`)
*   **Border-Radius:** `8px` or fully rounded pill `9999px` for a softer feel.
*   **Hover State:** Background shifts to `--color-terracotta-hover` (`#A64834`).

### Secondary Button
*   **Background:** Transparent
*   **Border:** `2px solid --color-sage-secondary` (`#7A8B7B`)
*   **Text Color:** `--color-charcoal-text` (`#222222`)
*   **Hover State:** Background becomes `--color-sage-secondary` (`#7A8B7B`) with text changing to `--color-cream-bg` (`#FAF8F5`).

---

## 6. Image Assets & Generation Prompts

These prompts are engineered for a text-to-image generator (such as standard AI diffusion models) to create matching, high-quality visuals for the website.

### 1. Exterior Hero Image
> **Prompt:** A professional architectural photograph of Toledo Circle Apartments at sunset. A modern, warm, three-story residential building with large glass windows, terracotta-accented brickwork, and timber details. The building is surrounded by lush green landscaping, neat walkways, and elegant outdoor lighting casting a warm golden glow. High-end, inviting, cinematic lighting, shot on 35mm lens, photorealistic, 8k resolution.

### 2. Interior (Modern Kitchen)
> **Prompt:** A bright and airy modern apartment kitchen. Sleek minimalist design featuring natural wood cabinetry, cream countertops, a terracotta handmade tile backsplash, and matte black fixtures. A kitchen island with two stylish barstools. Soft natural light streaming in from a large window showing green trees outside. Warm, welcoming atmosphere, high-end interior design magazine style, photorealistic, 8k resolution.

### 3. Interior (Cozy Bedroom)
> **Prompt:** A cozy, sunlit apartment bedroom with a warm and inviting design. A queen-sized bed with cream and sage green linen bedding, textured throw pillows, and a terracotta knit blanket. A light wood nightstand with a ceramic lamp emitting a warm glow. A large window with sheer curtains letting in soft morning sunlight. Elegant, serene, cozy aesthetic, photorealistic, high-end interior photography, 8k resolution.

### 4. Floor Plan Graphic
> **Prompt:** A clean, minimal, 3D architectural floor plan layout of a modern two-bedroom apartment. The plan shows a living room, open-concept kitchen, two bedrooms, and two bathrooms. Styled with soft neutral tones, sage green rugs, terracotta accents in the furniture, and light wood flooring. The layout is clear, clean-cut, and easy to read, set against a solid off-white cream background. Professional architectural rendering, high-resolution.

### 5. Amenities (Outdoor Lounge)
> **Prompt:** A chic outdoor community patio and lounge area at Toledo Circle Apartments. Comfortable outdoor sofas and armchairs with cream cushions and sage green accents surrounding a warm, glowing fire pit. Potted plants and mature leafy trees create a private oasis. Warm bistro string lights hang overhead in the twilight sky. Cozy, warm, inviting social space, high-end lifestyle photography, photorealistic, 8k.
