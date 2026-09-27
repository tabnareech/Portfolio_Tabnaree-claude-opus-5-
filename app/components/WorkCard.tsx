import Link from 'next/link'
import DriveImage from './DriveImage'
import type { WorkRow } from '@/lib/types'

export default function WorkCard({ w }: { w: WorkRow }) {
  return (
    <Link href={`/works/${w.id}`} className="card overflow-hidden group hover:-translate-y-1 transition block">
      <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
        <DriveImage refId={w.cover_ref} alt={w.title} size={800}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
      </div>
      <div className="p-4">
        {w.category_name && (
          <span className="chip" style={{ background: `${w.category_color}1a`, color: w.category_color ?? '#2563eb' }}>
            {w.category_code} {w.category_name}
          </span>
        )}
        <h3 className="font-bold text-[15px] mt-2 leading-snug line-clamp-2">{w.title}</h3>
        <p className="text-[12.5px] text-ink-muted mt-1 line-clamp-2">{w.summary}</p>
        <p className="text-[11.5px] text-ink-muted mt-2.5">
          รอบ {w.round} / ปีงบประมาณ {w.fiscal_year}
        </p>
      </div>
    </Link>
  )
}
