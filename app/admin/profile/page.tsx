import { one } from '@/lib/db'
import { saveProfile } from '../actions'
import type { Profile } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const p = await one<Profile>('SELECT * FROM profile WHERE id = 1')

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="card px-5 py-4 flex items-center gap-3">
        <span className="w-1.5 h-9 rounded-full bg-primary" />
        <div><h1 className="text-xl font-bold">ข้อมูลส่วนตัว</h1>
          <p className="text-[12.5px] text-ink-muted">แสดงบนหน้าแรกของเว็บไซต์</p></div>
      </div>

      <form action={saveProfile} className="card p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="lbl req" htmlFor="full_name">ชื่อ-นามสกุล</label>
            <input className="inp" id="full_name" name="full_name" required defaultValue={p?.full_name ?? ''} /></div>
          <div><label className="lbl" htmlFor="position">ตำแหน่ง</label>
            <input className="inp" id="position" name="position" defaultValue={p?.position ?? 'นักวิชาการศึกษา'} /></div>
        </div>
        <div><label className="lbl" htmlFor="org">หน่วยงาน / สังกัด</label>
          <input className="inp" id="org" name="org" defaultValue={p?.org ?? ''} /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="lbl" htmlFor="email">อีเมล</label>
            <input className="inp" id="email" name="email" type="email" defaultValue={p?.email ?? ''} /></div>
          <div><label className="lbl" htmlFor="phone">เบอร์โทรศัพท์</label>
            <input className="inp" id="phone" name="phone" defaultValue={p?.phone ?? ''} /></div>
        </div>
        <div><label className="lbl" htmlFor="about">เกี่ยวกับฉัน</label>
          <textarea className="inp" id="about" name="about" rows={4} defaultValue={p?.about ?? ''} /></div>
        <div><label className="lbl" htmlFor="photo_ref">รูปโปรไฟล์ (ลิงก์ Google Drive)</label>
          <input className="inp" id="photo_ref" name="photo_ref" defaultValue={p?.photo_ref ?? ''} /></div>

        <div className="flex justify-end"><button className="btn btn-primary">💾 บันทึกข้อมูล</button></div>
      </form>
    </div>
  )
}
