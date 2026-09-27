import Link from 'next/link'
import { q } from '@/lib/db'
import type { WorkRow } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const [s] = await q<{ total: string; pub: string; hidden: string; views: string }>(`
    SELECT COUNT(*) AS total,
           COUNT(*) FILTER (WHERE status='published' AND is_hidden=FALSE) AS pub,
           COUNT(*) FILTER (WHERE is_hidden=TRUE) AS hidden,
           COALESCE(SUM(view_count),0) AS views
    FROM works
  `)
  const recent = await q<WorkRow>(`
    SELECT w.*, c.code AS category_code, c.name AS category_name, c.color AS category_color
    FROM works w LEFT JOIN categories c ON c.id = w.category_id
    ORDER BY w.updated_at DESC LIMIT 6
  `)

  const Stat = ({ icon, n, label, cls }: { icon: string; n: string | number; label: string; cls: string }) => (
    <div className="card p-5">
      <span className={`inline-grid place-items-center w-10 h-10 rounded-xl text-lg ${cls}`}>{icon}</span>
      <b className="block text-2xl mt-2.5">{Number(n).toLocaleString('th-TH')}</b>
      <span className="text-[12px] text-ink-muted">{label}</span>
    </div>
  )

  return (
    <div className="space-y-5">
      <div className="card px-5 py-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-9 rounded-full bg-primary" />
          <div>
            <h1 className="text-xl font-bold">แดชบอร์ด</h1>
            <p className="text-[12.5px] text-ink-muted">ภาพรวมผลการปฏิบัติงานทั้งหมด</p>
          </div>
        </div>
        <Link href="/admin/works/new" className="btn btn-primary">+ เพิ่มผลงานใหม่</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon="🗂️" n={s.total} label="ผลงานทั้งหมด" cls="bg-primary-soft text-primary" />
        <Stat icon="✅" n={s.pub} label="เผยแพร่อยู่" cls="bg-emerald-50 text-emerald-600" />
        <Stat icon="🙈" n={s.hidden} label="ซ่อนอยู่" cls="bg-slate-100 text-slate-500" />
        <Stat icon="👁️" n={s.views} label="ยอดเข้าชมรวม" cls="bg-amber-50 text-amber-600" />
      </div>

      <section className="card p-5">
        <h2 className="font-bold text-[15px] mb-3">🕒 อัปเดตล่าสุด</h2>
        <div className="overflow-x-auto">
          <table className="adm-table">
            <thead>
              <tr><th className="col-no">#</th><th>ชื่อผลงาน</th><th>หมวดหมู่</th><th>รอบ/ปีงบฯ</th><th>สถานะ</th></tr>
            </thead>
            <tbody>
              {recent.map((w, i) => (
                <tr key={w.id}>
                  <td className="col-no" data-label="ลำดับ">{i + 1}</td>
                  <td data-label="ชื่อผลงาน">
                    <Link href={`/admin/works/${w.id}`} className="font-bold text-ink hover:text-primary">{w.title}</Link>
                  </td>
                  <td data-label="หมวดหมู่">
                    {w.category_name ? (
                      <span className="chip" style={{ background: `${w.category_color}1a`, color: w.category_color ?? '' }}>
                        {w.category_code} {w.category_name}
                      </span>
                    ) : '—'}
                  </td>
                  <td data-label="รอบ/ปีงบฯ">รอบ {w.round}/{w.fiscal_year}</td>
                  <td data-label="สถานะ">
                    {w.is_hidden
                      ? <span className="chip chip-muted">🙈 ซ่อน</span>
                      : <span className={`chip ${w.status === 'published' ? 'chip-ok' : 'chip-draft'}`}>
                          {w.status === 'published' ? 'เผยแพร่' : 'ฉบับร่าง'}
                        </span>}
                  </td>
                </tr>
              ))}
              {!recent.length && <tr><td colSpan={5} className="text-center text-ink-muted py-8">ยังไม่มีข้อมูล</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
