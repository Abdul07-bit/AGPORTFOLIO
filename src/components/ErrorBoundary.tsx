import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error) => void
}

/** Contains failures (e.g. WebGL or a lazy chunk) so the rest of the page keeps working. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error)
    if (import.meta.env.DEV) console.warn('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}
