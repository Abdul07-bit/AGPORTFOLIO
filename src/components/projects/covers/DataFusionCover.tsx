import { Layer } from './Layer'
import { useSvgId } from './svgId'

// Raw rows → validation gate → structured, checked table. Red cells are errors.
const rows = [
  [70, 46, 58, 30],
  [52, 64, 40, 50],
  [80, 36, 52, 34],
  [44, 58, 70, 28],
  [66, 42, 48, 46],
  [58, 60, 36, 52],
  [74, 40, 56, 30],
]
const errors = new Set(['1-2', '3-0', '5-3'])
const checks = [true, true, false, true, true, false]

export function DataFusionCover() {
  const id = useSvgId('df')
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" role="presentation">
      <defs>
        <pattern id={id('grid')} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="rgba(232,223,204,0.05)" />
        </pattern>
        <linearGradient id={id('flow')} x1="0" x2="1">
          <stop offset="0" stopColor="#e8dfcc" stopOpacity="0.05" />
          <stop offset="1" stopColor="#5ce1c6" stopOpacity="0.6" />
        </linearGradient>
        <radialGradient id={id('glow')} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#5ce1c6" stopOpacity="0.18" />
          <stop offset="1" stopColor="#5ce1c6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="-800" y="-600" width="2400" height="1800" fill="#0b0f12" />
      <rect x="-800" y="-600" width="2400" height="1800" fill={`url(#${id('grid')})`} />
      <circle cx="400" cy="300" r="260" fill={`url(#${id('glow')})`} />

      {/* Sources */}
      <Layer depth={1}>
        <text x="48" y="74" className="cover-mono" fill="#9c907b">
          SOURCES
        </text>
        <g className="cover-mono" fontSize="11">
          <rect x="48" y="92" width="64" height="26" rx="13" fill="none" stroke="rgba(232,223,204,0.3)" />
          <text x="80" y="109" textAnchor="middle" fill="#e8dfcc">
            CSV
          </text>
          <rect x="120" y="92" width="88" height="26" rx="13" fill="none" stroke="rgba(232,223,204,0.3)" />
          <text x="164" y="109" textAnchor="middle" fill="#e8dfcc">
            SHEETS
          </text>
        </g>
        {rows.map((cells, rowIndex) => {
          let x = 48
          const y = 168 + rowIndex * 46
          return (
            <g key={rowIndex}>
              {cells.map((width, cellIndex) => {
                const isError = errors.has(`${rowIndex}-${cellIndex}`)
                const cell = (
                  <rect
                    key={cellIndex}
                    x={x}
                    y={y}
                    width={width - 6}
                    height="22"
                    rx="3"
                    fill={isError ? 'rgba(201,164,92,0.55)' : 'rgba(232,223,204,0.09)'}
                    className={isError ? 'cover-blink' : undefined}
                  />
                )
                x += width
                return cell
              })}
            </g>
          )
        })}
      </Layer>

      {/* Flows into the gate */}
      <Layer depth={2}>
        {rows.map((_, index) => {
          const y = 179 + index * 46
          return (
            <path
              key={index}
              d={`M300 ${y} C 350 ${y}, 350 300, 392 300`}
              fill="none"
              stroke={`url(#${id('flow')})`}
              strokeWidth="1.2"
              className="cover-flow"
              style={{ animationDelay: `${index * -0.35}s` }}
            />
          )
        })}
        {checks.map((_, index) => {
          const y = 206 + index * 40
          return <path key={index} d={`M408 300 C 450 300, 450 ${y}, 500 ${y}`} fill="none" stroke="rgba(92,225,198,0.35)" strokeWidth="1" />
        })}
      </Layer>

      {/* Validation gate */}
      <Layer depth={3}>
        <rect x="388" y="140" width="24" height="320" rx="12" fill="#0b0f12" stroke="rgba(232,223,204,0.55)" />
        <rect x="392" y="150" width="16" height="2" fill="#c9a45c" className="cover-scan" />
        <text x="400" y="124" textAnchor="middle" className="cover-mono" fill="#e8dfcc">
          VALIDATE
        </text>
      </Layer>

      {/* Structured output */}
      <Layer depth={2}>
        <rect x="500" y="160" width="252" height="290" rx="14" fill="rgba(255,255,255,0.03)" stroke="rgba(232,223,204,0.18)" />
        <text x="520" y="186" className="cover-mono" fill="#9c907b" fontSize="10">
          FIELD
        </text>
        <text x="732" y="186" textAnchor="end" className="cover-mono" fill="#9c907b" fontSize="10">
          QA
        </text>
        {checks.map((ok, index) => {
          const y = 206 + index * 40
          return (
            <g key={index}>
              <line x1="516" x2="736" y1={y - 12} y2={y - 12} stroke="rgba(232,223,204,0.07)" />
              <rect x="520" y={y - 4} width={80 + ((index * 37) % 70)} height="9" rx="2" fill="rgba(232,223,204,0.22)" />
              {ok ? (
                <path d={`M716 ${y} l5 5 l10 -11`} fill="none" stroke="#5ce1c6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <circle cx="724" cy={y + 1} r="6" fill="none" stroke="#c9a45c" strokeWidth="2" />
              )}
            </g>
          )
        })}
      </Layer>

      {/* Confidence + QA report */}
      <Layer depth={4}>
        <g transform="translate(676 86)">
          <circle r="34" fill="#0b0f12" stroke="rgba(232,223,204,0.15)" strokeWidth="5" />
          <circle r="34" fill="none" stroke="#5ce1c6" strokeWidth="5" strokeDasharray="168 214" strokeLinecap="round" transform="rotate(-90)" />
          <circle r="4" fill="#e8dfcc" />
        </g>
        <text x="620" y="146" className="cover-mono" fill="#9c907b" fontSize="10">
          CONFIDENCE
        </text>
        <rect x="560" y="76" width="66" height="22" rx="11" fill="none" stroke="rgba(92,225,198,0.6)" />
        <text x="593" y="91" textAnchor="middle" className="cover-mono" fill="#5ce1c6" fontSize="10">
          QA
        </text>
      </Layer>

      {/* Chat explanation */}
      <Layer depth={5}>
        <g transform="translate(520 474)">
          <rect width="214" height="74" rx="14" fill="#151b20" stroke="rgba(232,223,204,0.22)" />
          <circle cx="22" cy="24" r="7" fill="#5ce1c6" />
          <rect x="38" y="19" width="130" height="8" rx="2" fill="rgba(232,223,204,0.4)" />
          <rect x="22" y="42" width="170" height="7" rx="2" fill="rgba(232,223,204,0.18)" />
          <rect x="22" y="56" width="110" height="7" rx="2" fill="rgba(232,223,204,0.18)" />
        </g>
      </Layer>
    </svg>
  )
}
