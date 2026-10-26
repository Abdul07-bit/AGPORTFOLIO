import { useEffect, useState, type RefObject } from 'react'

/** True while the element intersects the viewport (with an optional margin). */
export function useInView(ref: RefObject<Element | null>, rootMargin = '0px') {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, rootMargin])
  return inView
}
