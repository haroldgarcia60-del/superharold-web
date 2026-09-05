import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {PortableText, type PortableTextComponents} from '@portabletext/react'
import ImageGallery from '@/components/ImageGallery'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'

type PortableTextBlock = {
  _key: string
  _type: string
  [key: string]: unknown
}

type NewsArticle = {
  _id: string
  title: string
  summary?: string
  publishedAt: string
  youtubeUrl?: string
  content?: PortableTextBlock[]
  game: {
    name: string
    slug: {
      current: string
    }
  }
  coverImage?: {
    asset: {
      _ref: string
      _type: string
    }
    alt?: string
  }
}

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

type ContentImageValue = {
  asset?: {
    _ref: string
    _type: string
  }
  alt?: string
  caption?: string
}

type GalleryImageValue = {
  _key?: string
  asset?: {
    _ref: string
    _type: string
  }
  alt?: string
  caption?: string
}

type GalleryValue = {
  title?: string
  images?: GalleryImageValue[]
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({children}) => (
      <p className="my-5 text-base leading-8 text-text-secondary md:text-lg">
        {children}
      </p>
    ),

    h2: ({children}) => (
      <h2 className="mb-4 mt-10 text-3xl font-black text-white">
        {children}
      </h2>
    ),

    h3: ({children}) => (
      <h3 className="mb-3 mt-8 text-2xl font-black text-white">
        {children}
      </h3>
    ),

    blockquote: ({children}) => (
      <blockquote className="my-8 border-l-4 border-primary pl-5 italic text-text-secondary">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({children}) => (
      <ul className="my-6 list-disc space-y-2 pl-6 text-text-secondary">
        {children}
      </ul>
    ),

    number: ({children}) => (
      <ol className="my-6 list-decimal space-y-2 pl-6 text-text-secondary">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({children}) => (
      <li className="leading-7">
        {children}
      </li>
    ),

    number: ({children}) => (
      <li className="leading-7">
        {children}
      </li>
    ),
  },

  marks: {
    strong: ({children}) => (
      <strong className="font-bold text-white">
        {children}
      </strong>
    ),

    em: ({children}) => (
      <em className="italic">
        {children}
      </em>
    ),

    link: ({value, children}) => {
      const href =
        typeof value?.href === 'string'
          ? value.href
          : '#'

      const external = href.startsWith('http')

      return (
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 transition hover:text-primary-pressed"
        >
          {children}
        </a>
      )
    },
  },

  types: {
    // IMAGEN INDIVIDUAL
    image: ({value}) => {
      const image = value as ContentImageValue

      if (!image?.asset) {
        return null
      }

      return (
        <figure className="my-10">

          <div className="overflow-hidden rounded-2xl border border-surface-light bg-background">
            <Image
              src={urlFor(image)
                .width(1200)
                .url()}
              alt={image.alt || 'Imagen de la noticia'}
              width={1200}
              height={800}
              className="h-auto w-full object-contain"
              sizes="(max-width: 1024px) 100vw, 960px"
            />
          </div>

          {image.caption && (
            <figcaption className="mt-3 text-center text-sm italic text-text-secondary">
              {image.caption}
            </figcaption>
          )}

        </figure>
      )
    },

    // GALERÍA / SLIDER
    gallery: ({value}) => {
      const gallery = value as GalleryValue

      if (!gallery.images || gallery.images.length === 0) {
        return null
      }

      return (
        <ImageGallery
          title={gallery.title}
          images={gallery.images}
        />
      )
    },
  },
}

export default async function NewsPage({params}: PageProps) {
  const {slug} = await params

  const article = await client.fetch<NewsArticle | null>(
    `*[
      _type == "news" &&
      slug.current == $slug &&
      game->slug.current == "fallout-76"
    ][0] {
      _id,
      title,
      summary,
      publishedAt,
      youtubeUrl,
      coverImage,
      content,
      game->{
        name,
        slug
      }
    }`,
    {slug}
  )

  if (!article) {
    notFound()
  }

  return (
    <main>
      <article className="mx-auto max-w-5xl px-6 py-12 md:py-16">

        {/* VOLVER */}
        <Link
          href="/fallout-76"
          className="text-sm font-bold text-primary transition hover:text-primary-pressed"
        >
          ← Volver a Fallout 76
        </Link>

        {/* CABECERA */}
        <header className="mt-8">

          <p className="font-bold uppercase tracking-widest text-secondary">
            {article.game.name} · Noticias
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            {article.title}
          </h1>

          <time className="mt-5 block text-sm text-text-secondary">
            {new Date(article.publishedAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </time>

          {article.summary && (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-text-secondary">
              {article.summary}
            </p>
          )}

        </header>

        {/* CONTENIDO REAL DE SANITY */}
        {article.content && article.content.length > 0 && (
          <section className="mt-10 rounded-2xl border border-surface-light bg-surface p-6 md:p-10">
            <PortableText
              value={article.content}
              components={portableTextComponents}
            />
          </section>
        )}

        {/* YOUTUBE */}
        {article.youtubeUrl && (
          <div className="mt-8">
            <a
              href={article.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-xl bg-primary px-5 py-3 font-bold text-black transition hover:bg-primary-pressed"
            >
              Ver vídeo en YouTube
            </a>
          </div>
        )}

      </article>
    </main>
  )
}