import { Layer } from './Layer'
import { useSvgId } from './svgId'

// One account opening three isolated businesses: dine, stay and bill.
const ACCENT = '#e0a458'
const INK = '#f1e7d6'
const modules = [
  { name: 'DINE', detail: 'RESTAURANT', x: 150 },
  { name: 'STAY', detail: 'HOTEL', x: 400 },
  { name: 'BILL', detail: 'RETAIL', x: 650 },
]

export function SafFlowCover() {
  const id = useSvgId('sf')

  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" role="presentation">
      <defs>
        <radialGradient id={id('bg')} cx="50%" cy="20%" r="80%">
          <stop offset="0" stopColor="#241b12" />
          <stop offset="1" stopColor="#0e0c0a" />
        </radialGradient>
        <radialGradient id={id('glow')}>
          <stop offset="0" stopColor={ACCENT} stopOpacity="0.28" />
          <stop offset="1" stopColor={ACCENT} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="-800" y="-600" width="2400" height="1800" fill={`url(#${id('bg')})`} />
      <circle cx="400" cy="120" r="180" fill={`url(#${id('glow')})`} />

      {/* Tenant walls: each business sits in its own isolated lane */}
      <Layer depth={1}>
        {[275, 525].map((x) => (
          <line key={x} x1={x} x2={x} y1="230" y2="560" stroke="rgba(241,231,214,0.14)" strokeDasharray="4 8" />
        ))}
        <text x="400" y="580" textAnchor="middle" className="cover-mono" fill="#6f6656" fontSize="10">
          PER-BUSINESS DATA ISOLATION
        </text>
      </Layer>

      {/* Flows from the single sign-in to each module */}
      <Layer depth={2}>
        {modules.map((module, index) => (
          <path
            key={module.name}
            d={`M400 150 C 400 210, ${module.x} 200, ${module.x} 270`}
            fill="none"
            stroke={index === 1 ? ACCENT : 'rgba(241,231,214,0.4)'}
            strokeWidth="1.3"
            className="cover-flow"
            style={{ animationDelay: `${index * -0.6}s` }}
          />
        ))}
      </Layer>

      {/* Module cards */}
      <Layer depth={3}>
        {modules.map((module, index) => (
          <g key={module.name} transform={`translate(${module.x - 95} 270)`}>
            <rect width="190" height="230" rx="14" fill="#17130f" stroke={index === 1 ? ACCENT : 'rgba(241,231,214,0.3)'} />
            <text x="20" y="38" className="cover-mono" fill="#9c907b" fontSize="10">
              SAF
            </text>
            <text x="20" y="70" className="cover-display" fill={INK} fontSize="26" letterSpacing="3">
              {module.name}
            </text>
            <text x="20" y="92" className="cover-mono" fill={ACCENT} fontSize="10">
              {module.detail}
            </text>
            {/* Receipt lines */}
            {[0, 1, 2, 3].map((line) => (
              <g key={line}>
                <rect x="20" y={122 + line * 20} width={line === 3 ? 60 : 96} height="5" rx="2" fill="rgba(241,231,214,0.2)" />
                <rect x="140" y={122 + line * 20} width="30" height="5" rx="2" fill="rgba(241,231,214,0.3)" />
              </g>
            ))}
            <line x1="20" x2="170" y1="206" y2="206" stroke="rgba(241,231,214,0.2)" />
            <rect x="130" y="212" width="40" height="6" rx="3" fill={ACCENT} opacity="0.8" className="cover-pulse-soft" />
          </g>
        ))}
      </Layer>

      {/* One account */}
      <Layer depth={4}>
        <g transform="translate(400 120)">
          <rect x="-110" y="-30" width="220" height="60" rx="30" fill="#1b1611" stroke={INK} strokeOpacity="0.55" />
          <circle cx="-78" cy="0" r="12" fill="none" stroke={ACCENT} strokeWidth="1.5" />
          <circle cx="-78" cy="0" r="4" fill={ACCENT} className="cover-pulse" />
          <text x="14" y="5" textAnchor="middle" className="cover-mono" fill={INK} fontSize="12">
            ONE ACCOUNT
          </text>
        </g>
        {/* Installed on every device */}
        <g transform="translate(650 60)" opacity="0.8">
          <rect width="22" height="38" rx="4" fill="none" stroke="rgba(241,231,214,0.45)" />
          <rect x="32" y="6" width="52" height="32" rx="3" fill="none" stroke="rgba(241,231,214,0.45)" />
          <text x="0" y="58" className="cover-mono" fill="#6f6656" fontSize="9">
            INSTALLABLE PWA
          </text>
        </g>
      </Layer>
    </svg>
  )
}
