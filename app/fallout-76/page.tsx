import Link from 'next/link'
import ContentCard from '@/components/ContentCard'
import {client} from '@/sanity/lib/client'

type ContentType = 'news' | 'guide' | 'build' | 'datamine'

type LatestContent = {
  _id: string
  _type: ContentType
  title: string
  summary?: string
  publishedAt: string
  slug: {
    current: string
  }
  coverImage?: {
    asset: {
      _ref: string
      _type: string
    }
    alt?: string
  }
}

const contentConfig: Record<
  ContentType,
  {
    label: string
    path: string
    colorClass: string
  }
> = {
  news: {
    label: 'Noticia',
    path: 'noticias',
    colorClass: 'text-primary',
  },
  guide: {
    label: 'Guía',
    path: 'guias',
    colorClass: 'text-accent',
  },
  build: {
    label: 'Build',
    path: 'builds',
    colorClass: 'text-secondary',
  },
  datamine: {
    label: 'Datamineo',
    path: 'datamineos',
    colorClass: 'text-accent',
  },
}

async function getLatestFallout76Content() {
  return client.fetch<LatestContent[]>(`
    *[
      _type in ["news", "guide", "build", "datamine"] &&
      game->slug.current == "fallout-76" &&
      defined(slug.current) &&
      defined(publishedAt)
    ] | order(publishedAt desc)[0...6] {
      _id,
      _type,
      title,
      summary,
      publishedAt,
      slug,
      coverImage
    }
  `)
}

export default async function Fallout76Page() {
  const latestContent = await getLatestFallout76Content()

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

          <p className="mt-8 font-bold uppercase tracking-[0.25em] text-primary">
            SuperHarOld
          </p>

          <h1 className="mt-3 text-5xl font-black md:text-6xl">
            Fallout 76
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-text-secondary">
            Noticias, guías, builds, datamineos y herramientas para estar al
            día de todo lo que ocurre en Fallout 76.
          </p>
        </div>
      </section>

      {/* ÚLTIMO EN FALLOUT 76 */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="font-bold uppercase tracking-widest text-secondary">
          Actualidad
        </p>

        <div className="mt-2 flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black md:text-4xl">
              Último en Fallout 76
            </h2>

            <p className="mt-3 max-w-2xl text-text-secondary">
              Las últimas noticias, guías, builds y datamineos publicados.
            </p>
          </div>
        </div>

        {latestContent.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestContent.map((item) => {
              const config = contentConfig[item._type]

              const href = `/fallout-76/${config.path}/${item.slug.current}`

              return (
                <ContentCard
                  key={item._id}
                  title={item.title}
                  summary={item.summary}
                  publishedAt={item.publishedAt}
                  href={href}
                  typeLabel={config.label}
                  typeColorClass={config.colorClass}
                  coverImage={item.coverImage}
                />
              )
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-surface-light bg-surface p-8 text-text-secondary">
            Todavía no hay publicaciones disponibles.
          </div>
        )}
      </section>

      {/* EXPLORAR */}
      <section className="border-y border-surface-light bg-surface/30">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="font-bold uppercase tracking-widest text-accent">
            Explorar
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Contenido de Fallout 76
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {/* NOTICIAS */}
            <Link
              href="/fallout-76/noticias"
              className="group flex h-full flex-col rounded-2xl border border-surface-light bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-primary"
            >
              <p className="text-sm font-bold uppercase tracking-widest text-secondary">
                Actualidad
              </p>

              <h3 className="mt-3 text-2xl font-black group-hover:text-primary">
                Noticias
              </h3>

              <p className="mt-3 leading-7 text-text-secondary">
                Actualizaciones, anuncios y novedades del juego.
              </p>

              <p className="mt-auto pt-6 font-bold text-primary">
                Ver noticias →
              </p>
            </Link>

            {/* GUÍAS */}
            <Link
              href="/fallout-76/guias"
              className="group flex h-full flex-col rounded-2xl border border-surface-light bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-primary"
            >
              <p className="text-sm font-bold uppercase tracking-widest text-secondary">
                Comunidad
              </p>

              <h3 className="mt-3 text-2xl font-black group-hover:text-primary">
                Guías
              </h3>

              <p className="mt-3 leading-7 text-text-secondary">
                Consejos y explicaciones para sacar el máximo partido al juego.
              </p>

              <p className="mt-auto pt-6 font-bold text-primary">
                Ver guías →
              </p>
            </Link>

            {/* BUILDS */}
            <Link
              href="/fallout-76/builds"
              className="group flex h-full flex-col rounded-2xl border border-surface-light bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-primary"
            >
              <p className="text-sm font-bold uppercase tracking-widest text-secondary">
                Personajes
              </p>

              <h3 className="mt-3 text-2xl font-black group-hover:text-primary">
                Builds
              </h3>

              <p className="mt-3 leading-7 text-text-secondary">
                Armas, armaduras y configuraciones para diferentes estilos.
              </p>

              <p className="mt-auto pt-6 font-bold text-primary">
                Ver builds →
              </p>
            </Link>

            {/* DATAMINEOS */}
            <Link
              href="/fallout-76/datamineos"
              className="group flex h-full flex-col rounded-2xl border border-surface-light bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-primary"
            >
              <p className="text-sm font-bold uppercase tracking-widest text-secondary">
                Archivos
              </p>

              <h3 className="mt-3 text-2xl font-black group-hover:text-primary">
                Datamineos
              </h3>

              <p className="mt-3 leading-7 text-text-secondary">
                Información encontrada directamente en los archivos del juego.
              </p>

              <p className="mt-auto pt-6 font-bold text-primary">
                Ver datamineos →
              </p>
            </Link>

            {/* MINERVA */}
            <Link
              href="/fallout-76/minerva"
              className="group flex h-full flex-col rounded-2xl border border-surface-light bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-primary"
            >
              <p className="text-sm font-bold uppercase tracking-widest text-secondary">
                Herramienta
              </p>

              <h3 className="mt-3 text-2xl font-black group-hover:text-primary">
                Minerva
              </h3>

              <p className="mt-3 leading-7 text-text-secondary">
                Consulta su ubicación, inventario, precios y próximas
                apariciones.
              </p>

              <p className="mt-auto pt-6 font-bold text-primary">
                Ver Minerva →
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}