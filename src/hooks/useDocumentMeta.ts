import { useEffect } from 'react'
import { site } from '../data/site'

/** Updates the document title and meta description for client-side routes. */
export function useDocumentMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${site.shortTitle}` : site.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description ?? site.description)
  }, [title, description])
}
