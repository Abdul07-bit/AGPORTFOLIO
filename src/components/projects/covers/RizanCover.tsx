import { Layer } from './Layer'
import { useSvgId } from './svgId'

// Polished bullion on warm black, a live spot-price line, and the ordering journey.
const spark = 'M56 150 L110 142 L150 146 L196 130 L240 136 L290 118 L330 124 L372 108 L420 116 L470 98 L520 104 L566 88 L612 96 L660 80 L700 84 L744 70'

export function RizanCover() {
  const id = useSvgId('rz')
  const url = (name: string) => `url(#${id(name)})`

  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" role="presentation">
      <defs>
        <radialGradient id={id('bg')} cx="50%" cy="58%" r="70%">
          <stop offset="0" stopColor="#2b2216" />
          <stop offset="0.55" stopColor="#17140f" />
          <stop offset="1" stopColor="#0e0d0b" />
        </radialGradient>
        <linearGradient id={id('gold')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7a5a24" />
          <stop offset="0.22" stopColor="#e9cf8e" />
          <stop offset="0.4" stopColor="#b48a3c" />
          <stop offset="0.62" stopColor="#f6e4b0" />
          <stop offset="0.82" stopColor="#a37b34" />
          <stop offset="1" stopColor="#5f4519" />
        </linearGradient>
        <linearGradient id={id('gold-face')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3dea6" />
          <stop offset="0.5" stopColor="#c99f4f" />
          <stop offset="1" stopColor="#8d6a2b" />
        </linearGradient>
        <linearGradient id={id('silver')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6d7279" />
          <stop offset="0.3" stopColor="#eef0f2" />
          <stop offset="0.55" stopColor="#9aa0a7" />
          <stop offset="0.8" stopColor="#e3e6e9" />
          <stop offset="1" stopColor="#5c6168" />
        </linearGradient>
        <linearGradient id={id('spark')} x1="0" x2="1">
          <stop offset="0" stopColor="#d9b26f" stopOpacity="0" />
          <stop offset="1" stopColor="#d9b26f" />
        </linearGradient>
        <radialGradient id={id('shadow')}>
          <stop offset="0" stopColor="#000" stopOpacity="0.6" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="-800" y="-600" width="2400" height="1800" fill={url('bg')} />

      {/* Spot price line */}
      <Layer depth={1}>
        <text x="56" y="62" className="cover-mono" fill="#a8977a" fontSize="11">
          SPOT · PER GRAM
        </text>
        <text x="744" y="62" textAnchor="end" className="cover-mono" fill="#d9b26f" fontSize="11">
          S$ · LIVE
        </text>
        <line x1="56" x2="744" y1="170" y2="170" stroke="rgba(217,178,111,0.12)" />
        <path d={spark} fill="none" stroke={url('spark')} strokeWidth="1.6" />
        <circle cx="744" cy="70" r="4" fill="#d9b26f" className="cover-pulse" />
      </Layer>

      {/* Silver bar behind */}
      <Layer depth={2}>
        <g transform="translate(470 222) rotate(9)">
          <rect width="210" height="112" rx="10" fill={url('silver')} />
          <rect x="10" y="10" width="190" height="92" rx="6" fill="none" stroke="rgba(255,255,255,0.45)" />
          <text x="105" y="62" textAnchor="middle" className="cover-display" fill="rgba(40,44,50,0.55)" fontSize="15" letterSpacing="4">
            FINE SILVER
          </text>
          <text x="105" y="82" textAnchor="middle" className="cover-mono" fill="rgba(40,44,50,0.5)" fontSize="10">
            999
          </text>
        </g>
      </Layer>

      {/* Gold bar */}
      <Layer depth={4}>
        <ellipse cx="380" cy="468" rx="210" ry="22" fill={url('shadow')} />
        <g transform="translate(220 260) rotate(-7)">
          <rect width="320" height="176" rx="14" fill={url('gold')} />
          <rect x="14" y="14" width="292" height="148" rx="9" fill={url('gold-face')} />
          <rect x="14" y="14" width="292" height="148" rx="9" fill="none" stroke="rgba(255,244,214,0.6)" />
          <text x="160" y="76" textAnchor="middle" className="cover-display" fill="rgba(74,52,16,0.75)" fontSize="22" letterSpacing="7">
            FINE GOLD
          </text>
          <line x1="96" x2="224" y1="94" y2="94" stroke="rgba(74,52,16,0.35)" />
          <text x="160" y="124" textAnchor="middle" className="cover-display" fill="rgba(74,52,16,0.75)" fontSize="26" letterSpacing="3">
            999.9
          </text>
          <path d="M14 14 L120 14 L60 162 L14 162 Z" fill="rgba(255,255,255,0.14)" className="cover-sheen" />
        </g>
      </Layer>

      {/* Ordering journey */}
      <Layer depth={1}>
        <line x1="96" x2="704" y1="540" y2="540" stroke="rgba(217,178,111,0.25)" />
        {['BROWSE', 'PRICE', 'CART', 'WHATSAPP'].map((label, index) => {
          const x = 96 + index * 202.7
          return (
            <g key={label}>
              <circle cx={x} cy="540" r={index === 3 ? 5 : 3.5} fill={index === 3 ? '#d9b26f' : '#0e0d0b'} stroke="#d9b26f" />
              <text x={x} y="568" textAnchor="middle" className="cover-mono" fill="#a8977a" fontSize="10">
                {label}
              </text>
            </g>
          )
        })}
      </Layer>
    </svg>
  )
}
