import Image from 'next/image'

import MinervaCountdown from '@/components/MinervaCountdown'
import MinervaInventory from '@/components/MinervaInventory'
import minervaData from '@/data/minerva/minerva.json'
import {
  getMinervaScheduleState,
  getUpcomingMinervaVisits,
  type MinervaVisit,
} from '@/data/minerva/minervaSchedule'

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

type MinervaSaleList = {
  number: number
  isBigSale: boolean
  planFormIds: string[]
  componentLists: number[]
}

type MinervaData = {
  plans: MinervaPlan[]
  saleLists: MinervaSaleList[]
}

const data = minervaData as MinervaData

function getPlansForVisit(visit: MinervaVisit) {
  const saleList = data.saleLists.find(
    (list) => list.number === visit.listNumber,
  )

  if (!saleList) return []

  const ids = new Set<string>()

  if (saleList.isBigSale) {
    for (const componentListNumber of saleList.componentLists) {
      const componentList = data.saleLists.find(
        (list) => list.number === componentListNumber,
      )

      if (!componentList) continue

      for (const formId of componentList.planFormIds) {
        ids.add(formId)
      }
    }
  } else {
    for (const formId of saleList.planFormIds) {
      ids.add(formId)
    }
  }

  return Array.from(ids)
    .map((formId) =>
      data.plans.find((plan) => plan.formId === formId),
    )
    .filter((plan): plan is MinervaPlan => Boolean(plan))
}

export default function MinervaPage() {
  const schedule = getMinervaScheduleState()
  const visit = schedule.relevantVisit
  const plans = getPlansForVisit(visit)

  const targetDate = schedule.isPresent
    ? visit.endsAt
    : visit.startsAt

  // Próximas visitas de Minerva.
  // Las convertimos a texto ISO antes de enviarlas
  // al componente cliente del buscador.
  const upcomingVisits = getUpcomingMinervaVisits(
    schedule.now,
    8,
  ).map((upcomingVisit) => ({
    listNumber: upcomingVisit.listNumber,
    locationLabel: upcomingVisit.locationLabel,
    startsAt: upcomingVisit.startsAt.toISOString(),
    endsAt: upcomingVisit.endsAt.toISOString(),
    isBigSale: upcomingVisit.isBigSale,
  }))

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        {/* CABECERA DE PÁGINA */}
        <section className="mb-8">
          <div className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Fallout 76
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            Minerva
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-text-secondary md:text-lg">
            Consulta dónde está Minerva, cuándo llegará y qué planos tiene
            disponibles en Fallout 76.
          </p>
        </section>

        {/* TARJETA PRINCIPAL DE MINERVA */}
        <section className="relative mb-12 overflow-hidden rounded-3xl border border-primary/60 bg-surface">
          {/* FONDO */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(182,217,0,0.10),transparent_45%)]" />

          <div className="relative min-h-[320px] md:min-h-[350px]">
            {/* INFORMACIÓN */}
            <div className="relative z-10 flex min-h-[320px] flex-col justify-center px-7 py-8 md:min-h-[350px] md:w-[68%] md:px-10 lg:px-12">
              {/* ESTADO */}
              <div className="mb-4 flex items-center gap-3">
                <span
                  className={`h-3.5 w-3.5 shrink-0 rounded-full ${
                    schedule.isPresent
                      ? 'bg-primary'
                      : 'bg-secondary'
                  }`}
                />

                <span
                  className={`text-sm font-black uppercase tracking-[0.14em] md:text-base ${
                    schedule.isPresent
                      ? 'text-primary'
                      : 'text-secondary'
                  }`}
                >
                  {schedule.isPresent
                    ? 'Minerva está aquí'
                    : 'Minerva no está aquí'}
                </span>
              </div>

              {/* UBICACIÓN */}
              <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
                {visit.locationLabel}
              </h2>

              {/* LISTA / GRAN VENTA */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-lg bg-surface-light px-4 py-2 text-sm font-black text-white">
                  Lista {visit.listNumber}
                </span>

                {visit.isBigSale && (
                  <span className="rounded-lg bg-secondary px-4 py-2 text-sm font-black text-white">
                    Gran Venta
                  </span>
                )}
              </div>

              {/* CONTADOR */}
              <div className="max-w-xl">
                <MinervaCountdown
                  targetDate={targetDate.toISOString()}
                  isPresent={schedule.isPresent}
                />
              </div>
            </div>

            {/* MINERVA - ESCRITORIO */}
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 hidden w-[42%] items-end justify-end md:flex">
              <Image
                src="/images/minerva/minerva.webp"
                alt="Minerva en Fallout 76"
                width={700}
                height={900}
                priority
                className="h-[98%] w-auto max-w-none object-contain object-bottom"
              />
            </div>

            {/* MINERVA - MÓVIL */}
            <div className="pointer-events-none relative flex h-[300px] items-end justify-center md:hidden">
              <Image
                src="/images/minerva/minerva.webp"
                alt="Minerva en Fallout 76"
                width={700}
                height={900}
                priority
                className="h-full w-auto object-contain object-bottom"
              />
            </div>
          </div>
        </section>

        {/* INVENTARIO + BUSCADOR */}
        <MinervaInventory
          currentPlans={plans}
          allPlans={data.plans}
          upcomingVisits={upcomingVisits}
          currentListNumber={visit.listNumber}
          isPresent={schedule.isPresent}
        />
      </div>
    </main>
  )
}