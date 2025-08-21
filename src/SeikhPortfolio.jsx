import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, useAnimation } from 'framer-motion';

// Opening splash overlay
export function OpeningSplash({ onFinish }) {
  const prefersReduced = useReducedMotion();
  const [show, setShow] = useState(true);
  const visitedRef = useRef(false);

  useEffect(() => {
    visitedRef.current = localStorage.getItem('visited') === '1';
    const total = visitedRef.current || prefersReduced ? 1.2 : 2.4;
    const timer = setTimeout(() => {
      setShow(false);
      localStorage.setItem('visited', '1');
      if (onFinish) onFinish();
    }, total * 1000);
    return () => clearTimeout(timer);
  }, [onFinish, prefersReduced]);

  if (!show) return null;
  const simple = visitedRef.current || prefersReduced;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: simple ? 0.6 : 1.8, duration: 0.6, ease: 'easeInOut' }}
    >
      {!simple && (
        <>
          <motion.svg
            width="96"
            height="96"
            viewBox="0 0 100 100"
            className="text-white"
          >
            <motion.path
              d="M10 50 L50 10 L90 50 L50 90 Z"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </motion.svg>
          <motion.div
            className="absolute w-40 h-40 rounded-full bg-[radial-gradient(ellipse_at_center,theme(colors.fuchsia.500),theme(colors.sky.500),theme(colors.emerald.500))]"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.06 }}
            transition={{ duration: 0.9, delay: 1.2, ease: 'easeInOut' }}
          />
        </>
      )}
    </motion.div>
  );
}

// Magnetic button with slight pointer attraction
function MagneticButton({ children, className = '', href, ...props }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x, y });
  };

  const handleLeave = () => setPos({ x: 0, y: 0 });
  const Comp = href ? 'a' : 'button';

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: pos.x * 0.2, y: pos.y * 0.2 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <Comp
        href={href}
        {...props}
        className="relative inline-block px-6 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
      >
        {children}
      </Comp>
    </motion.div>
  );
}

// Counter component for KPI strip
function Counter({ value, label, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = value / (duration / 16);
    const handle = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(handle);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);
    return () => clearInterval(handle);
  }, [value]);
  return (
    <div>
      <div className="text-3xl font-bold">{count.toLocaleString()}{suffix}</div>
      <div className="mt-2 text-sm text-white/60">{label}</div>
    </div>
  );
}

// Marquee for toolchain
function Marquee({ items }) {
  const controls = useAnimation();
  useEffect(() => {
    controls.start({
      x: ['0%', '-50%'],
      transition: { duration: 20, ease: 'linear', repeat: Infinity }
    });
  }, [controls]);
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-8 whitespace-nowrap text-sm text-white/60"
        animate={controls}
        onHoverStart={() => controls.stop()}
        onHoverEnd={() =>
          controls.start({
            x: ['0%', '-50%'],
            transition: { duration: 20, ease: 'linear', repeat: Infinity }
          })
        }
      >
        {items.concat(items).map((item, i) => (
          <span key={i} aria-hidden={i >= items.length}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// Process card with parallax
function ProcessCard({ title, text, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className="rounded-lg border border-white/10 bg-white/5 p-6"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay: index * 0.2 }}
    >
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-white/70">{text}</p>
    </motion.div>
  );
}

const caseStudies = [
  {
    title: 'Brand Story Reel',
    metric: '3.2M views in 10 days',
    tools: 'Midjourney, Runway',
    link: '#'
  },
  {
    title: 'AI Ad Concept',
    metric: '+37% CTR',
    tools: 'Stable Diffusion, n8n',
    link: '#'
  },
  {
    title: 'Narrated Slideshow',
    metric: '1.1M organic reach',
    tools: 'ElevenLabs, FLUX',
    link: '#'
  }
];

export default function SeikhPortfolio() {
  const [ready, setReady] = useState(false);
  const prefersReduced = useReducedMotion();

  const heroVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 16 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main className="bg-black text-white font-sans">
      <OpeningSplash onFinish={() => setReady(true)} />

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(ellipse_at_center,theme(colors.fuchsia.500),theme(colors.sky.500),theme(colors.emerald.500))]" />
        <motion.span
          className="mb-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur"
          variants={heroVariants}
          initial="hidden"
          animate={ready ? 'show' : 'hidden'}
          transition={{ delay: 0.3 }}
        >
          ⭐ Top Rated Freelancer
        </motion.span>
        <motion.h1
          className="text-4xl sm:text-6xl font-bold tracking-tight"
          variants={heroVariants}
          initial="hidden"
          animate={ready ? 'show' : 'hidden'}
          transition={{ delay: 0.4 }}
        >
          Seikh Nabab Uddin
        </motion.h1>
        <motion.p
          className="mt-6 max-w-xl text-lg text-white/80"
          variants={heroVariants}
          initial="hidden"
          animate={ready ? 'show' : 'hidden'}
          transition={{ delay: 0.5 }}
        >
          Prompt Engineer &amp; AI Content Creator. I design creative systems that turn ideas into scalable image &amp; video storytelling.
        </motion.p>
        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-4"
          variants={heroVariants}
          initial="hidden"
          animate={ready ? 'show' : 'hidden'}
          transition={{ delay: 0.6 }}
        >
          {/* Replace #contact with actual Calendly or form link */}
          <MagneticButton className="rounded-full bg-white text-black" href="#contact">
            Start a Project
          </MagneticButton>
          <MagneticButton className="rounded-full border border-white/40" href="#cases">
            See Case Studies
          </MagneticButton>
        </motion.div>
        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-white/60"
          variants={heroVariants}
          initial="hidden"
          animate={ready ? 'show' : 'hidden'}
          transition={{ delay: 0.7 }}
        >
          <span>29M+ views</span>
          <span>48k followers</span>
        </motion.div>
      </section>

      {/* KPI strip */}
      <section className="py-20" id="kpi">
        <div className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          <Counter value={29000000} label="Organic Views" suffix="+" />
          <Counter value={48000} label="Followers" suffix="+" />
          <Counter value={32} label="Projects" suffix="+" />
          <Counter value={90} label="Job Success" suffix="%" />
        </div>
      </section>

      {/* Toolchain marquee */}
      <section className="py-16 border-t border-white/10">
        <Marquee items={[
          'FLUX',
          'Midjourney',
          'Stable Diffusion',
          'Veo 3',
          'Kling',
          'Runway',
          'ElevenLabs',
          'n8n'
        ]} />
      </section>

      {/* Process section */}
      <section className="py-24" id="process">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold mb-12">Process</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Discover',
                text: 'Map goals, prompts, guardrails.'
              },
              {
                title: 'Design',
                text: 'Craft negative prompts and creative systems.'
              },
              {
                title: 'Deliver',
                text: 'Automate with n8n for scale.'
              }
            ].map((step, i) => (
              <ProcessCard key={step.title} {...step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section className="py-24" id="cases">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold mb-12">Case Studies</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {caseStudies.map((cs, i) => (
              <motion.article
                key={cs.title}
                className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
              >
                <div className="aspect-video bg-black/50" />
                <div className="p-6 flex flex-col">
                  <h3 className="text-xl font-semibold">{cs.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{cs.metric}</p>
                  <p className="mt-4 text-sm text-white/50">{cs.tools}</p>
                  <MagneticButton
                    className="mt-4 self-start rounded-full border border-white/40 text-sm"
                    href={cs.link}
                  >
                    View Breakdown
                  </MagneticButton>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 border-t border-white/10 text-center">
        <blockquote className="mx-auto max-w-2xl text-2xl font-medium italic text-white/80">
          “A rare blend of technical precision and creative instinct.”
        </blockquote>
        <div className="mt-6">
          {/* Replace # with Upwork profile link */}
          <a href="#" className="text-sm underline text-white/60">
            View Upwork Profile
          </a>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24" id="contact">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="text-3xl font-bold mb-8">Start a Project</h2>
          <p className="mb-6 text-white/70">Expect a lightweight concept board in reply.</p>
          <form className="grid gap-4">
            <input
              className="rounded-md bg-white/10 p-3"
              type="text"
              placeholder="Name"
              required
            />
            <input
              className="rounded-md bg-white/10 p-3"
              type="text"
              placeholder="Email or Telegram"
              required
            />
            <input
              className="rounded-md bg-white/10 p-3"
              type="text"
              placeholder="Project Title"
            />
            <textarea
              className="rounded-md bg-white/10 p-3"
              rows="5"
              placeholder="Tell me about your project..."
            />
            <MagneticButton className="mt-2 rounded-full bg-white text-black" type="submit">
              Start a Project
            </MagneticButton>
          </form>
          <div className="mt-8 flex justify-center gap-6 text-sm">
            {/* Replace # with social links */}
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-fuchsia-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Instagram
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              LinkedIn
            </a>
            <a
              href="#"
              aria-label="Upwork"
              className="hover:text-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Upwork
            </a>
            <a
              href="mailto:hello@example.com"
              aria-label="Email"
              className="hover:text-fuchsia-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Email
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
