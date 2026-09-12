import RichContent from '@/components/content/RichContent'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {client} from '@/sanity/lib/client'

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