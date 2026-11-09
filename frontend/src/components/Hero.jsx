import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { experience, profile, projects, skills } from '../data'
import { GithubIcon, LinkedInIcon } from './Icons'
import { fadeUp, staggerContainer } from './variants'

const stats = [
  { value: 9, suffix: '', label: 'años de experiencia' },
  { value: experience.length, suffix: '', label: 'empresas' },
  { value: skills.reduce((n, c) => n + c.items.length, 0), suffix: '+', label: 'tecnologías' },
  { value: projects.length, suffix: '', label: 'proyectos públicos' },
]

function Counter({ to, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? to : 0)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to, reduce])

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  )
}

const lineVariants = { hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0, transition: { duration: 0.25 } } }

function TLine({ className, children }) {
  return (
    <motion.div className={className} variants={lineVariants}>
      {children}
    </motion.div>
  )
}

// Líneas del "código" de la terminal, se revelan una a una
const code = (
  <>
  <TLine className="t-line t-comment">// Perfil profesional</TLine>
  <TLine className="t-blank" />
  <TLine className="t-line">
    <span className="t-key">var</span> <span className="t-cmd">developer</span> ={' '}
    <span className="t-key">new</span> <span className="t-val">Developer</span>()
  </TLine>
  <TLine className="t-line">{'{'}</TLine>
  <TLine className="t-line t-out">
    <span className="t-key">Name</span> <span>=</span> <span className="t-str">"Valeria Echeverry"</span>,
  </TLine>
  <TLine className="t-line t-out">
    <span className="t-key">Location</span> <span>=</span> <span className="t-str">"Buenos Aires, Argentina"</span>,
  </TLine>
  <TLine className="t-line t-out">
    <span className="t-key">Specialty</span> <span>=</span> <span className="t-str">"Full Stack · .NET & React"</span>,
  </TLine>
  <TLine className="t-line t-out">
    <span className="t-key">Stack</span> <span>=</span>{' '}
    <span className="t-str">{'["C#", ".NET 8", "SQL Server", "React"]'}</span>,
  </TLine>
  <TLine className="t-line t-out">
    <span className="t-key">Architecture</span> <span>=</span>{' '}
    <span className="t-str">{'["Microservicios", "DDD", "CQRS", "BFF"]'}</span>,
  </TLine>
  <TLine className="t-line t-out">
    <span className="t-key">DevOps</span> <span>=</span>{' '}
    <span className="t-str">{'["Jenkins", "Azure DevOps", "Git"]'}</span>,
  </TLine>
  <TLine className="t-line t-out">
    <span className="t-key">Available</span> <span>=</span> <span className="t-val">true</span>
  </TLine>
  <TLine className="t-line">{'};'}</TLine>
  <TLine className="t-blank" />
  <TLine className="t-line">
    <span className="t-prompt">$</span> <span className="t-cmd">developer.HireMe();</span> <span className="t-cursor" />
  </TLine>
  </>
)

function Terminal() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const cfg = { stiffness: 150, damping: 18 }
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), cfg)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), cfg)

  function onMove(e) {
    if (reduce || e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <motion.div
      ref={ref}
      className="terminal"
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="terminal-bar">
        <span className="dot dot-r" />
        <span className="dot dot-y" />
        <span className="dot dot-g" />
        <span className="terminal-title">valeria@dev ~ profile.cs</span>
      </div>
      <motion.div
        className="terminal-body"
        initial="hidden"
        animate="show"
        variants={staggerContainer(0.12, 0.8)}
      >
        {code}
      </motion.div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-glow" aria-hidden="true" />
      <motion.div className="hero-content" initial="hidden" animate="show" variants={staggerContainer(0.1, 0.1)}>
        <motion.div className="hero-eyebrow" variants={fadeUp}>
          <span className="pulse-dot" aria-hidden="true" />
          Disponible para trabajar
        </motion.div>
        <h1 className="hero-title">
          <span className="hero-line">
            <motion.span
              className="hero-line-inner"
              variants={{ hidden: { y: '110%' }, show: { y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }}
            >
              Valeria
            </motion.span>
          </span>
          <span className="hero-line">
            <motion.span
              className="hero-line-inner line2"
              variants={{ hidden: { y: '110%' }, show: { y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }}
            >
              Echeverry
            </motion.span>
          </span>
        </h1>
        <motion.p className="hero-desc" variants={fadeUp}>
          <strong>Desarrolladora full stack</strong> con 9 años de experiencia en el ecosistema{' '}
          <strong>.NET (C#, SQL Server)</strong> y en frontend con <strong>React y Blazor</strong>. Diseño
          arquitecturas de microservicios, microfrontends y aplicaciones web para el sector financiero.
        </motion.p>
        <motion.div className="hero-cta" variants={fadeUp}>
          <motion.a
            href="#contact"
            className="btn btn-primary"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
          >
            Hablemos →
          </motion.a>
          <motion.a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
          >
            <GithubIcon /> GitHub
          </motion.a>
          <motion.a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
          >
            <LinkedInIcon /> LinkedIn
          </motion.a>
        </motion.div>
        <motion.dl className="hero-stats" variants={fadeUp}>
          {stats.map((s) => (
            <div className="hero-stat" key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="hero-stat-value">
                <Counter to={s.value} suffix={s.suffix} />
              </dd>
              <dd className="hero-stat-label" aria-hidden="true">
                {s.label}
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
      <div className="hero-right">
        <Terminal />
      </div>
      <motion.a
        href="#about"
        className="scroll-hint"
        aria-label="Ir a la sección Sobre mí"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="scroll-hint-mouse">
          <span className="scroll-hint-wheel" />
        </span>
      </motion.a>
    </section>
  )
}
