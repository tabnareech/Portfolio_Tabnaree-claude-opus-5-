import { imageUrl } from '@/lib/drive'

export default function DriveImage({
  refId, alt, className, size = 1600,
}: { refId: string; alt: string; className?: string; size?: number }) {
  const src = imageUrl(refId, size)
  if (!src) {
    return (
      <div className={`grid place-items-center bg-slate-100 text-slate-400 text-[12px] ${className ?? ''}`}>
        ไม่มีรูปภาพ
      </div>
    )
  }
  // ใช้ img ปกติเพราะ Drive ไม่รองรับการ optimize ของ next/image ทุกกรณี
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" referrerPolicy="no-referrer" className={className} />
}
