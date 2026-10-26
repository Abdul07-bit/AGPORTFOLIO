import './SceneFallback.css'

/**
 * Static CSS/SVG rendition of the Signal Core. Shown while the 3D chunk loads,
 * and permanently when WebGL is unavailable or fails.
 */
export function SceneFallback({ className }: { className?: string }) {
  return (
    <div className={['scene-fallback', className].filter(Boolean).join(' ')} aria-hidden="true">
      <svg viewBox="-320 -320 640 640" role="presentation">
        <defs>
          <radialGradient id="sf-core" cx="36%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#fbf1d8" />
            <stop offset="18%" stopColor="#d9b877" />
            <stop offset="48%" stopColor="#7a5a2c" />
            <stop offset="78%" stopColor="#2a1f12" />
            <stop offset="100%" stopColor="#0c0907" />
          </radialGradient>
          <radialGradient id="sf-rim" cx="70%" cy="78%" r="55%">
            <stop offset="0%" stopColor="rgba(196,86,46,0.55)" />
            <stop offset="100%" stopColor="rgba(196,86,46,0)" />
          </radialGradient>
          <radialGradient id="sf-halo">
            <stop offset="0%" stopColor="rgba(232,223,204,0.14)" />
            <stop offset="100%" stopColor="rgba(232,223,204,0)" />
          </radialGradient>
        </defs>

        <circle r="300" fill="url(#sf-halo)" />

        <g className="scene-fallback__rings" fill="none" stroke="#e8dfcc">
          <ellipse rx="236" ry="74" transform="rotate(-22)" strokeOpacity="0.4" />
          <ellipse rx="196" ry="118" transform="rotate(34)" strokeOpacity="0.22" />
          <ellipse rx="290" ry="56" transform="rotate(8)" strokeOpacity="0.18" strokeDasharray="2 7" />
          <path d="M 180 -48 A 236 74 0 0 1 228 18" transform="rotate(-22)" stroke="#c9a45c" strokeWidth="2.4" strokeOpacity="1" />
        </g>

        <g className="scene-fallback__cage" fill="none" stroke="#e8dfcc" strokeOpacity="0.12">
          <polygon points="0,-150 130,-75 130,75 0,150 -130,75 -130,-75" />
          <polyline points="0,-150 0,0 130,75" />
          <polyline points="0,0 -130,75" />
        </g>

        <circle r="96" fill="url(#sf-core)" />
        <circle r="96" fill="url(#sf-rim)" />
        <ellipse rx="96" ry="9" fill="none" stroke="#c9a45c" strokeWidth="1.6" />

        <circle className="scene-fallback__signal" cx="212" cy="-58" r="4" fill="#c9a45c" />
        <circle cx="-180" cy="96" r="3" fill="#e8dfcc" />
      </svg>
    </div>
  )
}
