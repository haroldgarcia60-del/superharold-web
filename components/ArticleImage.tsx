'use client'

import Image from 'next/image'
import {useEffect, useState} from 'react'

type ArticleImageProps = {
  src: string
  alt: string
  caption?: string
}

export default function ArticleImage({
  src,
  alt,
  caption,
}: ArticleImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <figure className="my-10">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mx-auto block max-w-[500px] cursor-zoom-in overflow-hidden rounded-2xl border border-surface-light bg-background"
          aria-label="Ampliar imagen"
        >
          <Image
            src={src}
            alt={alt}
            width={800}
            height={533}
            className="h-auto w-full object-contain"
            sizes="(max-width: 550px) 100vw, 500px"
          />
        </button>

        {caption && (
          <figcaption className="mx-auto mt-3 max-w-[500px] text-center text-sm italic text-text-secondary">
            {caption}
          </figcaption>
        )}
      </figure>

      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 md:p-8"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Imagen ampliada"
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-2xl text-white hover:bg-black"
            aria-label="Cerrar imagen"
          >
            ×
          </button>

          <div
            className="relative flex h-full w-full items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              width={1600}
              height={1200}
              className="max-h-[95vh] max-w-[95vw] object-contain"
              sizes="95vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}