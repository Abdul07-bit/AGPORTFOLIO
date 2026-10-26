import { ArrowDown, ArrowUp, ArrowUpRight, Eye, EyeOff, LoaderCircle, LogOut, Plus, Trash2, Upload } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { LIMITS, emptySettings, normaliseUrl, socialPresets, type SiteSettings, type SocialLinkSetting } from '../data/settings'
import { site } from '../data/site'
import { fetchSiteSettings, RESUME_ENDPOINT } from '../lib/siteSettings'
import { ApiError, adminApi } from './api'
import './Admin.css'

// This page is only reached on a full load of /admin, so `profile` and
// `projects` still hold the untouched defaults from src/data (see main.tsx).

type Session = { kind: 'checking' } | { kind: 'signed-out'; notice?: string } | { kind: 'signed-in'; email: string }

type Status = { kind: 'idle' } | { kind: 'busy' } | { kind: 'saved'; message: string } | { kind: 'error'; message: string }

const message = (error: unknown) => (error instanceof Error ? error.message : 'Something went wrong.')

export default function AdminPage() {
  const [session, setSession] = useState<Session>({ kind: 'checking' })

  useEffect(() => {
    document.getElementById('boot')?.remove()
    document.title = `Admin · ${site.shortTitle}`
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.append(robots)
    return () => robots.remove()
  }, [])

  useEffect(() => {
    adminApi
      .session()
      .then(({ email }) => setSession({ kind: 'signed-in', email }))
      .catch((error) => setSession({ kind: 'signed-out', notice: error instanceof ApiError && error.status !== 401 ? error.message : undefined }))
  }, [])

  const expire = (error: unknown) => {
    if (error instanceof ApiError && error.status === 401) setSession({ kind: 'signed-out', notice: error.message })
  }

  return (
    <div className="admin">
      <header className="admin__bar">
        <span className="admin__brand mono">
          {profile.initials} <span className="muted">/ Admin</span>
        </span>
        <div className="admin__bar-actions">
          <a href="/" className="admin__link mono" target="_blank" rel="noopener noreferrer">
            View site <ArrowUpRight aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          {session.kind === 'signed-in' && (
            <button
              type="button"
              className="admin__link mono"
              onClick={() => adminApi.logout().finally(() => setSession({ kind: 'signed-out', notice: 'Signed out.' }))}
            >
              Sign out <LogOut aria-hidden="true" />
            </button>
          )}
        </div>
      </header>

      <main className="admin__main" id="main">
        {session.kind === 'checking' && (
          <p className="admin__loading mono muted" role="status">
            <LoaderCircle className="admin__spin" aria-hidden="true" /> Checking session…
          </p>
        )}
        {session.kind === 'signed-out' && <LoginForm notice={session.notice} onSignedIn={(email) => setSession({ kind: 'signed-in', email })} />}
        {session.kind === 'signed-in' && <Dashboard email={session.email} onAuthError={expire} />}
      </main>
    </div>
  )
}

// ─── Login ────────────────────────────────────────────────────────────────

function LoginForm({ notice, onSignedIn }: { notice?: string; onSignedIn: (email: string) => void }) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [reveal, setReveal] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setStatus({ kind: 'busy' })
    try {
      const result = await adminApi.login(email, password)
      onSignedIn(result.email)
    } catch (error) {
      setStatus({ kind: 'error', message: message(error) })
      setPassword('')
    }
  }

  return (
    <form className="admin__card admin__login" onSubmit={submit}>
      <h1 className="admin__title">Sign in</h1>
      <p className="muted">Manage the work, profile links and resume shown on the portfolio.</p>
      {notice && <p className="admin__notice">{notice}</p>}

      <label className="admin__field" htmlFor={`${id}-email`}>
        <span className="mono muted">Email</span>
        <input id={`${id}-email`} type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>

      <label className="admin__field" htmlFor={`${id}-password`}>
        <span className="mono muted">Password</span>
        <span className="admin__password">
          <input
            id={`${id}-password`}
            type={reveal ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="button" className="admin__icon-btn" onClick={() => setReveal((value) => !value)} aria-label={reveal ? 'Hide password' : 'Show password'}>
            {reveal ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </button>
        </span>
      </label>

      {status.kind === 'error' && (
        <p className="admin__error" role="alert">
          {status.message}
        </p>
      )}

      <button type="submit" className="btn btn--primary" disabled={status.kind === 'busy'}>
        {status.kind === 'busy' ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────

const TABS = [
  { id: 'work', label: 'Work' },
  { id: 'links', label: 'Links' },
  { id: 'resume', label: 'Resume' },
] as const

type TabId = (typeof TABS)[number]['id']

function Dashboard({ email, onAuthError }: { email: string; onAuthError: (error: unknown) => void }) {
  const id = useId()
  const [tab, setTab] = useState<TabId>('work')
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    fetchSiteSettings()
      .then((loaded) => setSettings(loaded ?? emptySettings))
      .catch((error) => setLoadError(message(error)))
  }, [])

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const onTabKey = (event: KeyboardEvent, index: number) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    const next = (index + step + TABS.length) % TABS.length
    setTab(TABS[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="admin__dashboard">
      <div className="admin__intro">
        <h1 className="admin__title">Portfolio settings</h1>
        <p className="muted">
          Signed in as {email}.
          {settings?.updatedAt && ` Last saved ${formatDate(settings.updatedAt)}.`} Changes go live as soon as you save.
        </p>
      </div>

      <div className="admin__tabs" role="tablist" aria-label="Settings">
        {TABS.map((item, index) => (
          <button
            key={item.id}
            ref={(element) => {
              tabRefs.current[index] = element
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`${id}-panel`}
            tabIndex={tab === item.id ? 0 : -1}
            className="admin__tab mono"
            onClick={() => setTab(item.id)}
            onKeyDown={(event) => onTabKey(event, index)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className="admin__card" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${tab}`}>
        {loadError && <p className="admin__error">{loadError}</p>}
        {!settings && !loadError && (
          <p className="mono muted" role="status">
            Loading settings…
          </p>
        )}
        {settings && tab === 'work' && <WorkEditor settings={settings} onSaved={setSettings} onAuthError={onAuthError} />}
        {settings && tab === 'links' && <LinksEditor settings={settings} onSaved={setSettings} onAuthError={onAuthError} />}
        {settings && tab === 'resume' && <ResumeEditor settings={settings} onSaved={setSettings} onAuthError={onAuthError} />}
      </section>
    </div>
  )
}

interface EditorProps {
  settings: SiteSettings
  onSaved: (settings: SiteSettings) => void
  onAuthError: (error: unknown) => void
}

function useSave({ onSaved, onAuthError }: Pick<EditorProps, 'onSaved' | 'onAuthError'>) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const run = async (action: () => Promise<SiteSettings>, success: string) => {
    setStatus({ kind: 'busy' })
    try {
      onSaved(await action())
      setStatus({ kind: 'saved', message: success })
    } catch (error) {
      setStatus({ kind: 'error', message: message(error) })
      onAuthError(error)
    }
  }
  return { status, setStatus, run }
}

function StatusLine({ status }: { status: Status }) {
  return (
    <p className={`admin__status${status.kind === 'error' ? ' admin__status--error' : ''}`} role="status">
      {status.kind === 'saved' && status.message}
      {status.kind === 'error' && status.message}
    </p>
  )
}

function Actions({ children }: { children: ReactNode }) {
  return <div className="admin__actions">{children}</div>
}

// ─── Work ─────────────────────────────────────────────────────────────────

interface WorkRow {
  slug: string
  visible: boolean
}

const defaultWork = (): WorkRow[] => projects.map((project) => ({ slug: project.slug, visible: true }))

function workRows(settings: SiteSettings): WorkRow[] {
  if (!settings.projects) return defaultWork()
  const { order, hidden } = settings.projects
  const slugs = [...order, ...projects.map((project) => project.slug).filter((slug) => !order.includes(slug))]
  return slugs.map((slug) => ({ slug, visible: !hidden.includes(slug) }))
}

function WorkEditor({ settings, onSaved, onAuthError }: EditorProps) {
  const [rows, setRows] = useState(() => workRows(settings))
  const { status, setStatus, run } = useSave({ onSaved, onAuthError })
  const visibleCount = rows.filter((row) => row.visible).length
  const dirty = JSON.stringify(rows) !== JSON.stringify(workRows(settings))

  const edit = (next: WorkRow[]) => {
    setRows(next)
    setStatus({ kind: 'idle' })
  }

  const save = () =>
    run(
      () =>
        adminApi.saveSettings({
          projects: { order: rows.map((row) => row.slug), hidden: rows.filter((row) => !row.visible).map((row) => row.slug) },
          social: settings.social,
        }),
      'Work saved. The portfolio now shows the selected projects.',
    )

  return (
    <>
      <div className="admin__panel-head">
        <h2 className="admin__subtitle">Selected work</h2>
        <p className="muted">
          Choose which projects appear in the gallery, case files and stack sections, and in what order. Hidden case studies are not reachable on the site.
        </p>
      </div>

      <ol className="admin__list">
        {rows.map((row, index) => {
          const project = projects.find((item) => item.slug === row.slug)
          if (!project) return null
          return (
            <li key={row.slug} className="admin__row" data-hidden={!row.visible}>
              <label className="admin__check">
                <input
                  type="checkbox"
                  checked={row.visible}
                  onChange={(event) => edit(rows.map((item) => (item.slug === row.slug ? { ...item, visible: event.target.checked } : item)))}
                />
                <span>
                  <span className="admin__row-title">{project.name}</span>
                  <span className="mono muted">
                    {project.status.label} · {row.visible ? 'Shown' : 'Hidden'}
                  </span>
                </span>
              </label>
              <MoveButtons index={index} count={rows.length} label={project.name} onMove={(to) => edit(move(rows, index, to))} />
            </li>
          )
        })}
      </ol>

      {visibleCount === 0 && <p className="admin__error">Keep at least one project visible.</p>}

      <Actions>
        <button type="button" className="btn btn--primary" onClick={save} disabled={!dirty || visibleCount === 0 || status.kind === 'busy'}>
          {status.kind === 'busy' ? 'Saving…' : 'Save work'}
        </button>
        <button type="button" className="btn btn--small" onClick={() => edit(defaultWork())}>
          Show all, default order
        </button>
      </Actions>
      <StatusLine status={status} />
    </>
  )
}

// ─── Links ────────────────────────────────────────────────────────────────

interface LinkRow extends SocialLinkSetting {
  key: string
}

let rowKey = 0
const toRows = (links: { id: string; label: string; href: string | null }[]): LinkRow[] =>
  links.map((link) => ({ id: link.id, label: link.label, href: link.href ?? '', key: `row-${rowKey++}` }))

const defaultLinks = () => toRows(profile.social.filter((link) => link.href))

function LinksEditor({ settings, onSaved, onAuthError }: EditorProps) {
  const id = useId()
  const [rows, setRows] = useState(() => (settings.social ? toRows(settings.social) : defaultLinks()))
  const [showErrors, setShowErrors] = useState(false)
  const { status, setStatus, run } = useSave({ onSaved, onAuthError })

  const errors = rows.map((row) => ({
    label: row.label.trim() ? null : 'Add a label.',
    href: normaliseUrl(row.href) ? null : 'Enter a full URL starting with https://',
  }))
  const invalid = errors.some((error) => error.label || error.href)

  const edit = (next: LinkRow[]) => {
    setRows(next)
    setStatus({ kind: 'idle' })
  }
  const update = (key: string, field: 'label' | 'href', value: string) => edit(rows.map((row) => (row.key === key ? { ...row, [field]: value } : row)))

  const missingPresets = socialPresets.filter((preset) => !rows.some((row) => row.id === preset.id))
  const add = (preset?: (typeof socialPresets)[number]) => {
    // Custom ids only need to be unique within the list; the server de-duplicates them anyway.
    const row = toRows([{ id: preset?.id ?? `custom-${rowKey}`, label: preset?.label ?? '', href: '' }])[0]
    edit([...rows, row])
    requestAnimationFrame(() => document.getElementById(`${id}-${row.key}-${preset ? 'href' : 'label'}`)?.focus())
  }

  const save = () => {
    setShowErrors(true)
    if (invalid) {
      setStatus({ kind: 'error', message: 'Fix the highlighted links first.' })
      return
    }
    return run(
      () =>
        adminApi.saveSettings({
          projects: settings.projects,
          social: rows.map(({ id: linkId, label, href }) => ({ id: linkId, label: label.trim(), href: normaliseUrl(href) ?? href })),
        }),
      'Links saved. They now appear in the navigation, contact section and footer.',
    )
  }

  return (
    <>
      <div className="admin__panel-head">
        <h2 className="admin__subtitle">Profile links</h2>
        <p className="muted">LinkedIn, LeetCode, Instagram and any other profile. Links appear in this order across the site.</p>
      </div>

      {rows.length === 0 && <p className="muted">No links — the site will not show any profile links.</p>}

      <ol className="admin__list">
        {rows.map((row, index) => {
          const preset = socialPresets.find((item) => item.id === row.id)
          const error = showErrors ? errors[index] : { label: null, href: null }
          return (
            <li key={row.key} className="admin__row admin__row--link">
              <div className="admin__link-fields">
                <label className="admin__field" htmlFor={`${id}-${row.key}-label`}>
                  <span className="mono muted">Label</span>
                  <input
                    id={`${id}-${row.key}-label`}
                    value={row.label}
                    maxLength={LIMITS.label}
                    aria-invalid={Boolean(error.label)}
                    onChange={(event) => update(row.key, 'label', event.target.value)}
                  />
                  {error.label && <span className="admin__field-error">{error.label}</span>}
                </label>
                <label className="admin__field admin__field--grow" htmlFor={`${id}-${row.key}-href`}>
                  <span className="mono muted">URL</span>
                  <input
                    id={`${id}-${row.key}-href`}
                    type="url"
                    inputMode="url"
                    value={row.href}
                    maxLength={LIMITS.url}
                    placeholder={preset?.placeholder ?? 'https://…'}
                    aria-invalid={Boolean(error.href)}
                    onChange={(event) => update(row.key, 'href', event.target.value)}
                  />
                  {error.href && <span className="admin__field-error">{error.href}</span>}
                </label>
              </div>
              <div className="admin__row-tools">
                <MoveButtons index={index} count={rows.length} label={row.label || 'link'} onMove={(to) => edit(move(rows, index, to))} />
                <button
                  type="button"
                  className="admin__icon-btn"
                  aria-label={`Remove ${row.label || 'link'}`}
                  onClick={() => edit(rows.filter((item) => item.key !== row.key))}
                >
                  <Trash2 aria-hidden="true" />
                </button>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="admin__add">
        {missingPresets.map((preset) => (
          <button key={preset.id} type="button" className="btn btn--small" onClick={() => add(preset)}>
            <Plus aria-hidden="true" /> {preset.label}
          </button>
        ))}
        {rows.length < LIMITS.socialLinks && (
          <button type="button" className="btn btn--small" onClick={() => add()}>
            <Plus aria-hidden="true" /> Other profile
          </button>
        )}
      </div>

      <Actions>
        <button type="button" className="btn btn--primary" onClick={save} disabled={status.kind === 'busy'}>
          {status.kind === 'busy' ? 'Saving…' : 'Save links'}
        </button>
        <button type="button" className="btn btn--small" onClick={() => edit(defaultLinks())}>
          Restore defaults
        </button>
      </Actions>
      <StatusLine status={status} />
    </>
  )
}

// ─── Resume ───────────────────────────────────────────────────────────────

function ResumeEditor({ settings, onSaved, onAuthError }: EditorProps) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const { status, setStatus, run } = useSave({ onSaved, onAuthError })

  const current = settings.resume
    ? { href: `${RESUME_ENDPOINT}?v=${encodeURIComponent(settings.resume.updatedAt)}`, text: `Uploaded ${formatDate(settings.resume.updatedAt)} · ${formatSize(settings.resume.size)}` }
    : __RESUME_AVAILABLE__
      ? { href: profile.resume.path, text: 'The resume bundled with the site (public/resume.pdf).' }
      : null

  const choose = (selected: File | null) => {
    setFile(null)
    setStatus({ kind: 'idle' })
    if (!selected) return
    if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
      setStatus({ kind: 'error', message: 'Choose a PDF file.' })
    } else if (selected.size > LIMITS.resumeBytes) {
      setStatus({ kind: 'error', message: `That file is ${formatSize(selected.size)}. The limit is ${formatSize(LIMITS.resumeBytes)}.` })
    } else {
      setFile(selected)
    }
  }

  const upload = async () => {
    if (!file) return
    await run(() => adminApi.uploadResume(file), 'Resume uploaded. The download button now serves the new file.')
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const revert = () => {
    if (!window.confirm('Remove the uploaded resume and go back to the bundled one?')) return
    return run(() => adminApi.deleteResume(), 'Uploaded resume removed.')
  }

  return (
    <>
      <div className="admin__panel-head">
        <h2 className="admin__subtitle">Resume</h2>
        <p className="muted">Upload a new PDF (up to {formatSize(LIMITS.resumeBytes)}). Visitors download it as “{profile.resume.downloadName}”.</p>
      </div>

      <div className="admin__resume-current">
        <span className="mono muted">Current</span>
        {current ? (
          <>
            <span>{current.text}</span>
            <a href={current.href} target="_blank" rel="noopener noreferrer" className="admin__link mono">
              Open <ArrowUpRight aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </>
        ) : (
          <span>No resume — the download button is hidden.</span>
        )}
      </div>

      <label className="admin__drop" htmlFor={`${id}-file`}>
        <Upload aria-hidden="true" />
        <span>{file ? `${file.name} · ${formatSize(file.size)}` : 'Choose a PDF…'}</span>
        <input
          ref={inputRef}
          id={`${id}-file`}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          onChange={(event) => choose(event.target.files?.[0] ?? null)}
        />
      </label>

      <Actions>
        <button type="button" className="btn btn--primary" onClick={upload} disabled={!file || status.kind === 'busy'}>
          {status.kind === 'busy' ? 'Uploading…' : 'Upload resume'}
        </button>
        {settings.resume && (
          <button type="button" className="btn btn--small" onClick={revert} disabled={status.kind === 'busy'}>
            Use bundled resume
          </button>
        )}
      </Actions>
      <StatusLine status={status} />
    </>
  )
}

// ─── Shared bits ──────────────────────────────────────────────────────────

function MoveButtons({ index, count, label, onMove }: { index: number; count: number; label: string; onMove: (to: number) => void }) {
  return (
    <span className="admin__move">
      <button type="button" className="admin__icon-btn" aria-label={`Move ${label} up`} disabled={index === 0} onClick={() => onMove(index - 1)}>
        <ArrowUp aria-hidden="true" />
      </button>
      <button type="button" className="admin__icon-btn" aria-label={`Move ${label} down`} disabled={index === count - 1} onClick={() => onMove(index + 1)}>
        <ArrowDown aria-hidden="true" />
      </button>
    </span>
  )
}

function move<T>(items: T[], from: number, to: number) {
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))

const formatSize = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`)
