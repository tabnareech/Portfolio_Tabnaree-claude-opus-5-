'use client'

import { useState } from 'react'
import { imageUrl } from '@/lib/drive'
import type { WorkImage } from '@/lib/types'

export default function Gallery({ images }: { images: WorkImage[] }) {
  const [open, setOpen] = useState<string | null>(null)
  if (!images.length) return null

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((im) => (
          <button key={im.id} type="button" onClick={() => setOpen(imageUrl(im.image_ref))}
            className="group text-left">
            <span className="block aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl(im.image_ref, 800)} alt={im.caption || 'ภาพประกอบ'} loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition" />
            </span>
            {im.caption && <span className="block text-[11.5px] text-ink-muted mt-1.5">{im.caption}</span>}
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4" onClick={() => setOpen(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={open} alt="ภาพขยาย" referrerPolicy="no-referrer"
            className="max-h-[90vh] max-w-full rounded-xl shadow-2xl" />
        </div>
      )}
    </>
  )
}
