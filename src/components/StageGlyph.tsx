// Small technical line illustrations for each stage of the system map.
const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const glyphs = [
  // Idea — a signal radiating from a point
  <g key="idea" {...common}>
    <circle cx="32" cy="32" r="5" fill="currentColor" />
    <circle cx="32" cy="32" r="13" strokeDasharray="2 4" />
    <path d="M32 6v8M32 50v8M6 32h8M50 32h8M13.6 13.6l5.6 5.6M44.8 44.8l5.6 5.6M13.6 50.4l5.6-5.6M44.8 19.2l5.6-5.6" />
  </g>,
  // Design — wireframe
  <g key="design" {...common}>
    <rect x="8" y="10" width="48" height="44" rx="3" />
    <path d="M8 20h48M20 20v34M26 30h22M26 38h14M26 46h18" />
  </g>,
  // Build — code blocks
  <g key="build" {...common}>
    <path d="M22 18L10 32l12 14M42 18l12 14-12 14M36 12l-8 40" />
  </g>,
  // Integrate — connected nodes
  <g key="integrate" {...common}>
    <circle cx="14" cy="18" r="6" />
    <circle cx="50" cy="46" r="6" />
    <circle cx="50" cy="16" r="4" />
    <path d="M20 18c14 0 10 28 24 28M20 20l26-3" />
  </g>,
  // Deploy — container shipping upward
  <g key="deploy" {...common}>
    <path d="M10 30l22-10 22 10-22 10z" />
    <path d="M10 30v14l22 10 22-10V30M32 40v14" />
    <path d="M32 4v12M26 10l6-6 6 6" />
  </g>,
  // Improve — iteration loop
  <g key="improve" {...common}>
    <path d="M50 26a19 19 0 1 0 2 12" />
    <path d="M52 16v10H42" />
    <circle cx="32" cy="32" r="3" fill="currentColor" />
  </g>,
]

export function StageGlyph({ index, className }: { index: number; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" className={className} aria-hidden="true">
      {glyphs[index % glyphs.length]}
    </svg>
  )
}
