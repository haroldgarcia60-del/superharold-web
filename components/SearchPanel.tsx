'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'

type SearchResult = {
  _id: string
  _type: 'news' | 'guide' | 'build' | 'datamine'
  title: string
  slug: {
    current: string
  }
  summary?: string
  game?: {
    name: string
    slug: {
      current: string
    }
  }
}

type SearchPanelProps = {
  onResultClick?: () => void
}

const typeLabels: Record<SearchResult['_type'], string> = {
  news: 'Noticia',
  guide: 'Guía',
  build: 'Build',
  datamine: 'Datamineo',
}

function getResultUrl(result: SearchResult) {
  const gameSlug = result.game?.slug?.current

  if (!gameSlug) {
    return '#'
  }

  switch (result._type) {
    case 'news':
      return `/${gameSlug}/noticias/${result.slug.current}`

    case 'guide':
      return `/${gameSlug}/guias/${result.slug.current}`

    case 'build':
      return `/${gameSlug}/builds/${result.slug.current}`

    case 'datamine':
      return `/${gameSlug}/datamineos/${result.slug.current}`

    default:
      return '#'
  }
}

export default function SearchPanel({
  onResultClick,
}: SearchPanelProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState(false)

  useEffect(() => {
    const searchTerm = query.trim()

    if (searchTerm.length < 2) {
      setResults([])
      setLoading(false)
      setSearchError(false)
      return
    }

    const controller = new AbortController()

    const timer = setTimeout(async () => {
      setLoading(true)
      setSearchError(false)

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchTerm)}`,
          {
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          throw new Error('Error al realizar la búsqueda')
        }

        const searchResults: SearchResult[] = await response.json()

        setResults(searchResults)
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }

        console.error('Error buscando contenido:', error)
        setResults([])
        setSearchError(true)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">

      {/* CAMPO DE BÚSQUEDA */}
      <div className="relative">

        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar noticias, guías, builds y datamineos..."
          autoFocus
          className="w-full rounded-xl border border-surface-light bg-surface py-4 pl-12 pr-4 text-white outline-none transition placeholder:text-text-secondary focus:border-primary"
        />

      </div>

      {/* RESULTADOS */}
      {query.trim().length >= 2 && (
        <div className="mt-4 overflow-hidden rounded-xl border border-surface-light bg-surface">

          {loading ? (
            <p className="p-5 text-sm text-text-secondary">
              Buscando...
            </p>
          ) : searchError ? (
            <p className="p-5 text-sm text-secondary">
              Ha ocurrido un error al realizar la búsqueda.
            </p>
          ) : results.length > 0 ? (
            <div className="divide-y divide-surface-light">

              {results.map((result) => (
                <Link
                  key={result._id}
                  href={getResultUrl(result)}
                  onClick={onResultClick}
                  className="block p-4 transition hover:bg-surface-light"
                >

                  <div className="flex flex-wrap items-center gap-2">

                    <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                      {typeLabels[result._type]}
                    </span>

                    {result.game && (
                      <>
                        <span className="text-text-secondary">
                          ·
                        </span>

                        <span className="text-xs font-bold text-primary">
                          {result.game.name}
                        </span>
                      </>
                    )}

                  </div>

                  <h3 className="mt-2 font-bold text-white">
                    {result.title}
                  </h3>

                  {result.summary && (
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-text-secondary">
                      {result.summary}
                    </p>
                  )}

                </Link>
              ))}

            </div>
          ) : (
            <p className="p-5 text-sm text-text-secondary">
              No hemos encontrado resultados para &quot;{query}&quot;.
            </p>
          )}

        </div>
      )}

    </div>
  )
}