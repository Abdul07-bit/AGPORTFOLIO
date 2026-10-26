import { Layer } from './Layer'
import { useSvgId } from './svgId'

// A conversation becoming a structured ticket — an illustration, not a screenshot.
export function TicketingCover() {
  const id = useSvgId('tk')

  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" role="presentation">
      <defs>
        <linearGradient id={id('bg')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#12151d" />
          <stop offset="1" stopColor="#0b0c11" />
        </linearGradient>
        <radialGradient id={id('glow')}>
          <stop offset="0" stopColor="#8fa8ff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#8fa8ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="-800" y="-600" width="2400" height="1800" fill={`url(#${id('bg')})`} />
      <circle cx="260" cy="300" r="260" fill={`url(#${id('glow')})`} />

      {/* Chat window */}
      <Layer depth={2}>
        <rect x="64" y="70" width="372" height="440" rx="22" fill="#151821" stroke="rgba(232,223,204,0.16)" />
        <circle cx="96" cy="104" r="8" fill="#8fa8ff" />
        <text x="114" y="108" className="cover-mono" fill="#e8dfcc" fontSize="11">
          SUPPORT ASSISTANT
        </text>
        <circle cx="404" cy="104" r="4" fill="#3ddc84" />
        <line x1="64" x2="436" y1="132" y2="132" stroke="rgba(232,223,204,0.08)" />

        {/* user */}
        <rect x="200" y="158" width="210" height="58" rx="16" fill="#2a2f3b" />
        <rect x="218" y="176" width="150" height="8" rx="3" fill="rgba(232,223,204,0.55)" />
        <rect x="218" y="192" width="104" height="8" rx="3" fill="rgba(232,223,204,0.35)" />
        {/* assistant */}
        <rect x="90" y="238" width="236" height="76" rx="16" fill="rgba(143,168,255,0.14)" stroke="rgba(143,168,255,0.35)" />
        <rect x="108" y="256" width="170" height="8" rx="3" fill="rgba(232,223,204,0.55)" />
        <rect x="108" y="272" width="190" height="8" rx="3" fill="rgba(232,223,204,0.35)" />
        <rect x="108" y="288" width="120" height="8" rx="3" fill="rgba(232,223,204,0.35)" />
        {/* user */}
        <rect x="236" y="336" width="174" height="44" rx="16" fill="#2a2f3b" />
        <rect x="254" y="354" width="120" height="8" rx="3" fill="rgba(232,223,204,0.5)" />
        {/* typing */}
        <rect x="90" y="402" width="76" height="36" rx="18" fill="rgba(143,168,255,0.14)" />
        {[0, 1, 2].map((dot) => (
          <circle key={dot} cx={112 + dot * 16} cy="420" r="4" fill="#8fa8ff" className="cover-typing" style={{ animationDelay: `${dot * 0.18}s` }} />
        ))}
        <rect x="88" y="462" width="324" height="30" rx="15" fill="none" stroke="rgba(232,223,204,0.16)" />
      </Layer>

      {/* Connector */}
      <Layer depth={1}>
        <path d="M436 290 C 480 290, 470 220, 516 220" fill="none" stroke="rgba(143,168,255,0.6)" strokeDasharray="4 6" className="cover-flow" />
        <circle cx="516" cy="220" r="4" fill="#8fa8ff" />
      </Layer>

      {/* Ticket */}
      <Layer depth={4}>
        <g transform="translate(516 150)">
          <rect width="236" height="250" rx="18" fill="#1a1e28" stroke="rgba(232,223,204,0.22)" />
          <text x="22" y="36" className="cover-mono" fill="#9c907b" fontSize="10">
            TICKET
          </text>
          <rect x="150" y="20" width="64" height="24" rx="12" fill="rgba(143,168,255,0.18)" stroke="#8fa8ff" />
          <text x="182" y="36" textAnchor="middle" className="cover-mono" fill="#8fa8ff" fontSize="10">
            NEW
          </text>
          {['ISSUE', 'CONTEXT', 'PRIORITY', 'OWNER'].map((label, index) => {
            const y = 76 + index * 42
            return (
              <g key={label}>
                <text x="22" y={y} className="cover-mono" fill="#9c907b" fontSize="9">
                  {label}
                </text>
                <rect x="22" y={y + 8} width={index === 2 ? 70 : 150 - index * 18} height="9" rx="3" fill={index === 2 ? 'rgba(201,164,92,0.6)' : 'rgba(232,223,204,0.3)'} />
              </g>
            )
          })}
        </g>
      </Layer>

      <Layer depth={1.5}>
        <text x="64" y="556" className="cover-mono" fill="#9c907b" fontSize="10">
          DESCRIBE → CLARIFY → CAPTURE → HAND OFF
        </text>
        <rect x="644" y="40" width="108" height="26" rx="13" fill="none" stroke="rgba(232,223,204,0.35)" />
        <text x="698" y="57" textAnchor="middle" className="cover-mono" fill="#9c907b" fontSize="10">
          PROTOTYPE
        </text>
      </Layer>
    </svg>
  )
}
