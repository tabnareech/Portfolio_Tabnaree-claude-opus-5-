'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { pool, q } from '@/lib/db'
import { isLoggedIn, setSession, clearSession } from '@/lib/auth'

type Res = { ok: true; id?: number } | { ok: false; error: string }

async function guard() {
  if (!(await isLoggedIn())) throw new Error('unauthorized')
}

/* ---------- ล็อกอิน ---------- */
export async function login(_prev: unknown, f: FormData): Promise<{ error: string }> {
  const u = String(f.get('username') ?? '')
  const p = String(f.get('password') ?? '')
  if (u !== process.env.ADMIN_USER || p !== process.env.ADMIN_PASSWORD) {
    return { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }
  }
  await setSession(u)
  redirect('/admin')
}

export async function logout() {
  await clearSession()
  redirect('/admin/login')
}

/* ---------- ผลงาน ---------- */
export async function saveWork(f: FormData): Promise<Res> {
  await guard()
  const id = Number(f.get('id') ?? 0)
  const title = String(f.get('title') ?? '').trim()
  if (!title) return { ok: false, error: 'กรุณากรอกชื่อผลงาน' }

  const v = {
    category_id: Number(f.get('category_id')) || null,
    fiscal_year: Number(f.get('fiscal_year')) || new Date().getFullYear() + 543,
    round: Number(f.get('round')) || 1,
    summary: String(f.get('summary') ?? ''),
    rationale: String(f.get('rationale') ?? ''),
    method: String(f.get('method') ?? ''),
    outcome: String(f.get('outcome') ?? ''),
    target_qty: String(f.get('target_qty') ?? ''),
    target_qual: String(f.get('target_qual') ?? ''),
    doc_url: String(f.get('doc_url') ?? ''),
    cover_ref: String(f.get('cover_ref') ?? ''),
    status: f.get('status') === 'published' ? 'published' : 'draft',
    is_hidden: f.get('is_hidden') === '1',
  }

  let workId = id
  if (id > 0) {
    await pool.query(
      `UPDATE works SET title=$1, category_id=$2, fiscal_year=$3, round=$4, summary=$5,
        rationale=$6, method=$7, outcome=$8, target_qty=$9, target_qual=$10,
        doc_url=$11, cover_ref=$12, status=$13, is_hidden=$14, updated_at=NOW()
       WHERE id=$15`,
      [title, v.category_id, v.fiscal_year, v.round, v.summary, v.rationale, v.method,
       v.outcome, v.target_qty, v.target_qual, v.doc_url, v.cover_ref, v.status, v.is_hidden, id],
    )
  } else {
    const r = await pool.query(
      `INSERT INTO works (title, category_id, fiscal_year, round, summary, rationale, method,
        outcome, target_qty, target_qual, doc_url, cover_ref, status, is_hidden)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id`,
      [title, v.category_id, v.fiscal_year, v.round, v.summary, v.rationale, v.method,
       v.outcome, v.target_qty, v.target_qual, v.doc_url, v.cover_ref, v.status, v.is_hidden],
    )
    workId = r.rows[0].id
  }

  // รูปภาพประกอบ — ลบของเดิมแล้วบันทึกชุดใหม่
  const refs = f.getAll('img_ref').map(String)
  const caps = f.getAll('img_caption').map(String)
  await pool.query('DELETE FROM work_images WHERE work_id = $1', [workId])
  for (let i = 0; i < refs.length; i++) {
    if (!refs[i].trim()) continue
    await pool.query(
      'INSERT INTO work_images (work_id, image_ref, caption, sort_order) VALUES ($1,$2,$3,$4)',
      [workId, refs[i].trim(), caps[i] ?? '', i],
    )
  }

  revalidatePath('/admin/works')
  revalidatePath('/works')
  revalidatePath('/')
  return { ok: true, id: workId }
}

export async function deleteWork(id: number): Promise<Res> {
  await guard()
  await pool.query('DELETE FROM works WHERE id = $1', [id])
  revalidatePath('/admin/works')
  revalidatePath('/works')
  return { ok: true }
}

export async function toggleHidden(id: number): Promise<Res> {
  await guard()
  await pool.query('UPDATE works SET is_hidden = NOT is_hidden, updated_at = NOW() WHERE id = $1', [id])
  revalidatePath('/admin/works')
  revalidatePath('/works')
  return { ok: true }
}

export async function togglePublish(id: number): Promise<Res> {
  await guard()
  await pool.query(
    `UPDATE works SET status = CASE WHEN status='published' THEN 'draft' ELSE 'published' END,
     updated_at = NOW() WHERE id = $1`, [id],
  )
  revalidatePath('/admin/works')
  revalidatePath('/works')
  return { ok: true }
}

/* ---------- หมวดหมู่ ---------- */
export async function saveCategory(f: FormData): Promise<Res> {
  await guard()
  const id = Number(f.get('id') ?? 0)
  const code = String(f.get('code') ?? '').trim()
  const name = String(f.get('name') ?? '').trim()
  const color = String(f.get('color') ?? '#2563eb')
  const sort = Number(f.get('sort_order')) || 0
  if (!code || !name) return { ok: false, error: 'กรุณากรอกรหัสและชื่อหมวดหมู่' }

  if (id > 0) {
    await pool.query('UPDATE categories SET code=$1, name=$2, color=$3, sort_order=$4 WHERE id=$5',
      [code, name, color, sort, id])
  } else {
    await pool.query('INSERT INTO categories (code, name, color, sort_order) VALUES ($1,$2,$3,$4)',
      [code, name, color, sort])
  }
  revalidatePath('/admin/categories')
  return { ok: true }
}

export async function deleteCategory(id: number): Promise<Res> {
  await guard()
  const used = await q<{ n: string }>('SELECT COUNT(*) AS n FROM works WHERE category_id = $1', [id])
  if (Number(used[0].n) > 0) return { ok: false, error: 'ยังมีผลงานอยู่ในหมวดนี้ ไม่สามารถลบได้' }
  await pool.query('DELETE FROM categories WHERE id = $1', [id])
  revalidatePath('/admin/categories')
  return { ok: true }
}

/* ---------- โปรไฟล์ ---------- */
export async function saveProfile(f: FormData): Promise<Res> {
  await guard()
  await pool.query(
    `UPDATE profile SET full_name=$1, position=$2, org=$3, email=$4, phone=$5, about=$6, photo_ref=$7 WHERE id=1`,
    [String(f.get('full_name') ?? ''), String(f.get('position') ?? ''), String(f.get('org') ?? ''),
     String(f.get('email') ?? ''), String(f.get('phone') ?? ''), String(f.get('about') ?? ''),
     String(f.get('photo_ref') ?? '')],
  )
  revalidatePath('/')
  revalidatePath('/admin/profile')
  return { ok: true }
}
