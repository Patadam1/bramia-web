---
name: Bramia
description: Black-and-silver poster world for a small-business web and automation studio; the business lights up once it is visible.
colors:
  carbon: "#1C1C1C"
  carbon-hondo: "#151515"
  panel: "#232323"
  grafito: "#393939"
  roto: "#F5F4F0"
  piedra: "#D8D6D1"
  tenue: "#A9A7A2"
  plata: "#C0C0C0"
  plata-viva: "#E6E6E6"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(56px, 7.4vw, 124px)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 112"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(46px, 7vw, 120px)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(34px, 4vw, 72px)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 108"
  lead:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(17px, 1.25vw, 20px)"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(16px, 1.05vw, 18px)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.6
  button:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1
rounded:
  field: "12px"
  frame: "16px"
  card: "18px"
  panel: "22px"
  device: "46px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "18px"
  lg: "28px"
  gutter: "clamp(16px, 4.5vw, 64px)"
  section: "clamp(96px, 14vw, 180px)"
  max: "1320px"
components:
  button-primary:
    backgroundColor: "{colors.roto}"
    textColor: "{colors.carbon}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "16px 18px 16px 26px"
  button-primary-hover:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.carbon}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.roto}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "16px 26px"
  button-small:
    backgroundColor: "{colors.roto}"
    textColor: "{colors.carbon}"
    rounded: "{rounded.pill}"
    padding: "10px 12px 10px 18px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.piedra}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.roto}"
    rounded: "{rounded.panel}"
    padding: "24px"
  field:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.roto}"
    rounded: "{rounded.field}"
    padding: "12px 14px"
  notification:
    backgroundColor: "rgba(245,244,240,.1)"
    textColor: "{colors.roto}"
    rounded: "{rounded.card}"
    padding: "10px 12px"
  example-label:
    textColor: "{colors.tenue}"
    typography: "{typography.label}"
---

# Design System: Bramia

## Overview

**Creative North Star: "The Poster That Lights Up"**

Bramia's world is the studio's own ad turned into a page: a carbon ground, heavy off-white Archivo posters that end in a silver full stop, rows of outlined lettering sliding behind them, and a drop of liquid chrome that ripples slowly and stirs with the pointer and the scroll. Everything is black, graphite and silver; light is the only accent. The page reads as a sequence of posters separated by a silver thread, with working demonstrations (a phone lock screen receiving notifications, a search result list, an automation chain) set between them as physical objects.

Density is low and the scale contrast is extreme: posters run up to 124px with 0.86 leading, while body copy sits at 16 to 18px Manrope in stone grey. Motion is part of the material, not decoration: letters rise out of masks, outline rows slide on long linear loops, outlined titles fill solid on scroll, and the B mark reveals the wordmark with a light sweep. All motion collapses under reduced-motion preferences.

Absence is drawn too. Ghost lettering stays visible behind the lit headline, a missing search listing is hatched rather than omitted, and outlined numerals turn silver only when reached. Poster letters widen near the pointer (Archivo's width axis) and lean with scroll speed.

**Key Characteristics:**
- Carbon ground (#1C1C1C), never pure black; silver as the only accent, no hue.
- Uppercase Archivo 900 posters, widened (112%), tightly led, each ending in a silver full stop.
- Outlined "ghost" lettering (text-stroke, no fill) as a recurring second voice.
- Hairline graphite seams separate rows and panels; deep soft shadows belong only to objects (phone, browser, search panel).
- Pill-shaped actions with a round dark arrow chip.
- A fixed 3D drop of liquid chrome (noise-displaced sphere, physical metal, studio reflections) that gains energy from pointer and scroll speed. Full strength in the opening viewport and dimmed elsewhere.

## Colors

A monochrome carbon-and-silver palette with a faint warm cast in the light greys; metal does the work colour would do elsewhere.

### Primary
- **Brushed Silver** (plata): the accent. Poster full stops, sparkles, check and star icons, the silver thread, reached process numerals, the "Hecho" state, the tagline under the final poster, text selection.
- **Lit Silver** (plata-viva): the bright highlight of metal. Focus rings, the centre of the silver thread, the filled automation progress line and its glow, the submitted-state button.

### Neutral
- **Carbon** (carbon): page ground, inner surfaces of fields and search box, the dark arrow chip inside buttons.
- **Deep Carbon** (carbon-hondo): recessed bands (the automation section), the scrolled nav backdrop at 82%, scrollbar track.
- **Panel Grey** (panel): raised demonstration panels (search, form).
- **Graphite** (grafito): every hairline seam, inset ring, row divider, and the unlit outline of process numerals.
- **Off-White** (roto): headlines, primary button fill, active step icon fill, notification icon tiles.
- **Stone** (piedra): body and lead copy, nav links at rest, chip text, outline stroke of service titles, and the outline rows (at 11 to 17% alpha).
- **Muted Stone** (tenue): secondary metadata, field labels, example labels, footer.

### Named Rules
**The No-Hue Rule.** The palette is carbon, graphite, stone and silver. No orange, no brand colour; client screenshots are the only colour on the page.

**The Silver Full Stop Rule.** Every poster headline ends with its punctuation in silver. That full stop is the system's signature accent and should not be spent elsewhere on headlines.

## Typography

**Display Font:** Archivo (variable weight 100 to 900, width 62 to 125%), with system-ui fallback
**Body Font:** Manrope (variable 200 to 800), with system-ui fallback

**Character:** A loud, wide grotesk poster voice against a calm, rounded humanist body. Archivo carries every claim; Manrope carries every explanation.

### Hierarchy
- **Display** (Archivo 900, width 112%, clamp(56px, 7.4vw, 124px), 0.86, uppercase): the opening poster only. On phones it drops to clamp(44px, 13.4vw, 64px) and normal width.
- **Headline** (Archivo 900, width 112%, clamp(46px, 7vw, 120px), 0.86, uppercase): each section poster, balanced wrapping, often capped at 12 to 14ch. Below 560px it becomes clamp(36px, 11vw, 60px) at 100% width.
- **Title** (Archivo 900, width 108%, clamp(34px, 4vw, 72px), 0.88 to 0.92, uppercase): project names and service names. Service titles start as outline only and fill solid on scroll.
- **Lead** (Manrope 400, clamp(17px, 1.25vw, 20px), 1.6, max 58ch, stone): the paragraph directly under a poster.
- **Body** (Manrope 400, clamp(16px, 1.05vw, 18px), 1.6, max 46 to 52ch, stone).
- **Label** (Manrope 600, 12 to 13px, sentence case): chips, field labels, example labels, metadata.
- **Outline rows** (Archivo 900, width 118%, clamp(70px, 11vw, 190px), 0.95, uppercase, transparent fill with a 1px stone stroke at 11 to 17% alpha): aria-hidden background texture behind the opening and closing posters only.

### Named Rules
**The Poster Rule.** Headlines are uppercase Archivo 900, widened, led below 0.9, and they reveal letter by letter from a mask with a slight rotation (900ms ease-out, 22ms stagger). Everything that is not a claim is Manrope in sentence case.

**The Ghost Letter Rule.** Outline lettering (text-stroke, transparent fill) is the second voice of the world: sliding rows behind posters, unfilled service titles, unreached step numerals. It is always decorative or a state, never the only carrier of readable content.

## Layout

Content sits in a centred wrapper (max 1320px) with a fluid gutter (clamp(16px, 4.5vw, 64px)). Sections breathe with clamp(96px, 14vw, 180px) of vertical padding; the opening and closing sections fill the viewport (100svh). Between sections a 1px silver thread wipes in from the left (1.4s ease-in-out).

Two-column asymmetric grids carry each demonstration: poster plus lead on one side, the object on the other (1.25fr / 0.75fr in the opening, 1.5fr / 0.8fr alternating sides for projects, 1.3fr / 1fr for service rows). Services and process steps are stacked rows divided by graphite hairlines, not cards. The process is a four-column row of numbered steps, two columns under 980px, one under 560px.

At 980px every split grid collapses to one column, the nav links hide (the brand mark and small button remain), and the phone mockup stops rotating. At 560px the wordmark text in the nav hides and the primary actions stretch to full width.

## Elevation & Depth

Depth comes from three things: tonal steps (carbon-hondo, carbon, panel), 1px graphite seams drawn as inset or outer rings, and the liquid chrome drop behind everything. Flat content (service rows, steps, chips, the contact note) uses seams only. Objects that represent a device or a screen (the phone, the browser frames, the search panel) float on a long, soft, very dark ambient shadow. A translucent blurred surface appears only on the scrolled nav and the phone notifications.

### Shadow Vocabulary
- **Seam** (`box-shadow: inset 0 0 0 1px #393939` or `0 0 0 1px #393939`): the default edge of panels, chips, fields, outline buttons.
- **Object float** (`box-shadow: 0 40px 80px -40px rgba(0,0,0,.8)` to `0 60px 90px -40px rgba(0,0,0,.9)`): under phone, browser and search panel, combined with the seam.
- **Pill lift** (`box-shadow: 0 10px 30px -12px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.6)`): the primary button, with a silver glow on hover.
- **Lit glow** (`box-shadow: 0 0 0 6px rgba(245,244,240,.08), 0 0 30px rgba(230,230,230,.35)`): an active automation step.

### Named Rules
**The Seam Rule.** Panels are separated by graphite hairlines, not by shadow. A shadow means "this is an object you could hold".

## Shapes

Soft but not bubbly. Actions and chips are full pills (999px); the arrow chip inside a button is a circle. Panels round at 22px, notifications and the contact note at 18px, browser frames at 16px, fields and thumbnails at 12px, and the phone at 46px outer / 36px screen. Row-based content (services, steps, project bullet lists) has no corners at all: just a top hairline. Metal surfaces (phone bezel, small phone frame) use a diagonal grey gradient to read as brushed metal.

## Components

### Buttons
Tactile, metallic pills with a dark arrow chip.
- **Shape:** full pill (999px), arrow chip a 30px circle (24px in the small size).
- **Primary:** off-white fill, carbon text, Manrope 700 16px, padding 16px 18px 16px 26px, the arrow chip in carbon with off-white arrow.
- **Hover / Focus:** fill brightens to white with a silver glow; the arrow chip slides 3px and turns -45 degrees (300ms ease-out). Press scales to 0.97. Focus is a 2px lit-silver outline offset 4px.
- **Line:** transparent with a graphite inset seam and off-white text, padding 16px 26px; on hover a 6% white wash and the seam turns silver.
- **Small:** the nav variant, padding 10px 12px 10px 18px, 14px text.

### Chips
- **Style:** transparent pill, graphite inset seam, stone text, Manrope 600 13px, padding 6px 12px. Used as non-interactive tags under each service.

### Cards / Containers
- **Corner Style:** 22px panel.
- **Background:** panel grey on carbon, or on deep carbon in the automation band.
- **Shadow Strategy:** seam always; object float only when the panel imitates a screen.
- **Internal Padding:** 18 to 24px.

### Inputs / Fields
- **Style:** carbon inset on the panel, graphite inset seam, 12px radius, padding 12px 14px, 15px text; the search box is the same treatment as a pill. Labels sit above in muted stone 12px 600.
- These are demonstration fields; there is no live form state in the build.

### Navigation
- **Style:** fixed, transparent over the opening poster; after scrolling it gains deep carbon at 82% with a 14px backdrop blur and a graphite bottom seam. B mark (38px) plus the BRAMIA wordmark in Archivo 800 at 112% width; links Manrope 600 14px in stone, off-white on hover; a small primary button on the right. Under 980px only the mark and button remain.

### Example Label
- A muted-stone 12px 600 line with a 6px silver dot, placed under every demonstration (notifications, search, form) to say it is an example. Required wherever a demo could be mistaken for real data.

### Phone Lock Screen (signature)
- Brushed-metal bezel, 46px radius, 9:19, tilted -14 degrees in Y on desktop. Inside: a light Archivo 300 clock (68px), date, and notifications that drop in one at a time (translucent off-white at 10%, 18px radius, blur, off-white icon tile in carbon), cycling.

### Outline Fill Row (signature)
- A service row: outlined title (1.5px stone stroke) that wipes to solid off-white from left to right when it enters view (1.1s ease-in-out), beside its description and chips, divided by graphite hairlines.

### B-to-Wordmark Ritual (signature)
- The metallic wordmark is clipped to its first third (the B) and opens to full width over 1.6s, with a single light sweep masked to the letterforms. Used once, at the close.

## Do's and Don'ts

### Do:
- **Do** end every poster headline with a silver full stop and reveal it letter by letter from a mask.
- **Do** separate rows and panels with 1px graphite seams; save the deep soft shadow for device and screen objects.
- **Do** keep outline lettering decorative or stateful (aria-hidden rows, unfilled titles, unreached numerals).
- **Do** label every demonstration with the example label (silver dot, muted stone 12px).
- **Do** show real client screenshots inside browser and phone frames; they are the only colour on the page.
- **Do** keep the liquid chrome drop behind content and dim it outside the opening viewport (about 0.2 on desktop, 0.14 on mobile, 0.45 at the close).
- **Do** collapse all animation under prefers-reduced-motion and stop the outline rows.

### Don't:
- **Don't** introduce a hue accent; no orange, no brand colour beyond silver.
- **Don't** use pure black (#000) as the ground; the world is carbon.
- **Don't** place small labels or kickers above poster headlines; the poster opens the section on its own.
- **Don't** turn services or steps into boxed cards; they are hairline-divided rows.
- **Don't** set body or explanatory copy in Archivo or in uppercase.
