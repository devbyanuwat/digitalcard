# digitalcard — Design System

> Open-source digital business card builder.
> Left **control panel** + center **live playground**. Block-based cards, themes-as-data.
> Open-core: self-host (OSS) and hosted share **one engine**; only the theme catalog differs
> (OSS ~6 base themes, hosted 30+).

Status: **v0** — foundations locked. Accent = indigo `#5B5BD6`.
Stack: **Next.js 16 (App Router) + shadcn/ui + Tailwind**.

---

## 1. Design Principles

1. **Two-layer separation.** The *tool chrome* (panel + playground UI) is quiet and neutral.
   The *card* is the expressive, themeable artifact. The chrome must never visually compete with
   the card in the playground — it is a gallery wall, not a painting.
2. **Theme is data, not code.** One rendering engine. A theme is a plain object (see §4). OSS and
   hosted run the identical renderer; the only difference is which themes are in the catalog. This is
   the central architectural commitment — every design decision serves it.
3. **Block-based composition.** A card is an ordered list of blocks (like Notion). One model covers
   personal profile, business, link-in-bio, and vCard — no separate templates to maintain.
4. **Minimal Swiss aesthetic.** Monochrome neutrals + a single accent, strict 8px grid, generous
   whitespace, sharp type hierarchy, restrained motion. Borders over shadows.
5. **Accessibility by default.** Chrome targets WCAG AA (AAA where cheap). User-customized card
   colors can drift, so the builder ships a live contrast checker rather than blocking creativity.
6. **Mobile-first card, desktop-first builder.** Cards are consumed on phones (opened from a QR or
   shared link), so the renderer is mobile-first. The builder is desktop-primary but degrades to a
   stacked mobile layout.

---

## 2. Foundations — Builder Chrome Tokens

These tokens style **only the builder UI**. Card themes carry their own tokens (§4).

### 2.1 Color — Light (default)

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#FAFAFA` | App background |
| `--surface` | `#FFFFFF` | Panels, cards, popovers |
| `--surface-2` | `#F4F4F5` | Inset wells, hover rows |
| `--fg` | `#09090B` | Primary text |
| `--fg-muted` | `#71717A` | Secondary text, captions |
| `--fg-subtle` | `#A1A1AA` | Placeholder, disabled text |
| `--border` | `#E4E4E7` | Hairline dividers, input borders |
| `--border-strong` | `#D4D4D8` | Emphasized borders |
| `--primary` | `#18181B` | Primary buttons, active nav |
| `--primary-fg` | `#FFFFFF` | Text on primary |
| `--accent` | `#5B5BD6` | Brand accent, focus ring, selected (LOCKED — indigo) |
| `--accent-fg` | `#FFFFFF` | Text on accent |
| `--accent-subtle` | `#EEEEFB` | Accent tint backgrounds |
| `--success` | `#16A34A` | Saved, valid |
| `--warning` | `#D97706` | Low-contrast warnings |
| `--destructive` | `#DC2626` | Delete, errors |
| `--ring` | `#5B5BD6` | Focus ring (= accent) |

### 2.2 Color — Dark (Linear-style near-black)

| Token | Hex |
|---|---|
| `--bg` | `#0A0A0B` |
| `--surface` | `#131316` |
| `--surface-2` | `#1F1F23` |
| `--fg` | `#FAFAFA` |
| `--fg-muted` | `#A1A1AA` |
| `--fg-subtle` | `#71717A` |
| `--border` | `#27272A` |
| `--border-strong` | `#3F3F46` |
| `--primary` | `#FAFAFA` |
| `--primary-fg` | `#18181B` |
| `--accent` | `#7C7CF0` |
| `--accent-subtle` | `#1E1E3A` |

> All semantic — no raw hex in components. Themed via `data-theme="dark"` on `<html>`.
> **Implementation note:** the hex values above are human-readable references. In code, tokens are
> authored in **OKLCH** with neutrals **tinted ~0.006 chroma toward the brand hue (≈279, indigo)**
> for subconscious cohesion (per impeccable color guidance). Accent ≈ `oklch(0.53 0.19 279)`.

### 2.3 Typography

- **UI font:** `Geist` (variable) — entire chrome. One family, weight-driven hierarchy.
  (Deliberately **not** Inter: Inter is the monoculture default; Geist is the truer Vercel match
  and stays neutral so themed cards keep the spotlight.)
- **Mono font:** `Geist Mono` — URLs, slugs, copy-link fields, code.
- **Card fonts:** chosen per theme (theme data), loaded on demand — this is the expressive layer.

Scale (16px base). The builder is dense (Linear-like), so UI controls sit at 13–14px.

| Role | Size | Weight | Line-height | Tracking |
|---|---|---|---|---|
| `display` | 30px | 700 | 1.2 | -0.02em |
| `h1` | 24px | 600 | 1.25 | -0.02em |
| `h2` | 20px | 600 | 1.3 | -0.01em |
| `h3` | 18px | 600 | 1.4 | -0.01em |
| `body` | 16px | 400 | 1.5 | 0 |
| `body-sm` | 14px | 400 | 1.5 | 0 |
| `ui` | 13px | 500 | 1.4 | 0 |
| `label` | 13px | 500 | 1.4 | 0 |
| `caption` | 12px | 400 | 1.4 | 0 |
| `mono` | 13px | 400 | 1.5 | 0 |

### 2.4 Spacing — 8px base (4px half-steps)

`2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96` (px)
Tokens: `space-0.5=2 · space-1=4 · space-2=8 · space-3=12 · space-4=16 · space-5=20 · space-6=24 · space-8=32 · space-10=40 · space-12=48 · space-16=64`.

### 2.5 Radius

`sm 6 · md 8 (base) · lg 12 · xl 16 · full 9999`. (Cards use their theme's own radius.)

### 2.6 Shadow — subtle; prefer 1px borders

| Token | Value | Usage |
|---|---|---|
| `shadow-xs` | `0 1px 2px rgba(0,0,0,.04)` | Resting cards |
| `shadow-sm` | `0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)` | Raised cards |
| `shadow-md` | `0 4px 12px rgba(0,0,0,.08)` | Dropdowns, popovers |
| `shadow-lg` | `0 12px 32px rgba(0,0,0,.12)` | Modals, dialogs |

### 2.7 Motion

| Token | Value |
|---|---|
| `dur-fast` | 120ms |
| `dur-base` | 180ms |
| `dur-slow` | 240ms |
| `ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `ease-out` | enter | `ease-in` | exit (exit ≈ 70% of enter) |
| spring | block drag/reorder |

Rules: transform/opacity only; respect `prefers-reduced-motion`; **live preview** debounces text
inputs ~120ms, applies toggles/selects instantly.

### 2.8 Z-index

`base 0 · sticky 10 · dropdown 20 · panel-header 30 · overlay 40 · modal 50 · popover 60 · toast 70 · tooltip 80`.

### 2.9 Icons

`lucide-react`, stroke 1.5–2px, sizes 16 / 20 / 24. **No emoji anywhere.**

---

## 3. Layout Spec

```
┌────────────────────────────────────────────────────────────────┐
│ Topbar: logo · card name · save-state · [Share] [QR] [Publish] · ☾│
├────────────┬─────────────────────────────────────┬─────────────┤
│ LEFT PANEL │            PLAYGROUND               │  INSPECTOR  │
│  320–360px │      (flex, centered card)          │   280px     │
│            │                                     │ (collapsible│
│ Content    │   ┌─────────────┐  device frame     │  per-block  │
│ Theme      │   │             │  zoom · bg grid    │  settings)  │
│ Style      │   │   CARD      │                    │             │
│ Settings   │   │  preview    │  [copy] [QR] [⤢]   │             │
│            │   └─────────────┘                    │             │
└────────────┴─────────────────────────────────────┴─────────────┘
```

- **Desktop ≥1024px:** 3 columns. Left panel fixed 320–360px, playground flex, right inspector
  280px (collapsible; opens when a block is selected).
- **Tablet 768–1023px:** Left panel becomes a collapsible drawer; playground full width;
  inspector as a popover.
- **Mobile <768px:** Preview is primary (full screen). Panel is a bottom sheet with a tab bar
  (Content / Theme / Style / Settings). Floating "Edit" FAB toggles the sheet.
- **Public card page** (`/c/[slug]`): its own mobile-first route — pure card, zero chrome.

---

## 4. Theme Architecture (the core)

A theme is data. The renderer reads it; nothing is hard-coded. Catalog gating is a single field.

```ts
type ThemeTier = 'oss' | 'hosted'
type ThemeCategory = 'minimal' | 'bold' | 'gradient' | 'dark' | 'glass' | 'playful' | 'pro'

interface CardTheme {
  id: string
  name: string
  tier: ThemeTier              // 'oss' ships everywhere; 'hosted' gated to the hosted catalog
  category: ThemeCategory
  thumbnail: string            // preview image path

  colors: {
    background: string         // base bg color (see `background` for gradient/image)
    surface: string            // card/section surface
    text: string
    textMuted: string
    accent: string             // links, buttons, highlights
    accentText: string         // text on accent
    border: string
  }
  background: {
    type: 'solid' | 'gradient' | 'pattern' | 'image'
    value: string              // css color | css gradient | pattern id | image url
  }
  typography: {
    fontFamily: string         // Google Font family name
    headingWeight: number      // e.g. 700
    bodyWeight: number         // e.g. 400
    scale: 'compact' | 'normal' | 'large'
  }
  shape: {
    radius: number             // card + control corner radius (px)
    avatarShape: 'circle' | 'rounded' | 'square'
    buttonStyle: 'solid' | 'outline' | 'soft' | 'ghost'
  }
  effects: {
    shadow: 'none' | 'sm' | 'md' | 'lg'
    blur: boolean              // glassmorphism surfaces
    border: boolean            // hairline on surfaces
  }
  layout: {
    align: 'center' | 'left'
    avatarPosition: 'top' | 'left'
    spacing: 'compact' | 'normal' | 'roomy'
  }
}
```

### User customization (layers over a theme)

The Style tab lets the user override a subset without forking the theme. Customization is a partial
that **merges onto** the active theme at render time:

```ts
interface CardCustomization {
  accent?: string
  fontFamily?: string
  radius?: number
  avatarShape?: CardTheme['shape']['avatarShape']
  align?: CardTheme['layout']['align']
  spacing?: CardTheme['layout']['spacing']
}

// render = applyCustomization(theme, customization)
```

### Catalog

```
themes/
  oss/        # ~6 base themes, bundled in every build (MIT)
  hosted/     # 30+ premium themes, gated behind tier === 'hosted'
  index.ts    # getThemes(tier): CardTheme[]
```

`getThemes('oss')` returns OSS only; the hosted deployment passes `'hosted'` to include both.
A locked theme renders in the gallery with a lock badge and is non-selectable on OSS.

---

## 5. Block Architecture

A card document:

```ts
interface CardDocument {
  slug: string
  themeId: string
  customization: CardCustomization
  blocks: CardBlock[]
  meta: { title: string; description?: string; ogImage?: string }
}

type CardBlock =
  | { id: string; type: 'header';  visible: boolean; data: { avatar?: string; name: string; title?: string; company?: string; tagline?: string } }
  | { id: string; type: 'bio';     visible: boolean; data: { text: string } }
  | { id: string; type: 'links';   visible: boolean; data: { items: { label: string; url: string; icon?: string }[] } }   // link-in-bio
  | { id: string; type: 'social';  visible: boolean; data: { items: { platform: string; url: string }[] } }
  | { id: string; type: 'contact'; visible: boolean; data: { phone?: string; email?: string; website?: string; address?: string; line?: string } }
  | { id: string; type: 'cta';     visible: boolean; data: { label: string; url: string; style: 'solid' | 'outline' } }
  | { id: string; type: 'gallery'; visible: boolean; data: { images: string[] } }
  | { id: string; type: 'map';     visible: boolean; data: { lat: number; lng: number; label?: string } }
  | { id: string; type: 'divider'; visible: boolean }
  | { id: string; type: 'spacer';  visible: boolean; data: { size: 'sm' | 'md' | 'lg' } }
```

- Blocks are reorderable (drag handle) and toggleable (`visible`).
- **vCard export** is a global action derived from `header` + `contact` + `social` (not a block).
  A "Save Contact" button can also surface inside the `contact` block.
- Use-case coverage: personal = header+bio+social; business = header+contact+map+cta;
  link-in-bio = header+links; vCard = header+contact + export. All composable in one card.

---

## 6. Component Inventory

### 6.1 Builder Chrome
- **AppShell** — topbar + 3-zone layout, theme toggle, save-state indicator.
- **LeftPanel** — tabbed: Content / Theme / Style / Settings.
  - *Content:* block list (drag reorder, add via "+", remove), inline block forms.
  - *Theme:* gallery grid, category filter, search, lock badges, selected state.
  - *Style:* accent color picker, font select, radius slider, avatar-shape segmented control,
    layout align/spacing controls, live contrast checker.
  - *Settings:* slug/URL, SEO/OG fields, QR options, visibility (draft/public).
- **Playground** — device frame toggle (phone / tablet / desktop / **custom size input**),
  zoom controls, background (dot-grid / solid / checker), floating toolbar (copy link / QR /
  export / fullscreen).
- **ShareDialog / QRDialog** — QR preview (size, margin, fg/bg color, center logo),
  download PNG + SVG, copy link, native share.
- **Form primitives** — Input, Textarea, UrlInput (validated), Select, Slider, Toggle,
  SegmentedControl, ColorPicker, IconPicker, AvatarUploader (crop), LinkListEditor.
- **Feedback** — Toast, ConfirmDialog, Tooltip, EmptyState, CommandPalette (cmd+K).

### 6.2 Card Renderer (themeable)
- HeaderBlock, BioBlock, LinksBlock, SocialBlock, ContactBlock, CtaBlock, GalleryBlock,
  MapBlock, Divider, Spacer. Every block reads theme + customization tokens.

---

## 7. Open-core Boundary

| | OSS (self-host) | Hosted (we host) |
|---|---|---|
| Builder, blocks, renderer | full | full |
| Themes | ~6 base (`tier: 'oss'`) | 30+ (`oss` + `hosted`) |
| QR / copy link / vCard export | full | full |
| Engine | identical | identical |

Single field (`tier`) gates the catalog. No forked code paths.

---

## 8. Build Roadmap (post-approval)

1. **Visual design system** — HTML preview component library under `ui_kits/digitalcard/`
   with `@dsCard` markers → push to claude.ai/design via `/design-sync` for visual review.
2. **Foundations in code** — `globals.css` tokens, Tailwind theme, `CardTheme`/`CardBlock` types,
   6 OSS themes.
3. **Renderer** — block components + theme engine (the shared core).
4. **Builder** — AppShell, panel tabs, playground, dialogs.
5. **Public card route** + QR + vCard + OG image.
6. **Hosted layer** — auth, persistence, hosted theme catalog, custom slugs.

---

## Open Decisions

- ~~Accent hue~~ — **LOCKED: indigo `#5B5BD6`** (dark mode `#7C7CF0`).
- Confirm the 6 OSS launch themes (categories to cover) before building the theme catalog.
