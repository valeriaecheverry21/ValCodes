import { experience } from '../data'

export default function Experience() {
  return (
    <section id="experience">
      <div className="reveal">
        <div className="section-tag">// 02 — trayectoria</div>
        <h2 className="section-title">Experiencia</h2>
        <p className="section-sub">
          Más de 8 años construyendo software en el sector financiero y de comercio exterior.
        </p>
      </div>
      <div className="timeline reveal">
        {experience.map((job) => (
          <div className="timeline-item" key={job.company}>
            <div className="timeline-date">{job.period}</div>
            <div className="timeline-body">
              <div className="timeline-role">{job.role}</div>
              <div className="timeline-company">{job.company}</div>
              <ul className="timeline-list">
                {job.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
