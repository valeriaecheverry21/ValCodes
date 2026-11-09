import { motion } from 'motion/react'
import { education, languages } from '../data'
import { Reveal, SpotlightCard, Stagger } from './motion'
import { fadeUp } from './variants'

export default function Education() {
  return (
    <section id="education">
      <Reveal>
        <div className="section-tag">// 04 — formación</div>
        <h2 className="section-title">Educación</h2>
      </Reveal>
      <Stagger className="edu-grid">
        {education.map((edu, i) => (
          <SpotlightCard className="edu-card" key={edu.degree + i} tilt={4}>
            <div className="edu-institution">{edu.institution}</div>
            <div className="edu-degree">{edu.degree}</div>
            {edu.period && <div className="edu-period">{edu.period}</div>}
            <span className="badge-done">✓ {edu.status}</span>
          </SpotlightCard>
        ))}
      </Stagger>
      <Stagger className="languages">
        <motion.h3 variants={fadeUp}>Idiomas</motion.h3>
        <div className="lang-tags">
          {languages.map((lang) => (
            <motion.span className="tag" key={lang} variants={fadeUp} whileHover={{ y: -3 }}>
              {lang}
            </motion.span>
          ))}
        </div>
      </Stagger>
    </section>
  )
}
