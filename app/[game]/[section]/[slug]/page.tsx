import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {Metadata} from 'next'
import ImageGallery from '@/components/ImageGallery'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'

type ContentType = 'news' | 'guide' | 'build' | 'datamine'

type PortableTextBlock = {
  _key: string
  _type: string
  [key: string]: unknown
}

type ContentArticle = {
  _id: string
  _type: ContentType
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
    game: string
    section: string
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

const sectionConfig: Record<
  string,
  {
    type: ContentType
    label: string
  }
> = {
  noticias: {
    type: 'news',
    label: 'Noticias',
  },
  guias: {
    type: 'guide',
    label: 'Guías',
  },
  builds: {
    type: 'build',
    label: 'Builds',
  },
  datamineos: {
    type: 'datamine',
    label: 'Datamineos',
  },
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
      <li className="leading-7">{children}</li>
    ),

    number: ({children}) => (
      <li className="leading-7">{children}</li>
    ),
  },

  marks: {
    strong: ({children}) => (
      <strong className="font-bold text-white">{children}</strong>
    ),

    em: ({children}) => <em className="italic">{children}</em>,

    link: ({value, children}) => {
      const href = typeof value?.href === 'string' ? value.href : '#'
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
    image: ({value}) => {
      const image = value as ContentImageValue

      if (!image?.asset) {
        return null
      }

      return (
        <figure className="my-10">
          <div className="overflow-hidden rounded-2xl border border-surface-light bg-background">
            <Image
              src={urlFor(image).width(1200).url()}
              alt={image.alt || 'Imagen de la publicación'}
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

/* METADATA PARA SEO Y REDES SOCIALES */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const {game, section, slug} = await params

  const sectionInfo = sectionConfig[section]

  if (!sectionInfo) {
    return {}
  }

  const article = await client.fetch<ContentArticle | null>(
    `*[
      _type == $contentType &&
      slug.current == $slug &&
      game->slug.current == $game
    ][0] {
      title,
      summary,
      publishedAt,
      coverImage,
      game->{
        name,
        slug
      }
    }`,
    {
      contentType: sectionInfo.type,
      slug,
      game,
    },
  )

  if (!article) {
    return {}
  }

  const description =
    article.summary ||
    `${article.title} — ${article.game.name} | SuperHarOld`

  /*
   * PORTADA ORIGINAL DE SANITY
   *
   * No forzamos 1200x630 y no usamos crop.
   * Solo obtenemos una versión de buena resolución.
   */
  const coverImageUrl = article.coverImage
    ? urlFor(article.coverImage)
        .width(1200)
        .fit('max')
        .url()
    : undefined

  /*
   * TARJETA SOCIAL
   *
   * /api/og recibe la portada original y crea una
   * imagen real de 1200x630 para Discord, X, etc.
   */
  const socialImageUrl = coverImageUrl
    ? `https://www.superharold.es/api/og?${new URLSearchParams({
        image: coverImageUrl,
        title: article.title,
        game: article.game.name,
        section: sectionInfo.label,
      }).toString()}`
    : undefined

  return {
    title: article.title,
    description,

    openGraph: {
      title: article.title,
      description,
      type: 'article',
      siteName: 'SuperHarOld',
      locale: 'es_ES',

      ...(socialImageUrl
        ? {
            images: [
              {
                url: socialImageUrl,
                width: 1200,
                height: 630,
                alt: article.coverImage?.alt || article.title,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,

      ...(socialImageUrl
        ? {
            images: [socialImageUrl],
          }
        : {}),
    },
  }
}

export default async function OtherGameArticlePage({
  params,
}: PageProps) {
  const {game, section, slug} = await params

  const sectionInfo = sectionConfig[section]

  if (!sectionInfo) {
    notFound()
  }

  const article = await client.fetch<ContentArticle | null>(
    `*[
      _type == $contentType &&
      slug.current == $slug &&
      game->slug.current == $game
    ][0] {
      _id,
      _type,
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
    {
      contentType: sectionInfo.type,
      slug,
      game,
    },
  )

  if (!article) {
    notFound()
  }

  return (
    <main>
      <article className="mx-auto max-w-5xl px-6 py-12 md:py-16">

        {/* VOLVER */}

        <Link
          href={`/otros-juegos?game=${encodeURIComponent(game)}`}
          className="text-sm font-bold text-primary transition hover:text-primary-pressed"
        >
          ← Volver a {article.game.name}
        </Link>

        {/* CABECERA */}

        <header className="mt-8">
          <p className="font-bold uppercase tracking-widest text-secondary">
            {article.game.name} · {sectionInfo.label}
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

        {/* CONTENIDO */}

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