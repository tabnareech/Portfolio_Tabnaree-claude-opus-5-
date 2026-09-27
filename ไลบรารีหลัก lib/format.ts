export const thaiDate = (d: string | Date) =>
  new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })

export const currentFiscalYear = () => {
  const now = new Date()
  const be = now.getFullYear() + 543
  return now.getMonth() >= 9 ? be + 1 : be // ปีงบประมาณเริ่ม 1 ต.ค.
}
