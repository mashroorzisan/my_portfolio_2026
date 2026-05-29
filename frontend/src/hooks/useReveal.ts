import { useEffect, useRef } from 'react'

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); io.unobserve(el) } },
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return ref
}

export function useCounterReveal() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const target = parseInt(el.dataset.target || '0', 10)
    const suffix = el.dataset.suffix || ''

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.unobserve(el)
      const dur = 1800
      const start = performance.now()
      const step = (now: number) => {
        const p = Math.min((now - start) / dur, 1)
        const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
        el.textContent = Math.floor(ease * target).toLocaleString() + suffix
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, { threshold: 0.2 })

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return ref
}
