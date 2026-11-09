import { useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { projects } from '../data'
import { GithubIcon } from './Icons'
import { Reveal, SpotlightCard } from './motion'

const badgeColor = (t) => (t === 'Go' || t === 'HTML' ? 'red' : 'blue')

export default function Projects() {
  const [filter, setFilter] = useState('Todos')

  // Filtros: tecnologías que aparecen en más de un proyecto
  const filters = useMemo(() => {
    const counts = {}
    projects.forEach((p) => p.tech.forEach((t) => (counts[t] = (counts[t] || 0) + 1)))
    const common = Object.keys(counts)
      .filter((t) => counts[t] > 1)
      .sort((a, b) => counts[b] - counts[a])
    return ['Todos', ...common]
  }, [])

  const visible = filter === 'Todos' ? projects : projects.filter((p) => p.tech.includes(filter))

  return (
    <section id="projects">
      <Reveal>
        <div className="section-tag">// 05 — proyectos destacados</div>
        <h2 className="section-title">Proyectos</h2>
        <p className="section-sub">Repositorios públicos seleccionados de mi GitHub.</p>
      </Reveal>

      <Reveal className="project-filters" role="group" aria-label="Filtrar proyectos por tecnología" delay={0.1}>
        <LayoutGroup id="filters">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className={`filter-chip ${filter === f ? 'active' : ''}`}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {filter === f && (
                <motion.span
                  layoutId="filter-bg"
                  className="filter-bg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="filter-label">{f}</span>
            </button>
          ))}
        </LayoutGroup>
        <span className="filter-count" aria-live="polite">
          {visible.length} {visible.length === 1 ? 'proyecto' : 'proyectos'}
        </span>
      </Reveal>

      <motion.div layout className="projects-grid">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p) => (
            <SpotlightCard
              as="article"
              layout
              className="project-card"
              key={p.name}
              tilt={5}
              variants={undefined}
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="project-header">
                <div className="project-icon">📦</div>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  aria-label={`Ver ${p.name} en GitHub`}
                >
                  <GithubIcon size={13} /> GitHub ↗
                </a>
              </div>
              <h3 className="project-name">{p.name}</h3>
              <div className="project-tech">
                {p.tech.map((t) => (
                  <button
                    type="button"
                    className={`tech-badge ${badgeColor(t)}`}
                    key={t}
                    onClick={() => filters.includes(t) && setFilter(t)}
                    disabled={!filters.includes(t)}
                    title={filters.includes(t) ? `Filtrar por ${t}` : undefined}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="project-desc">{p.description}</p>
            </SpotlightCard>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
