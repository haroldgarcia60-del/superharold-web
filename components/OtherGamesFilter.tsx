'use client'

import {useMemo, useState} from 'react'
import {useSearchParams} from 'next/navigation'
import ContentCard from '@/components/ContentCard'

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

type Props = {
  content: OtherContent[]
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

export default function OtherGamesFilter({content}: Props) {
  const searchParams = useSearchParams()
  const gameFromUrl = searchParams.get('game')

  // Los juegos se generan automáticamente a partir del contenido recibido.
  const games = useMemo(() => {
    const uniqueGames = new Map<string, string>()

    content.forEach((item) => {
      uniqueGames.set(item.game.slug.current, item.game.name)
    })

    return Array.from(uniqueGames.entries())
      .map(([slug, name]) => ({
        slug,
        name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'es'))
  }, [content])

  // Comprobamos que el juego recibido por URL exista realmente.
  const initialGame =
    gameFromUrl && games.some((game) => game.slug === gameFromUrl)
      ? gameFromUrl
      : 'all'

  const [selectedGame, setSelectedGame] = useState(initialGame)

  const filteredContent = useMemo(() => {
    if (selectedGame === 'all') {
      return content
    }

    return content.filter(
      (item) => item.game.slug.current === selectedGame,
    )
  }, [content, selectedGame])

  return (
    <>
      {/* FILTROS */}
      {games.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSelectedGame('all')}
            className={`rounded-full border px-5 py-2 text-sm font-bold transition ${
              selectedGame === 'all'
                ? 'border-primary bg-primary text-background'
                : 'border-surface-light bg-surface text-text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            Todos
          </button>

          {games.map((game) => (
            <button
              key={game.slug}
              type="button"
              onClick={() => setSelectedGame(game.slug)}
              className={`rounded-full border px-5 py-2 text-sm font-bold transition ${
                selectedGame === game.slug
                  ? 'border-primary bg-primary text-background'
                  : 'border-surface-light bg-surface text-text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              {game.name}
            </button>
          ))}
        </div>
      )}

      {/* PUBLICACIONES */}
      {filteredContent.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredContent.map((item) => {
            const config = contentConfig[item._type]

            const href = `/${item.game.slug.current}/${config.path}/${item.slug.current}`

            return (
              <ContentCard
                key={item._id}
                title={item.title}
                summary={item.summary}
                publishedAt={item.publishedAt}
                href={href}
                typeLabel={`${item.game.name} · ${config.label}`}
                typeColorClass={config.colorClass}
                coverImage={item.coverImage}
              />
            )
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-surface-light bg-surface p-8 text-text-secondary">
          No hay publicaciones disponibles para este juego.
        </div>
      )}
    </>
  )
}