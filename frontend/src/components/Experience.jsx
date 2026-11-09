import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { experience } from '../data'
import { Reveal } from './motion'

export default function Experience() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 25 })

  return (
    <section id="experience">
      <Reveal>
        <div className="section-tag">// 02 — trayectoria</div>
        <h2 className="section-title">Experiencia</h2>
        <p className="section-sub">
          Más de 8 años construyendo software en el sector financiero y de comercio exterior.
        </p>
      </Reveal>
      <div className="timeline" ref={ref}>
        <div className="timeline-track" aria-hidden="true">
          <motion.div className="timeline-progress" style={{ scaleY }} />
        </div>
        {experience.map((job) => (
          <motion.article
            className="timeline-item"
            key={job.company}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="timeline-date">{job.period}</div>
            <div className="timeline-body">
              <motion.span
                className="timeline-dot"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
              />
              <h3 className="timeline-role">{job.role}</h3>
              <div className="timeline-company">{job.company}</div>
              <ul className="timeline-list">
                {job.items.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.06 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
