/// <reference types="vite/client" />

/** True when public/resume.pdf exists at build time (see vite.config.ts). */
declare const __RESUME_AVAILABLE__: boolean

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
  readonly VITE_CONTACT_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
