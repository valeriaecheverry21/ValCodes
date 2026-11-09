import { motion } from 'motion/react'
import { toast } from 'sonner'
import { profile } from '../data'
import { MailIcon, PhoneIcon, PinIcon } from './Icons'
import { Reveal, SpotlightCard, Stagger } from './motion'

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
    toast.success('Email copiado al portapapeles')
  } catch {
    toast.error('No se pudo copiar. Email: ' + profile.email)
  }
}

export default function About() {
  return (
    <section id="about">
      <Reveal>
        <div className="section-tag">// 01 — quién soy</div>
        <h2 className="section-title">Sobre mí</h2>
        <p className="section-sub">{profile.summary}</p>
      </Reveal>
      <Stagger className="about-grid" stagger={0.12}>
        <SpotlightCard className="about-card" tilt={0}>
          <div className="about-row">
            <MailIcon />
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <motion.button
              type="button"
              className="copy-btn"
              onClick={copyEmail}
              whileTap={{ scale: 0.9 }}
              aria-label="Copiar email"
              title="Copiar email"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </motion.button>
          </div>
          <div className="about-row">
            <PhoneIcon />
            <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer">
              {profile.phone}
            </a>
          </div>
          <div className="about-row">
            <PinIcon />
            <span>{profile.location}</span>
          </div>
        </SpotlightCard>
        <SpotlightCard className="about-focus" tilt={0}>
          <motion.div
            className="skill-cat-icon"
            whileHover={{ rotate: [0, -12, 12, -6, 0], scale: 1.15 }}
            transition={{ duration: 0.5 }}
          >
            🎯
          </motion.div>
          <h3>Orientación técnica</h3>
          <p>
            Me enfoco en sistemas críticos de alto rendimiento: APIs, integración de sistemas,
            microservicios y optimización de bases de datos, siempre con arquitectura limpia y escalable.
          </p>
        </SpotlightCard>
      </Stagger>
    </section>
  )
}
