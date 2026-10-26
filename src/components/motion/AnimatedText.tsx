import type { ReactNode } from 'react'

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'

interface AnimatedTextProps {
  as?: Tag
  /** Art-directed lines. Each line animates through its own mask. */
  lines: ReactNode[]
  className?: string
  lineClassName?: (index: number) => string | undefined
  id?: string
  /** Adds data-reveal="lines" so the line reveal runs on scroll. */
  reveal?: boolean
  revealDelay?: number
}

/**
 * Renders text as masked lines for clipped reveals. A space separates lines
 * in the DOM so the text reads naturally for screen readers and search engines.
 */
export function AnimatedText({
  as: Component = 'span',
  lines,
  className,
  lineClassName,
  id,
  reveal = false,
  revealDelay,
}: AnimatedTextProps) {
  return (
    <Component
      id={id}
      className={className}
      data-reveal={reveal ? 'lines' : undefined}
      data-reveal-delay={revealDelay}
    >
      {lines.map((line, index) => (
        <span key={index}>
          <span className={['line-mask', lineClassName?.(index)].filter(Boolean).join(' ')}>
            <span className="line-mask__inner">{line}</span>
          </span>{' '}
        </span>
      ))}
    </Component>
  )
}
