import { profile } from '../data'
import { GithubIcon, LinkedInIcon } from './Icons'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-content">
        <div className="hero-eyebrow">Disponible para trabajar</div>
        <h1 className="hero-title">
          Valeria
          <br />
          <span className="line2">Echeverry</span>
        </h1>
        <p className="hero-desc">
          <strong>Desarrolladora de software</strong> especializada en soluciones de alto rendimiento.
          Conocimiento en microservicios, despliegues en la nube, optimización de sistemas críticos y
          construcción de pipelines de datos. Experta en desarrollo de <strong>APIs y servicios web</strong>{' '}
          con .NET, C#, ASP.NET y SQL Server.
        </p>
        <div className="hero-cta">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <GithubIcon /> Ver GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <LinkedInIcon /> LinkedIn
          </a>
        </div>
      </div>
      <div className="hero-right">
        <div className="terminal">
          <div className="terminal-bar">
            <span className="dot dot-r" />
            <span className="dot dot-y" />
            <span className="dot dot-g" />
            <span className="terminal-title">valeria@dev ~ profile.cs</span>
          </div>
          <div className="terminal-body">
            <div className="t-line t-comment">// Perfil profesional</div>
            <div className="t-blank" />
            <div className="t-line">
              <span className="t-key">var</span> <span className="t-cmd">developer</span> ={' '}
              <span className="t-key">new</span> <span className="t-val">Developer</span>()
            </div>
            <div className="t-line">{'{'}</div>
            <div className="t-line t-out">
              <span className="t-key">Name</span> <span>=</span> <span className="t-str">"Valeria Echeverry"</span>,
            </div>
            <div className="t-line t-out">
              <span className="t-key">Location</span> <span>=</span> <span className="t-str">"Argentina"</span>,
            </div>
            <div className="t-line t-out">
              <span className="t-key">Specialty</span> <span>=</span>{' '}
              <span className="t-str">"APIs & Servicios Web"</span>,
            </div>
            <div className="t-line t-out">
              <span className="t-key">Stack</span> <span>=</span>{' '}
              <span className="t-str">{'["C#", ".NET", "ASP.NET", "SQL Server"]'}</span>,
            </div>
            <div className="t-line t-out">
              <span className="t-key">Architecture</span> <span>=</span>{' '}
              <span className="t-str">{'["Microservicios", "DDD", "CQRS"]'}</span>,
            </div>
            <div className="t-line t-out">
              <span className="t-key">Cloud</span> <span>=</span>{' '}
              <span className="t-str">{'["Azure", "GCP", "Docker", "K8s"]'}</span>,
            </div>
            <div className="t-line t-out">
              <span className="t-key">Available</span> <span>=</span> <span className="t-val">true</span>
            </div>
            <div className="t-line">{'};'}</div>
            <div className="t-blank" />
            <div className="t-line">
              <span className="t-prompt">$</span> <span className="t-cmd">developer.HireMe();</span>{' '}
              <span className="t-cursor" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
