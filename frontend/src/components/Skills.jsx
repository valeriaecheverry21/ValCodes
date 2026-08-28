import { skills } from '../data'

export default function Skills() {
  return (
    <section id="skills">
      <div className="reveal">
        <div className="section-tag">// 03 — stack técnico</div>
        <h2 className="section-title">Habilidades</h2>
        <p className="section-sub">Tecnologías y patrones que aplico a diario en proyectos reales.</p>
      </div>
      <div className="skills-grid reveal">
        {skills.map((cat) => (
          <div className="skill-card" key={cat.category}>
            <div className="skill-cat">
              <span className="skill-cat-icon">⚙️</span> {cat.category}
            </div>
            <div className="skill-tags">
              {cat.items.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
