const links = [
  { href: '#about', label: 'Sobre mí' },
  { href: '#experience', label: 'Experiencia' },
  { href: '#skills', label: 'Habilidades' },
  { href: '#projects', label: 'Proyectos' },
  { href: '#education', label: 'Educación' },
  { href: '#contact', label: 'Contacto' },
]

export default function Nav() {
  return (
    <nav className="nav">
      <a href="#" className="nav-logo">
        Valeria<span>.</span>dev
      </a>
      <a className="nav-contact" href="#contact">
        Hablemos
      </a>
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
