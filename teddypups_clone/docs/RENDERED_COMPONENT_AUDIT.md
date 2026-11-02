# TeddyPups Rendered Component Audit

This audit documents the runtime component tree for every route in the TeddyPups application, tracing from entry point to rendered DOM, and cataloging all imported components, CSS stylesheets, and asset dependencies.

---

## 1. Application Runtime Architecture

### Entry Point & Mounting
1. **HTML Shell**: [`index.html`](file:///D:/Desktop/TeddyPups_Assignment/teddypups_clone/index.html)
   - Entry point: `<script type="module" src="/src/main.jsx"></script>`
   - Mounting container: `<div id="root"></div>`
2. **React Entry**: [`src/main.jsx`](file:///D:/Desktop/TeddyPups_Assignment/teddypups_clone/src/main.jsx)
   - Loads stylesheet: `import './index.css'`
   - Mounts: `<StrictMode><App /></StrictMode>` to `document.getElementById('root')`
3. **Application Root**: [`src/App.jsx`](file:///D:/Desktop/TeddyPups_Assignment/teddypups_clone/src/App.jsx)
   - Router: `<BrowserRouter>`
   - Utility: `<ScrollToTop />` (scrolls viewport to top upon pathname change)
   - Global Shell:
     - Header: `<Navbar />` (rendered universally across all routes)
     - Content Host: `<main id="main-content">` wrapping `<Routes>`
     - Footer: `<Footer />` (rendered universally across all routes)

---

## 2. Route-by-Route Component Tree

### Route 1: Home (`/`)
- **Route Definition**: `<Route path="/" element={<Home />} />`
- **Page Component**: [`src/pages/Home.jsx`](file:///D:/Desktop/TeddyPups_Assignment/teddypups_clone/src/pages/Home.jsx)
- **Rendered Component Hierarchy**:
  ```
  <App>
    ├── <Navbar /> (src/components/Navbar.jsx)
    ├── <main id="main-content">
    │     └── <Home> (src/pages/Home.jsx)
    │           ├── <section className="tp-scene tp-hero">
    │           │     ├── <span className="tp-hero__sun">
    │           │     ├── <div className="tp-hero__copy"> (Kicker, H1, Lede, CTA Buttons)
    │           │     └── <div className="tp-hero__stage">
    │           │           ├── <ul className="tp-lineup"> (6 puppy peep-hole seats)
    │           │           ├── <div className="tp-hero__teddy"> (Mascot peeking over quilt)
    │           │           └── <div className="tp-quilt"> (Scalloped border + diamond quilt background)
    │           ├── <section className="tp-scene tp-meet"> (Meet the pups)
    │           │     └── 6x <PuppyCard /> (src/components/PuppyCard.jsx)
    │           ├── <section className="tp-paths"> (Two ways to meet your puppy)
    │           ├── <section className="tp-scene tp-chat"> (Your puppy journey, 3 steps)
    │           ├── <section className="tp-paper"> (Why families trust TeddyPups, 4 passport points)
    │           ├── <section className="tp-dusk"> (Happy families wall preview, 4 polaroids)
    │           ├── <section className="tp-scene tp-faqroom"> (Questions, answered corkboard, 3 notes)
    │           └── <section className="tp-home"> (Bottom CTA board with mascot)
    └── <Footer /> (src/components/Footer.jsx)
  ```
- **Data Dependencies**: `puppies.js` (first 6 available), `families.js` (first 4 moments), `faqs.js` (first 3 preview questions).

---

### Route 2: Available Puppies (`/puppies`)
- **Route Definition**: `<Route path="/puppies" element={<Puppies />} />`
- **Page Component**: [`src/pages/Puppies.jsx`](file:///D:/Desktop/TeddyPups_Assignment/teddypups_clone/src/pages/Puppies.jsx)
- **Rendered Component Hierarchy**:
  ```
  <App>
    ├── <Navbar />
    ├── <main id="main-content">
    │     └── <Puppies> (src/pages/Puppies.jsx)
    │           ├── Header with framed self-portrait (<div className="tp-frame">)
    │           ├── Filter Panel (<div className="tp-filter-panel">)
    │           │     ├── Location row (.tp-filter-row: all / dubai / order)
    │           │     ├── Breed row (.tp-filter-row: all / maltipoo / cavapoo / etc.)
    │           │     └── Gender row (.tp-filter-row: both / boy / girl)
    │           ├── Status counter (.tp-filter-count)
    │           └── Puppies Grid (repeating <PuppyCard /> components)
    └── <Footer />
  ```
- **Data Dependencies**: `src/data/puppies.js` (all available puppy profiles).

---

### Route 3: Puppy Detail (`/puppies/:slug`)
- **Route Definition**: `<Route path="/puppies/:slug" element={<PuppyDetail />} />`
- **Page Component**: [`src/pages/PuppyDetail.jsx`](file:///D:/Desktop/TeddyPups_Assignment/teddypups_clone/src/pages/PuppyDetail.jsx)
- **Rendered Component Hierarchy**:
  ```
  <App>
    ├── <Navbar />
    ├── <main id="main-content">
    │     └── <PuppyDetail> (src/pages/PuppyDetail.jsx)
    │           ├── Breadcrumbs Navigation
    │           ├── Gallery Strip (main photo + thumbnail selector)
    │           ├── Puppy Specs (breed, sex, age, color, expected weight, health status)
    │           ├── Direct WhatsApp Action (<Button variant="whatsapp">)
    │           └── <SectionDivider /> + Related Puppies Grid (<PuppyCard />)
    └── <Footer />
  ```
- **Data Dependencies**: `src/data/puppies.js` (resolved by slug/id match).

---

### Route 4: Happy Families (`/happy-families`)
- **Route Definition**: `<Route path="/happy-families" element={<HappyFamilies />} />`
- **Page Component**: [`src/pages/HappyFamilies.jsx`](file:///D:/Desktop/TeddyPups_Assignment/teddypups_clone/src/pages/HappyFamilies.jsx)
- **Rendered Component Hierarchy**:
  ```
  <App>
    ├── <Navbar />
    ├── <main id="main-content">
    │     └── <HappyFamilies> (src/pages/HappyFamilies.jsx)
    │           ├── 2-column header with Sarah M. testimonial on lined sticky note
    │           ├── 4-column polaroid gallery (.tp-polaroid with pastel washi tapes)
    │           └── Lightbox modal for enlarged photograph inspection
    └── <Footer />
  ```
- **Data Dependencies**: `src/data/families.js` (64 family gallery photographs).

---

### Route 5: How It Works (`/how-it-works`)
- **Route Definition**: `<Route path="/how-it-works" element={<HowItWorks />} />`
- **Page Component**: [`src/pages/HowItWorks.jsx`](file:///D:/Desktop/TeddyPups_Assignment/teddypups_clone/src/pages/HowItWorks.jsx)
- **Rendered Component Hierarchy**:
  ```
  <App>
    ├── <Navbar />
    ├── <main id="main-content">
    │     └── <HowItWorks> (src/pages/HowItWorks.jsx)
    │           ├── 4 jump-navigation chips
    │           ├── Interactive 2-way toggle switch (In Dubai vs Imported)
    │           ├── Mascot speech bubble & Dubai skyline postcard (.tp-postcard)
    │           └── 4 numbered step cards explaining the adoption journey
    └── <Footer />
  ```

---

### Route 6: FAQ (`/faq`)
- **Route Definition**: `<Route path="/faq" element={<FAQ />} />`
- **Page Component**: [`src/pages/FAQ.jsx`](file:///D:/Desktop/TeddyPups_Assignment/teddypups_clone/src/pages/FAQ.jsx)
- **Rendered Component Hierarchy**:
  ```
  <App>
    ├── <Navbar />
    ├── <main id="main-content">
    │     └── <FAQ> (src/pages/FAQ.jsx)
    │           ├── Chocolate tone container (.tp-scene[data-tone="dark"])
    │           ├── Pill search input with instant filtering
    │           ├── Mascot companion with dynamic ? / ! speech bubble
    │           └── Corkboard frame (.tp-notes__board) with 9 pinned paper notes
    └── <Footer />
  ```
- **Data Dependencies**: `src/data/faqs.js`.

---

### Route 7: Visit & Contact (`/contact`)
- **Route Definition**: `<Route path="/contact" element={<Contact />} />`
- **Page Component**: [`src/pages/Contact.jsx`](file:///D:/Desktop/TeddyPups_Assignment/teddypups_clone/src/pages/Contact.jsx)
- **Rendered Component Hierarchy**:
  ```
  <App>
    ├── <Navbar />
    ├── <main id="main-content">
    │     └── <Contact> (src/pages/Contact.jsx)
    │           ├── Left Column: Direct WhatsApp, phone, email, boutique postcard
    │           └── Right Column: "Dear TeddyPups," fill-in-the-blank letter on lined paper with paw stamp
    └── <Footer />
  ```

---

### Route 8: Gone Home (`/gone-home`)
- **Route Definition**: `<Route path="/gone-home" element={<GoneHome />} />`
- **Page Component**: [`src/pages/GoneHome.jsx`](file:///D:/Desktop/TeddyPups_Assignment/teddypups_clone/src/pages/GoneHome.jsx)
- **Rendered Component Hierarchy**:
  ```
  <App>
    ├── <Navbar />
    ├── <main id="main-content">
    │     └── <GoneHome> (src/pages/GoneHome.jsx)
    │           ├── Ticket booth awning header with MascotTeddy
    │           └── 27 vintage boarding pass admission tickets (.tp-ticket)
    └── <Footer />
  ```
- **Data Dependencies**: `src/data/goneTickets.js` (27 adopted puppy tickets).

---

## 3. Component & Style Duplication Inventory

| Item | Location | Status | Action Taken / Needed |
| :--- | :--- | :--- | :--- |
| **`variables.css` Import** | `index.css` & `global.css` | Duplicate import | Remove `@import './variables.css'` inside `global.css` to prevent redundant CSS parsing |
| **Body Wallpaper** | `src/styles/global.css:44` | Conflicting background | Remove repeating `paw-wallpaper-pattern.svg` on body so cream background is clean and flush with header |
| **`.tp-page` Padding-Top** | `theme-components.css:1208` | Redundant 96px gap | Remove 96px padding-top since header is positioned in-flow, eliminating the gap |
| **Hero Mascot Peeking** | `src/pages/Home.jsx:187` | Incorrect illustration | Replace side-runner `MascotTeddy` with authentic `teddy-hero.svg` peeking over quilt |
| **Hero Peep-Hole Photos** | `src/pages/Home.jsx:26-66` | Broken `.avif` extensions | Update extensions from `.avif` to `.jpg`, preventing 404s and fallback to puppy-01 |
| **`Button.jsx` / `SectionDivider.jsx`** | `src/components/` | Used only in `PuppyDetail.jsx` | Kept intact; valid scoped usage |

