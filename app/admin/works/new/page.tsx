import WorkForm from '../WorkForm'
import { q } from '@/lib/db'
import type { Category } from '@/lib/types'

export default async function NewWork() {
  const categories = await q<Category>('SELECT * FROM categories ORDER BY sort_order, id')
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="card px-5 py-4 flex items-center gap-3">
        <span className="w-1.5 h-9 rounded-full bg-primary" />
        <div><h1 className="text-xl font-bold">เพิ่มผลงานใหม่</h1>
          <p className="text-[12.5px] text-ink-muted">บันทึกรายละเอียดผลการปฏิบัติงานหรือโครงการ</p></div>
      </div>
      <WorkForm categories={categories} />
    </div>
  )
}
