import { notFound } from 'next/navigation'
import WorkForm from '../WorkForm'
import { q, one } from '@/lib/db'
import type { Category, Work, WorkImage } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function EditWork({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const work = await one<Work>('SELECT * FROM works WHERE id = $1', [Number(id)])
  if (!work) notFound()

  const images = await q<WorkImage>('SELECT * FROM work_images WHERE work_id = $1 ORDER BY sort_order, id', [work.id])
  const categories = await q<Category>('SELECT * FROM categories ORDER BY sort_order, id')

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="card px-5 py-4 flex items-center gap-3">
        <span className="w-1.5 h-9 rounded-full bg-primary" />
        <div><h1 className="text-xl font-bold">แก้ไขผลงาน</h1>
          <p className="text-[12.5px] text-ink-muted truncate">{work.title}</p></div>
      </div>
      <WorkForm work={work} images={images} categories={categories} />
    </div>
  )
}
