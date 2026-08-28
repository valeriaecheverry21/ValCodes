import { projects } from '../data'
import { GithubIcon } from './Icons'

export default function Projects() {
  return (
    <section id="projects">
      <div className="reveal">
        <div className="section-tag">// 05 — proyecto destacado</div>
        <h2 className="section-title">Proyectos</h2>
        <p className="section-sub">Repositorios públicos seleccionados de mi GitHub.</p>
      </div>
      <div className="projects-grid reveal">
        {projects.map((p) => (
          <div className="project-card" key={p.name}>
            <div className="project-header">
              <div className="project-icon">📦</div>
              <div className="project-links">
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-link">
                  <GithubIcon size={13} /> GitHub
                </a>
              </div>
            </div>
            <div className="project-name">{p.name}</div>
            <div className="project-tech">
              {p.tech.map((t) => (
                <span className={`tech-badge ${t === 'Go' ? 'red' : t === 'HTML' ? 'red' : 'blue'}`} key={t}>
                  {t}
                </span>
              ))}
            </div>
            <p className="project-desc">{p.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
