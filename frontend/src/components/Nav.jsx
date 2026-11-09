import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useLenis } from 'lenis/react'
import { SunIcon, MoonIcon } from './Icons'

const links = [
  { href: '#about', label: 'Sobre mí' },
  { href: '#experience', label: 'Experiencia' },
  { href: '#skills', label: 'Habilidades' },
  { href: '#education', label: 'Educación' },
  { href: '#projects', label: 'Proyectos' },
  { href: '#contact', label: 'Contacto' },
]

// Detecta qué sección está en el centro de la pantalla
function useActiveSection(ids) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    ids.forEach((id) => {
      const el = document.querySelector(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])
  return active
}

const ids = links.map((l) => l.href)

export default function Nav({ theme, onToggleTheme }) {
  const active = useActiveSection(ids)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()
  const lenis = useLenis()

  // Se oculta al bajar y reaparece al subir, para dar más espacio al contenido
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 20)
    setHidden(y > prev && y > 200 && !open)
  })

  // Bloquea el scroll y permite cerrar con Escape cuando el menú móvil está abierto
  useEffect(() => {
    if (!open) return
    lenis?.stop()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open, lenis])

  function goTo(e, href) {
    e.preventDefault()
    setOpen(false)
    if (lenis) {
      lenis.start()
      lenis.scrollTo(href, { offset: -72 })
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.nav
        className={`nav ${scrolled ? 'nav-scrolled' : ''}`}
        initial={{ y: -80 }}
        animate={{ y: hidden ? -90 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <a href="#top" className="nav-logo">
          Valeria<span>.</span>dev
        </a>
        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className={active === l.href ? 'active' : ''} aria-current={active === l.href ? 'true' : undefined}>
                {active === l.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="nav-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="nav-label">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <motion.button
            className="theme-toggle"
            onClick={onToggleTheme}
            whileTap={{ scale: 0.88 }}
            aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'inline-flex' }}
              >
                {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
          <button
            className={`nav-burger ${open ? 'open' : ''}`}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span />
            <span />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.ul
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
            >
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0 } }}
                >
                  <a href={l.href} className={active === l.href ? 'active' : ''} onClick={(e) => goTo(e, l.href)}>
                    <span className="mobile-num">0{i + 1}</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
