import Link from 'next/link'
import { one } from '@/lib/db'
import type { Profile } from '@/lib/types'

export default async function SiteHeader() {
  const p = await one<Profile>('SELECT * FROM profile WHERE id = 1')
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-[color:var(--border)]">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <span className="w-9 h-9 rounded-xl bg-primary text-white grid place-items-center font-bold">ว</span>
          <span className="min-w-0">
            <b className="block text-[14.5px] truncate">{p?.full_name ?? 'ผลงานของฉัน'}</b>
            <span className="block text-[11.5px] text-ink-muted truncate">{p?.position ?? 'นักวิชาการศึกษา'}</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-[13px] font-bold">
          <Link href="/" className="px-3 py-2 rounded-lg hover:bg-primary-soft">หน้าแรก</Link>
          <Link href="/works" className="px-3 py-2 rounded-lg hover:bg-primary-soft">ผลงาน</Link>
          <Link href="/admin" className="btn btn-primary btn-sm ml-1">จัดการ</Link>
        </nav>
      </div>
    </header>
  )
}
