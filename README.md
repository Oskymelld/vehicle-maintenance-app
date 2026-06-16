# Wallet Pattern Generator

A React Native (Expo) mobile app that generates leatherworking patterns for a
**stacked card holder** — a wallet with one open pocket per card. You set the
options, tap **Make** to render a true-to-scale wireframe, then **Output** to
download a print-ready PDF or an SVG.

## Features (v1)

- **Stacked design, one pocket per card** — 1–6 pockets that cascade downward.
- **Sized for a standard credit card** (ISO/IEC 7810 ID-1, 85.6 × 53.98 mm) with
  built-in clearance so a real card slides in.
- **Stitch spacing** slider — 2 mm to 6 mm, in 0.5 mm steps.
- **Border width** slider — 2 mm to 5 mm (the margin between the cut edge and the
  stitch line), in 0.5 mm steps.
- **Wireframe preview** drawn 1:1 in millimetres: cut outline, pocket openings,
  card reference outlines, the stitch line and every individual stitch hole.
- **Export overlay** with **PDF** (print at 100% for tracing) and **SVG** (for
  editing or laser/CNC) options, shared through the native share sheet.

## How it works

1. Choose the number of card pockets, the stitch spacing and the border width.
2. Tap **Make** — the geometry is generated and the wireframe appears. If you
   change an option afterwards, a badge reminds you to remake it.
3. Tap **Output**, then pick **PDF** or **SVG** to save/share the template.

All measurements are real-world millimetres. The exported files are drawn at 1:1
scale, so **print at 100% (no "fit to page")** for an accurate template.

## Project layout

```
App.tsx                      App entry (SafeAreaProvider + screen)
src/
  constants.ts               Card dimensions, slider ranges, colours
  types.ts                   WalletConfig + render-ready WalletPattern
  patternGenerator.ts        Pure geometry: config -> pattern (the core logic)
  svg/buildSvg.ts            Pattern -> standalone SVG string (1:1, mm units)
  export/exportPattern.ts    SVG file write + PDF render + native share
  components/
    SliderRow.tsx            Labelled slider with live readout
    StepperRow.tsx           +/- integer stepper (pocket count)
    WireframePreview.tsx     On-screen SVG wireframe (react-native-svg)
    OutputModal.tsx          PDF / SVG export overlay
  screens/
    GeneratorScreen.tsx      Main mobile screen wiring it together
```

The pattern generator (`generateWalletPattern`) is intentionally a pure
function with no UI dependencies, so the same geometry feeds both the on-screen
wireframe and the exported files, and it can be unit tested in isolation.

## Running

```bash
npm install
npm run ios       # or: npm run android
```

Built with Expo SDK 56, `react-native-svg`, `@react-native-community/slider`,
`expo-print`, `expo-sharing` and `expo-file-system`.

## Roadmap ideas

- Adjustable card size / non-standard cards and a card clearance control.
- Corner radius and reveal (peek) sliders.
- Separate cut pieces laid out for material (vs. the assembled view).
- Saved presets and a measured ruler overlay on the preview.
