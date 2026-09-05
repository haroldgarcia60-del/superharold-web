import Image from 'next/image'
import Link from 'next/link'
import ContentCard from '@/components/ContentCard'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'

export const revalidate = 60

type Game = {
  _id: string
  name: string
  slug: {
    current: string
  }
  coverImage?: {
    asset: {
      _ref: string
      _type: string
    }
  }
}

type ContentItem = {
  _id: string
  _type: 'news' | 'guide' | 'build' | 'datamine'
  title: string
  slug: {
    current: string
  }
  summary?: string
  publishedAt: string
  featured?: boolean
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

const sectionByType = {
  news: 'noticias',
  guide: 'guias',
  build: 'builds',
  datamine: 'datamineos',
} as const

const labelByType = {
  news: 'Noticia',
  guide: 'Guía',
  build: 'Build',
  datamine: 'Datamineo',
} as const

function getGameHref(game: Game) {
  if (game.slug.current === 'fallout-76') {
    return '/fallout-76'
  }

  return `/otros-juegos?game=${encodeURIComponent(game.slug.current)}`
}

function getContentHref(item: ContentItem) {
  const section = sectionByType[item._type]

  return `/${item.game.slug.current}/${section}/${item.slug.current}`
}

export default async function Home() {
  const games = await client.fetch<Game[]>(
    `*[
      _type == "game" &&
      active != false &&
      defined(slug.current)
    ] | order(name asc) {
      _id,
      name,
      slug,
      coverImage
    }`,
  )

  const latestContent = await client.fetch<ContentItem[]>(
    `*[
      _type in ["news", "guide", "build", "datamine"] &&
      defined(slug.current) &&
      defined(publishedAt) &&
      defined(game->slug.current)
    ] | order(publishedAt desc)[0...3] {
      _id,
      _type,
      title,
      slug,
      summary,
      publishedAt,
      featured,
      coverImage,
      game->{
        name,
        slug
      }
    }`,
  )

  return (
    <main>
      {/* PRESENTACIÓN */}
      <section className="border-b border-surface-light">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="mb-4 text-2xl font-bold tracking-[0.18em] text-primary">
            SuperHarol
          </p>

          <h1 className="max-w-5xl text-4xl font-black leading-tight md:text-6xl">
            Tu punto de encuentro para la comunidad hispanohablante
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-text-secondary">
            Noticias, guías, builds, datamineos y herramientas sobre Fallout 76
            y otros juegos.
          </p>
        </div>
      </section>

      {/* ÚLTIMO CONTENIDO */}
      <section className="border-b border-surface-light">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8">
            <p className="font-bold uppercase tracking-widest text-secondary">
              Actualidad
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Último contenido
            </h2>

            <p className="mt-3 max-w-2xl text-text-secondary">
              Lo último publicado en SuperHarOld.
            </p>
          </div>

          {latestContent.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestContent.map((item) => (
                <ContentCard
                  key={item._id}
                  title={item.title}
                  summary={item.summary}
                  publishedAt={item.publishedAt}
                  href={getContentHref(item)}
                  typeLabel={`${labelByType[item._type]} · ${item.game.name}`}
                  typeColorClass="text-primary"
                  coverImage={item.coverImage}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-surface-light bg-surface p-8 text-text-secondary">
              Todavía no hay contenido publicado.
            </div>
          )}
        </div>
      </section>

      {/* JUEGOS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8">
          <p className="font-bold uppercase tracking-widest text-secondary">
            Contenido
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Explora nuestros juegos
          </h2>

          <p className="mt-3 max-w-2xl text-text-secondary">
            Explora todo el contenido publicado de cada juego en SuperHarOld.
          </p>
        </div>

        {games.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {games.map((game) => (
              <Link
                key={game._id}
                href={getGameHref(game)}
                className="group overflow-hidden rounded-2xl border border-surface-light bg-surface transition duration-300 hover:-translate-y-1 hover:border-primary"
              >
                <div className="relative h-[220px] w-full overflow-hidden bg-surface-light sm:h-[260px]">
                  {game.coverImage ? (
                    <Image
                      src={urlFor(game.coverImage)
                        .width(900)
                        .height(520)
                        .fit('crop')
                        .url()}
                      alt={game.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-text-secondary">
                      {game.name}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                </div>

                <div className="p-6 sm:p-7">
                  {game.slug.current === 'fallout-76' && (
                    <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
                      Portal principal
                    </p>
                  )}

                  <h3 className="text-2xl font-black transition group-hover:text-primary">
                    {game.name}
                  </h3>

                  <p className="mt-3 leading-7 text-text-secondary">
                    Noticias, guías, builds, datamineos y todo nuestro contenido
                    sobre {game.name}.
                  </p>

                  <p className="mt-6 font-bold text-primary">
                    Ver contenido →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-surface-light bg-surface p-8 text-text-secondary">
            Todavía no hay juegos disponibles.
          </div>
        )}
      </section>
    </main>
  )
}