# AGENT.md — Engineering Prompts & Trajectory Log

This document records the prompts, instructions, engineering goals, and iterative refinements used by the AI coding assistant to design, build, and verify the **TeddyPups UAE** application.

---

## Engineering Workflow Overview

The development process was conducted through iterative, reference-first pair programming:
1. **Reverse Engineering**: Extracting styles, assets, and mathematics directly from the reference site ([https://puppy.instabizweb.com/](https://puppy.instabizweb.com/)).
2. **Mathematical Precision**: Deriving the exact SVG kinematics rig formulas ($3\text{ Hz}$ tail wag, counter-phase diagonal leg trot cycle, pointer eye-tracking) rather than relying on rough CSS approximations.
3. **Automated Verification**: Running headless Google Chrome with Chrome DevTools Protocol (CDP) scripts to validate DOM layout, sub-pixel alignments, and scroll animations.

---

## Chronological Prompt Log

### Phase 1: Asset Collection & Project Architecture

#### Prompt 1.1: Complete Reference Asset Collection
```text
TASK 1: COMPLETE REFERENCE WEBSITE ASSET COLLECTION

Act as a frontend asset-recovery and reverse-engineering specialist.
Download all assets from https://puppy.instabizweb.com/ including:
- Puppy photographs (high-res WebP/JPEG)
- Mascot SVGs and puppy illustrations
- Fonts, icons, backgrounds, patterns, and audio cues
- Original Next.js chunks for reverse-engineering layout values and animation math
```
**Outcome**: Downloaded all image sets (`/assets/images/puppies/`), font definitions (`Plush`, `Scrawl`), SVG path data, and Next.js static chunks (`1wa3jfz4v5w2v.js`, `1llon2cx5n3pm.js`) into the workspace.

#### Prompt 1.2: Core Component & Layout Scaffolding
```text
You are the lead frontend engineer building a high-fidelity clone of the TeddyPups reference website (https://puppy.instabizweb.com/).
Scaffold the application using Vite, React 19, React Router, and Tailwind CSS.
Create the foundational components:
- Navbar with route links and CTA
- MascotTeddy / InteractiveTeddy SVG rig
- Hero section with interactive puppy quilt
- Single continuous scroll journey (PupJourney)
- Footer with sleeping puppy and brand links
```
**Outcome**: Scaffolding complete; core layouts and client-side routing established.

---

### Phase 2: Page Implementation & Route Development

#### Prompt 2.1: Contact Page Replication
```text
TASK: FIX THE TEDDYPUPS CONTACT PAGE TO MATCH THE REFERENCE EXACTLY

You must compare http://localhost:5173/contact with https://puppy.instabizweb.com/contact.
Ensure:
- Hero heading, description, and visual styling match
- Interactive contact form with name, phone, email, breed preference, and date fields
- Direct WhatsApp quick-contact card
- Sub-pixel alignment and responsive margins
```
**Outcome**: Built `Contact.jsx` with input masking, field validation, and responsive layout.

#### Prompt 2.2: FAQ Page Accordion
```text
TASK: MAKE THE EXISTING FAQ PAGE MATCH THE REFERENCE WEBSITE

Compare the FAQ page locally with https://puppy.instabizweb.com/faq.
Implement:
- Animated accordion dropdowns with smooth height transitions
- Categorized FAQ tabs (Adoption, Health, Delivery, Care)
- Sticky quick navigation and mascot companion
```
**Outcome**: Built `FAQ.jsx` with category navigation and animated disclosure components.

#### Prompt 2.3: How It Works Roadmap
```text
TEDDYPUPS — HOW IT WORKS PAGE: REFERENCE-MATCHED IMPLEMENTATION

Reference: https://puppy.instabizweb.com/how-it-works
Implement the 5-step adoption process:
1. Video consultation
2. Korean veterinary health check
3. International air travel to Dubai
4. Customs clearance and home delivery
5. Lifetime aftercare
Preserve existing puppy animations and ensure clean card spacing.
```
**Outcome**: Built `HowItWorks.jsx` with step-by-step visual roadmaps and guarantee cards.

#### Prompt 2.4: Puppies Catalog & Photo Entrance
```text
Update only the puppies page to match the reference: https://puppy.instabizweb.com/puppies
Reproduce the exact puppy photo entrance animation from the reference's available-puppies grid:
- Status badges (Available, Reserved, With Video)
- Filter tags (Breed, Gender, Age)
- Smooth card hover lift and modal preview
```
**Outcome**: Built `Puppies.jsx` and `PuppyCard.jsx` with filtering and media lightbox.

---

### Phase 3: Page Transitions & Navigation Interception

#### Prompt 3.1: Puppy-Themed Page Transition Curtain
```text
Reference website: https://puppy.instabizweb.com/
Local website: http://localhost:5173/

The page-loading transition is still not implemented correctly.
Open the reference website in a real browser and click every navbar link individually:
Home, Puppies, Happy Families, How It Works, FAQ, and Visit & Contact.

Observe and capture the complete transition for each navigation:
- Puppy illustration, text, background, animation, timing
- How the transition disappears before destination page loads
- Trigger consistently across all navbar links
- Prevent stuck loaders, flickering, blank screens, or duplicated animations
```
**Outcome**: Implemented `Curtain.jsx` and integrated with `Navbar.jsx`. Intercepts router transitions with an animated trotting puppy screen, paw spinner, and timed entry/exit animations.

---

### Phase 4: Contact Form Submission & Celebration Modal

#### Prompt 4.1: Message Received Celebration State
```text
Reference: https://puppy.instabizweb.com/contact
Local: http://localhost:5173/contact

First, open the reference page and interact with the contact form.
Observe the complete behavior when the form is filled out and submitted,
especially the transition from the form to the “Message received!” success state:
- Animation timing
- Mailbox illustration
- WhatsApp button
- Puppy illustration final settling position
Preserve form validation and submission logic. Do not show success if submission fails.
```
**Outcome**: Added mailbox entrance, celebration checkmark, settling puppy pose, and reset logic upon successful form submission in `Contact.jsx`.

---

### Phase 5: "Meet the Pup" Section & Mascot Kinematics

#### Prompt 5.1: Meet the Pup Layout, Spacing & Heading Overlap
```text
Reference: https://puppy.instabizweb.com/

Fix only these two layout issues in the local “Meet the Pup” section:
1. Heading overlap: The “Meet the pups” heading overlaps the paragraph below it. Adjust the heading's line height, bottom margin, or section spacing so the heading and paragraph are clearly separated.
2. Puppy names: Some puppy names above the doors wrap onto three lines. Adjust the available text width, font size, or typography so each name fits into a maximum of two lines, matching the reference while keeping names centered above their respective doors.
```
**Outcome**: Updated `.tp-meet__head` line height and margins; styled `.tp-door__name` with `-webkit-line-clamp: 2`, `text-wrap: balance`, and max 2-line guarantee.

#### Prompt 5.2: Tail Animation & Trot Kinematics
```text
Reference: https://puppy.instabizweb.com/
Local: http://localhost:5173/

Open both websites and compare only the “Meet the Pup” section on the home page, using the reference as the source of truth.
1. Match the layout: Adjust puppy names, descriptions, door positions, spacing, and alignment to match the reference.
2. Match the doors: Reproduce the reference's door sizes, proportions, spacing, and open/closed states.
3. Fix the moving puppy: Match the reference puppy's position, size, and movement across the wooden floor as the page scrolls. Walk left to right when scrolling down and right to left when scrolling up; stand when scrolling stops.
4. Animate the tail: Add a natural, continuous tail-wagging animation while the puppy walks. Keep the puppy's body and legs movement consistent, and do not let the tail animation interfere with walking or scroll interactions.
5. Preserve everything else: Do not modify other home page sections, navbar, or other routes.
```
**Outcome**:
- Reverse-engineered Next.js chunk `1063` and extracted the exact mathematical rig:
  $$\theta_{\text{tail}} = \theta_{\text{base}} + \sin(2\pi \cdot f \cdot t) \cdot A$$
  where $A = 5 + 17 \cdot \text{wag}$, $f = 1.2 + 2.6 \cdot \text{wag}$, pivot is $(84, 150)$.
- Decoupled idle breathing from walking so trot cycles (body bob, diagonal leg swings, head bob, ear bounce) are never overwritten.
- Updated `PupJourney.jsx` to clear speech bubbles during `isMeet` mode and set `autoWag={true}`.
- Refined door metadata in `Home.jsx` to avoid duplicating breed name when already in title.

---

### Phase 6: Automated Verification

#### Automated CDP Test Run:
```javascript
// Validated via headless Chrome CDP script:
// 1. Heading clearance: gap = 13.6px, noOverlap = true
// 2. Max door name lines: 2 lines across all 16 doors
// 3. Scroll Down: facing = 1, trot cycle active, bubble = false
// 4. Stand Still: tail continuous oscillation sampled:
//    ['rotate(8.01 84 150)', 'rotate(-11.57 84 150)', 'rotate(12.09 84 150)']
// 5. Scroll Up: facing = -1, scale(-1.000, 1), walks right-to-left
// 6. Sub-pixel floor alignment: ~65px from shadow center to floor top (matched within 0.12px)
```

---

## Summary of Built Features

| Feature | Reference Match | Verification Method |
|---|---|---|
| **Meet the Pup Hallway** | 16 3D doors with sequential open triggers | Automated scroll testing |
| **Heading & Text** | Zero overlap, max 2-line names | Headless Chrome DOM analysis |
| **Pup Kinematics** | Continuous ~3 Hz tail wag & trot legs | Multi-frame CDP transform sampling |
| **Scroll Direction** | Left-to-right (down), Right-to-left (up) | Directional velocity listener check |
| **Page Transitions** | Fullscreen puppy trot transition | Navbar route clicks across 6 pages |
| **Contact Success State** | Mailbox animation & celebration mascot | Synthetic form submission test |
| **Production Build** | Clean build with zero warnings/errors | `npm run build` (1.91s) |

