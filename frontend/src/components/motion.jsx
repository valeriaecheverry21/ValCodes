import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { ease, fadeUp, staggerContainer } from './variants'

const viewport = { once: true, amount: 0.15 }

// Aparece una sola vez al entrar en pantalla
export function Reveal({ as = 'div', children, delay = 0, ...rest }) {
  const Tag = motion[as]
  return (
    <Tag
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.65, ease, delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// Grilla cuyos hijos (<motion.* variants={fadeUp}>) entran escalonados
export function Stagger({ as = 'div', children, stagger = 0.08, ...rest }) {
  const Tag = motion[as]
  return (
    <Tag variants={staggerContainer(stagger)} initial="hidden" whileInView="show" viewport={viewport} {...rest}>
      {children}
    </Tag>
  )
}

// Tarjeta con brillo que sigue al cursor y una inclinación 3D sutil
export function SpotlightCard({ as = 'div', className = '', tilt = 6, children, ref: externalRef, ...rest }) {
  const ref = useRef(null)
  const setRef = (node) => {
    ref.current = node
    if (typeof externalRef === 'function') externalRef(node)
    else if (externalRef) externalRef.current = node
  }
  const reduce = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const springCfg = { stiffness: 200, damping: 20 }
  const rotateX = useSpring(useTransform(py, [0, 1], [tilt, -tilt]), springCfg)
  const rotateY = useSpring(useTransform(px, [0, 1], [-tilt, tilt]), springCfg)

  function handleMove(e) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
    if (!reduce && e.pointerType === 'mouse') {
      px.set(x)
      py.set(y)
    }
  }

  function handleLeave() {
    px.set(0.5)
    py.set(0.5)
  }

  const Tag = motion[as]
  return (
    <Tag
      ref={setRef}
      className={`spotlight ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={tilt && !reduce ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      variants={fadeUp}
      {...rest}
    >
      {children}
    </Tag>
  )
}
