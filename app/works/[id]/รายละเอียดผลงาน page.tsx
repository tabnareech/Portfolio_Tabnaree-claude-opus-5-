import { notFound } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import DriveImage from '@/components/DriveImage'
import Gallery from '@/components/Gallery'
import { q, one, pool } from '@/lib/db'
import { thaiDate } from '@/lib/format'
import type { WorkRow, WorkImage } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function WorkDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const w = await one<WorkRow>(
    `SELECT w.*, c.code AS category_code, c.name AS category_name, c.color AS category_color
     FROM works w LEFT JOIN categories c ON c.id = w.category_id
     WHERE w.id = $1 AND w.is_hidden = FALSE AND w.status = 'published'`,
    [Number(id)],
  )
  if (!w) notFound()

  await pool.query('UPDATE works SET view_count = view_count + 1 WHERE id = $1', [w.id])
  const images = await q<WorkImage>(
    'SELECT * FROM work_images WHERE work_id = $1 ORDER BY sort_order, id', [w.id],
  )

  const Block = ({ icon, title, text }: { icon: string; title: string; text: string }) =>
    text ? (
      <section className="card p-5">
        <h2 className="font-bold text-[14.5px] flex items-center gap-2 mb-2">
          <span>{icon}</span>{title}
        </h2>
        <p className="text-[13.5px] text-ink-soft leading-relaxed whitespace-pre-line">{text}</p>
      </section>
    ) : null

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 space-y-5">
        <Link href="/works" className="text-[13px] font-bold text-primary hover:underline">← กลับไปหน้าผลงาน</Link>

        <header className="card overflow-hidden">
          {w.cover_ref && (
            <div className="aspect-[16/7] bg-slate-100">
              <DriveImage refId={w.cover_ref} alt={w.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-6">
            {w.category_name && (
              <span className="chip" style={{ background: `${w.category_color}1a`, color: w.category_color ?? '#2563eb' }}>
                {w.category_code} {w.category_name}
              </span>
            )}
            <h1 className="text-2xl font-bold mt-2.5 leading-snug">{w.title}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-ink-muted mt-3">
              <span>📅 รอบ {w.round} / ปีงบประมาณ {w.fiscal_year}</span>
              <span>🕒 อัปเดต {thaiDate(w.updated_at)}</span>
              <span>👁️ {w.view_count.toLocaleString('th-TH')} ครั้ง</span>
            </div>
            {w.summary && <p className="text-[13.5px] text-ink-soft mt-4 leading-relaxed">{w.summary}</p>}
          </div>
        </header>

        <Block icon="📌" title="หลักการและเหตุผล / สภาพปัญหา" text={w.rationale} />
        <Block icon="🛠️" title="วิธีการดำเนินการ" text={w.method} />

        {(w.target_qty || w.target_qual) && (
          <section className="card p-5">
            <h2 className="font-bold text-[14.5px] flex items-center gap-2 mb-3">🎯 เป้าหมายการดำเนินงาน</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {w.target_qty && (
                <div className="rounded-xl bg-primary-soft p-4">
                  <b className="block text-[12.5px] text-primary-deep mb-1">เชิงปริมาณ</b>
                  <p className="text-[13px] text-ink-soft whitespace-pre-line">{w.target_qty}</p>
                </div>
              )}
              {w.target_qual && (
                <div className="rounded-xl bg-emerald-50 p-4">
                  <b className="block text-[12.5px] text-emerald-700 mb-1">เชิงคุณภาพ</b>
                  <p className="text-[13px] text-ink-soft whitespace-pre-line">{w.target_qual}</p>
                </div>
              )}
            </div>
          </section>
        )}

        <Block icon="🏆" title="ผลลัพธ์และความสำเร็จ" text={w.outcome} />

        {images.length > 0 && (
          <section className="card p-5">
            <h2 className="font-bold text-[14.5px] flex items-center gap-2 mb-3">🖼️ ภาพประกอบ</h2>
            <Gallery images={images} />
          </section>
        )}

        {w.doc_url && (
          <a href={w.doc_url} target="_blank" rel="noreferrer" className="btn btn-primary w-full justify-center">
            📎 เปิดเอกสารหลักฐานประกอบ
          </a>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
