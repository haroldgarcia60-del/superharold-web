import Link from 'next/link'
import {notFound} from 'next/navigation'
import ContentCard from '@/components/ContentCard'
import {client} from '@/sanity/lib/client'

type ContentType = 'news' | 'guide' | 'build' | 'datamine'

type ContentItem = {
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

type PageProps = {
  params: Promise<{
    section: string
  }>
}

const sectionConfig: Record<
  string,
  {
    type: ContentType
    title: string
    label: string
    singularLabel: string
    description: string
    colorClass: string
  }
> = {
  noticias: {
    type: 'news',
    title: 'Noticias de Fallout 76',
    label: 'Noticias',
    singularLabel: 'Noticia',
    description:
      'Actualizaciones, anuncios y todas las novedades de Fallout 76.',
    colorClass: 'text-primary',
  },

  guias: {
    type: 'guide',
    title: 'Guías de Fallout 76',
    label: 'Guías',
    singularLabel: 'Guía',
    description:
      'Consejos, explicaciones y guías para sacar el máximo partido a Fallout 76.',
    colorClass: 'text-accent',
  },

  builds: {
    type: 'build',
    title: 'Builds de Fallout 76',
    label: 'Builds',
    singularLabel: 'Build',
    description:
      'Armas, armaduras y configuraciones para diferentes estilos de juego.',
    colorClass: 'text-secondary',
  },

  datamineos: {
    type: 'datamine',
    title: 'Datamineos de Fallout 76',
    label: 'Datamineos',
    singularLabel: 'Datamineo',
    description:
      'Información encontrada directamente en los archivos de Fallout 76.',
    colorClass: 'text-accent',
  },
}

export default async function Fallout76SectionPage({params}: PageProps) {
  const {section} = await params

  const config = sectionConfig[section]

  // Cualquier sección que no sea una de las cuatro permitidas devuelve 404.
  if (!config) {
    notFound()
  }

  const content = await client.fetch<ContentItem[]>(
    `*[
      _type == $contentType &&
      game->slug.current == "fallout-76" &&
      defined(slug.current) &&
      defined(publishedAt)
    ] | order(publishedAt desc) {
      _id,
      _type,
      title,
      slug,
      summary,
      publishedAt,
      coverImage
    }`,
    {
      contentType: config.type,
    },
  )

  return (
    <main>
      {/* CABECERA */}
      <section className="border-b border-surface-light">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
          <Link
            href="/fallout-76"
            className="text-sm font-bold text-primary transition hover:text-primary-pressed"
          >
            ← Volver a Fallout 76
          </Link>

          <p className="mt-8 font-bold uppercase tracking-widest text-secondary">
            Fallout 76
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            {config.title}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-text-secondary">
            {config.description}
          </p>
        </div>
      </section>

      {/* PUBLICACIONES */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8">
          <p
            className={`font-bold uppercase tracking-widest ${config.colorClass}`}
          >
            {config.label}
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Últimas publicaciones
          </h2>
        </div>

        {content.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content.map((item) => (
              <ContentCard
                key={item._id}
                title={item.title}
                summary={item.summary}
                publishedAt={item.publishedAt}
                href={`/fallout-76/${section}/${item.slug.current}`}
                typeLabel={config.singularLabel}
                typeColorClass={config.colorClass}
                coverImage={item.coverImage}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-surface-light bg-surface p-8">
            <p className="font-bold text-white">
              Todavía no hay publicaciones en {config.label.toLowerCase()}.
            </p>

            <p className="mt-2 text-text-secondary">
              El contenido aparecerá aquí automáticamente cuando sea publicado.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}