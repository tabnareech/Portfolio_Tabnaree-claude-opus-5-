import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isLoggedIn } from '@/lib/auth'
import { logout } from './actions'
import { headers } from 'next/headers'

const NAV = [
  { href: '/admin', icon: '📊', label: 'แดชบอร์ด' },
  { href: '/admin/works', icon: '🗂️', label: 'ผลงาน / โครงการ' },
  { href: '/admin/categories', icon: '🏷️', label: 'หมวดหมู่ภาระงาน' },
  { href: '/admin/profile', icon: '👤', label: 'ข้อมูลส่วนตัว' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = (await headers()).get('x-pathname') ?? ''
  if (path.startsWith('/admin/login')) return <>{children}</>
  if (!(await isLoggedIn())) redirect('/admin/login')

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-60 bg-white border-r border-[color:var(--border)] p-4 shrink-0">
        <Link href="/" className="flex items-center gap-2 mb-6">
          <span className="w-9 h-9 rounded-xl bg-primary text-white grid place-items-center font-bold">ว</span>
          <b className="text-[14px]">ระบบจัดการ</b>
        </Link>
        <nav className="flex md:flex-col gap-1 overflow-x-auto">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-bold
                         text-ink-soft hover:bg-primary-soft hover:text-primary-deep whitespace-nowrap">
              <span>{n.icon}</span>{n.label}
            </Link>
          ))}
        </nav>
        <form action={logout} className="mt-6">
          <button className="btn btn-ghost w-full justify-center text-[12.5px]">ออกจากระบบ</button>
        </form>
      </aside>
      <main className="flex-1 p-4 md:p-6 bg-slate-50 min-w-0">{children}</main>
    </div>
  )
}
