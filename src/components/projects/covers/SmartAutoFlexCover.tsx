import { Layer } from './Layer'
import { useSvgId } from './svgId'

// Business workflows connected through a central intelligence layer.
const nodes = [
  { label: 'WEB APPS', angle: -150 },
  { label: 'CHATBOTS', angle: -90 },
  { label: 'CALLS', angle: -30 },
  { label: 'BOOKINGS', angle: 30 },
  { label: 'WORKFLOWS', angle: 90 },
  { label: 'DASHBOARD', angle: 150 },
]
const center = { x: 400, y: 270 }

export function SmartAutoFlexCover() {
  const id = useSvgId('saf')

  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" role="presentation">
      <defs>
        <radialGradient id={id('core')} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#3a3f46" />
          <stop offset="1" stopColor="#0c0d10" />
        </radialGradient>
        <radialGradient id={id('glow')}>
          <stop offset="0" stopColor="#c9a45c" stopOpacity="0.22" />
          <stop offset="1" stopColor="#c9a45c" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="-800" y="-600" width="2400" height="1800" fill="#0c0d10" />
      <circle cx={center.x} cy={center.y} r="230" fill={`url(#${id('glow')})`} />

      <Layer depth={1}>
        <ellipse cx={center.x} cy={center.y} rx="262" ry="172" fill="none" stroke="rgba(232,223,204,0.08)" />
        <ellipse cx={center.x} cy={center.y} rx="150" ry="98" fill="none" stroke="rgba(232,223,204,0.08)" strokeDasharray="3 6" />
        {nodes.map((node, index) => {
          const radians = (node.angle * Math.PI) / 180
          const x = center.x + Math.cos(radians) * 262
          const y = center.y + Math.sin(radians) * 172
          const bend = center.x + Math.cos(radians) * 120
          return (
            <path
              key={node.label}
              d={`M${center.x} ${center.y} Q ${bend} ${y}, ${x} ${y}`}
              fill="none"
              stroke={index % 2 === 0 ? 'rgba(201,164,92,0.6)' : 'rgba(232,223,204,0.35)'}
              strokeWidth="1.2"
              className="cover-flow"
              style={{ animationDelay: `${index * -0.5}s` }}
            />
          )
        })}
      </Layer>

      <Layer depth={3}>
        {nodes.map((node) => {
          const radians = (node.angle * Math.PI) / 180
          const x = center.x + Math.cos(radians) * 262
          const y = center.y + Math.sin(radians) * 172
          return (
            <g key={node.label} transform={`translate(${x} ${y})`}>
              <rect x="-62" y="-18" width="124" height="36" rx="18" fill="#14161a" stroke="rgba(232,223,204,0.3)" />
              <circle cx="-44" cy="0" r="3.5" fill="#c9a45c" />
              <text x="6" y="4" textAnchor="middle" className="cover-mono" fill="#e8dfcc" fontSize="10">
                {node.label}
              </text>
            </g>
          )
        })}
      </Layer>

      <Layer depth={4}>
        <circle cx={center.x} cy={center.y} r="70" fill="none" stroke="rgba(232,223,204,0.25)" />
        <circle cx={center.x} cy={center.y} r="52" fill={`url(#${id('core')})`} stroke="rgba(232,223,204,0.4)" />
        <circle cx={center.x} cy={center.y} r="9" fill="#c9a45c" className="cover-pulse" />
        <text x={center.x} y={center.y + 96} textAnchor="middle" className="cover-mono" fill="#9c907b" fontSize="10">
          INTELLIGENCE LAYER
        </text>
      </Layer>

      <Layer depth={2}>
        <line x1="120" x2="680" y1="530" y2="530" stroke="rgba(232,223,204,0.2)" />
        {['01 UNDERSTAND', '02 AUTOMATE', '03 SCALE'].map((label, index) => {
          const x = 120 + index * 280
          return (
            <g key={label}>
              <circle cx={x} cy="530" r={index === 1 ? 6 : 4} fill={index === 1 ? '#c9a45c' : '#0c0d10'} stroke={index === 1 ? 'none' : '#e8dfcc'} />
              <text x={x} y="560" textAnchor="middle" className="cover-mono" fill={index === 1 ? '#e8dfcc' : '#9c907b'} fontSize="11">
                {label}
              </text>
            </g>
          )
        })}
        <rect x="660" y="40" width="100" height="26" rx="13" fill="none" stroke="rgba(232,223,204,0.35)" />
        <text x="710" y="57" textAnchor="middle" className="cover-mono" fill="#9c907b" fontSize="10">
          CONCEPT
        </text>
      </Layer>
    </svg>
  )
}
