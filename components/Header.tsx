'use client'

import Image from 'next/image'
import Link from 'next/link'
import {useState} from 'react'
import SearchPanel from './SearchPanel'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  function toggleSearch() {
    setSearchOpen(!searchOpen)
    setMenuOpen(false)
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen)
    setSearchOpen(false)
  }

  function closeAll() {
    setMenuOpen(false)
    setSearchOpen(false)
  }

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
            <Link
              href="/"
              className="transition hover:text-primary"
            >
              Inicio
            </Link>

            <Link
              href="/fallout-76"
              className="transition hover:text-primary"
            >
              Fallout 76
            </Link>

            <Link
              href="/otros-juegos"
              className="transition hover:text-primary"
            >
              Otros juegos
            </Link>

            <Link
              href="/videos"
              className="transition hover:text-primary"
            >
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
          <SearchPanel
            onResultClick={() => setSearchOpen(false)}
          />
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

            <Link
              href="/fallout-76"
              onClick={closeAll}
              className="rounded-lg px-4 py-3 font-semibold transition hover:bg-surface hover:text-primary"
            >
              Fallout 76
            </Link>

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
