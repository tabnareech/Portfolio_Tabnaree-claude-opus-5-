import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import WorkCard from '@/components/WorkCard'
import DriveImage from '@/components/DriveImage'
import { q, one } from '@/lib/db'
import type { Profile, WorkRow } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const p = await one<Profile>('SELECT * FROM profile WHERE id = 1')
  const works = await q<WorkRow>(`
    SELECT w.*, c.code AS category_code, c.name AS category_name, c.color AS category_color
    FROM works w LEFT JOIN categories c ON c.id = w.category_id
    WHERE w.is_hidden = FALSE AND w.status = 'published'
    ORDER BY w.fiscal_year DESC, w.id DESC LIMIT 6
  `)
  const stat = await one<{ total: string; years: string }>(`
    SELECT COUNT(*) AS total, COUNT(DISTINCT fiscal_year) AS years
    FROM works WHERE is_hidden = FALSE AND status = 'published'
  `)

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* แนะนำตัว */}
        <section className="card p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden bg-slate-100 shrink-0 ring-4 ring-primary-soft">
            <DriveImage refId={p?.photo_ref ?? ''} alt={p?.full_name ?? 'รูปโปรไฟล์'} size={600}
              className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 text-center md:text-left">
            <span className="chip chip-ok">{p?.position}</span>
            <h1 className="text-2xl md:text-3xl font-bold mt-2">{p?.full_name}</h1>
            <p className="text-ink-muted text-[13.5px] mt-1">{p?.org}</p>
            <p className="text-[13.5px] text-ink-soft mt-3 leading-relaxed whitespace-pre-line">{p?.about}</p>
            <div className="flex gap-2 justify-center md:justify-start mt-4 flex-wrap">
              <Link href="/works" className="btn btn-primary">ดูผลงานทั้งหมด</Link>
              {p?.email && <a href={`mailto:${p.email}`} className="btn btn-ghost">{p.email}</a>}
            </div>
          </div>
        </section>

        {/* สถิติ */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
          <div className="card p-5 text-center">
            <b className="block text-3xl text-primary">{stat?.total ?? 0}</b>
            <span className="text-[12.5px] text-ink-muted">ผลงานที่เผยแพร่</span>
          </div>
          <div className="card p-5 text-center">
            <b className="block text-3xl text-emerald-600">{stat?.years ?? 0}</b>
            <span className="text-[12.5px] text-ink-muted">ปีงบประมาณ</span>
          </div>
          <div className="card p-5 text-center col-span-2 md:col-span-1">
            <b className="block text-3xl text-amber-600">5</b>
            <span className="text-[12.5px] text-ink-muted">หมวดหมู่ภาระงาน</span>
          </div>
        </section>

        {/* ผลงานล่าสุด */}
        <section className="mt-10">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl font-bold">ผลงานล่าสุด</h2>
            <Link href="/works" className="text-[13px] font-bold text-primary hover:underline">ดูทั้งหมด →</Link>
          </div>
          {works.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {works.map((w) => <WorkCard key={w.id} w={w} />)}
            </div>
          ) : (
            <p className="card p-10 text-center text-ink-muted text-[13px]">ยังไม่มีผลงานที่เผยแพร่</p>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
