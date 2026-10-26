import { Layer } from './Layer'
import { useSvgId } from './svgId'

// Case documents → specialised agents → a cited answer that waits for human approval.
const agents = [
  { label: 'RESEARCH', y: 170 },
  { label: 'ANALYSIS', y: 300 },
  { label: 'EVIDENCE', y: 430 },
]

export function FormLawCover() {
  const id = useSvgId('fl')

  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" role="presentation">
      <defs>
        <radialGradient id={id('bg')} cx="45%" cy="45%" r="75%">
          <stop offset="0" stopColor="#221a15" />
          <stop offset="1" stopColor="#0f0c0a" />
        </radialGradient>
        <linearGradient id={id('paper')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efe4cd" />
          <stop offset="1" stopColor="#d9c9a8" />
        </linearGradient>
        <radialGradient id={id('seal')} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#e3a487" />
          <stop offset="1" stopColor="#8f3f28" />
        </radialGradient>
      </defs>

      <rect x="-800" y="-600" width="2400" height="1800" fill={`url(#${id('bg')})`} />

      {/* Case documents with highlighted, citable passages */}
      <Layer depth={1}>
        {[0, 1, 2].map((sheet) => (
          <g key={sheet} transform={`translate(${56 + sheet * 16} ${150 + sheet * 22}) rotate(${-6 + sheet * 4})`}>
            <rect width="190" height="250" rx="6" fill={`url(#${id('paper')})`} opacity={0.55 + sheet * 0.2} />
            {sheet === 2 && (
              <>
                <text x="18" y="34" className="cover-display" fontSize="13" fill="#4a3a2a" letterSpacing="2">
                  CASE FILE
                </text>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((line) => (
                  <rect
                    key={line}
                    x="18"
                    y={54 + line * 22}
                    width={line % 3 === 2 ? 110 : 150}
                    height="7"
                    rx="2"
                    fill={line === 2 || line === 5 ? '#d07a5c' : 'rgba(74,58,42,0.35)'}
                    opacity={line === 2 || line === 5 ? 0.85 : 1}
                  />
                ))}
                <text x="150" y="104" className="cover-mono" fontSize="10" fill="#8f3f28">
                  [1]
                </text>
                <text x="150" y="170" className="cover-mono" fontSize="10" fill="#8f3f28">
                  [2]
                </text>
              </>
            )}
          </g>
        ))}
      </Layer>

      {/* Orchestrated agents */}
      <Layer depth={2}>
        {agents.map((agent, index) => (
          <path
            key={agent.label}
            d={`M290 300 C 330 300, 330 ${agent.y}, 372 ${agent.y}`}
            fill="none"
            stroke={index === 0 ? 'rgba(208,122,92,0.7)' : 'rgba(232,223,204,0.35)'}
            strokeWidth="1.2"
            className="cover-flow"
            style={{ animationDelay: `${index * -0.4}s` }}
          />
        ))}
        {agents.map((agent) => (
          <path
            key={`out-${agent.label}`}
            d={`M492 ${agent.y} C 526 ${agent.y}, 526 300, 556 300`}
            fill="none"
            stroke="rgba(201,164,92,0.45)"
            strokeWidth="1.2"
          />
        ))}
        <circle cx="290" cy="300" r="9" fill="#13100e" stroke="#c9a45c" />
        <circle cx="290" cy="300" r="3.5" fill="#c9a45c" className="cover-pulse" />
      </Layer>

      <Layer depth={3}>
        {agents.map((agent) => (
          <g key={agent.label} transform={`translate(372 ${agent.y - 22})`}>
            <rect width="120" height="44" rx="22" fill="#1b1613" stroke="rgba(232,223,204,0.35)" />
            <circle cx="22" cy="22" r="5" fill="#d07a5c" />
            <text x="70" y="26" textAnchor="middle" className="cover-mono" fontSize="10" fill="#e8dfcc">
              {agent.label}
            </text>
          </g>
        ))}
        <text x="432" y="104" textAnchor="middle" className="cover-mono" fontSize="10" fill="#9c907b">
          AGENTS
        </text>
      </Layer>

      {/* Cited answer, human approval and audit trail */}
      <Layer depth={4}>
        <g transform="translate(556 160)">
          <rect width="200" height="280" rx="14" fill="#1b1613" stroke="rgba(232,223,204,0.25)" />
          <text x="18" y="32" className="cover-mono" fontSize="10" fill="#9c907b">
            ANSWER
          </text>
          {[0, 1, 2].map((line) => (
            <rect key={line} x="18" y={48 + line * 18} width={line === 2 ? 110 : 160} height="7" rx="2" fill="rgba(232,223,204,0.4)" />
          ))}
          {['[1]', '[2]'].map((cite, index) => (
            <g key={cite} transform={`translate(${18 + index * 52} 112)`}>
              <rect width="44" height="22" rx="11" fill="none" stroke="#d07a5c" />
              <text x="22" y="15" textAnchor="middle" className="cover-mono" fontSize="10" fill="#d07a5c">
                {cite}
              </text>
            </g>
          ))}
          <line x1="18" x2="182" y1="152" y2="152" stroke="rgba(232,223,204,0.12)" />
          <text x="18" y="176" className="cover-mono" fontSize="9" fill="#9c907b">
            AUDIT LOG
          </text>
          {[0, 1, 2].map((line) => (
            <g key={line}>
              <circle cx="22" cy={196 + line * 20} r="2.5" fill="#c9a45c" />
              <rect x="32" y={193 + line * 20} width={120 - line * 22} height="6" rx="2" fill="rgba(232,223,204,0.22)" />
            </g>
          ))}
          {/* Human-approval seal */}
          <g transform="translate(160 214)">
            <circle r="22" fill={`url(#${id('seal')})`} />
            <circle r="16" fill="none" stroke="rgba(255,236,210,0.55)" strokeDasharray="2 3" />
            <path d="M-7 0 l5 5 l9 -11" fill="none" stroke="#fbeee0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text x="18" y="262" className="cover-mono" fontSize="9" fill="#d07a5c">
            HUMAN APPROVAL
          </text>
        </g>
      </Layer>

      <Layer depth={1.5}>
        <text x="56" y="70" className="cover-mono" fill="#9c907b" fontSize="11">
          RAG · SOURCE-GROUNDED CITATIONS
        </text>
        <rect x="660" y="40" width="96" height="26" rx="13" fill="none" stroke="rgba(232,223,204,0.35)" />
        <text x="708" y="57" textAnchor="middle" className="cover-mono" fill="#9c907b" fontSize="10">
          RBAC
        </text>
      </Layer>
    </svg>
  )
}
