export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[color:var(--border)] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-[12.5px] text-ink-muted">
        © {new Date().getFullYear() + 543} — ระบบบันทึกผลการปฏิบัติงาน นักวิชาการศึกษา
      </div>
    </footer>
  )
}
