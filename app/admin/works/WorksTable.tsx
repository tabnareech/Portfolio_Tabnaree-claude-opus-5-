'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteWork, toggleHidden, togglePublish } from '../actions'
import type { WorkRow } from '@/lib/types'

export default function WorksTable({ rows }: { rows: WorkRow[] }) {
  const router = useRouter()
  const [kw, setKw] = useState('')
  const [, start] = useTransition()

  const n = kw.trim().toLowerCase()
  const shown = n
    ? rows.filter((r) => [r.title, r.category_name ?? '', String(r.fiscal_year)].join(' ').toLowerCase().includes(n))
    : rows

  const run = (fn: () => Promise<unknown>) => { void fn().then(() => start(() => router.refresh())) }

  return (
    <>
      <div className="flex justify-between items-center gap-3 flex-wrap mb-4">
        <label className="flex items-center gap-2 bg-white border-2 border-[color:var(--border)] focus-within:border-primary rounded-full px-3.5 py-1.5">
          <span>🔍</span>
          <input type="search" placeholder="ค้นหาผลงาน…" value={kw} onChange={(e) => setKw(e.target.value)}
            className="bg-transparent outline-none w-48 text-[13px]" />
        </label>
        <span className="text-[12.5px] text-ink-muted">แสดง {shown.length} จาก {rows.length} รายการ</span>
      </div>

      <div className="overflow-x-auto">
        <table className="adm-table">
          <thead>
            <tr>
              <th className="col-no">#</th><th>ชื่อผลงาน / โครงการ</th><th>หมวดหมู่ภาระงาน</th>
              <th>รอบ / ปีงบฯ</th><th>สถานะ</th><th>เข้าชม</th><th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((w, i) => (
              <tr key={w.id}>
                <td className="col-no" data-label="ลำดับ">{i + 1}</td>
                <td data-label="ชื่อผลงาน"><b className="text-ink">{w.title}</b></td>
                <td data-label="หมวดหมู่">
                  {w.category_name ? (
                    <span className="chip" style={{ background: `${w.category_color}1a`, color: w.category_color ?? '' }}>
                      {w.category_code} {w.category_name}
                    </span>
                  ) : '—'}
                </td>
                <td data-label="รอบ / ปีงบฯ">รอบ {w.round}/{w.fiscal_year}</td>
                <td data-label="สถานะ">
                  {w.is_hidden
                    ? <span className="chip chip-muted">🙈 ซ่อน</span>
                    : <span className={`chip ${w.status === 'published' ? 'chip-ok' : 'chip-draft'}`}>
                        {w.status === 'published' ? 'เผยแพร่' : 'ฉบับร่าง'}
                      </span>}
                </td>
                <td data-label="เข้าชม">{w.view_count || '—'}</td>
                <td data-label="จัดการ">
                  <div className="flex gap-1.5">
                    <button type="button" className="icon-btn" title={w.is_hidden ? 'แสดงผล' : 'ซ่อนการแสดงผล'}
                      onClick={() => run(() => toggleHidden(w.id))}>{w.is_hidden ? '🙈' : '👁️'}</button>
                    <button type="button" className="icon-btn" title="สลับเผยแพร่ / ฉบับร่าง"
                      onClick={() => run(() => togglePublish(w.id))}>{w.status === 'published' ? '📢' : '📝'}</button>
                    <Link href={`/admin/works/${w.id}`} className="icon-btn" title="แก้ไข">✏️</Link>
                    <button type="button" className="icon-btn del" title="ลบ"
                      onClick={() => { if (confirm(`ยืนยันการลบ "${w.title}" ?`)) run(() => deleteWork(w.id)) }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
            {!shown.length && <tr><td colSpan={7} className="text-center text-ink-muted py-10">ไม่พบข้อมูล</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )
}
