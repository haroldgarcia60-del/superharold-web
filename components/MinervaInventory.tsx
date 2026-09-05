'use client'

import Image from 'next/image'
import {useMemo, useState} from 'react'

type MinervaPlan = {
  formId: string
  name: string
  editorId: string
  price: number
  basePrice: number
  priceSource: string
  image: string
  normalLists: number[]
}

type UpcomingVisit = {
  listNumber: number
  locationLabel: string
  startsAt: string
  endsAt: string
  isBigSale: boolean
}

type MinervaInventoryProps = {
  currentPlans: MinervaPlan[]
  allPlans: MinervaPlan[]
  upcomingVisits: UpcomingVisit[]
  currentListNumber: number
  isPresent: boolean
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function formatLocalDate(date: string) {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

function findNextAppearance(
  plan: MinervaPlan,
  upcomingVisits: UpcomingVisit[],
) {
  return upcomingVisits.find((visit) =>
    plan.normalLists.includes(visit.listNumber),
  )
}

export default function MinervaInventory({
  currentPlans,
  allPlans,
  upcomingVisits,
  currentListNumber,
  isPresent,
}: MinervaInventoryProps) {
  const [search, setSearch] = useState('')

  const normalizedSearch = normalizeText(search)
  const isSearching = normalizedSearch.length > 0

  const plans = useMemo(() => {
    if (!isSearching) {
      return currentPlans
    }

    return allPlans.filter((plan) => {
      const searchableText = normalizeText(
        `${plan.name} ${plan.editorId}`,
      )

      return searchableText.includes(normalizedSearch)
    })
  }, [
    allPlans,
    currentPlans,
    isSearching,
    normalizedSearch,
  ])

  return (
    <section>
      {/* CABECERA */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            {isSearching
              ? 'Buscador de Minerva'
              : isPresent
                ? 'Inventario actual'
                : 'Próximo inventario'}
          </div>

          <h2 className="mt-2 text-3xl font-black text-white">
            {isSearching
              ? 'Buscar planos'
              : `Lista ${currentListNumber}`}
          </h2>
        </div>

        {!isSearching && (
          <div className="text-sm text-text-secondary">
            {currentPlans.length}{' '}
            {currentPlans.length === 1
              ? 'plano'
              : 'planos'}
          </div>
        )}
      </div>

      {/* BUSCADOR */}
      <div className="mb-8">
        <div className="relative">
          <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl text-text-secondary">
            ⌕
          </span>

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Buscar un plano en todas las listas..."
            className="w-full rounded-2xl border border-surface-light bg-surface py-4 pl-14 pr-5 text-base text-white outline-none transition placeholder:text-text-secondary focus:border-primary"
          />
        </div>

        <div className="mt-3 text-sm text-text-secondary">
          {isSearching ? (
            <>
              {plans.length}{' '}
              {plans.length === 1
                ? 'resultado'
                : 'resultados'}{' '}
              entre los {allPlans.length} planes de Minerva.
            </>
          ) : (
            <>
              Puedes buscar entre los {allPlans.length} planes
              disponibles en las rotaciones de Minerva.
            </>
          )}
        </div>
      </div>

      {/* SIN RESULTADOS */}
      {plans.length === 0 && (
        <div className="rounded-2xl border border-surface-light bg-surface p-8">
          <div className="text-lg font-black text-white">
            No encontramos ese plano
          </div>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Prueba con otra palabra del nombre del objeto.
          </p>
        </div>
      )}

      {/* TARJETAS */}
      {plans.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {plans.map((plan) => {
            const nextAppearance = isSearching
              ? findNextAppearance(plan, upcomingVisits)
              : undefined

            return (
              <article
                key={plan.formId}
                className="group overflow-hidden rounded-2xl border border-surface-light bg-surface transition hover:-translate-y-1 hover:border-primary"
              >
                {/* IMAGEN */}
                <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-background p-5">
                  <Image
                    src={`/images/minerva/${plan.image}`}
                    alt={plan.name}
                    width={500}
                    height={500}
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>

                {/* INFORMACIÓN */}
                <div className="border-t border-surface-light p-5">
                  <h3 className="min-h-[3rem] text-base font-black leading-6 text-white">
                    {plan.name}
                  </h3>

                  {/* PRECIO */}
                  <div className="mt-4">
                    <div className="text-xs font-bold uppercase tracking-[0.14em] text-text-secondary">
                      Precio
                    </div>

                    <div className="mt-1 text-xl font-black text-primary">
                      {plan.price.toLocaleString('es-ES')}{' '}
                      <span className="text-sm font-bold">
                        lingotes
                      </span>
                    </div>
                  </div>

                  {/* PRÓXIMA APARICIÓN */}
                  {isSearching && nextAppearance && (
                    <div className="mt-5 border-t border-surface-light pt-4">
                      <div className="text-xs font-black uppercase tracking-[0.14em] text-accent">
                        Próxima aparición
                      </div>

                      {/* UBICACIÓN */}
                      <div className="mt-3 text-base font-black text-white">
                        {nextAppearance.locationLabel}
                      </div>

                      {/* FECHA */}
                      <div className="mt-2 text-sm font-bold leading-6 text-white">
                        {formatLocalDate(
                          nextAppearance.startsAt,
                        )}
                      </div>

                      {/* GRAN VENTA */}
                      {nextAppearance.isBigSale && (
                        <div className="mt-3">
                          <span className="inline-flex rounded-md bg-secondary px-2.5 py-1 text-xs font-black uppercase text-white">
                            Gran Venta
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SEGURIDAD SI NO HAY PRÓXIMA APARICIÓN */}
                  {isSearching && !nextAppearance && (
                    <div className="mt-5 border-t border-surface-light pt-4">
                      <div className="text-xs font-black uppercase tracking-[0.14em] text-accent">
                        Próxima aparición
                      </div>

                      <div className="mt-2 text-sm text-text-secondary">
                        No se encontró una próxima aparición en el
                        calendario cargado.
                      </div>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}