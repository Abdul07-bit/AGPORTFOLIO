import { profile } from '../data/profile'

export interface ContactMessage {
  name: string
  email: string
  topic: string
  message: string
}

export type ContactErrors = Partial<Record<keyof ContactMessage, string>>

/** How the form will deliver a message, decided by configuration. */
export type DeliveryMode = 'endpoint' | 'mailto' | 'none'

const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT?.trim() || null

export const deliveryMode: DeliveryMode = endpoint ? 'endpoint' : profile.email ? 'mailto' : 'none'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateContact(values: ContactMessage): ContactErrors {
  const errors: ContactErrors = {}
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.'
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Please enter a valid email address so I can reply.'
  if (values.message.trim().length < 20) errors.message = 'Please write at least a couple of sentences (20+ characters).'
  return errors
}

export function buildMailto(values: ContactMessage, to: string) {
  const subject = `${values.topic ? `[${values.topic}] ` : ''}Message from ${values.name.trim()}`
  const body = `${values.message.trim()}\n\n— ${values.name.trim()}\n${values.email.trim()}`
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/** Sends to the configured endpoint. Resolves only on a 2xx response. */
export async function sendToEndpoint(values: ContactMessage): Promise<void> {
  if (!endpoint) throw new Error('No contact endpoint is configured.')
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name: values.name.trim(),
      email: values.email.trim(),
      topic: values.topic,
      message: values.message.trim(),
    }),
  })
  if (!response.ok) throw new Error(`The message service responded with ${response.status}.`)
}
