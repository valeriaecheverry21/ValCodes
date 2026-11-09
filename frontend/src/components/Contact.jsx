import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { toast } from 'sonner'
import { profile } from '../data'
import { GithubIcon, LinkedInIcon, MailIcon, PhoneIcon } from './Icons'
import { Reveal, Stagger } from './motion'
import { fadeUp } from './variants'

const MAX_MESSAGE = 1000
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ name, email, message }) {
  const errors = {}
  if (name.trim().length < 2) errors.name = 'Ingresá tu nombre (mínimo 2 caracteres).'
  if (!emailRe.test(email.trim())) errors.email = 'Ingresá un email válido, ej: nombre@empresa.com'
  if (message.trim().length < 10) errors.message = 'Contame un poco más (mínimo 10 caracteres).'
  return errors
}

function Field({ id, label, error, touched, children }) {
  const showError = touched && error
  return (
    <div className={`field ${showError ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      <AnimatePresence initial={false}>
        {showError && (
          <motion.p
            id={`${id}-error`}
            className="field-error"
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const contactLinks = [
  { href: profile.github, icon: <GithubIcon />, label: 'GitHub', external: true },
  { href: profile.linkedin, icon: <LinkedInIcon />, label: 'LinkedIn', external: true },
  { href: `mailto:${profile.email}`, icon: <MailIcon />, label: profile.email },
  { href: profile.whatsapp, icon: <PhoneIcon />, label: profile.phone, external: true },
]

export default function Contact() {
  const [backend, setBackend] = useState('checking')
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [touched, setTouched] = useState({})
  const [sent, setSent] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formRef, animateForm] = useAnimate()

  const errors = validate(values)

  useEffect(() => {
    fetch('/api/health')
      .then((r) => setBackend(r.ok ? 'online' : 'offline'))
      .catch(() => setBackend('offline'))
  }, [])

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))
  const blur = (key) => () => setTouched((t) => ({ ...t, [key]: true }))

  async function handleSubmit(e) {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })
    if (Object.keys(errors).length) {
      animateForm(formRef.current, { x: [0, -10, 10, -6, 6, 0] }, { duration: 0.4 })
      const first = Object.keys(errors)[0]
      document.getElementById(`contact-${first}`)?.focus()
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Error al enviar el mensaje')
      const msg = data.message || '¡Mensaje enviado! Gracias por contactarme.'
      setSent(msg)
      toast.success(msg)
    } catch (err) {
      toast.error(err.message, {
        description: 'También podés escribirme por WhatsApp o email.',
        action: { label: 'WhatsApp', onClick: () => window.open(profile.whatsapp, '_blank', 'noopener') },
      })
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setValues({ name: '', email: '', message: '' })
    setTouched({})
    setSent(null)
  }

  const inputProps = (key) => ({
    id: `contact-${key}`,
    name: key,
    value: values[key],
    onChange: set(key),
    onBlur: blur(key),
    'aria-invalid': touched[key] && errors[key] ? 'true' : 'false',
    'aria-describedby': touched[key] && errors[key] ? `contact-${key}-error` : undefined,
  })

  return (
    <section id="contact">
      <div className="contact-wrap">
        <Reveal>
          <div className="contact-label">// Hablemos</div>
          <h2 className="contact-title">¿Listo para construir algo juntos?</h2>
          <p className="contact-desc">
            ¿Tenés un proyecto o equipo donde pueda aportar y crecer? Estoy disponible.
          </p>
        </Reveal>

        <Stagger className="contact-links" stagger={0.06}>
          {contactLinks.map((l) => (
            <motion.a
              key={l.label}
              href={l.href}
              className="contact-item"
              variants={fadeUp}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {l.icon} {l.label}
            </motion.a>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            noValidate
            ref={formRef}
          >
            <h3>
              Enviar mensaje{' '}
              <span className={`backend-pill ${backend}`}>
                <span className="pill-dot" aria-hidden="true" />
                API (Go): {backend === 'online' ? 'conectada' : backend === 'checking' ? 'verificando…' : 'offline'}
              </span>
            </h3>
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div
                  key="ok"
                  className="form-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <svg className="check-svg" viewBox="0 0 52 52" width="64" height="64" aria-hidden="true">
                    <motion.circle
                      cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="2"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }}
                    />
                    <motion.path
                      d="M15 27l7 7 15-15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.5 }}
                    />
                  </svg>
                  <p className="form-ok">{sent}</p>
                  <button type="button" className="btn btn-ghost" onClick={reset}>
                    Enviar otro mensaje
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="form-row">
                    <Field id="contact-name" label="Nombre" error={errors.name} touched={touched.name}>
                      <input {...inputProps('name')} autoComplete="name" placeholder="Tu nombre" />
                    </Field>
                    <Field id="contact-email" label="Email" error={errors.email} touched={touched.email}>
                      <input {...inputProps('email')} type="email" autoComplete="email" placeholder="nombre@empresa.com" />
                    </Field>
                  </div>
                  <Field id="contact-message" label="Mensaje" error={errors.message} touched={touched.message}>
                    <textarea
                      {...inputProps('message')}
                      rows={5}
                      maxLength={MAX_MESSAGE}
                      placeholder="Contame sobre tu proyecto o propuesta…"
                    />
                    <span className={`char-count ${values.message.length > MAX_MESSAGE * 0.9 ? 'warn' : ''}`}>
                      {values.message.length}/{MAX_MESSAGE}
                    </span>
                  </Field>
                  <motion.button
                    type="submit"
                    className="btn btn-primary btn-submit"
                    disabled={submitting}
                    whileHover={submitting ? undefined : { y: -2 }}
                    whileTap={submitting ? undefined : { scale: 0.97 }}
                  >
                    {submitting && <span className="spinner" aria-hidden="true" />}
                    {submitting ? 'Enviando…' : 'Enviar mensaje'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </Reveal>
      </div>
    </section>
  )
}
