// Creates the admin-panel login: hashes a password and writes ADMIN_EMAIL,
// ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET to .env (used by `netlify dev`).
// Copy the same three values into Netlify → Site configuration → Environment variables.
//
//   npm run admin:credentials -- you@example.com
//
// The password is typed at a hidden prompt (or piped on stdin) and never stored in plain text.
// Needs Node 22.18+ (imports the TypeScript hashing code directly).
import { randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { hashPassword } from '../netlify/lib/auth.ts'

const envPath = fileURLToPath(new URL('../.env', import.meta.url))

const email = process.argv[2]?.trim().toLowerCase()
if (!email || !email.includes('@')) {
  console.error('Usage: npm run admin:credentials -- you@example.com')
  process.exit(1)
}

function readPassword() {
  const { stdin, stdout } = process
  if (!stdin.isTTY) {
    return new Promise((resolve) => {
      let data = ''
      stdin.setEncoding('utf8')
      stdin.on('data', (chunk) => (data += chunk))
      stdin.on('end', () => resolve(data.replace(/\r?\n$/, '')))
    })
  }
  return new Promise((resolve) => {
    let value = ''
    stdout.write('Admin password: ')
    stdin.setRawMode(true)
    stdin.setEncoding('utf8')
    stdin.resume()
    const onData = (key) => {
      if (key === '\u0003') process.exit(130) // Ctrl+C
      if (key === '\r' || key === '\n') {
        stdin.setRawMode(false)
        stdin.pause()
        stdin.off('data', onData)
        stdout.write('\n')
        resolve(value)
      } else if (key === '\u007f' || key === '\b') {
        value = value.slice(0, -1)
      } else {
        value += key
      }
    }
    stdin.on('data', onData)
  })
}

const password = await readPassword()
if (password.length < 8) {
  console.error('Use a password of at least 8 characters.')
  process.exit(1)
}

const values = {
  ADMIN_EMAIL: email,
  ADMIN_PASSWORD_HASH: await hashPassword(password),
  ADMIN_SESSION_SECRET: randomBytes(32).toString('base64url'),
}

let env = existsSync(envPath) ? readFileSync(envPath, 'utf8') : ''
for (const [key, value] of Object.entries(values)) {
  const line = `${key}=${value}`
  const pattern = new RegExp(`^${key}=.*$`, 'm')
  env = pattern.test(env) ? env.replace(pattern, line) : `${env}${env && !env.endsWith('\n') ? '\n' : ''}${line}\n`
}
writeFileSync(envPath, env)

console.log(`Saved to .env. Add the same values to Netlify (Site configuration → Environment variables):\n`)
for (const [key, value] of Object.entries(values)) console.log(`${key}=${value}`)
