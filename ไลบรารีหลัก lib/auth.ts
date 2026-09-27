import { cookies } from 'next/headers'
import crypto from 'crypto'

const COOKIE = 'pf_session'
const SECRET = process.env.SESSION_SECRET || 'dev-secret-change-me'

function sign(value: string) {
  return crypto.createHmac('sha256', SECRET).update(value).digest('hex')
}

export function makeToken(user: string) {
  const payload = `${user}.${Date.now()}`
  return `${Buffer.from(payload).toString('base64url')}.${sign(payload)}`
}

export function verifyToken(token?: string) {
  if (!token) return false
  const [b64, sig] = token.split('.')
  if (!b64 || !sig) return false
  const payload = Buffer.from(b64, 'base64url').toString()
  if (sign(payload) !== sig) return false
  const ts = Number(payload.split('.')[1])
  return Date.now() - ts < 1000 * 60 * 60 * 24 * 7 // อายุ 7 วัน
}

export async function isLoggedIn() {
  const jar = await cookies()
  return verifyToken(jar.get(COOKIE)?.value)
}

export async function setSession(user: string) {
  const jar = await cookies()
  jar.set(COOKIE, makeToken(user), {
    httpOnly: true, sameSite: 'lax', path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearSession() {
  const jar = await cookies()
  jar.delete(COOKIE)
}
