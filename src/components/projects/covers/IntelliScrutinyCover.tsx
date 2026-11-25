import { Layer } from './Layer'
import { useSvgId } from './svgId'

// A document passes through three agents in a stateful graph, then waits for a reviewer.
const ACCENT = '#7fb89a'
const INK = '#e8dfcc'
const agents = [
  { label: 'VALIDATE', x: 300 },
  { label: 'VERIFY', x: 450 },
  { label: 'COMPLY', x: 600 },
]

export function IntelliScrutinyCover() {
  const id = useSvgId('is')

  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" role="presentation">
      <defs>
        <radialGradient id={id('bg')} cx="55%" cy="40%" r="75%">
          <stop offset="0" stopColor="#15201c" />
          <stop offset="1" stopColor="#0a0f0d" />
        </radialGradient>
        <linearGradient id={id('paper')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eae2cf" />
          <stop offset="1" stopColor="#cfc4aa" />
        </linearGradient>
        <linearGradient id={id('scan')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ACCENT} stopOpacity="0" />
          <stop offset="1" stopColor={ACCENT} stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <rect x="-800" y="-600" width="2400" height="1800" fill={`url(#${id('bg')})`} />

      {/* Two retrieval indexes */}
      <Layer depth={1}>
        {['VECTOR', 'FULL-TEXT'].map((label, index) => (
          <g key={label} transform={`translate(${330 + index * 190} 420)`}>
            <ellipse cx="60" cy="0" rx="60" ry="14" fill="none" stroke="rgba(232,223,204,0.3)" />
            <path d="M0 0 v54 a60 14 0 0 0 120 0 v-54" fill="none" stroke="rgba(232,223,204,0.3)" />
            <ellipse cx="60" cy="27" rx="60" ry="14" fill="none" stroke="rgba(232,223,204,0.12)" />
            <text x="60" y="92" textAnchor="middle" className="cover-mono" fill="#9c907b" fontSize="10">
              {label}
            </text>
          </g>
        ))}
        <text x="485" y="540" textAnchor="middle" className="cover-mono" fill="#6f6656" fontSize="10">
          HYBRID RETRIEVAL · PGVECTOR
        </text>
      </Layer>

      {/* Scanned submission with OCR sweep */}
      <Layer depth={2}>
        <g transform="translate(70 150) rotate(-4)">
          <rect width="150" height="200" rx="5" fill={`url(#${id('paper')})`} />
          {Array.from({ length: 9 }, (_, line) => (
            <rect key={line} x="18" y={30 + line * 17} width={line % 3 === 2 ? 70 : 114} height="5" rx="2" fill="#7a6e5a" opacity="0.5" />
          ))}
          <rect x="0" y="-48" width="150" height="48" fill={`url(#${id('scan')})`} className="cover-scan" />
        </g>
        <text x="145" y="390" textAnchor="middle" className="cover-mono" fill="#9c907b" fontSize="10">
          OCR
        </text>
      </Layer>

      {/* Agent graph */}
      <Layer depth={3}>
        <path d="M232 250 H 690" fill="none" stroke={ACCENT} strokeOpacity="0.6" strokeWidth="1.3" className="cover-flow" />
        {agents.map((agent) => (
          <path
            key={`${agent.label}-q`}
            d={`M${agent.x} 278 V 405`}
            fill="none"
            stroke="rgba(232,223,204,0.25)"
            strokeDasharray="2 5"
          />
        ))}
        {agents.map((agent, index) => (
          <g key={agent.label} transform={`translate(${agent.x} 250)`}>
            <circle r="30" fill="#101815" stroke={index === 1 ? ACCENT : 'rgba(232,223,204,0.4)'} strokeWidth="1.3" />
            <circle r="4" fill={ACCENT} className={index === 1 ? 'cover-pulse' : undefined} />
            <text y="-44" textAnchor="middle" className="cover-mono" fill={INK} fontSize="10">
              {agent.label}
            </text>
          </g>
        ))}
        <text x="450" y="160" textAnchor="middle" className="cover-mono" fill="#6f6656" fontSize="10">
          STATEFUL GRAPH · VERSIONED RULES
        </text>
      </Layer>

      {/* Human reviewer gate */}
      <Layer depth={4}>
        <g transform="translate(705 250)">
          <rect x="-30" y="-30" width="60" height="60" rx="8" fill="#101815" stroke={INK} strokeOpacity="0.6" />
          <circle cx="0" cy="-8" r="8" fill="none" stroke={INK} strokeWidth="1.4" />
          <path d="M-14 16 a14 12 0 0 1 28 0" fill="none" stroke={INK} strokeWidth="1.4" />
          <text y="54" textAnchor="middle" className="cover-mono" fill={ACCENT} fontSize="10">
            CONFIRM
          </text>
        </g>
        {/* Hash-chained audit trail */}
        <g transform="translate(560 70)">
          {[0, 1, 2, 3].map((block) => (
            <g key={block} transform={`translate(${block * 42} 0)`}>
              <rect width="30" height="18" rx="3" fill="none" stroke="rgba(232,223,204,0.35)" className={block === 3 ? 'cover-blink' : undefined} />
              {block < 3 && <line x1="30" x2="42" y1="9" y2="9" stroke="rgba(232,223,204,0.35)" />}
            </g>
          ))}
          <text x="0" y="38" className="cover-mono" fill="#6f6656" fontSize="9">
            AUDIT CHAIN
          </text>
        </g>
      </Layer>
    </svg>
  )
}
