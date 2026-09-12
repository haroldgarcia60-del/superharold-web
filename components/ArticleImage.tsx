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

    function handleKeyDown(event: KeyboardEvent) {
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
      {/* IMAGEN DEL ARTÍCULO */}
      <figure className="my-10">

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mx-auto block max-w-[500px] cursor-zoom-in overflow-hidden rounded-2xl border border-surface-light bg-background transition hover:border-primary/60"
          aria-label="Ampliar imagen"
        >
          <Image
            src={src}
            alt={alt}
            width={1000}
            height={700}
            className="h-auto w-full object-contain"
            sizes="(max-width: 550px) 100vw, 500px"
          />
        </button>

        {caption && (
          <figcaption className="mx-auto mt-3 max-w-[500px] text-center text-sm italic leading-6 text-text-secondary">
            {caption}
          </figcaption>
        )}

      </figure>

      {/* ZOOM / LIGHTBOX */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 md:p-8"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Imagen ampliada"
        >

          {/* CERRAR */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-3xl text-white transition hover:bg-black"
            aria-label="Cerrar imagen"
          >
            ×
          </button>

          {/* IMAGEN AMPLIADA */}
          <div
            className="relative flex h-full w-full flex-col items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >

            <Image
              src={src}
              alt={alt}
              width={2000}
              height={1400}
              className="max-h-[90vh] max-w-[95vw] object-contain"
              sizes="95vw"
              priority
            />

            {/* PIE DE FOTO EN EL ZOOM */}
            {caption && (
              <div className="mt-4 max-w-3xl rounded-xl bg-black/70 px-4 py-2 text-center text-sm text-white/80">
                {caption}
              </div>
            )}

          </div>

        </div>
      )}
    </>
  )
}