import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
    return builder.image(source)
}

type Reward = {
    _key: string
    id?: {
        current?: string
    }
    name: string
    rarity: 'guaranteed' | 'common' | 'uncommon' | 'rare'
    image?: any
}

type Outfit = {
    _key: string
    id?: {
        current?: string
    }
    name: string
    dropChance?: number
    image?: any
}

type PackageReward = {
    _key: string
    id?: {
        current?: string
    }
    name: string
    image?: any
}

type Event = {
    _id: string
    title: string
    slug: string
    excerpt?: string
    mainImage?: any
    startDate?: string
    endDate?: string
    status?: 'scheduled' | 'active' | 'finished' | 'cancelled'
    rewards?: Reward[]
    outfits?: Outfit[]
    packageRewards?: PackageReward[]
    body?: any[]
    publishedAt?: string
}

type EventPageProps = {
    params: Promise<{ slug: string }>
}

async function getEvent(slug: string): Promise<Event | null> {
    return client.fetch(
        `
      *[_type == "event" && slug.current == $slug][0] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        mainImage,
        startDate,
        endDate,
        status,
        rewards[]{
          _key,
          id,
          name,
          rarity,
          image
        },
        outfits[]{
          _key,
          id,
          name,
          dropChance,
          image
        },
        packageRewards[]{
          _key,
          id,
          name,
          image
        },
        body,
        publishedAt
      }
    `,
        { slug },
    )
}

export async function generateMetadata({
    params,
}: EventPageProps): Promise<Metadata> {
    const { slug } = await params
    const event = await getEvent(slug)

    if (!event) return {}

    const description =
        event.excerpt ||
        `${event.title} — Evento de Fallout 76 | SuperHarOld`

    const mainImageUrl = event.mainImage
        ? urlFor(event.mainImage).width(1200).fit('max').url()
        : undefined

    const socialImageUrl = mainImageUrl
        ? `https://www.superharold.es/api/og?${new URLSearchParams({
              image: mainImageUrl,
              title: event.title,
              game: 'Fallout 76',
              section: 'Eventos',
          }).toString()}`
        : undefined

    const canonicalUrl =
        `https://www.superharold.es/fallout-76/eventos/${event.slug}`

    return {
        title: event.title,
        description,
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title: event.title,
            description,
            type: 'article',
            siteName: 'SuperHarOld',
            locale: 'es_ES',
            url: canonicalUrl,
            ...(event.publishedAt ? { publishedTime: event.publishedAt } : {}),
            ...(socialImageUrl
                ? {
                      images: [{
                          url: socialImageUrl,
                          width: 1200,
                          height: 630,
                          alt: event.mainImage?.alt || event.title,
                      }],
                  }
                : {}),
        },
        twitter: {
            card: 'summary_large_image',
            title: event.title,
            description,
            ...(socialImageUrl ? { images: [socialImageUrl] } : {}),
        },
    }
}

function formatDate(date?: string) {
    if (!date) return null

    return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(date))
}

function formatDropChance(dropChance?: number) {
    if (typeof dropChance !== 'number') return null

    return `${dropChance.toLocaleString('es-ES', {
        maximumFractionDigits: 4,
    })} %`
}

function RewardSection({
    title,
    rewards,
}: {
    title: string
    rewards: Reward[]
}) {
    if (rewards.length === 0) return null

    return (
        <section className="mt-10">
            <h3 className="text-2xl font-black">{title}</h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rewards.map((reward) => (
                    <div
                        key={reward._key}
                        className="overflow-hidden rounded-2xl border border-surface-light bg-surface"
                    >
                        {reward.image && (
                            <div className="relative aspect-square bg-background">
                                <Image
                                    src={urlFor(reward.image)
                                        .width(700)
                                        .height(700)
                                        .url()}
                                    alt={reward.image.alt || reward.name}
                                    fill
                                    className="object-contain p-4"
                                />
                            </div>
                        )}

                        <div className="p-5">
                            <h4 className="font-bold">{reward.name}</h4>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

function RewardsBlock({
    rewards,
    title,
    description,
}: {
    rewards: Reward[]
    title?: string
    description?: string
}) {
    if (rewards.length === 0) return null

    const commonRewards = rewards.filter(
        (reward) => reward.rarity === 'common',
    )

    const uncommonRewards = rewards.filter(
        (reward) => reward.rarity === 'uncommon',
    )

    const rareRewards = rewards.filter(
        (reward) => reward.rarity === 'rare',
    )

    const guaranteedRewards = rewards.filter(
        (reward) => reward.rarity === 'guaranteed',
    )

    return (
        <section className="my-14 border-y border-surface-light py-10">
            {title && (
                <h2 className="text-3xl font-black">
                    {title}
                </h2>
            )}

            {description && (
                <p className="mt-3 max-w-3xl leading-7 text-text-secondary">
                    {description}
                </p>
            )}

            <RewardSection
                title="Comunes"
                rewards={commonRewards}
            />

            <RewardSection
                title="Poco comunes"
                rewards={uncommonRewards}
            />

            <RewardSection
                title="Raras"
                rewards={rareRewards}
            />

            <RewardSection
                title="Garantizadas"
                rewards={guaranteedRewards}
            />
        </section>
    )
}

function OutfitSection({
    outfits,
    title,
    description,
}: {
    outfits: Outfit[]
    title?: string
    description?: string
}) {
    if (outfits.length === 0) return null

    return (
        <section className="my-14 border-y border-surface-light py-10">
            {title && (
                <h2 className="text-3xl font-black">
                    {title}
                </h2>
            )}

            {description && (
                <p className="mt-3 max-w-3xl leading-7 text-text-secondary">
                    {description}
                </p>
            )}

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {outfits.map((outfit) => {
                    const dropChance = formatDropChance(outfit.dropChance)

                    return (
                        <div
                            key={outfit._key}
                            className="overflow-hidden rounded-2xl border border-surface-light bg-surface"
                        >
                            {outfit.image && (
                                <div className="relative aspect-square bg-background">
                                    <Image
                                        src={urlFor(outfit.image)
                                            .width(700)
                                            .height(700)
                                            .url()}
                                        alt={outfit.image.alt || outfit.name}
                                        fill
                                        className="object-contain p-4"
                                    />
                                </div>
                            )}

                            <div className="p-5">
                                <h3 className="font-bold">
                                    {outfit.name}
                                </h3>

                                {dropChance && (
                                    <div className="mt-3 inline-flex rounded-lg border border-secondary/30 bg-secondary/10 px-3 py-1.5">
                                        <span className="text-sm font-bold text-secondary">
                                            Drop máximo: {dropChance}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

function PackageRewardsSection({
    rewards,
    title,
    description,
}: {
    rewards: PackageReward[]
    title?: string
    description?: string
}) {
    if (rewards.length === 0) return null

    return (
        <section className="my-14 border-y border-surface-light py-10">
            {title && (
                <h2 className="text-3xl font-black">
                    {title}
                </h2>
            )}

            {description && (
                <p className="mt-3 max-w-3xl leading-7 text-text-secondary">
                    {description}
                </p>
            )}

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rewards.map((reward) => (
                    <div
                        key={reward._key}
                        className="overflow-hidden rounded-2xl border border-surface-light bg-surface"
                    >
                        {reward.image && (
                            <div className="relative aspect-square bg-background">
                                <Image
                                    src={urlFor(reward.image)
                                        .width(700)
                                        .height(700)
                                        .url()}
                                    alt={reward.image.alt || reward.name}
                                    fill
                                    className="object-contain p-4"
                                />
                            </div>
                        )}

                        <div className="p-5">
                            <h3 className="font-bold">{reward.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default async function EventPage({
    params,
}: EventPageProps) {
    const { slug } = await params
    const event = await getEvent(slug)

    if (!event) {
        notFound()
    }

    const rewards = event.rewards || []
    const outfits = event.outfits || []
    const packageRewards = event.packageRewards || []

    /*
     * Detectamos si el artículo ya utiliza los nuevos
     * bloques insertables de Sanity.
     */
    const hasRewardsBlock =
        event.body?.some(
            (block) => block._type === 'eventRewardsBlock',
        ) ?? false

    const hasOutfitsBlock =
        event.body?.some(
            (block) => block._type === 'eventOutfitsBlock',
        ) ?? false

    const hasPackageRewardsBlock =
        event.body?.some(
            (block) => block._type === 'eventPackageRewardsBlock',
        ) ?? false

    return (
        <main className="min-h-screen">
            <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
                {/* CABECERA */}
                <header>
                    <p className="text-sm font-bold uppercase tracking-widest text-secondary">
                        Fallout 76 · Evento
                    </p>

                    <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
                        {event.title}
                    </h1>

                    {event.excerpt && (
                        <p className="mt-5 max-w-3xl text-lg leading-8 text-text-secondary">
                            {event.excerpt}
                        </p>
                    )}

                    {event.status === 'cancelled' ? (
                        <div className="mt-6">
                            <div className="inline-flex rounded-xl border border-secondary/40 bg-secondary/10 px-5 py-4">
                                <div>
                                    <span className="text-sm font-bold uppercase tracking-widest text-secondary">
                                        Estado del evento
                                    </span>
                                    <p className="mt-1 text-lg font-black">
                                        EVENTO CANCELADO
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        (event.startDate || event.endDate) && (
                            <div className="mt-6 flex flex-wrap gap-3">
                                {event.startDate && (
                                    <div className="rounded-xl border border-surface-light bg-surface px-4 py-3">
                                        <span className="text-accent">
                                            Inicio
                                        </span>
                                        <p className="mt-1 font-bold">
                                            {formatDate(event.startDate)}
                                        </p>
                                    </div>
                                )}
                                {event.endDate && (
                                    <div className="rounded-xl border border-surface-light bg-surface px-4 py-3">
                                        <span className="text-accent">
                                            Finaliza
                                        </span>
                                        <p className="mt-1 font-bold">
                                            {formatDate(event.endDate)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </header>

                {/* IMAGEN PRINCIPAL */}
                {event.mainImage && (
                    <div className="relative mt-10 aspect-video overflow-hidden rounded-2xl border border-surface-light bg-surface">
                        <Image
                            src={urlFor(event.mainImage).width(1600).url()}
                            alt={event.mainImage.alt || event.title}
                            fill
                            priority
                            className="object-contain"
                        />
                    </div>
                )}

                {/* GUÍA */}
                {event.body && event.body.length > 0 && (
                    <section className="mt-12">
                        <div className="prose prose-invert max-w-none">
                            <PortableText
                                value={event.body}
                                components={{
                                    block: {
                                        h1: ({children}) => (
                                            <h1 className="mb-5 mt-12 text-4xl font-black leading-tight">
                                                {children}
                                            </h1>
                                        ),
                                        h2: ({children}) => (
                                            <h2 className="mb-4 mt-10 text-3xl font-black leading-tight">
                                                {children}
                                            </h2>
                                        ),
                                        h3: ({children}) => (
                                            <h3 className="mb-3 mt-8 text-2xl font-black leading-tight">
                                                {children}
                                            </h3>
                                        ),
                                        h4: ({children}) => (
                                            <h4 className="mb-3 mt-7 text-xl font-bold leading-tight">
                                                {children}
                                            </h4>
                                        ),
                                        h5: ({children}) => (
                                            <h5 className="mb-2 mt-6 text-lg font-bold">
                                                {children}
                                            </h5>
                                        ),
                                        h6: ({children}) => (
                                            <h6 className="mb-2 mt-5 font-bold uppercase tracking-wide">
                                                {children}
                                            </h6>
                                        ),
                                        normal: ({children}) => (
                                            <p className="my-4 leading-8 text-text-primary">
                                                {children}
                                            </p>
                                        ),
                                        blockquote: ({children}) => (
                                            <blockquote className="my-6 border-l-4 border-secondary pl-5 italic text-text-secondary">
                                                {children}
                                            </blockquote>
                                        ),
                                    },
                                    types: {
                                        /*
                                         * BLOQUE DE RECOMPENSAS
                                         */
                                        eventRewardsBlock: ({ value }) => (
                                            <div className="not-prose">
                                                <RewardsBlock
                                                    rewards={rewards}
                                                    title={value.title}
                                                    description={value.description}
                                                />
                                            </div>
                                        ),

                                        /*
                                         * BLOQUE DE TRAJES
                                         */
                                        eventOutfitsBlock: ({ value }) => (
                                            <div className="not-prose">
                                                <OutfitSection
                                                    outfits={outfits}
                                                    title={value.title}
                                                    description={value.description}
                                                />
                                            </div>
                                        ),

                                        /*
                                         * BLOQUE DE RECOMPENSAS DE PAQUETES
                                         */
                                        eventPackageRewardsBlock: ({ value }) => (
                                            <div className="not-prose">
                                                <PackageRewardsSection
                                                    rewards={packageRewards}
                                                    title={value.title}
                                                    description={value.description}
                                                />
                                            </div>
                                        ),

                                        /*
                                         * IMAGEN NORMAL
                                         */
                                        image: ({ value }) => (
                                            <figure className="my-8">
                                                <div className="relative mx-auto aspect-video max-w-3xl overflow-hidden rounded-2xl bg-surface">
                                                    <Image
                                                        src={urlFor(value)
                                                            .width(1400)
                                                            .url()}
                                                        alt={
                                                            value.alt ||
                                                            'Imagen del evento'
                                                        }
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>

                                                {value.caption && (
                                                    <figcaption className="mt-2 text-center text-sm text-text-secondary">
                                                        {value.caption}
                                                    </figcaption>
                                                )}
                                            </figure>
                                        ),

                                        /*
                                         * GALERÍA
                                         */
                                        gallery: ({ value }) => (
                                            <section className="my-10">
                                                {value.title && (
                                                    <h3 className="mb-5 text-2xl font-black">
                                                        {value.title}
                                                    </h3>
                                                )}

                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    {value.images?.map(
                                                        (
                                                            image: any,
                                                            index: number,
                                                        ) => (
                                                            <figure
                                                                key={
                                                                    image._key ||
                                                                    index
                                                                }
                                                                className="overflow-hidden rounded-2xl border border-surface-light bg-surface"
                                                            >
                                                                <div className="relative aspect-video">
                                                                    <Image
                                                                        src={urlFor(
                                                                            image,
                                                                        )
                                                                            .width(
                                                                                1000,
                                                                            )
                                                                            .url()}
                                                                        alt={
                                                                            image.alt ||
                                                                            `Imagen ${index + 1}`
                                                                        }
                                                                        fill
                                                                        className="object-contain"
                                                                    />
                                                                </div>

                                                                {image.caption && (
                                                                    <figcaption className="p-3 text-sm text-text-secondary">
                                                                        {
                                                                            image.caption
                                                                        }
                                                                    </figcaption>
                                                                )}
                                                            </figure>
                                                        ),
                                                    )}
                                                </div>
                                            </section>
                                        ),
                                    },
                                }}
                            />
                        </div>
                    </section>
                )}

                {/*
                 * FALLBACK
                 *
                 * Los eventos antiguos que todavía no tengan los nuevos
                 * bloques en Sanity seguirán mostrando sus recompensas
                 * y trajes al final.
                 */}

                {!hasRewardsBlock && (
                    <RewardsBlock rewards={rewards} />
                )}

                {!hasOutfitsBlock && (
                    <OutfitSection outfits={outfits} />
                )}

                {!hasPackageRewardsBlock && (
                    <PackageRewardsSection rewards={packageRewards} />
                )}
            </article>
        </main>
    )
}