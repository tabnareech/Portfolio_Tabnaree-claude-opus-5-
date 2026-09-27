'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveWork } from '../actions'
import { imageUrl } from '@/lib/drive'
import type { Category, Work, WorkImage } from '@/lib/types'
import { currentFiscalYear } from '@/lib/format'

interface ImgRow { key: number; ref: string; caption: string }

export default function WorkForm({
  work, images, categories,
}: { work?: Work; images?: WorkImage[]; categories: Category[] }) {
  const router = useRouter()
  const [cover, setCover] = useState(work?.cover_ref ?? '')
  const [rows, setRows] = useState<ImgRow[]>(
    (images ?? []).map((im, i) => ({ key: i, ref: im.image_ref, caption: im.caption })),
  )
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const addRow = () => setRows((r) => [...r, { key: Date.now(), ref: '', caption: '' }])
  const delRow = (k: number) => setRows((r) => r.filter((x) => x.key !== k))
  const patch = (k: number, p: Partial<ImgRow>) =>
    setRows((r) => r.map((x) => (x.key === k ? { ...x, ...p } : x)))

  async function submit(f: FormData) {
    setBusy(true); setErr('')
    try {
      const res = await saveWork(f)
      if (!res.ok) { setErr(res.error); return }
      router.push('/admin/works')
      router.refresh()
    } finally { setBusy(false) }
  }

  return (
    <form action={submit} autoComplete="off" className="space-y-5">
      <input type="hidden" name="id" value={work?.id ?? 0} />

      {/* ข้อมูลหลัก */}
      <section className="card p-5 space-y-4">
        <h2 className="font-bold text-[15px]">📝 ข้อมูลหลัก</h2>

        <div>
          <label className="lbl req" htmlFor="title">ชื่อผลงาน / โครงการ</label>
          <input className="inp" id="title" name="title" required maxLength={300} defaultValue={work?.title ?? ''} />
          <span className="field-error">{err}</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="lbl" htmlFor="category_id">หมวดหมู่ภาระงาน</label>
            <select className="inp" id="category_id" name="category_id" defaultValue={work?.category_id ?? ''}>
              <option value="">— ไม่ระบุ —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.code} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl" htmlFor="fiscal_year">ปีงบประมาณ (พ.ศ.)</label>
            <input className="inp" id="fiscal_year" name="fiscal_year" type="number" min={2500} max={2700}
              defaultValue={work?.fiscal_year ?? currentFiscalYear()} />
          </div>
          <div>
            <label className="lbl" htmlFor="round">รอบการปฏิบัติงาน</label>
            <select className="inp" id="round" name="round" defaultValue={work?.round ?? 1}>
              <option value="1">รอบที่ 1</option>
              <option value="2">รอบที่ 2</option>
            </select>
          </div>
        </div>

        <div>
          <label className="lbl" htmlFor="summary">คำอธิบายโดยย่อ</label>
          <textarea className="inp" id="summary" name="summary" rows={2} maxLength={400}
            placeholder="สรุปสั้นๆ ที่จะแสดงบนการ์ดผลงาน" defaultValue={work?.summary ?? ''} />
        </div>
      </section>

      {/* รายละเอียดการดำเนินงาน */}
      <section className="card p-5 space-y-4">
        <h2 className="font-bold text-[15px]">📋 รายละเอียดการดำเนินงาน</h2>

        <div>
          <label className="lbl" htmlFor="rationale">หลักการและเหตุผล / สภาพปัญหา</label>
          <textarea className="inp" id="rationale" name="rationale" rows={3} defaultValue={work?.rationale ?? ''} />
        </div>
        <div>
          <label className="lbl" htmlFor="method">วิธีการดำเนินการ</label>
          <textarea className="inp" id="method" name="method" rows={4} defaultValue={work?.method ?? ''} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="lbl" htmlFor="target_qty">เป้าหมายเชิงปริมาณ</label>
            <textarea className="inp" id="target_qty" name="target_qty" rows={2}
              placeholder="เช่น จัดอบรม 2 ครั้ง ผู้เข้าร่วม 120 คน" defaultValue={work?.target_qty ?? ''} />
          </div>
          <div>
            <label className="lbl" htmlFor="target_qual">เป้าหมายเชิงคุณภาพ</label>
            <textarea className="inp" id="target_qual" name="target_qual" rows={2}
              placeholder="เช่น ความพึงพอใจไม่น้อยกว่าร้อยละ 85" defaultValue={work?.target_qual ?? ''} />
          </div>
        </div>
        <div>
          <label className="lbl" htmlFor="outcome">ผลลัพธ์ที่ได้ / ความสำเร็จ</label>
          <textarea className="inp" id="outcome" name="outcome" rows={3} defaultValue={work?.outcome ?? ''} />
        </div>
        <div>
          <label className="lbl" htmlFor="doc_url">ลิงก์เอกสารหลักฐาน (Google Drive)</label>
          <input className="inp" id="doc_url" name="doc_url" type="url"
            placeholder="https://drive.google.com/..." defaultValue={work?.doc_url ?? ''} />
        </div>
      </section>

      {/* รูปภาพ */}
      <section className="card p-5 space-y-4">
        <h2 className="font-bold text-[15px]">🖼️ รูปภาพประกอบ</h2>
        <p className="text-[12px] text-ink-soft bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
          💡 วางลิงก์แชร์จาก Google Drive ได้เลย ระบบจะแปลงเป็นรูปภาพให้อัตโนมัติ
          — อย่าลืมตั้งค่าการแชร์ไฟล์เป็น <b>“ทุกคนที่มีลิงก์ • ผู้อ่าน”</b>
        </p>

        <div>
          <label className="lbl" htmlFor="cover_ref">ภาพหน้าปก</label>
          <div className="flex gap-3 items-start">
            <input className="inp flex-1" id="cover_ref" name="cover_ref"
              placeholder="วางลิงก์รูปจาก Google Drive"
              value={cover} onChange={(e) => setCover(e.target.value)} />
            <span className="w-24 h-20 rounded-xl overflow-hidden bg-slate-100 grid place-items-center shrink-0 border border-[color:var(--border)]">
              {imageUrl(cover)
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={imageUrl(cover, 300)} alt="พรีวิว" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                : <span className="text-[11px] text-slate-400">พรีวิว</span>}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {rows.map((r, i) => (
            <div key={r.key} className="flex gap-3 items-start bg-slate-50 rounded-xl p-3">
              <span className="w-6 h-6 rounded-lg bg-white border grid place-items-center text-[11px] font-bold shrink-0 mt-1.5">{i + 1}</span>
              <div className="flex-1 space-y-2 min-w-0">
                <input className="inp" name="img_ref" placeholder="ลิงก์รูปจาก Google Drive"
                  value={r.ref} onChange={(e) => patch(r.key, { ref: e.target.value })} />
                <input className="inp" name="img_caption" placeholder="คำบรรยายภาพ (ไม่บังคับ)"
                  value={r.caption} onChange={(e) => patch(r.key, { caption: e.target.value })} />
              </div>
              <span className="w-20 h-16 rounded-lg overflow-hidden bg-white grid place-items-center shrink-0 border">
                {imageUrl(r.ref)
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={imageUrl(r.ref, 300)} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  : <span className="text-[10px] text-slate-400">พรีวิว</span>}
              </span>
              <button type="button" className="icon-btn del shrink-0" title="ลบรูปนี้"
                onClick={() => delRow(r.key)}>🗑️</button>
            </div>
          ))}
          <button type="button" className="btn btn-ghost btn-sm" onClick={addRow}>+ เพิ่มรูปภาพ</button>
        </div>
      </section>

      {/* การแสดงผล */}
      <section className="card p-5 space-y-3">
        <h2 className="font-bold text-[15px]">⚙️ การแสดงผล</h2>

        <div>
          <label className="lbl" htmlFor="status">สถานะการเผยแพร่</label>
          <select className="inp" id="status" name="status" defaultValue={work?.status ?? 'draft'}>
            <option value="draft">📝 ฉบับร่าง (เห็นเฉพาะหลังบ้าน)</option>
            <option value="published">📢 เผยแพร่บนเว็บไซต์</option>
          </select>
        </div>

        <label className="flex items-center gap-3 bg-primary-soft rounded-2xl px-4 py-3 cursor-pointer" htmlFor="is_hidden">
          <span className="text-lg">🙈</span>
          <span className="flex-1">
            <b className="block text-[12.5px] text-ink-soft">ซ่อนการแสดงผล</b>
            <span className="block text-[11px] text-ink-muted">ซ่อนรายการนี้จากหน้าเว็บไซต์สาธารณะชั่วคราว</span>
          </span>
          <input type="checkbox" id="is_hidden" name="is_hidden" value="1" defaultChecked={work?.is_hidden ?? false}
            className="w-5 h-5 rounded accent-[color:var(--primary)]" />
        </label>
      </section>

      <div className="flex justify-end gap-2 sticky bottom-0 bg-slate-50/90 backdrop-blur py-3">
        <button type="button" className="btn btn-ghost" onClick={() => router.back()}>ยกเลิก</button>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'กำลังบันทึก…' : '💾 บันทึกข้อมูล'}
        </button>
      </div>
    </form>
  )
}
