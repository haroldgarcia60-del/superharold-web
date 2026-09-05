import Image from 'next/image'
import Link from 'next/link'
import {urlFor} from '@/sanity/lib/image'

type ContentCardProps = {
  title: string
  summary?: string
  publishedAt: string
  href: string
  typeLabel: string
  typeColorClass?: string

  coverImage?: {
    asset: {
      _ref: string
      _type: string
    }
    alt?: string
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export default function ContentCard({
  title,
  summary,
  publishedAt,
  href,
  typeLabel,
  typeColorClass = 'text-primary',
  coverImage,
}: ContentCardProps) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-2xl border border-surface-light bg-surface transition duration-300 hover:-translate-y-1 hover:border-primary"
    >
      {/* IMAGEN */}
      <div className="relative aspect-video overflow-hidden bg-background">
        {coverImage?.asset ? (
          <Image
            src={urlFor(coverImage).width(900).url()}
            alt={coverImage.alt || title}
            fill
            className="object-contain transition duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-bold uppercase tracking-widest text-text-secondary">
            SuperHarOld
          </div>
        )}
      </div>

      {/* INFORMACIÓN */}
      <div className="p-6">
        <p
          className={`text-xs font-black uppercase tracking-widest ${typeColorClass}`}
        >
          {typeLabel}
        </p>

        <h3 className="mt-3 text-xl font-black leading-snug transition group-hover:text-primary">
          {title}
        </h3>

        {summary && (
          <p className="mt-3 line-clamp-3 leading-7 text-text-secondary">
            {summary}
          </p>
        )}

        <time
          dateTime={publishedAt}
          className="mt-5 block text-sm text-text-secondary"
        >
          {formatDate(publishedAt)}
        </time>
      </div>
    </Link>
  )
}