'use client'

import Image from 'next/image'
import Link from 'next/link'
import {useState} from 'react'
import SearchPanel from './SearchPanel'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [falloutOpen, setFalloutOpen] = useState(false)
  const [mobileFalloutOpen, setMobileFalloutOpen] = useState(false)

  function toggleSearch() {
    setSearchOpen(!searchOpen)
    setMenuOpen(false)
    setFalloutOpen(false)
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen)
    setSearchOpen(false)
    setFalloutOpen(false)
  }

  function closeAll() {
    setMenuOpen(false)
    setSearchOpen(false)
    setFalloutOpen(false)
    setMobileFalloutOpen(false)
  }

  const falloutLinks = [
    {
      label: 'Noticias',
      description: 'Actualidad y novedades',
      href: '/fallout-76/noticias',
    },
    {
      label: 'Guías',
      description: 'Consejos y explicaciones',
      href: '/fallout-76/guias',
    },
    {
      label: 'Builds',
      description: 'Armas y configuraciones',
      href: '/fallout-76/builds',
    },
    {
      label: 'Datamineos',
      description: 'Información de los archivos',
      href: '/fallout-76/datamineos',
    },
    {
      label: 'Eventos',
      description: 'Guías y recompensas',
      href: '/fallout-76/eventos',
    },
    {
      label: 'Minerva',
      description: 'Ubicación e inventario',
      href: '/fallout-76/minerva',
    },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-surface-light bg-background/95 backdrop-blur">
      {/* CABECERA PRINCIPAL */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:py-5">
        {/* LOGO */}
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 sm:gap-3"
          onClick={closeAll}
        >
          <Image
            src="/avatar.png"
            alt="Avatar SuperHarOld"
            width={76}
            height={76}
            priority
            className="h-12 w-12 shrink-0 object-contain sm:h-[68px] sm:w-[68px]"
          />

          <Image
            src="/Logo_fuente.png"
            alt="SuperHarOld"
            width={300}
            height={90}
            priority
            className="h-10 w-auto max-w-[190px] object-contain sm:h-16 sm:max-w-none"
          />
        </Link>

        {/* ZONA DERECHA */}
        <div className="flex items-center gap-2">
          {/* MENÚ ESCRITORIO */}
          <nav className="hidden items-center gap-7 font-semibold md:flex">
            <Link href="/" className="transition hover:text-primary">
              Inicio
            </Link>

            {/* FALLOUT 76 + DESPLEGABLE */}
            <div
              className="relative"
              onMouseEnter={() => setFalloutOpen(true)}
              onMouseLeave={() => setFalloutOpen(false)}
            >
              <div className="flex items-center">
                <Link
                  href="/fallout-76"
                  className="transition hover:text-primary"
                  onClick={() => setFalloutOpen(false)}
                >
                  Fallout 76
                </Link>

                <button
                  type="button"
                  onClick={() => setFalloutOpen(!falloutOpen)}
                  className="ml-1 flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-surface hover:text-primary"
                  aria-label="Abrir secciones de Fallout 76"
                  aria-expanded={falloutOpen}
                >
                  <span
                    className={`text-xs transition-transform ${
                      falloutOpen ? 'rotate-180' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>
              </div>

              {falloutOpen && (
                <div className="absolute left-1/2 top-full z-50 w-[440px] -translate-x-1/2 pt-4">
                  <div className="overflow-hidden rounded-2xl border border-surface-light bg-background p-3 shadow-2xl">
                    <div className="grid grid-cols-2 gap-2">
                      {falloutLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setFalloutOpen(false)}
                          className="group rounded-xl p-4 transition hover:bg-surface"
                        >
                          <p className="font-black transition group-hover:text-primary">
                            {item.label}
                          </p>

                          <p className="mt-1 text-sm font-normal text-text-secondary">
                            {item.description}
                          </p>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-2 border-t border-surface-light pt-2">
                      <Link
                        href="/fallout-76"
                        onClick={() => setFalloutOpen(false)}
                        className="block rounded-xl px-4 py-3 font-bold text-primary transition hover:bg-surface"
                      >
                        Ver todo Fallout 76 →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/otros-juegos"
              className="transition hover:text-primary"
            >
              Otros juegos
            </Link>

            <Link href="/videos" className="transition hover:text-primary">
              Vídeos
            </Link>

            <Link
              href="/herramientas"
              className="transition hover:text-primary"
            >
              Herramientas
            </Link>
          </nav>

          {/* LUPA */}
          <button
            type="button"
            onClick={toggleSearch}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-surface-light bg-surface transition hover:border-primary hover:text-primary"
            aria-label={searchOpen ? 'Cerrar buscador' : 'Abrir buscador'}
            aria-expanded={searchOpen}
          >
            <svg
              viewBox="0 0 24 24"
              width="21"
              height="21"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>

          {/* BOTÓN MENÚ MÓVIL */}
          <button
            type="button"
            onClick={toggleMenu}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-surface-light bg-surface text-2xl transition hover:border-primary hover:text-primary md:hidden"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? '×' : '☰'}
          </button>
        </div>
      </div>

      {/* BUSCADOR */}
      {searchOpen && (
        <div className="border-t border-surface-light bg-background/95">
          <SearchPanel onResultClick={() => setSearchOpen(false)} />
        </div>
      )}

      {/* MENÚ MÓVIL */}
      {menuOpen && (
        <nav className="border-t border-surface-light bg-background px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col">
            <Link
              href="/"
              onClick={closeAll}
              className="rounded-lg px-4 py-3 font-semibold transition hover:bg-surface hover:text-primary"
            >
              Inicio
            </Link>

            {/* FALLOUT 76 MÓVIL */}
            <div>
              <div className="flex items-center">
                <Link
                  href="/fallout-76"
                  onClick={closeAll}
                  className="flex-1 rounded-lg px-4 py-3 font-semibold transition hover:bg-surface hover:text-primary"
                >
                  Fallout 76
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileFalloutOpen(!mobileFalloutOpen)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg transition hover:bg-surface hover:text-primary"
                  aria-label="Mostrar secciones de Fallout 76"
                  aria-expanded={mobileFalloutOpen}
                >
                  <span
                    className={`text-xs transition-transform ${
                      mobileFalloutOpen ? 'rotate-180' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>
              </div>

              {mobileFalloutOpen && (
                <div className="ml-4 border-l border-surface-light pl-3">
                  {falloutLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeAll}
                      className="block rounded-lg px-4 py-3 text-sm font-semibold text-text-secondary transition hover:bg-surface hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/otros-juegos"
              onClick={closeAll}
              className="rounded-lg px-4 py-3 font-semibold transition hover:bg-surface hover:text-primary"
            >
              Otros juegos
            </Link>

            <Link
              href="/videos"
              onClick={closeAll}
              className="rounded-lg px-4 py-3 font-semibold transition hover:bg-surface hover:text-primary"
            >
              Vídeos
            </Link>

            <Link
              href="/herramientas"
              onClick={closeAll}
              className="rounded-lg px-4 py-3 font-semibold transition hover:bg-surface hover:text-primary"
            >
              Herramientas
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}