
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Brain,
  HeartPulse,
  Users2,
  Star,
  Activity,
  Eye,
  UserCog,
  Radar,
  Link2,
} from 'lucide-react'
import { CycleWheel } from '../components/ui/CycleWheel'
import { Accordion } from '../components/ui/Accordion'

const FEATURES = [
  {
    icon: Activity,
    title: 'Cycle intelligence',
    desc: 'Log flow, symptoms and mood in seconds — Claim learns your rhythm and predicts what comes next.',
    tone: 'bloom',
  },
  {
    icon: Brain,
    title: 'AI wellness coach',
    desc: 'Nutrition, movement and rest recommendations that shift with your phase, not a generic calendar.',
    tone: 'sprout',
  },
  {
    icon: HeartPulse,
    title: 'Mental wellness tools',
    desc: 'Guided breathing, sleep sounds and grounding exercises tuned to hormonal mood shifts.',
    tone: 'dusk',
  },
  {
    icon: Users2,
    title: 'A community that gets it',
    desc: 'Ask questions anonymously and hear from people further along the same path.',
    tone: 'sun',
  },
  {
    icon: ShieldCheck,
    title: 'Doctor connect',
    desc: 'Book real specialists when something needs more than an algorithm.',
    tone: 'bloom',
  },
  {
    icon: Sparkles,
    title: 'Monthly reports',
    desc: 'A plain-language summary of your month, with red flags surfaced early — not buried in charts.',
    tone: 'sprout',
  },
]

const TIMELINE = [
  { icon: Activity, label: 'Track', desc: 'Log your cycle, symptoms, sleep and mood in under a minute a day.' },
  { icon: Eye, label: 'Understand', desc: 'See patterns across months, not just this one — Claim connects the dots.' },
  { icon: UserCog, label: 'Personalize', desc: 'Get a wellness plan that adapts to your current phase automatically.' },
  { icon: Radar, label: 'Detect', desc: 'Catch irregularities early with AI that flags what deserves attention.' },
  { icon: Link2, label: 'Connect', desc: 'Bring a doctor in when you need one — with your full history, ready to share.' },
]

const TESTIMONIALS = [
  {
    name: 'Ananya, 27',
    quote: 'The prediction accuracy is genuinely uncanny — it caught my irregular cycle before I noticed the pattern myself.',
  },
  {
    name: 'Priya, 34',
    quote: 'The wellness coach actually changes with my phase instead of giving me the same tips every day.',
  },
  {
    name: 'Fatima, 22',
    quote: 'I found community answers to questions I was too embarrassed to ask anyone in real life.',
  },
]

const FAQS = [
  {
    q: 'Is my health data private?',
    a: 'Yes. Your logs are encrypted end-to-end and never sold or shared. You can export or permanently delete your data at any time from Settings.',
  },
  {
    q: 'How accurate are the AI predictions?',
    a: 'Predictions improve the more you log. Most users see period and fertile-window predictions stabilize within two to three cycles.',
  },
  {
    q: 'Can Claim replace my doctor?',
    a: "No — Claim is a wellness companion, not a medical provider. The AI chatbot and reports are designed to help you have better conversations with a doctor, and Doctor Connect makes booking one easy when you need it.",
  },
  {
    q: 'Is Claim free to use?',
    a: 'Core tracking, insights and the community are free. Doctor Connect bookings are paid per consultation, priced by the specialist.',
  },
]

export default function Landing() {
  return (
    <div className="bg-background text-foreground">
      <Header />
      <Hero />
      <Timeline />
      <Features />
      <USP />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <span className="font-display text-xl">Claim</span>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how-it-works" className="hover:text-foreground">How it works</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden sm:inline text-sm font-medium hover:text-bloom">
            Log in
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 bg-bloom text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-bloom/90 transition-colors"
          >
            Get started <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-5 pt-14 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-bloom bg-bloom-soft px-3 py-1.5 rounded-full">
          <Sparkles size={13} /> AI-powered cycle intelligence
        </span>
        <h1 className="font-display text-4xl md:text-6xl leading-[1.05] mt-5">
          Your body keeps a rhythm.
          <br />
          <span className="italic text-bloom">Claim learns it.</span>
        </h1>
        <p className="text-muted-foreground text-lg mt-6 max-w-md leading-relaxed">
          Track your cycle, mood and symptoms — and let AI turn a month of small entries into
          insight you can actually act on, in your language, on your terms.
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-8">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-bloom text-white font-medium px-6 py-3.5 rounded-xl hover:bg-bloom/90 transition-colors"
          >
            Start tracking free <ArrowRight size={17} />
          </Link>
          <a href="#how-it-works" className="text-sm font-medium text-foreground hover:text-bloom">
            See how it works
          </a>
        </div>
        <p className="text-xs text-muted-foreground mt-6">
          Trusted by 240,000+ women · No medical account required to start
        </p>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-bloom-soft via-sun-soft to-dusk-soft rounded-full blur-3xl opacity-60 scale-90" aria-hidden />
        <div className="relative bg-card border border-border rounded-3xl p-10 shadow-xl shadow-bloom/5">
          <CycleWheel size={280} currentDay={16} />
          <div className="mt-6 flex justify-center gap-4 text-xs">
            {[
              { label: 'Menstrual', color: 'var(--bloom)' },
              { label: 'Follicular', color: 'var(--sprout)' },
              { label: 'Ovulation', color: 'var(--sun)' },
              { label: 'Luteal', color: 'var(--dusk)' },
            ].map((p) => (
              <span key={p.label} className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Timeline() {
  return (
    <section id="how-it-works" className="border-y border-border bg-muted/40">
      <div className="max-w-6xl mx-auto px-5 py-20">
        <div className="max-w-xl mb-14">
          <span className="text-xs font-medium text-bloom uppercase tracking-wider">How it works</span>
          <h2 className="font-display text-3xl md:text-4xl mt-3">Five small steps, one clear picture.</h2>
        </div>
        <div className="relative grid md:grid-cols-5 gap-8 md:gap-4">
          <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-px bg-border" aria-hidden />
          {TIMELINE.map((step, i) => (
            <div key={step.label} className="relative flex flex-col items-start md:items-center md:text-center gap-3">
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center bg-card border border-border relative z-10 transition-transform hover:scale-105"
                style={{ animation: `float-slow 5s ease-in-out ${i * 0.4}s infinite` }}
              >
                <step.icon size={22} className="text-bloom" />
              </div>
              <h3 className="font-display text-lg">{step.label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-5 py-20">
      <div className="max-w-xl mb-12">
        <span className="text-xs font-medium text-bloom uppercase tracking-wider">Everything in one place</span>
        <h2 className="font-display text-3xl md:text-4xl mt-3">Built for the whole cycle, not just the calendar.</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f) => (
          <div key={f.title} className="p-6 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow">
            <div
              className="h-11 w-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `var(--${f.tone}-soft)`, color: `var(--${f.tone})` }}
            >
              <f.icon size={20} />
            </div>
            <h3 className="font-display text-lg mb-1.5">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function USP() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto px-5 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs font-medium text-sun uppercase tracking-wider">Why Claim</span>
          <h2 className="font-display text-3xl md:text-4xl mt-3 leading-tight">
            Not another calendar app. A pattern-recognition partner.
          </h2>
          <p className="text-white/70 mt-5 leading-relaxed max-w-md">
            Most cycle apps stop at logging. Claim's AI cross-references your symptoms, sleep,
            mood and cycle history to surface things worth noticing — and explains them in plain
            language, not clinical jargon.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { stat: '92%', label: 'prediction accuracy after 3 cycles' },
            { stat: '4.8★', label: 'average rating, 38k+ reviews' },
            { stat: '<60s', label: 'average daily logging time' },
            { stat: '150+', label: 'verified specialists on-call' },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="font-display text-3xl text-sun">{s.stat}</div>
              <div className="text-sm text-white/60 mt-1.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="max-w-6xl mx-auto px-5 py-20">
      <div className="max-w-xl mb-12">
        <span className="text-xs font-medium text-bloom uppercase tracking-wider">In their words</span>
        <h2 className="font-display text-3xl md:text-4xl mt-3">People who finally feel understood.</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="p-6 rounded-2xl border border-border bg-card">
            <div className="flex gap-0.5 text-sun mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="text-foreground leading-relaxed mb-5">"{t.quote}"</p>
            <p className="text-sm text-muted-foreground font-medium">{t.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function FAQ() {
  return (
    <section id="faq" className="max-w-3xl mx-auto px-5 py-20">
      <div className="mb-10">
        <span className="text-xs font-medium text-bloom uppercase tracking-wider">Questions</span>
        <h2 className="font-display text-3xl md:text-4xl mt-3">Frequently asked.</h2>
      </div>
      <Accordion items={FAQS} />
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-5 py-12 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <span className="font-display text-xl">Claim</span>
          <p className="text-sm text-muted-foreground mt-3 max-w-[200px]">
            AI-powered cycle and wellness tracking, built around you.
          </p>
        </div>
        {[
          { title: 'Product', links: ['Features', 'How it works', 'Pricing'] },
          { title: 'Company', links: ['About', 'Careers', 'Press'] },
          { title: 'Support', links: ['Help center', 'Privacy', 'Terms'] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-medium mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Claim. Not a substitute for professional medical advice.
      </div>
    </footer>
  )
}
