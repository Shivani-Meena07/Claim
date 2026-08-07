Claim — AI Cycle & Wellness App
A full product build: marketing landing page, auth flow, and a 9-screen in-app
dashboard, built with React + TypeScript + Vite + Tailwind CSS v4.
Design direction
Typography: Fraunces (display serif) paired with Inter (body/UI) — warm and editorial rather than a generic sans-only interface.
Palette: the base neutrals come from the provided design tokens (`--primary`, `--background`, etc). On top, a signature four-color cycle-phase system was added: bloom (berry-rose, menstrual), sprout (green, follicular), sun (gold, ovulation), dusk (violet, luteal) — used consistently across the calendar, charts, badges and phase indicators app-wide.
Signature element: the `CycleWheel` component (`src/components/ui/CycleWheel.tsx`) — a radial SVG dial showing the four cycle phases as proportional arcs with a day marker, used in the hero, auth screens and dashboard.
Pages built
Landing (`/`) — hero with the animated CycleWheel, features grid, animated Track → Understand → Personalize → Detect → Connect timeline, USP stats, testimonials, FAQ accordion, footer
Auth — `/login`, `/signup`, `/forgot-password`, `/verify-otp` (4-digit OTP with auto-advance)
Dashboard shell (`/app/*`) — collapsible sidebar, topbar with dark-mode toggle and notifications dropdown
Dashboard (`/app`) — stat cards, AI insight banner, quick actions, recent activity
Cycle Tracker (`/app/cycle`) — calendar with period/fertile/ovulation coloring, AI prediction card, flow/symptom/pain logging
Mood Tracker (`/app/mood`) — emoji selector, Recharts area chart, timeline
AI Wellness Coach (`/app/coach`) — filterable recommendation cards by category
AI Chatbot (`/app/chat`) — chat bubbles, typing-dots animation, suggested questions, medical disclaimer
Community (`/app/community`) — search, anonymous feed with likes/comments, trending sidebar
Doctor Connect (`/app/doctors`) — specialist cards, booking modal, emergency contact button
Mental Wellness (`/app/mental-wellness`) — animated breathing circle, sound/meditation cards with a playing-state visualizer, crisis support card
Monthly Report (`/app/report`) — line, bar, pie, area and bar charts + AI summary + red-flag detection + download button
Settings (`/app/settings`) — profile, notifications, privacy, theme, language, help tabs
All data in the app is mocked/static — there is no backend. Wire up real
data by replacing the constants at the top of each page in `src/pages/`.
Running locally
```bash
pnpm install   # or npm install
pnpm dev       # or npm run dev
```
Then open the printed local URL. Build for production with `pnpm build`.
Notes
Dark mode is toggled from the topbar and applies the `.dark` class tokens defined in `src/index.css`.
The `figma:asset/` Vite resolver from your original `vite.config.ts` is preserved, so figma-exported assets in `src/assets` will resolve correctly if you add any.