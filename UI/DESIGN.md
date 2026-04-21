---
name: The Design System
colors:
  surface: '#fef9f2'
  surface-dim: '#ded9d3'
  surface-bright: '#fef9f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3ec'
  surface-container: '#f2ede6'
  surface-container-high: '#ece7e1'
  surface-container-highest: '#e6e2db'
  on-surface: '#1d1c18'
  on-surface-variant: '#52443d'
  inverse-surface: '#32302c'
  inverse-on-surface: '#f5f0e9'
  outline: '#84746c'
  outline-variant: '#d6c3b9'
  surface-tint: '#855234'
  primary: '#825032'
  on-primary: '#ffffff'
  primary-container: '#9e6848'
  on-primary-container: '#fffbff'
  inverse-primary: '#fbb893'
  secondary: '#4d6450'
  on-secondary: '#ffffff'
  secondary-container: '#cde6cd'
  on-secondary-container: '#516854'
  tertiary: '#745b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cda72c'
  on-tertiary-container: '#4f3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbc9'
  primary-fixed-dim: '#fbb893'
  on-primary-fixed: '#331200'
  on-primary-fixed-variant: '#693b1f'
  secondary-fixed: '#d0e9d0'
  secondary-fixed-dim: '#b4cdb5'
  on-secondary-fixed: '#0b2010'
  on-secondary-fixed-variant: '#364c39'
  tertiary-fixed: '#ffe08b'
  tertiary-fixed-dim: '#ebc246'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#584400'
  background: '#fef9f2'
  on-background: '#1d1c18'
  surface-variant: '#e6e2db'
typography:
  display-lg:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
  headline-md:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The brand personality is rooted in the concept of "The Modern Hearth." It is designed to feel like a deep exhale—reliable, warm, and restorative. The target audience values the home as a sanctuary and seeks quality over trends. 

The visual style is a blend of **Tactile Minimalism**. It avoids the coldness of high-gloss modernism by incorporating organic tones and physical metaphors. The UI should evoke a sense of "lived-in" comfort, using soft textures and layered depth to simulate the physical experience of moving through a well-curated home.

## Colors
The palette is inspired by natural materials and sunlight. 
- **Primary (Cedar):** A warm, mid-tone wood brown used for key actions and branding.
- **Secondary (Sage):** A desaturated, calming green used for success states and lifestyle accents.
- **Tertiary (Honey):** A muted sunny yellow used sparingly to highlight promotions or "joy" moments.
- **Neutrals:** The background is a soft cream (`#FDF8F1`) rather than pure white to reduce eye strain and increase the "cozy" factor. Text uses a warm charcoal (`#3E362E`) to maintain high legibility without the harshness of true black.

## Typography
This design system employs a classic Serif/Sans-Serif pairing to balance tradition with accessibility.
- **Headings:** `Noto Serif` provides a literary, established feel. Use for all product titles and editorial storytelling.
- **Body & UI:** `Plus Jakarta Sans` is chosen for its friendly, open apertures and soft curves, which mirror the rounded corners of the UI elements.
- **Weighting:** Use heavier weights for headlines to create a strong visual anchor against the soft background colors.

## Layout & Spacing
The layout follows a **Fixed Grid** model to create a sense of stability and containment. On desktop, content is centered within a 1280px container.
- **Rhythm:** An 8px base unit drives all padding and margins. 
- **Density:** The system prioritizes "breathability." Use `lg` (40px) or `xl` (64px) spacing between major sections to prevent the interface from feeling cluttered or "salesy."
- **Grid:** A 12-column system with generous 24px gutters allows for asymmetrical product galleries that feel like a magazine layout.

## Elevation & Depth
To achieve a "tactile" feel, this design system avoids flat design in favor of **Ambient Shadows** and **Tonal Layers**.
- **Shadows:** Use extremely soft, multi-layered shadows with a slight warm tint (e.g., `rgba(62, 54, 46, 0.08)`). Shadows should look like natural light hitting a physical object, with larger blurs and low opacity.
- **Tiers:** 
  - *Level 0:* Cream background.
  - *Level 1:* White surfaces (cards, menus) with subtle shadows.
  - *Level 2:* Interactive elements that "lift" on hover to invite a touch.
- **Depth:** No harsh borders. Use subtle value shifts between the background and surface colors to define boundaries.

## Shapes
Shapes are intentionally soft to mimic the curves of upholstery and handcrafted wood. 
- **Base Corner Radius:** 0.5rem (8px). This is applied to standard inputs and small buttons.
- **Large Radius:** 1rem (16px). Applied to product cards and modal containers.
- **Extra Large Radius:** 1.5rem (24px). Used for featured editorial sections or "Hero" image containers.
- **Consistency:** Avoid sharp 90-degree angles wherever possible to maintain the "welcoming" brand promise.

## Components
- **Buttons:** Use a solid "Cedar" background for primary actions. Use a "pill-like" shape (rounded-lg) with a slight bottom shadow to make them feel pressable.
- **Cards:** Product cards should have no border; instead, use a Level 1 elevation (white surface + soft shadow). Images should have a 12px corner radius.
- **Chips:** Used for material types (e.g., "Velvet," "Oak"). These should use the secondary Sage color at 10% opacity with 600-weight text.
- **Input Fields:** Use a subtle inset shadow to make the field feel "hollowed out" of the surface, reinforcing the tactile metaphor.
- **Lists:** Use custom icons for list bullets, such as a small leaf or a simple wood-grain dot, to reinforce the theme.
- **Swatches:** For furniture colors, use large, circular swatches with a 2px "inner-glow" border to show texture.
- **Room Visualizers:** A custom component with a translucent "Glassmorphism" overlay for UI controls, allowing the product imagery to remain the focal point.