import { motion } from 'motion/react'
import { skills } from '../data'
import { Reveal, SpotlightCard, Stagger } from './motion'

const icons = {
  Backend: '⚙️',
  Arquitectura: '🏛️',
  'Bases de datos': '🗄️',
  Frontend: '🎨',
  'Herramientas & Cloud': '☁️',
}

export default function Skills() {
  return (
    <section id="skills">
      <Reveal>
        <div className="section-tag">// 03 — stack técnico</div>
        <h2 className="section-title">Habilidades</h2>
        <p className="section-sub">Tecnologías y patrones que aplico a diario en proyectos reales.</p>
      </Reveal>
      <Stagger className="skills-grid">
        {skills.map((cat) => (
          <SpotlightCard className="skill-card" key={cat.category}>
            <div className="skill-cat">
              <span className="skill-cat-icon">{icons[cat.category] ?? '⚙️'}</span> {cat.category}
              <span className="skill-count">{cat.items.length}</span>
            </div>
            <div className="skill-tags">
              {cat.items.map((tag) => (
                <motion.span
                  className="tag"
                  key={tag}
                  whileHover={{ y: -3, scale: 1.06 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </SpotlightCard>
        ))}
      </Stagger>
    </section>
  )
}
