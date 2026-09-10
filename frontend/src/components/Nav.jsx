import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon } from './Icons'

const links = [
  { href: '#about', label: 'Sobre mí' },
  { href: '#experience', label: 'Experiencia' },
  { href: '#skills', label: 'Habilidades' },
  { href: '#projects', label: 'Proyectos' },
  { href: '#education', label: 'Educación' },
  { href: '#contact', label: 'Contacto' },
]

export default function Nav() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    return document.documentElement.dataset.theme || 'dark'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <nav className="nav">
      <a href="#" className="nav-logo">
        Valeria<span>.</span>dev
      </a>
      <div className="nav-actions">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        >
          {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>
        <a className="nav-contact" href="#contact">
          Hablemos
        </a>
      </div>
      <ul className="nav-links">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}