import { FloatingIcons } from './FloatingIcons'

/**
 * Fixed atmospheric layers: technical grid lines, drifting software icons,
 * two ambient lights, film grain and a cinematic vignette.
 */
export function Backdrop() {
  return (
    <div aria-hidden="true">
      <div className="ambient">
        <div className="ambient__light ambient__light--silver" data-ambient="silver" />
        <div className="ambient__light ambient__light--red" data-ambient="red" />
      </div>
      <div className="grid-lines">
        <span />
        <span />
        <span />
        <span />
      </div>
      <FloatingIcons />
      <div className="grain" />
      <div className="vignette" />
    </div>
  )
}
