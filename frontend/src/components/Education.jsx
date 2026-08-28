import { education, languages } from '../data'

export default function Education() {
  return (
    <section id="education">
      <div className="reveal">
        <div className="section-tag">// 04 — formación</div>
        <h2 className="section-title">Educación</h2>
      </div>
      <div className="edu-grid reveal">
        {education.map((edu, i) => (
          <div className="edu-card" key={edu.degree + i}>
            <div className="edu-institution">{edu.institution}</div>
            <div className="edu-degree">{edu.degree}</div>
            {edu.period && <div className="edu-period">{edu.period}</div>}
            <span className="badge-done">✓ {edu.status}</span>
          </div>
        ))}
      </div>
      <div className="languages reveal">
        <h3>Idiomas</h3>
        <div className="lang-tags">
          {languages.map((lang) => (
            <span className="tag" key={lang}>
              {lang}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
