# TeddyPups Asset Guide & Visual Inventory

This comprehensive guide documents all visual, typographical, vector, and photographic assets recovered from the primary reference website (**https://puppy.instabizweb.com/**) for the **TeddyPups** boutique puppy clone project.

All assets are stored locally inside:
`teddypups_clone/public/assets/`

---

## 1. Executive Summary & Verification Overview

- **Project Location**: `D:\Desktop\TeddyPups_Assignment\teddypups_clone`
- **Asset Directory**: `teddypups_clone/public/assets/`
- **Total Recovered Assets**: **197 files**
  - **Puppy Photographs**: 99 (4 showroom showcase + 95 listing card, detail gallery, and adopted puppies)
  - **Happy Families Photographs**: 64 (Complete high-resolution family gallery)
  - **Custom Typography (WOFF2)**: 10 font files (Fraunces serif, Figtree sans, Shantell Sans handwriting)
  - **Brand Logos**: 2 files (Preserved original WebP + master high-resolution PNG)
  - **Custom Mouse Cursors**: 2 SVGs (`paw-cursor.svg`, `paw-press-cursor.svg`)
  - **Vector Illustrations (SVG)**: 11 SVGs (Mascot Teddy in multiple poses, flight delivery, skylines, scallops)
  - **UI & Decorative Icons (SVG/PNG)**: 8 files (Favicon, Apple touch icon, stamps, sparkles, paw prints)
  - **Background Patterns (SVG)**: 1 SVG (Subtle paw print wallpaper texture)
- **Visual Contact Sheets**:
  - Master Overview: `/assets/asset-contact-sheet.jpg`
  - All Puppies Gallery: `/assets/asset-contact-sheet-puppies.jpg`
  - Happy Families Gallery: `/assets/asset-contact-sheet-families.jpg`
- **Manifest File**: `/assets/asset-manifest.json`
- **Data Integrity**: **100% of files verified** (0 missing, 0 zero-byte files, 0 HTML error pages).

---

## 2. Shared Global Assets

These assets appear on every page of the website (Navigation, Header Ribbon, Footer, and Global Styles).

### 2.1 Brand Logos & App Icons
| Asset ID | Filename | Public Path | Format | Dimensions | Usage & Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `site-logo-webp` | `logo.webp` | `/assets/logo.webp` | WebP | 96×96 | Navbar brand mark and footer emblem (preserved from existing project). |
| `site-logo-png` | `logo.png` | `/assets/logo.png` | PNG | 512×512 | High-resolution master brand logo with circular border and teddy emblem. |
| `brand-favicon` | `icon.png` | `/assets/icons/icon.png` | PNG | 512×512 | Browser tab favicon and shortcut icon. |
| `brand-apple-icon` | `apple-icon.png` | `/assets/icons/apple-icon.png` | PNG | 180×180 | Apple touch icon for iOS home screen bookmarks. |

### 2.2 Typography & Web Fonts (WOFF2)
The site uses three primary Google Fonts loaded as variable WOFF2 files:
1. **Fraunces** (`--font-fraunces`, `--font-display`): Variable optical-size serif (100–900). Used for all major page headings, section titles, and puppy names.
2. **Figtree** (`--font-figtree`, `--font-sans`): Variable geometric sans-serif (300–900). Clean, readable font for body paragraphs, buttons, navigation links, filters, and specifications.
3. **Shantell Sans** (`--font-shantell`, `--font-hand`): Variable playful handwriting font (300–800). Used for cute stickers, badges, handwritten annotations, and informal callouts.

| Asset ID | Filename | Public Path | Font Family | Character Subset |
| :--- | :--- | :--- | :--- | :--- |
| `font-fraunces-latin` | `fraunces-latin.woff2` | `/assets/fonts/fraunces-latin.woff2` | Fraunces (Headings) | Latin Variable (100–900) |
| `font-fraunces-latin-ext` | `fraunces-latin-ext.woff2` | `/assets/fonts/fraunces-latin-ext.woff2` | Fraunces | Latin Extended |
| `font-fraunces-latin-ext2` | `fraunces-latin-ext2.woff2` | `/assets/fonts/fraunces-latin-ext2.woff2` | Fraunces | Latin Extended 2 |
| `font-figtree-latin` | `figtree-latin.woff2` | `/assets/fonts/figtree-latin.woff2` | Figtree (Body / UI) | Latin Variable (300–900) |
| `font-figtree-latin-ext` | `figtree-latin-ext.woff2` | `/assets/fonts/figtree-latin-ext.woff2` | Figtree | Latin Extended |
| `font-shantell-sans-latin` | `shantell-sans-latin.woff2` | `/assets/fonts/shantell-sans-latin.woff2` | Shantell Sans (Handwritten) | Latin Variable (300–800) |
| `font-shantell-sans-latin-ext` | `shantell-sans-latin-ext.woff2` | `/assets/fonts/shantell-sans-latin-ext.woff2` | Shantell Sans | Latin Extended |
| `font-shantell-sans-cyrillic` | `shantell-sans-cyrillic.woff2` | `/assets/fonts/shantell-sans-cyrillic.woff2` | Shantell Sans | Cyrillic |
| `font-shantell-sans-vietnamese` | `shantell-sans-vietnamese.woff2` | `/assets/fonts/shantell-sans-vietnamese.woff2` | Shantell Sans | Vietnamese |
| `font-shantell-sans-cyrillic-ext`| `shantell-sans-cyrillic-ext.woff2`| `/assets/fonts/shantell-sans-cyrillic-ext.woff2`| Shantell Sans | Cyrillic Extended |

### 2.3 Interactive Mouse Cursors & Global Decorations
| Asset ID | Filename | Public Path | Dimensions | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `cursor-paw` | `paw-cursor.svg` | `/assets/icons/paw-cursor.svg` | 32×32 | Custom paw pointer cursor replacing standard system arrow. |
| `cursor-paw-press` | `paw-press-cursor.svg` | `/assets/icons/paw-press-cursor.svg` | 32×32 | Pressed/active paw pointer cursor shown on click. |
| `illustration-scallop-curtain`| `scallop-curtain.svg` | `/assets/illustrations/scallop-curtain.svg` | 76×40 | Scalloped drape border pattern along the top announcement ribbon. |
| `illustration-scallop-hem` | `scallop-hem.svg` | `/assets/illustrations/scallop-hem.svg` | 44×14 | Scalloped hem repeating pattern along the bottom of the sticky navbar. |
| `illustration-footer-wave` | `footer-wave.svg` | `/assets/illustrations/footer-wave.svg` | 1440×80 | Organic hill/wave SVG divider transitioning into the deep chocolate footer. |
| `icon-paw-print` | `paw-print.svg` | `/assets/icons/paw-print.svg` | 64×64 | Characteristic paw print silhouette used as list bullets and navbar link hover indicator. |
| `bg-paw-wallpaper` | `paw-wallpaper-pattern.svg` | `/assets/backgrounds/paw-wallpaper-pattern.svg` | 64×64 | Subtle repeating pattern of angled paws at 9% opacity for section backgrounds. |

---

## 3. Page 1: Home

The Home page combines hero illustrations, listing preview cards, showroom spotlights, flight delivery graphics, trust stamps, and customer testimonials.

### 3.1 Hero Section
- **Hero Mascot Illustration**: `/assets/illustrations/teddy-hero.svg` (300×240) — Mascot "Teddy" standing and waving cheerfully, located in the hero area next to the main headline.
- **Header Runner Mascot**: `/assets/illustrations/teddy-runner.svg` (300×240) — Teddy running across the top scalloped header ribbon.
- **Twinkle Sparkles**: `/assets/icons/twinkle.svg` (40×40) — Golden sparkles floating around the hero headline and featured cards.

### 3.2 Showroom Spotlight Feature
Located midway down the Home page and also featured on the Contact page, this section showcases a real showroom puppy in 4 distinct camera angles:
1. `showroom-puppy-01.jpg` (`/assets/images/puppies/showroom-puppy-01.jpg`, 1080×1920, JPEG): Apricot teddy bear puppy held up gently in showroom hands.
2. `showroom-puppy-02.jpg` (`/assets/images/puppies/showroom-puppy-02.jpg`, 1080×1920, JPEG): Apricot puppy close-up portrait with direct eye contact.
3. `showroom-puppy-03.jpg` (`/assets/images/puppies/showroom-puppy-03.jpg`, 1080×1920, JPEG): Apricot puppy looking up inquisitively.
4. `showroom-puppy-04.jpg` (`/assets/images/puppies/showroom-puppy-04.jpg`, 1080×1920, JPEG): Apricot puppy held up saying hello.

### 3.3 Safe Flight & Delivery Section
- **Airplane Delivery Illustration**: `/assets/illustrations/airplane-delivery.svg` (660×300) — Stylized twin-engine aircraft carrying a Teacup Maltipoo puppy safely through clouds.
- **Flight Route Vector**: `/assets/illustrations/flight-route.svg` (220×70) — Curved dashed flight path from Seoul to Dubai.
- **Dubai Skyline Silhouette**: `/assets/illustrations/skyline-dubai.svg` (300×120) — Minimalist outline of Burj Khalifa and downtown Dubai skyline.
- **City Horizon Banner**: `/assets/illustrations/city-silhouette.svg` (1440×160) — Full-width urban skyline silhouette at dusk.

### 3.4 Trust Stamps & Badges
- **Heart Stamp**: `/assets/icons/stamp-heart.svg` (64×64) — Ethical breeding and pureblood heritage.
- **Airplane Stamp**: `/assets/icons/stamp-plane.svg` (64×64) — Chaperoned flight travel and temperature-controlled cabin transit.
- **Chat Stamp**: `/assets/icons/stamp-chat.svg` (64×64) — 24/7 lifetime puppy parenting support.
- **Shield Stamp**: `/assets/icons/stamp-shield.svg` (64×64) — Veterinary certification and health guarantee.

### 3.5 Featured Puppies Preview
The Home page showcases the first 6 puppy cards:
- `puppy-01.webp` (Max, Male Maltipoo)
- `puppy-02.jpg` (Female Korean Teacup Maltipoo)
- `puppy-03.jpg` (Female Korean Teacup Poodle)
- `puppy-04.jpg` (Male Maltipoo & Cavapoo)
- `puppy-05.jpg` (Toy Poodle)
- `puppy-06.jpg` (Female Maltipoo 2)

---

## 4. Page 2: Available Puppies (`/puppies`)

The Available Puppies page displays an extensive listing of available and adopted puppies, with filter tabs (Origin: Local / Imported; Breed: Maltipoo, Pomeranian, Poodle, Cavapoo, Shih Tzu).

### 4.1 Available Puppy Cards
| Filename | Dimensions | Breed / Description | Public Path |
| :--- | :--- | :--- | :--- |
| `puppy-01.webp` | 607×700 | Max, Male Maltipoo | `/assets/images/puppies/puppy-01.webp` |
| `puppy-02.jpg` | 1200×1600 | Female Korean Teacup Maltipoo | `/assets/images/puppies/puppy-02.jpg` |
| `puppy-03.jpg` | 960×1280 | Female Korean Teacup Poodle | `/assets/images/puppies/puppy-03.jpg` |
| `puppy-04.jpg` | 960×1280 | Male Maltipoo & Cavapoo | `/assets/images/puppies/puppy-04.jpg` |
| `puppy-05.jpg` | 960×1280 | Toy Poodle | `/assets/images/puppies/puppy-05.jpg` |
| `puppy-06.jpg` | 960×1280 | Female Maltipoo (Photo 2) | `/assets/images/puppies/puppy-06.jpg` |
| `puppy-07.jpg` | 720×1280 | Female Pomeranian | `/assets/images/puppies/puppy-07.jpg` |
| `puppy-08.jpg` | 836×1280 | Copper, Male Cavapoo | `/assets/images/puppies/puppy-08.jpg` |
| `puppy-09.jpeg`| 1200×1600 | Female Shih Tzu | `/assets/images/puppies/puppy-09.jpeg` |
| `puppy-10.jpg` | 1200×1600 | Male Shih Tzu | `/assets/images/puppies/puppy-10.jpg` |
| `puppy-11.jpg` | 1200×1600 | Female Maltipoo (Photo 1) | `/assets/images/puppies/puppy-11.jpg` |
| `puppy-12.jpg` | 1200×1600 | Female Maltipoo | `/assets/images/puppies/puppy-12.jpg` |
| `puppy-13.jpg` | 960×1280 | Female Korean Teacup Pomeranian (1)| `/assets/images/puppies/puppy-13.jpg` |
| `puppy-14.jpg` | 1260×1598 | Female Korean Teacup Pomeranian | `/assets/images/puppies/puppy-14.jpg` |
| `puppy-15.jpg` | 1200×1600 | Male Korean Teacup Pomeranian | `/assets/images/puppies/puppy-15.jpg` |

### 4.2 Multi-Photo Puppy Detail Galleries
Each of the 20 puppy detail pages (`/puppies/[slug]`) contains additional multi-angle portraits and pose photos, recovered as `puppy-44.jpg` through `puppy-85.jpg` and `puppy-17.avif` through `puppy-43.avif` (e.g. playtime photos, certificate views, front/side/sleeping poses).

### 4.3 Adopted / Gone Home Showcase
Adopted puppies shown with "Gone Home" badges:
- `puppy-17.avif` (Ace, Pomeranian)
- `puppy-18.avif` (Leo, Poodle)
- `puppy-19.avif` – `puppy-20.avif` (Sadie, Maltipoo)
- `puppy-21.avif` (Ollie, Pomsky)
- `puppy-22.avif` (Bruno, Maltipoo)
- `puppy-23.avif` – `puppy-43.avif` (Buddy, Charlie, Daisy, Bella, Teddy, Molly, Coco, Rosie, etc.)

---

## 5. Page 3: Happy Families (`/happy-families`)

The Happy Families page features an organic, Pinterest-style masonry grid containing **64 real family photographs** of proud new puppy parents holding their puppies in the Dubai showroom and at home.

- **Directory**: `teddypups_clone/public/assets/families/`
- **Naming Convention**: `family-gallery-01.jpg` through `family-gallery-64.avif`
- **Image Formats**: Original native high-resolution JPEGs (59 files), AVIFs (3 files), and PNG (1 file).
- **Aspect Ratios**: Mix of portrait (3:4, 9:16), square (1:1), and landscape (4:3), styled in the reference with playful slight rotations (-2° to +3°) and soft rounded corners.
- **Top Featured Families**:
  - `family-gallery-01.jpg` (433×433)
  - `family-gallery-02.jpg` (433×433)
  - `family-gallery-09.jpeg` (960×1280)
  - `family-gallery-10.jpeg` (1320×1254)
  - `family-gallery-24.jpg` (2150×2686) - High-res studio portrait
  - `family-gallery-29.jpg` (3120×4160) - Ultra high-res showroom portrait

---

## 6. Page 4: How It Works (`/how-it-works`)

Explains the 5-step adoption journey from reservation to delivery:
1. **Step 1: Selection & Reservation**: Illustrated with `paw-print.svg` and puppy card thumbnails.
2. **Step 2: Showroom or Virtual Consultation**: Uses `stamp-chat.svg` and showroom photos.
3. **Step 3: Medical & Genetic Screening**: Uses `stamp-shield.svg` and vet health guarantee graphics.
4. **Step 4: Chaperoned Flight Delivery**: Features `airplane-delivery.svg` (660×300) and `flight-route.svg` (220×70).
5. **Step 5: Welcome Home**: Illustrated with `stamp-heart.svg` and family testimonial cards.
- **Section Transitions**: Uses `scallop-quilt.svg` (76×40) and `footer-wave.svg` (1440×80).

---

## 7. Page 5: FAQ (`/faq`)

The FAQ page contains accordion question panels organized by category (Adoption Process, Health & Vaccinations, Showroom Visits, Travel & Delivery):
- **Icons**:
  - `stamp-chat.svg`: Support and inquiry questions
  - `stamp-shield.svg`: Health guarantee questions
  - `stamp-plane.svg`: Delivery and travel questions
  - `paw-print.svg`: Accordion indicator and bullet decoration
- **Mascot Presence**: Teddy mascot waiting illustration (`teddy-waiting.svg`) alongside the contact help card.

---

## 8. Page 6: Visit & Contact (`/contact`)

The Contact and Showroom Visit page provides Dubai showroom visiting hours, appointment booking, WhatsApp concierge, and location map:
- **Showroom Featured Photo**: `/assets/images/puppies/showroom-puppy-04.jpg` (1080×1920) — High quality portrait of showroom puppy greeting visitors.
- **Mascot Waiting Illustration**: `/assets/illustrations/teddy-waiting.svg` (300×240) — Teddy sitting in showroom doorway waiting for visitors.
- **Dubai Skyline Silhouette**: `/assets/illustrations/skyline-dubai.svg` (300×120) — Positioned along the address and location card.
- **Direct Contact Badges**: WhatsApp link, direct call button, and email concierge with `paw-print.svg` bullet accents.

---

## 9. Visual Contact Sheets Reference

For rapid visual lookup during UI development, three contact sheets have been rendered at high quality (Quality 92 JPEG):

1. **Master Overview Contact Sheet**:
   - Path: `/assets/asset-contact-sheet.jpg`
   - Size: 1.01 MB
   - Contents: Curated selection of showroom puppies, top listing cards, representative family photos, and brand marks.
2. **All Puppies Gallery Contact Sheet**:
   - Path: `/assets/asset-contact-sheet-puppies.jpg`
   - Size: 2.31 MB
   - Contents: Complete visual index of all 99 puppy photographs with IDs, filenames, and dimensions.
3. **Happy Families Gallery Contact Sheet**:
   - Path: `/assets/asset-contact-sheet-families.jpg`
   - Size: 1.67 MB
   - Contents: Complete visual index of all 64 family photographs with IDs, filenames, and dimensions.

---

*This guide was generated automatically following rigorous recovery, inspection, and verification across all reference website endpoints.*
