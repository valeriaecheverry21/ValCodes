import { useEffect, useState } from 'react'
import { profile } from '../data'
import { GithubIcon, LinkedInIcon, MailIcon, PhoneIcon } from './Icons'

export default function Contact() {
  const [backend, setBackend] = useState('checking')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(null)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/health')
      .then((r) => (r.ok ? setBackend('online') : setBackend('offline')))
      .catch(() => setBackend('offline'))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.message || 'Error al enviar el mensaje')
      }
      setSent(data.message || '¡Mensaje enviado! Gracias por contactarme.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact">
      <div className="contact-wrap reveal">
        <div className="contact-label">// Hablemos</div>
        <h2 className="contact-title">¿Listo para construir algo juntos?</h2>
        <p className="contact-desc">
          ¿Tenés un proyecto o equipo donde pueda aportar y crecer? Estoy disponible.
        </p>

        <div className="contact-links">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="contact-item">
            <GithubIcon /> GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="contact-item">
            <LinkedInIcon /> LinkedIn
          </a>
          <a href={`mailto:${profile.email}`} className="contact-item">
            <MailIcon /> {profile.email}
          </a>
          <a href={`tel:${profile.phoneHref}`} className="contact-item">
            <PhoneIcon /> +54 11 2396-1238
          </a>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>
            Enviar mensaje{' '}
            <span className={`backend-pill ${backend}`}>
              API (Go): {backend === 'online' ? 'conectada' : backend === 'checking' ? 'verificando…' : 'offline'}
            </span>
          </h3>
          {sent ? (
            <p className="form-ok">{sent}</p>
          ) : (
            <>
              <div className="form-row">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre"
                />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
              </div>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tu mensaje…"
              />
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Enviando…' : 'Enviar mensaje'}
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  )
}
