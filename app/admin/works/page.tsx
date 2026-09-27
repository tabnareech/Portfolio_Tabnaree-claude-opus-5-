import Link from 'next/link'
import WorksTable from './WorksTable'
import { q } from '@/lib/db'
import type { WorkRow } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminWorks() {
  const rows = await q<WorkRow>(`
    SELECT w.*, c.code AS category_code, c.name AS category_name, c.color AS category_color
    FROM works w LEFT JOIN categories c ON c.id = w.category_id
    ORDER BY w.fiscal_year DESC, w.id DESC
  `)

  return (
    <div className="space-y-5">
      <div className="card px-5 py-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-9 rounded-full bg-primary" />
          <div>
            <h1 className="text-xl font-bold">ผลงาน / โครงการ</h1>
            <p className="text-[12.5px] text-ink-muted">เพิ่ม แก้ไข ซ่อน หรือลบรายการผลการปฏิบัติงาน</p>
          </div>
        </div>
        <Link href="/admin/works/new" className="btn btn-primary">+ เพิ่มผลงานใหม่</Link>
      </div>

      <section className="card p-5"><WorksTable rows={rows} /></section>
    </div>
  )
}
