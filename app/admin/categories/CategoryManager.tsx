'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveCategory, deleteCategory } from '../actions'
import type { Category } from '@/lib/types'

export default function CategoryManager({ rows }: { rows: Category[] }) {
  const router = useRouter()
  const [err, setErr] = useState('')
  const [, start] = useTransition()

  async function add(f: FormData) {
    const r = await saveCategory(f)
    if (!r.ok) { setErr(r.error); return }
    setErr(''); start(() => router.refresh())
  }

  async function remove(c: Category) {
    if (!confirm(`ลบหมวดหมู่ "${c.name}" ?`)) return
    const r = await deleteCategory(c.id)
    if (!r.ok) { alert(r.error); return }
    start(() => router.refresh())
  }

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
      <section className="card p-5 overflow-x-auto">
        <table className="adm-table">
          <thead><tr><th className="col-no">#</th><th>รหัส</th><th>ชื่อหมวดหมู่</th><th>สี</th><th>ลบ</th></tr></thead>
          <tbody>
            {rows.map((c, i) => (
              <tr key={c.id}>
                <td className="col-no" data-label="ลำดับ">{i + 1}</td>
                <td data-label="รหัส"><b>{c.code}</b></td>
                <td data-label="ชื่อหมวดหมู่">{c.name}</td>
                <td data-label="สี"><span className="inline-block w-6 h-6 rounded-lg" style={{ background: c.color }} /></td>
                <td data-label="ลบ">
                  <button type="button" className="icon-btn del" onClick={() => void remove(c)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <form action={add} className="card p-5 space-y-3">
        <h2 className="font-bold text-[15px]">➕ เพิ่มหมวดหมู่</h2>
        <input type="hidden" name="id" value={0} />
        <div><label className="lbl req" htmlFor="c_code">รหัส</label>
          <input className="inp" id="c_code" name="code" required maxLength={10} placeholder="06" /></div>
        <div><label className="lbl req" htmlFor="c_name">ชื่อหมวดหมู่</label>
          <input className="inp" id="c_name" name="name" required placeholder="งานสารสนเทศทางการศึกษา" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="lbl" htmlFor="c_color">สี</label>
            <input className="inp h-11 p-1" id="c_color" name="color" type="color" defaultValue="#2563eb" /></div>
          <div><label className="lbl" htmlFor="c_sort">ลำดับ</label>
            <input className="inp" id="c_sort" name="sort_order" type="number" defaultValue={rows.length + 1} /></div>
        </div>
        <span className="field-error">{err}</span>
        <button className="btn btn-primary w-full justify-center">บันทึกหมวดหมู่</button>
      </form>
    </div>
  )
}
