import { useEffect, useState } from 'react'
import { MotionConfig, useReducedMotion } from 'motion/react'
import { ReactLenis } from 'lenis/react'
import { Toaster } from 'sonner'
import 'lenis/dist/lenis.css'
import './App.css'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Education from './components/Education'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'

function getInitialTheme() {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.dataset.theme || 'dark'
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // almacenamiento no disponible (modo privado)
    }
  }, [theme])

  const content = (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>
      <ScrollProgress />
      <Nav theme={theme} onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Education />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <Toaster theme={theme} position="bottom-center" richColors closeButton />
    </MotionConfig>
  )

  // Scroll suave solo si el usuario no pidió reducir movimiento
  if (reduceMotion) return content

  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -72 } }}>
      {content}
    </ReactLenis>
  )
}
