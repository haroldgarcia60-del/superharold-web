import {Suspense} from 'react'
import Link from 'next/link'
import OtherGamesFilter from '@/components/OtherGamesFilter'
import {client} from '@/sanity/lib/client'

type ContentType = 'news' | 'guide' | 'build' | 'datamine'

type OtherContent = {
  _id: string
  _type: ContentType
  title: string
  summary?: string
  publishedAt: string
  slug: {
    current: string
  }
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

async function getOtherGamesContent() {
  return client.fetch<OtherContent[]>(`
    *[
      _type in ["news", "guide", "build", "datamine"] &&
      game->slug.current != "fallout-76" &&
      defined(game->slug.current) &&
      defined(slug.current) &&
      defined(publishedAt)
    ] | order(publishedAt desc) {
      _id,
      _type,
      title,
      summary,
      publishedAt,
      slug,
      coverImage,
      game->{
        name,
        slug
      }
    }
  `)
}

export default async function OtherGamesPage() {
  const content = await getOtherGamesContent()

  return (
    <main className="min-h-screen">
      {/* CABECERA */}
      <section className="border-b border-surface-light">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
          <Link
            href="/"
            className="inline-block font-semibold text-text-secondary transition hover:text-primary"
          >
            ← Volver a Inicio
          </Link>

          <p className="mt-8 font-bold uppercase tracking-[0.25em] text-secondary">
            SuperHarOld
          </p>

          <h1 className="mt-3 text-5xl font-black md:text-6xl">
            Otros juegos
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-text-secondary">
            Noticias, guías, builds y datamineos de otros juegos que también
            forman parte del contenido de SuperHarOld.
          </p>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="font-bold uppercase tracking-widest text-primary">
          Todo el contenido
        </p>

        <h2 className="mt-2 text-3xl font-black md:text-4xl">
          Últimas publicaciones
        </h2>

        {content.length > 0 ? (
          <Suspense
            fallback={
              <div className="mt-8 rounded-2xl border border-surface-light bg-surface p-8 text-text-secondary">
                Cargando publicaciones...
              </div>
            }
          >
            <OtherGamesFilter content={content} />
          </Suspense>
        ) : (
          <div className="mt-8 rounded-2xl border border-surface-light bg-surface p-8">
            <p className="font-bold text-white">
              Todavía no hay publicaciones de otros juegos.
            </p>

            <p className="mt-2 text-text-secondary">
              Cuando publiques contenido de otros juegos en Sanity, aparecerá
              automáticamente aquí.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}