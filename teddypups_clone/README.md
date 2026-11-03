# TeddyPups UAE — High-Fidelity Web Application

A pixel-accurate, interactive recreation of the [TeddyPups UAE Reference Website](https://puppy.instabizweb.com/). This project showcases luxury Korean Teacup and Teddy Bear puppies in Dubai, featuring custom SVG mascot physics, scroll-driven page animations, interactive 3D door mechanics, and page transitions.

---

## Tech Stack & Core Technologies

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/) (with custom page transition curtains)
- **Styling**: Modern CSS3 (CSS Variables, Flexbox/Grid, 3D Transforms, `text-wrap: balance`, `-webkit-line-clamp`) + [Tailwind CSS](https://tailwindcss.com/)
- **Kinematics & Animation Engine**:
  - Custom SVG Puppetry (`InteractiveTeddy.jsx`) with pointer eye-tracking, autonomous blinking, independent continuous sinusoidal tail wagging, and trot cycle kinematics.
  - Continuous Single Mascot Journey (`PupJourney.jsx`) synchronizing multi-scene pinned scrolls and horizontal treadmill walking across viewports.
- **Testing & Verification**: Headless Google Chrome with Chrome DevTools Protocol (CDP) for automated DOM measurement, sub-pixel alignment, and scroll animation testing.

---

##  Project Architecture & Directory Structure

```text
TeddyPups_Assignment/
├── README.md                 # Primary documentation
├── AGENT.md                  # Comprehensive AI prompt log & build trajectory
└── teddypups_clone/
    ├── package.json          # Dependencies & npm scripts
    ├── vite.config.js        # Vite configuration
    ├── index.html            # Main HTML entry with font preloads
    ├── public/
    │   ├── assets/           # Real puppy photography, textures, icons
    │   └── favicon.ico
    └── src/
        ├── main.jsx          # React DOM entry point
        ├── App.jsx           # App wrapper, routing table & global overlays
        ├── components/
        │   ├── InteractiveTeddy.jsx # Mathematical SVG dog rig (tail wag, eyes, trot)
        │   ├── PupJourney.jsx       # Multi-section scroll journey orchestrator
        │   ├── Curtain.jsx          # Puppy trot page transition loader
        │   ├── Navbar.jsx           # Responsive header with route interception
        │   ├── Footer.jsx           # Global footer with sleeping mascot
        │   ├── PuppyCard.jsx        # Available puppy card with modal view
        │   ├── PawCursorTrail.jsx   # Custom animated paw cursor trail
        │   └── Button.jsx           # Reusable styled button components
        ├── pages/
        │   ├── Home.jsx             # Landing page with interactive scenes
        │   ├── Puppies.jsx          # Puppy catalog with filters & tags
        │   ├── PuppyDetail.jsx      # Individual puppy showcase page
        │   ├── HappyFamilies.jsx    # Real customer adoptions & testimonials
        │   ├── HowItWorks.jsx       # Adoption roadmap & delivery guide
        │   ├── FAQ.jsx              # Interactive animated accordion
        │   ├── Contact.jsx          # Inquiry form & celebration state
        │   └── GoneHome.jsx         # Adopted puppies archive gallery
        └── styles/
            ├── index.css            # Base Tailwind reset & design tokens
            └── theme-components.css # Complete reference styles & 3D transforms
```

---

##  Page-by-Page Feature Breakdown

### 1. Home Page (`/` — `src/pages/Home.jsx`)
- **Hero Quilt & Interactive Lineup**: Handwritten tag seats where puppy heads pop up, tilt, track the mouse cursor, and bark/greet on click with sound-less cartoon speech bubbles.
- **Mascot Scroll Journey**: A single persistent puppy mascot leaps down the page across scenes.
- **“Meet the Pup” Horizontal Treadmill Hallway**:
  - Pinned horizontal scroll section tracking 16 individual 3D wooden doors.
  - Proportional door frames with peepholes, brass knobs, and open/closed states that unlock sequentially as the mascot walks past.
  - Puppy names restricted to a maximum of 2 lines with balanced typography.
  - Clean vertical separation preventing any heading/paragraph overlaps.
  - Mascot trots left-to-right when scrolling down, turns and trots right-to-left when scrolling up, and stands calmly when scrolling pauses.
  - Independent continuous tail wagging running at ~3 Hz around the $(84, 150)$ joint pivot.
- **Two Ways to Meet**: Interactive cards highlighting home visits and video calls.
- **Happy Families Preview & FAQs**: Curated snippets leading to full subpages.

### 2. Available Puppies (`/puppies` — `src/pages/Puppies.jsx`)
- Dynamic grid displaying real photos of Korean Teacup Pomeranians, Maltipoos, Toy Poodles, and Shih Tzus.
- Status badges (`Available`, `Reserved`, `With Video`).
- Age, gender, and breed metadata.
- Instant photo previews and WhatsApp inquiry integration.

### 3. Puppy Profile Detail (`/puppies/:slug` — `src/pages/PuppyDetail.jsx`)
- Individual puppy showcase with high-resolution imagery.
- Detailed specifications: Microchip status, Korean veterinary health certification, vaccination records, passport info, and expected adult weight.
- Direct WhatsApp booking button pre-filled with the puppy's name and ID.

### 4. Happy Families (`/happy-families` — `src/pages/HappyFamilies.jsx`)
- Social proof wall showcasing real adopted puppies with their owners across Dubai, Abu Dhabi, and the UAE.
- Verified reviews, testimonials, adoption dates, and puppy nicknames.

### 5. How It Works (`/how-it-works` — `src/pages/HowItWorks.jsx`)
- 5-step transparent adoption process:
  1. Puppy Selection & Live Video Calling
  2. Health Screening & Korean Vet Certification
  3. Safe International Air Travel to Dubai (DXB)
  4. Customs Clearance & Direct Home Handover
  5. Lifetime 24/7 Aftercare & Guidance
- Visual flowcharts, guarantees, and preparation checklists.

### 6. FAQ (`/faq` — `src/pages/FAQ.jsx`)
- Interactive accordion organized into categories (Adoption, Health & Guarantees, Travel & Delivery, Training).
- Smooth expansion animations and quick links to contact support.

### 7. Visit & Contact (`/contact` — `src/pages/Contact.jsx`)
- Comprehensive appointment booking and inquiry form.
- Real-time client-side field validation (Name, Phone, Preferred Breed, Visit Date).
- Direct WhatsApp quick-contact card.
- **Celebration Success State**: Upon valid submission, the form smoothly animates into the **“Message received!”** panel featuring the animated mailbox illustration and settling mascot puppy.

### 8. Gone Home Archive (`/gone-home` — `src/pages/GoneHome.jsx`)
- Gallery of previously adopted puppies now happily living in their forever homes.

---

##  Key Technical Challenges & Custom Implementations

### 1. Mascot Kinematics Rig (`InteractiveTeddy.jsx`)
- **Trot Kinematics Equation**:
  Diagonal leg pairs swing in counter-phase using sinusoidal functions modulated by stride velocity:
  $$\text{rot}_{\text{BF}} = \sin(\phi) \cdot (20 + 10 \cdot \text{stride})$$
  $$\text{rot}_{\text{FF}} = \sin(\phi + \pi) \cdot (20 + 10 \cdot \text{stride})$$
- **Autonomous Tail Wagging**:
  The tail wags continuously regardless of walking or standing, oscillating around pivot $(84, 150)$ at $f = 1.2 + 2.6 \cdot \text{wag}$ ($\approx 3\text{ Hz}$) with amplitude $A = 5 + 17 \cdot \text{wag}$ ($\approx 16.9^\circ$).
- **Decoupled Breathing**: Idle breathing motion is isolated to non-walking states to prevent clobbering trot kinematics during scroll updates.

### 2. Puppy Curtain Page Transition (`Curtain.jsx`)
- Custom navigation handler intercepting route changes across all navbar links.
- Displays a warm puppy-themed transition screen with an animated walking puppy, rotating paw badge, and smooth fade-in/fade-out before revealing the destination page.
- Prevents stuck states, blank screens, and duplicate transitions.

---

##  How to Run & Build

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- `npm` or `pnpm`

### Installation & Setup
```bash
# 1. Navigate to the project directory
cd teddypups_clone

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Open your browser at [http://127.0.0.1:5173/](http://127.0.0.1:5173/).

### Production Build & Preview
```bash
# Build optimized production bundle into /dist
npm run build

# Preview production build locally
npm run preview
```
Production build compiles in ~1.9s with zero errors.

---

##  Automated Testing
Verified via custom headless Chrome CDP automation scripts located in `teddypups_clone/scratch/`:
- `test_meet_section.mjs`: Tests scroll directions, tail wagging, door openings, and heading clearance.
- `measure_paws_floor.mjs`: Tests sub-pixel mascot paw positioning on the wooden floor against reference.
- `test_local_contact_submission.mjs`: Tests contact form validation and success mailbox animation.
