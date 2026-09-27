'use client'

import { useActionState } from 'react'
import { login } from '../actions'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, { error: '' })

  return (
    <main className="min-h-screen grid place-items-center p-4 bg-slate-100">
      <form action={action} className="card p-7 w-full max-w-sm">
        <div className="text-center mb-6">
          <span className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-primary text-white text-2xl mb-3">🔐</span>
          <h1 className="text-lg font-bold">เข้าสู่ระบบผู้ดูแล</h1>
          <p className="text-[12.5px] text-ink-muted mt-1">ระบบบันทึกผลการปฏิบัติงาน</p>
        </div>

        <div className="mb-4">
          <label className="lbl req" htmlFor="u">ชื่อผู้ใช้</label>
          <input className="inp" id="u" name="username" required autoComplete="username" />
        </div>
        <div className="mb-2">
          <label className="lbl req" htmlFor="p">รหัสผ่าน</label>
          <input className="inp" id="p" name="password" type="password" required autoComplete="current-password" />
        </div>
        <span className="field-error">{state?.error}</span>

        <button type="submit" className="btn btn-primary w-full justify-center mt-3" disabled={pending}>
          {pending ? 'กำลังตรวจสอบ…' : 'เข้าสู่ระบบ'}
        </button>
      </form>
    </main>
  )
}
