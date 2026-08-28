import { profile } from '../data'
import { MailIcon, PhoneIcon, PinIcon } from './Icons'

export default function About() {
  return (
    <section id="about">
      <div className="reveal">
        <div className="section-tag">// 01 — quién soy</div>
        <h2 className="section-title">Sobre mí</h2>
        <p className="section-sub">{profile.summary}</p>
      </div>
      <div className="about-grid reveal">
        <div className="about-card">
          <div className="about-row">
            <MailIcon />
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </div>
          <div className="about-row">
            <PhoneIcon />
            <a href={`tel:${profile.phoneHref}`}>{profile.phone}</a>
          </div>
          <div className="about-row">
            <PinIcon />
            <span>{profile.location}</span>
          </div>
        </div>
        <div className="about-focus">
          <div className="skill-cat-icon">🎯</div>
          <h3>Orientación técnica</h3>
          <p>
            Me enfoco en sistemas críticos de alto rendimiento: APIs, integración de sistemas,
            microservicios y optimización de bases de datos, siempre con arquitectura limpia y escalable.
          </p>
        </div>
      </div>
    </section>
  )
}
