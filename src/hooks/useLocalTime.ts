import { useEffect, useState } from 'react'

const format = (timeZone: string) =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone, hour12: false }).format(new Date())

/** Current time in a time zone, refreshed every 30 seconds. */
export function useLocalTime(timeZone: string) {
  const [time, setTime] = useState(() => format(timeZone))
  useEffect(() => {
    const id = window.setInterval(() => setTime(format(timeZone)), 30_000)
    return () => window.clearInterval(id)
  }, [timeZone])
  return time
}
