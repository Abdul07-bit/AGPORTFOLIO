import { ArrowUpRight, Check, Copy, Download, LoaderCircle, Mail, Send } from 'lucide-react'
import { useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { AnimatedText } from '../components/motion/AnimatedText'
import { Magnetic } from '../components/motion/Magnetic'
import { activeSocialLinks, profile } from '../data/profile'
import { copyText } from '../lib/clipboard'
import { buildMailto, deliveryMode, sendToEndpoint, validateContact, type ContactErrors, type ContactMessage } from '../lib/contact'
import { resumeLink } from '../lib/siteSettings'
import './Contact.css'

const TOPICS = ['Software engineering', 'AI automation', 'Digital product', 'Collaboration', 'Something else']

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'mailto' }
  | { kind: 'error'; message: string }

const emptyMessage: ContactMessage = { name: '', email: '', topic: TOPICS[0], message: '' }

export function Contact() {
  const formId = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState<ContactMessage>(emptyMessage)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')

  const socials = activeSocialLinks()
  const resumeAvailable = resumeLink.available
  const formEnabled = deliveryMode !== 'none'

  const update = (field: keyof ContactMessage) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: event.target.value }
    setValues(next)
    if (submitted) setErrors(validateContact(next))
    if (status.kind !== 'idle' && status.kind !== 'sending') setStatus({ kind: 'idle' })
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    const found = validateContact(values)
    setErrors(found)
    const firstInvalid = (Object.keys(found) as (keyof ContactMessage)[])[0]
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    // Honeypot: real visitors never fill this hidden field.
    if (new FormData(event.currentTarget).get('company')) return

    if (deliveryMode === 'endpoint') {
      setStatus({ kind: 'sending' })
      try {
        await sendToEndpoint(values)
        setStatus({ kind: 'sent' })
        setValues(emptyMessage)
        setSubmitted(false)
      } catch (error) {
        setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Something went wrong.' })
      }
      return
    }

    if (deliveryMode === 'mailto' && profile.email) {
      window.location.href = buildMailto(values, profile.email)
      setStatus({ kind: 'mailto' })
    }
  }

  const copyEmail = async () => {
    if (!profile.email) return
    setCopyState((await copyText(profile.email)) ? 'copied' : 'failed')
    window.setTimeout(() => setCopyState('idle'), 2400)
  }

  const fieldProps = (field: keyof ContactMessage) => ({
    id: `${formId}-${field}`,
    name: field,
    value: values[field],
    onChange: update(field),
    'aria-invalid': Boolean(errors[field]) || undefined,
    'aria-describedby': errors[field] ? `${formId}-${field}-error` : undefined,
  })

  const fieldError = (field: keyof ContactMessage) =>
    errors[field] ? (
      <p id={`${formId}-${field}-error`} className="contact__error mono">
        {errors[field]}
      </p>
    ) : null

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <header className="contact__head">
          <span className="section-label mono" data-reveal="fade">
            <span className="section-label__index">(08)</span>
            Contact
          </span>
          <h2 id="contact-title" className="contact__title">
            <AnimatedText
              lines={['Have a complex', 'problem?', 'Let’s build', 'something useful.']}
              lineClassName={(index) => (index >= 2 ? 'contact__title-accent' : undefined)}
              reveal
            />
          </h2>
          <p className="contact__lead" data-reveal="up">
            I’m open to discussing software engineering, AI automation, digital products, and interesting technical
            collaborations.
          </p>
        </header>

        <div className="contact__grid">
          {formEnabled ? (
            <form ref={formRef} className="contact__form" onSubmit={onSubmit} noValidate data-reveal="up">
              <div className="contact__row">
                <div className="contact__field">
                  <label htmlFor={`${formId}-name`} className="mono">
                    Your name
                  </label>
                  <input type="text" autoComplete="name" required {...fieldProps('name')} />
                  {fieldError('name')}
                </div>
                <div className="contact__field">
                  <label htmlFor={`${formId}-email`} className="mono">
                    Email address
                  </label>
                  <input type="email" autoComplete="email" inputMode="email" required {...fieldProps('email')} />
                  {fieldError('email')}
                </div>
              </div>

              <fieldset className="contact__topics">
                <legend className="mono">What is it about?</legend>
                <div className="contact__topic-list">
                  {TOPICS.map((topic) => (
                    <label key={topic} className="contact__topic">
                      <input
                        type="radio"
                        name="topic"
                        value={topic}
                        checked={values.topic === topic}
                        onChange={() => setValues({ ...values, topic })}
                      />
                      <span>{topic}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="contact__field">
                <label htmlFor={`${formId}-message`} className="mono">
                  Message
                </label>
                <textarea rows={6} required {...fieldProps('message')} />
                <div className="contact__field-foot">
                  {fieldError('message')}
                  <span className="mono muted contact__count" aria-hidden="true">
                    {values.message.trim().length} chars
                  </span>
                </div>
              </div>

              {/* Honeypot */}
              <div className="contact__trap" aria-hidden="true">
                <label>
                  Company
                  <input type="text" name="company" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div className="contact__submit">
                <Magnetic>
                  <button type="submit" className="btn btn--primary" disabled={status.kind === 'sending'}>
                    {status.kind === 'sending' ? (
                      <>
                        Sending <LoaderCircle className="contact__spin" aria-hidden="true" />
                      </>
                    ) : deliveryMode === 'mailto' ? (
                      <>
                        Compose email <Mail aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        Send message <Send aria-hidden="true" data-arrow="right" />
                      </>
                    )}
                  </button>
                </Magnetic>
                <p className="mono muted contact__hint">
                  {deliveryMode === 'mailto' ? 'Opens your email app with the message ready to send.' : 'Usually answered within a few days.'}
                </p>
              </div>

              <div className="contact__status" role="status" aria-live="polite">
                {status.kind === 'sent' && (
                  <p className="contact__notice" data-tone="success">
                    <Check aria-hidden="true" /> Thanks — your message was delivered. I’ll reply by email.
                  </p>
                )}
                {status.kind === 'mailto' && (
                  <p className="contact__notice">
                    <Mail aria-hidden="true" /> Your email app should now be open with the message drafted — press send there
                    to deliver it. Nothing opened? Write to <a href={`mailto:${profile.email}`}>{profile.email}</a>.
                  </p>
                )}
                {status.kind === 'error' && (
                  <p className="contact__notice" data-tone="error">
                    The message could not be sent ({status.message})
                    {profile.email ? (
                      <>
                        {' '}
                        — please email <a href={`mailto:${profile.email}`}>{profile.email}</a> instead.
                      </>
                    ) : (
                      ' — please try again in a moment.'
                    )}
                  </p>
                )}
              </div>
            </form>
          ) : (
            <div className="contact__form contact__form--unavailable" data-reveal="up">
              <p className="contact__unavailable-title">Direct channels</p>
              <p className="muted">
                {socials.length
                  ? 'The best way to reach me right now is through the channels listed here.'
                  : 'Contact details are being finalised.'}
              </p>
              {import.meta.env.DEV && (
                <p className="contact__dev mono">
                  Dev note — the form is hidden because no delivery method is configured. Set <code>email</code> in
                  src/data/profile.ts (mailto fallback) or <code>VITE_CONTACT_ENDPOINT</code> in .env.local.
                </p>
              )}
            </div>
          )}

          <aside className="contact__aside" data-reveal="up" data-reveal-delay="0.1">
            {profile.email && (
              <div className="contact__channel">
                <span className="mono muted">Email</span>
                <a href={`mailto:${profile.email}`} className="contact__email">
                  {profile.email}
                </a>
                <button type="button" className="btn btn--small" onClick={copyEmail}>
                  {copyState === 'copied' ? (
                    <>
                      Copied <Check aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      Copy address <Copy aria-hidden="true" />
                    </>
                  )}
                </button>
                <span className="sr-only" role="status">
                  {copyState === 'copied' ? 'Email address copied to clipboard.' : copyState === 'failed' ? 'Copy failed.' : ''}
                </span>
                {copyState === 'failed' && <span className="mono contact__error">Copy failed — select the address above.</span>}
              </div>
            )}

            {socials.length > 0 && (
              <div className="contact__channel">
                <span className="mono muted">Profiles</span>
                <ul className="contact__links">
                  {socials.map((link) => (
                    <li key={link.id}>
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="contact__link">
                        {link.label}
                        <ArrowUpRight aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {resumeAvailable && (
              <div className="contact__channel">
                <span className="mono muted">Resume</span>
                <a href={resumeLink.href} download={profile.resume.downloadName} className="btn">
                  Download resume (PDF) <Download aria-hidden="true" data-arrow="down" />
                </a>
              </div>
            )}

            <div className="contact__channel">
              <span className="mono muted">Based in</span>
              <span>{profile.location}</span>
            </div>

            {import.meta.env.DEV && (!profile.email || socials.length < profile.social.length || !resumeAvailable) && (
              <div className="contact__dev mono">
                Dev note — not shown in production. Missing:
                {!profile.email && ' email,'}
                {profile.social
                  .filter((link) => !link.href)
                  .map((link) => ` ${link.label} URL,`)}
                {!resumeAvailable && ' public/resume.pdf,'} → see README “Configuration checklist”.
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}
