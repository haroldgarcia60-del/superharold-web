import Image from 'next/image'
import Link from 'next/link'
import {client} from '@/sanity/lib/client'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

type Event = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  mainImage?: any
  startDate?: string
  endDate?: string
  publishedAt?: string
}

async function getEvents(): Promise<Event[]> {
  return client.fetch(`
    *[_type == "event"] | order(startDate desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      mainImage,
      startDate,
      endDate,
      publishedAt
    }
  `)
}

export default async function EventosPage() {
  const events = await getEvents()

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        {/* CABECERA */}
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-secondary">
            Fallout 76
          </p>

          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Eventos
          </h1>

          <p className="mt-5 text-lg leading-8 text-text-secondary">
            Guías completas, recompensas y toda la información de los eventos
            de Fallout 76.
          </p>
        </div>

        {/* EVENTOS */}
        {events.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event._id}
                href={`/fallout-76/eventos/${event.slug}`}
                className="group overflow-hidden rounded-2xl border border-surface-light bg-surface transition duration-300 hover:-translate-y-1 hover:border-primary"
              >
                {/* IMAGEN */}
                {event.mainImage && (
                  <div className="relative aspect-video overflow-hidden bg-background">
                    <Image
                      src={urlFor(event.mainImage)
                        .width(900)
                        .height(506)
                        .url()}
                      alt={
                        event.mainImage.alt ||
                        event.title
                      }
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* INFORMACIÓN */}
                <div className="p-6">
                  <p className="text-sm font-bold uppercase tracking-widest text-secondary">
                    Evento
                  </p>

                  <h2 className="mt-2 text-2xl font-black transition group-hover:text-primary">
                    {event.title}
                  </h2>

                  {event.excerpt && (
                    <p className="mt-3 leading-7 text-text-secondary">
                      {event.excerpt}
                    </p>
                  )}

                  <p className="mt-6 font-bold text-primary">
                    Ver evento →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-surface-light bg-surface p-8">
            <p className="text-text-secondary">
              Todavía no hay eventos publicados.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}