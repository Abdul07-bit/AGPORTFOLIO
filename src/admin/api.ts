// Browser client for the admin endpoints in netlify/functions/admin.mts.
import type { SiteSettings } from '../data/settings'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`/api/admin${path}`, { credentials: 'same-origin', cache: 'no-store', ...init })
  } catch {
    throw new ApiError(0, 'Could not reach the server. Check your connection and try again.')
  }
  // Hosts without the Netlify functions (e.g. `vite preview`) answer with index.html.
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new ApiError(response.status, 'The admin API is not running here. Use `npm run dev` locally, or the site deployed on Netlify.')
  }
  const body = await response.json()
  if (!response.ok) throw new ApiError(response.status, typeof body?.error === 'string' ? body.error : 'Something went wrong.')
  return body as T
}

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).slice(String(reader.result).indexOf(',') + 1))
    reader.onerror = () => reject(new ApiError(0, 'Could not read that file.'))
    reader.readAsDataURL(file)
  })

const json = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
})

export const adminApi = {
  session: () => request<{ email: string }>('/session'),
  login: (email: string, password: string) => request<{ email: string }>('/login', json('POST', { email, password })),
  logout: () => request<{ ok: true }>('/logout', { method: 'POST' }),
  saveSettings: (settings: Pick<SiteSettings, 'projects' | 'social'>) => request<SiteSettings>('/settings', json('PUT', settings)),
  uploadResume: async (file: File) => request<SiteSettings>('/resume', json('PUT', { data: await toBase64(file) })),
  deleteResume: () => request<SiteSettings>('/resume', { method: 'DELETE' }),
}
