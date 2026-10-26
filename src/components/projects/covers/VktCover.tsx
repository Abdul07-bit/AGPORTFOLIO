import { Layer } from './Layer'
import { useSvgId } from './svgId'

// A bright, clean product grid with sky-blue accents — a storefront composition.
const products = ['candle', 'vase', 'gift', 'frame', 'pendant', 'star'] as const

function Glyph({ kind }: { kind: (typeof products)[number] }) {
  const stroke = { fill: 'none', stroke: '#1d6fae', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (kind) {
    case 'candle':
      return (
        <g>
          <rect x="-12" y="-6" width="24" height="40" rx="3" fill="#ffffff" stroke="#1d6fae" strokeWidth="2" />
          <path d="M0 -10 C 6 -18, 2 -26, 0 -30 C -2 -26, -6 -18, 0 -10 Z" fill="#3ba3f2" />
        </g>
      )
    case 'vase':
      return <path d="M-10 -28 h20 v6 c0 6 12 10 12 26 c0 14 -8 26 -22 26 c-14 0 -22 -12 -22 -26 c0 -16 12 -20 12 -26 z" {...stroke} />
    case 'gift':
      return (
        <g {...stroke}>
          <rect x="-22" y="-12" width="44" height="38" rx="3" />
          <path d="M-22 0 h44 M0 -12 v38 M0 -12 c-8 -14 -22 -10 -14 0 M0 -12 c8 -14 22 -10 14 0" />
        </g>
      )
    case 'frame':
      return (
        <g {...stroke}>
          <rect x="-22" y="-26" width="44" height="54" rx="2" />
          <rect x="-14" y="-18" width="28" height="38" rx="1" fill="#e3f2fd" />
        </g>
      )
    case 'pendant':
      return (
        <g {...stroke}>
          <path d="M-18 -30 Q 0 -6 18 -30" />
          <path d="M0 -16 v34 M-10 -4 h20" strokeWidth="4" />
        </g>
      )
    case 'star':
      return <path d="M0 -28 L7 -8 L28 -8 L11 4 L17 26 L0 13 L-17 26 L-11 4 L-28 -8 L-7 -8 Z" {...stroke} />
  }
}

export function VktCover() {
  const id = useSvgId('vkt')

  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" role="presentation">
      <defs>
        <filter id={id('shadow')} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#0f2233" floodOpacity="0.1" />
        </filter>
        <linearGradient id={id('sky')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eaf5fe" />
          <stop offset="1" stopColor="#d6ecfc" />
        </linearGradient>
      </defs>

      <rect x="-800" y="-600" width="2400" height="1800" fill="#f5f9fc" />

      <Layer depth={0.5}>
        <circle cx="690" cy="90" r="150" fill="#e3f2fd" />
        <circle cx="70" cy="560" r="120" fill="#eaf5fe" />
      </Layer>

      {/* Header */}
      <Layer depth={1}>
        <rect x="40" y="36" width="720" height="56" rx="28" fill="#ffffff" filter={`url(#${id('shadow')})`} />
        <text x="76" y="71" className="cover-display" fill="#0f2233" fontSize="20" fontWeight="600" letterSpacing="2">
          VKT
        </text>
        {['Shop', 'Collections', 'Saved'].map((label, index) => (
          <text key={label} x={300 + index * 96} y="69" className="cover-body" fill="#4c6275" fontSize="14">
            {label}
          </text>
        ))}
        <circle cx="706" cy="64" r="16" fill="#3ba3f2" />
        <path d="M699 60 h14 l-2 10 h-10 z M702 60 c0 -6 8 -6 8 0" fill="none" stroke="#ffffff" strokeWidth="1.6" />
        <circle cx="718" cy="52" r="7" fill="#0f2233" />
      </Layer>

      {/* Category chips */}
      <Layer depth={1.5}>
        {['Candles', 'Décor', 'Gifts', 'Wall art'].map((label, index) => (
          <g key={label} transform={`translate(${56 + index * 112} 120)`}>
            <rect width="100" height="30" rx="15" fill={index === 0 ? '#3ba3f2' : '#ffffff'} stroke={index === 0 ? 'none' : '#cfe3f2'} />
            <text x="50" y="20" textAnchor="middle" className="cover-body" fontSize="12" fill={index === 0 ? '#ffffff' : '#4c6275'}>
              {label}
            </text>
          </g>
        ))}
      </Layer>

      {/* Product grid */}
      <Layer depth={3}>
        {products.map((kind, index) => {
          const column = index % 3
          const row = Math.floor(index / 3)
          const x = 56 + column * 236
          const y = 172 + row * 206
          return (
            <g key={kind} transform={`translate(${x} ${y})`}>
              <rect width="216" height="188" rx="16" fill="#ffffff" filter={`url(#${id('shadow')})`} />
              <rect x="10" y="10" width="196" height="112" rx="10" fill={`url(#${id('sky')})`} />
              <g transform="translate(108 66)">
                <Glyph kind={kind} />
              </g>
              <path d="M182 26 c-4 -6 -12 -2 -8 4 l8 8 l8 -8 c4 -6 -4 -10 -8 -4 z" fill={index === 1 ? '#3ba3f2' : 'none'} stroke="#3ba3f2" strokeWidth="1.6" />
              <rect x="14" y="136" width={110 - column * 14} height="9" rx="3" fill="#0f2233" opacity="0.75" />
              <rect x="14" y="154" width="54" height="8" rx="3" fill="#3ba3f2" opacity="0.7" />
              {index === 4 && (
                <g className="cover-pulse-soft">
                  <rect x="118" y="146" width="86" height="28" rx="14" fill="#3ba3f2" />
                  <text x="161" y="165" textAnchor="middle" className="cover-body" fontSize="11" fill="#ffffff" fontWeight="600">
                    Add to cart
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </Layer>
    </svg>
  )
}
