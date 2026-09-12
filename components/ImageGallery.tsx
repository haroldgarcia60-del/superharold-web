'use client'

import Image from 'next/image'
import {useEffect, useState} from 'react'
import {urlFor} from '@/sanity/lib/image'

type GalleryImage = {
  _key?: string
  asset?: {
    _ref: string
    _type: string
  }
  alt?: string
  caption?: string
}

type ImageGalleryProps = {
  title?: string
  images?: GalleryImage[]
}

export default function ImageGallery({
  title,
  images = [],
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  function previousImage() {
    setCurrentIndex((current) =>
      current === 0 ? images.length - 1 : current - 1
    )
  }

  function nextImage() {
    setCurrentIndex((current) =>
      current === images.length - 1 ? 0 : current + 1
    )
  }

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }

      if (event.key === 'ArrowLeft') {
        setCurrentIndex((current) =>
          current === 0 ? images.length - 1 : current - 1
        )
      }

      if (event.key === 'ArrowRight') {
        setCurrentIndex((current) =>
          current === images.length - 1 ? 0 : current + 1
        )
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, images.length])

  if (images.length === 0) {
    return null
  }

  const currentImage = images[currentIndex]

  const normalImageUrl = currentImage?.asset
    ? urlFor(currentImage)
        .width(1000)
        .url()
    : ''

  const zoomImageUrl = currentImage?.asset
    ? urlFor(currentImage)
        .width(2000)
        .url()
    : ''

  return (
    <>
      <figure className="mx-auto my-8 w-full max-w-xl">

        {/* TÍTULO DE LA GALERÍA */}
        {title && (
          <h2 className="mb-4 text-2xl font-black text-white md:text-3xl">
            {title}
          </h2>
        )}

        {/* SLIDER */}
        <div className="overflow-hidden rounded-2xl border border-surface-light bg-background">

          {/* IMAGEN */}
          <div className="relative flex items-center justify-center p-3 md:p-4">

            {currentImage?.asset && (
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="cursor-zoom-in"
                aria-label="Ampliar imagen"
              >
                <Image
                  src={normalImageUrl}
                  alt={currentImage.alt || 'Imagen de la galería'}
                  width={1000}
                  height={700}
                  className="h-auto max-h-[260px] w-auto max-w-full object-contain md:max-h-[340px]"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </button>
            )}

            {/* FLECHA IZQUIERDA */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={previousImage}
                aria-label="Imagen anterior"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/70 text-2xl font-bold text-white transition hover:border-primary hover:text-primary"
              >
                ‹
              </button>
            )}

            {/* FLECHA DERECHA */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={nextImage}
                aria-label="Imagen siguiente"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/70 text-2xl font-bold text-white transition hover:border-primary hover:text-primary"
              >
                ›
              </button>
            )}

          </div>

          {/* INFORMACIÓN */}
          <div className="border-t border-surface-light px-4 py-3">

            <div className="flex items-start justify-between gap-4">

              {/* PIE DE IMAGEN */}
              <div className="min-w-0 flex-1">
                {currentImage.caption ? (
                  <figcaption className="text-sm leading-6 text-text-secondary">
                    {currentImage.caption}
                  </figcaption>
                ) : (
                  <span className="text-sm text-text-secondary">
                    Imagen de la galería
                  </span>
                )}
              </div>

              {/* CONTADOR */}
              <span className="shrink-0 rounded-full bg-surface-light px-3 py-1 text-xs font-bold text-primary">
                {currentIndex + 1} / {images.length}
              </span>

            </div>

          </div>

        </div>

        {/* PUNTOS DE NAVEGACIÓN */}
        {images.length > 1 && images.length <= 12 && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {images.map((image, index) => (
              <button
                key={image._key || index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Ver imagen ${index + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  index === currentIndex
                    ? 'bg-primary'
                    : 'bg-surface-light hover:bg-text-secondary'
                }`}
              />
            ))}
          </div>
        )}

      </figure>

      {/* ZOOM / LIGHTBOX */}
      {isOpen && currentImage?.asset && (
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

          {/* ANTERIOR */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                previousImage()
              }}
              className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-4xl text-white transition hover:bg-black"
              aria-label="Imagen anterior"
            >
              ‹
            </button>
          )}

          {/* IMAGEN AMPLIADA */}
          <div
            className="relative flex h-full w-full items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={zoomImageUrl}
              alt={currentImage.alt || 'Imagen ampliada'}
              width={2000}
              height={1400}
              className="max-h-[95vh] max-w-[95vw] object-contain"
              sizes="95vw"
              priority
            />
          </div>

          {/* SIGUIENTE */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                nextImage()
              }}
              className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-4xl text-white transition hover:bg-black"
              aria-label="Imagen siguiente"
            >
              ›
            </button>
          )}

          {/* CONTADOR EN ZOOM */}
          <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm font-bold text-white">
            {currentIndex + 1} / {images.length}
          </div>

        </div>
      )}
    </>
  )
}