import RichContent from '@/components/content/RichContent'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'

type ContentType = 'news' | 'guide' | 'build' | 'datamine'

type ContentBlock = {
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
  content?: ContentBlock[]
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

/*
 * METADATA PARA SEO Y REDES SOCIALES
 */

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
              timeZone: 'Europe/Madrid',
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

        {/* CONTENIDO DE SANITY */}
        {article.content && article.content.length > 0 && (
          <section className="mt-10 rounded-2xl border border-surface-light bg-surface p-6 md:p-10">
            <RichContent value={article.content} />
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