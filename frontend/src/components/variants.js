export const ease = [0.22, 1, 0.36, 1]

// Variantes compartidas: contenedor que escalona a sus hijos y un hijo que sube con fade
export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
})

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}
