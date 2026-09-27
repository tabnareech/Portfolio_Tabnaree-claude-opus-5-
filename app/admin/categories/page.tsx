import CategoryManager from './CategoryManager'
import { q } from '@/lib/db'
import type { Category } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const rows = await q<Category>('SELECT * FROM categories ORDER BY sort_order, id')
  return (
    <div className="space-y-5">
      <div className="card px-5 py-4 flex items-center gap-3">
        <span className="w-1.5 h-9 rounded-full bg-primary" />
        <div><h1 className="text-xl font-bold">หมวดหมู่ภาระงาน</h1>
          <p className="text-[12.5px] text-ink-muted">จัดกลุ่มผลงานตามลักษณะงานที่รับผิดชอบ</p></div>
      </div>
      <CategoryManager rows={rows} />
    </div>
  )
}
