import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import WorkCard from '@/components/WorkCard'
import { q } from '@/lib/db'
import type { Category, WorkRow } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function WorksPage({
  searchParams,
}: { searchParams: Promise<{ cat?: string; year?: string }> }) {
  const sp = await searchParams
  const cat = sp.cat ? Number(sp.cat) : 0
  const year = sp.year ? Number(sp.year) : 0

  const cats = await q<Category>('SELECT * FROM categories ORDER BY sort_order, id')
  const years = await q<{ fiscal_year: number }>(
    `SELECT DISTINCT fiscal_year FROM works WHERE is_hidden = FALSE AND status='published' ORDER BY fiscal_year DESC`,
  )

  const works = await q<WorkRow>(
    `SELECT w.*, c.code AS category_code, c.name AS category_name, c.color AS category_color
     FROM works w LEFT JOIN categories c ON c.id = w.category_id
     WHERE w.is_hidden = FALSE AND w.status = 'published'
       AND ($1::int = 0 OR w.category_id = $1)
       AND ($2::int = 0 OR w.fiscal_year = $2)
     ORDER BY w.fiscal_year DESC, w.id DESC`,
    [cat, year],
  )

  const link = (c: number, y: number) => {
    const p = new URLSearchParams()
    if (c) p.set('cat', String(c))
    if (y) p.set('year', String(y))
    return `/works${p.toString() ? `?${p}` : ''}`
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold">ผลงานและโครงการ</h1>
        <p className="text-[13px] text-ink-muted mt-1">ทั้งหมด {works.length} รายการ</p>

        <div className="card p-4 mt-5 space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[12px] font-bold text-ink-muted w-24">หมวดหมู่งาน</span>
            <Link href={link(0, year)} className={`chip ${cat === 0 ? 'chip-ok' : 'chip-muted'}`}>ทั้งหมด</Link>
            {cats.map((c) => (
              <Link key={c.id} href={link(c.id, year)}
                className="chip"
                style={cat === c.id
                  ? { background: c.color, color: '#fff' }
                  : { background: `${c.color}1a`, color: c.color }}>
                {c.code} {c.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[12px] font-bold text-ink-muted w-24">ปีงบประมาณ</span>
            <Link href={link(cat, 0)} className={`chip ${year === 0 ? 'chip-ok' : 'chip-muted'}`}>ทุกปี</Link>
            {years.map((y) => (
              <Link key={y.fiscal_year} href={link(cat, y.fiscal_year)}
                className={`chip ${year === y.fiscal_year ? 'chip-ok' : 'chip-muted'}`}>
                {y.fiscal_year}
              </Link>
            ))}
          </div>
        </div>

        {works.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {works.map((w) => <WorkCard key={w.id} w={w} />)}
          </div>
        ) : (
          <p className="card p-12 text-center text-ink-muted text-[13px] mt-6">ไม่พบผลงานตามเงื่อนไขที่เลือก</p>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
