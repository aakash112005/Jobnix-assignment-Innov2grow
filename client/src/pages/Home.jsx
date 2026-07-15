import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// import {
//   HiOutlineSearch,
//   HiOutlineLightningBolt,
//   HiOutlineShieldCheck,
//   HiOutlineSparkles,
//   HiOutlineCode,
//   HiOutlineChartBar,
//   HiOutlineMegaphone,
//   HiOutlineCurrencyDollar,
//   HiOutlinePaintBrush,
//   HiOutlineChevronDown,
// } from "react-icons/hi";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineBolt,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineCommandLine,
  HiOutlinePresentationChartBar,
  HiOutlineSpeakerWave,
  HiOutlineCurrencyDollar,
  HiOutlineSwatch,
  HiOutlineChevronDown,
} from "react-icons/hi2";
import toast from 'react-hot-toast';
import PipelineTrack from '../components/PipelineTrack';
import JobCard from '../components/JobCard';
import { JobCardSkeleton } from '../components/Loader';
import { jobService } from '../services/jobService';

const trustedCompanies = ['NovaTech', 'Brightline', 'Fenwick & Co', 'OrbitAI', 'Lumen Labs', 'Cascade'];

const steps = [
  { title: 'Create your profile', desc: 'Add your skills, experience, and resume in minutes.' },
  { title: 'Find matching roles', desc: 'Search and filter thousands of live and AI-sourced openings.' },
  { title: 'Apply with one click', desc: 'Submit tailored applications and track every stage.' },
  { title: 'Get hired', desc: 'Move through the pipeline with real-time status updates.' },
];

// const reasons = [
//   { icon: HiOutlineLightningBolt, title: 'Fast applications', desc: 'Apply to roles in seconds with a saved profile and resume.' },
//   { icon: HiOutlineShieldCheck, title: 'Verified employers', desc: 'Every company profile is reviewed before jobs go live.' },
//   { icon: HiOutlineSparkles, title: 'AI resume matching', desc: 'See your match score against every role before you apply.' },
// ];
const reasons = [
  {
    icon: HiOutlineBolt,
    title: "Fast applications",
    desc: "Apply to roles in seconds with a saved profile and resume.",
  },
  {
    icon: HiOutlineShieldCheck,
    title: "Verified employers",
    desc: "Every company profile is reviewed before jobs go live.",
  },
  {
    icon: HiOutlineSparkles,
    title: "AI resume matching",
    desc: "See your match score against every role before you apply.",
  },
];

// const categories = [
//   { icon: HiOutlineCode, name: 'Engineering', count: '4,210' },
//   { icon: HiOutlineChartBar, name: 'Data & Analytics', count: '1,340' },
//   { icon: HiOutlineMegaphone, name: 'Marketing', count: '980' },
//   { icon: HiOutlineCurrencyDollar, name: 'Finance', count: '760' },
//   { icon: HiOutlinePaintBrush, name: 'Design', count: '1,120' },
//   { icon: HiOutlineShieldCheck, name: 'Operations', count: '640' },
// ];
const categories = [
  {
    icon: HiOutlineCommandLine,
    name: "Engineering",
    count: "4,210",
  },
  {
    icon: HiOutlinePresentationChartBar,
    name: "Data & Analytics",
    count: "1,340",
  },
  {
    icon: HiOutlineSpeakerWave,
    name: "Marketing",
    count: "980",
  },
  {
    icon: HiOutlineCurrencyDollar,
    name: "Finance",
    count: "760",
  },
  {
    icon: HiOutlineSwatch,
    name: "Design",
    count: "1,120",
  },
  {
    icon: HiOutlineShieldCheck,
    name: "Operations",
    count: "640",
  },
];

const testimonials = [
  { name: 'Priya N.', role: 'Frontend Engineer @ Cascade', quote: 'I found and started a new role in under three weeks using the saved-search alerts.' },
  { name: 'Daniel O.', role: 'Hiring Manager @ Brightline', quote: 'The applicant match scores cut our screening time in half.' },
  { name: 'Maria S.', role: 'Product Designer @ Lumen Labs', quote: 'The application tracker made it obvious where every role stood.' },
];

const faqs = [
  { q: 'Is Jobnix free for candidates?', a: 'Yes. Creating a profile, searching jobs, and applying is always free for candidates.' },
  { q: 'How does AI resume matching work?', a: 'We compare your listed skills against each role\'s requirements and show a compatibility score on every application.' },
  { q: 'Can employers post unlimited jobs?', a: 'Employers can create, edit, and close as many listings as they need from their dashboard.' },
  { q: 'Where do the aggregated jobs come from?', a: 'Our scraper pulls fresh listings from public job APIs every six hours and removes duplicates automatically.' },
];

const stats = [
  { value: '12,400+', label: 'Active job listings' },
  { value: '3,200+', label: 'Verified companies' },
  { value: '58,000+', label: 'Candidates hired' },
  { value: '4.8', label: 'Average employer rating' },
];


const useCountUp = (endValue, duration = 1500, start = false) => {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * endValue));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCount(endValue);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [endValue, duration, start]);

  return count;
};

const StatsSection = ({ stats }) => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="card grid grid-cols-2 gap-8 p-8 sm:grid-cols-4">
        {stats.map((s) => {
          const numericValue = parseFloat(String(s.value).replace(/[^0-9.]/g, '')) || 0;
          const suffix = String(s.value).replace(/[0-9.]/g, '');
          const isDecimal = String(s.value).includes('.');
          const count = useCountUp(numericValue, 1500, inView);
          const displayValue = isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString();

          return (
            <div key={s.label} className="text-center">
              <p className="font-display text-2xl font-bold text-primary-500 sm:text-3xl">
                {displayValue}
                {suffix}
              </p>
              <p className="mt-1 text-xs text-ink/60 dark:text-paper/60">{s.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await jobService.getJobs({ limit: 6, sort: '-createdAt' });
        setFeatured(res.data);
      } catch (err) {
        // Featured jobs are non-critical - fail silently on the landing page
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleNewsletter = (e) => {
    e.preventDefault();
    toast.success('You\'re on the list!');
    e.target.reset();
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-50/60 via-transparent to-transparent dark:from-primary-900/20" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-24">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="badge mb-5">Now aggregating jobs every 6 hours</span>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
              Every application, <span className="text-primary-500">tracked stage by stage</span>.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink/60 dark:text-paper/60">
              Jobnix turns the job hunt into a visible pipeline — search real and AI-sourced roles, apply in a click, and always know exactly where you stand.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/jobs" className="btn-primary text-base"><HiOutlineMagnifyingGlass /> Browse jobs</Link>
              <Link to="/register" className="btn-secondary text-base">Post a job as employer</Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card flex flex-col justify-center gap-8 p-8"
          >
            <div>
              <p className="mb-1 text-sm font-medium text-ink/60 dark:text-paper/60">Your application to</p>
              <p className="font-display text-lg font-semibold">Software Engineer · Innov2grow</p>
            </div>
            <PipelineTrack activeIndex={2} />
            <div className="flex items-center justify-between rounded-xl bg-primary-50 px-4 py-3 text-sm dark:bg-primary-900/30">
              <span className="text-primary-700 dark:text-primary-200">AI match score</span>
              <span className="font-mono font-semibold text-primary-700 dark:text-primary-200">87%</span>
            </div>
          </motion.div>
        </div>

        {/* Trusted companies */}
        <div className="border-y border-black/5 bg-white/60 py-6 dark:border-white/5 dark:bg-white/5">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 sm:px-6 lg:px-8">
            {trustedCompanies.map((c) => (
              <span key={c} className="font-display text-sm font-semibold text-ink/40 dark:text-paper/40">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured jobs */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Featured roles</h2>
            <p className="mt-1 text-ink/60 dark:text-paper/60">Freshly posted, hand-picked openings.</p>
          </div>
          <Link to="/jobs" className="text-sm font-semibold text-primary-500 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
            : featured.map((job) => <JobCard key={job._id} job={job} />)}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 dark:bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 font-display text-2xl font-bold sm:text-3xl">How it works</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="font-mono text-xs text-primary-500">STAGE {i + 1}</span>
                <h3 className="mt-2 font-display font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-10 font-display text-2xl font-bold sm:text-3xl">Why choose Hirable</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.title} className="card p-6">
              <r.icon className="mb-3 text-2xl text-primary-500" />
              <h3 className="font-display font-semibold">{r.title}</h3>
              <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-16 dark:bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 font-display text-2xl font-bold sm:text-3xl">Explore by category</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <Link
                key={c.name}
                to={`/jobs?search=${encodeURIComponent(c.name)}`}
                className="card flex flex-col items-center gap-2 p-5 text-center transition hover:shadow-lift"
              >
                <c.icon className="text-2xl text-primary-500" />
                <span className="text-sm font-semibold">{c.name}</span>
                <span className="font-mono text-xs text-ink/50 dark:text-paper/50">{c.count} jobs</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      {/* <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="card grid grid-cols-2 gap-8 p-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-2xl font-bold text-primary-500 sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-ink/60 dark:text-paper/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section> */}
      <StatsSection stats={stats} />

      {/* Testimonials */}
      <section className="bg-white py-16 dark:bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 font-display text-2xl font-bold sm:text-3xl">What people are saying</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-6">
                <p className="text-sm text-ink/70 dark:text-paper/70">"{t.quote}"</p>
                <p className="mt-4 font-display text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-ink/50 dark:text-paper/50">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-10 font-display text-2xl font-bold sm:text-3xl">Frequently asked questions</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="card overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left font-medium"
                aria-expanded={openFaq === i}
              >
                {f.q}
                <HiOutlineChevronDown className={`shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && <p className="px-5 pb-4 text-sm text-ink/60 dark:text-paper/60">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="card flex flex-col items-center gap-4 bg-gradient-to-br from-primary-500 to-violet-500 p-10 text-center text-white">
          <h2 className="font-display text-2xl font-bold">Get new roles in your inbox</h2>
          <p className="max-w-md text-sm text-white/80">Weekly picks matched to your skills. No spam, unsubscribe anytime.</p>
          <form onSubmit={handleNewsletter} className="flex w-full max-w-md gap-2">
            <input type="email" required placeholder="you@email.com" className="input flex-1 !bg-white/95 !text-ink" />
            <button className="btn-accent shrink-0">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
