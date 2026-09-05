// SuperHarOld Web - Calendario de Minerva
//
// Portado desde SH76 Companion.
// Todos los cálculos internos se realizan en UTC.
//
// Ancla comprobada:
// Lista 1 - Fundación
// 14 septiembre 2026, 16:00 UTC.
//
// Ciclo de 5 semanas:
// semana 1: Fundación
// semana 2: Cráter
// semana 3: Fuerte Atlas
// semana 4: Gran Venta - Whitespring
// semana 5: descanso
//
// Grandes Ventas: listas 4, 8, 12, 16, 20 y 24.

export type MinervaLocation =
  | 'foundation'
  | 'crater'
  | 'fortAtlas'
  | 'whitespring'

export type MinervaVisit = {
  listNumber: number
  location: MinervaLocation
  locationLabel: string
  startsAt: Date
  endsAt: Date
  isBigSale: boolean
}

export type MinervaScheduleState = {
  now: Date
  isPresent: boolean
  activeVisit: MinervaVisit | null
  nextVisit: MinervaVisit
  relevantVisit: MinervaVisit
  remainingMs: number
}

// ============================================================
// CONFIGURACIÓN
// ============================================================

// Lista 1 - Fundación
// 14 septiembre 2026 - 16:00 UTC
const ANCHOR_UTC = new Date(
  Date.UTC(2026, 8, 14, 16, 0, 0),
)

const DAY_MS = 24 * 60 * 60 * 1000

const NORMAL_DURATION_MS = 2 * DAY_MS
const BIG_SALE_DURATION_MS = 4 * DAY_MS

// Un bloque completo dura 35 días.
const BLOCK_DURATION_DAYS = 35
const BLOCK_DURATION_MS =
  BLOCK_DURATION_DAYS * DAY_MS

// ============================================================
// UBICACIONES
// ============================================================

export function minervaLocationLabel(
  location: MinervaLocation,
): string {
  switch (location) {
    case 'foundation':
      return 'Fundación'

    case 'crater':
      return 'Cráter'

    case 'fortAtlas':
      return 'Fuerte Atlas'

    case 'whitespring':
      return 'Whitespring'
  }
}

// ============================================================
// UTILIDADES
// ============================================================

function wrapListNumber(value: number): number {
  let result = value % 24

  if (result <= 0) {
    result += 24
  }

  return result
}

function addDays(date: Date, days: number): Date {
  return new Date(
    date.getTime() + days * DAY_MS,
  )
}

function blockIndexFor(moment: Date): number {
  const difference =
    moment.getTime() - ANCHOR_UTC.getTime()

  return Math.floor(
    difference / BLOCK_DURATION_MS,
  )
}

function createVisit(
  listNumber: number,
  location: MinervaLocation,
  startsAt: Date,
  durationMs: number,
  isBigSale: boolean,
): MinervaVisit {
  return {
    listNumber,
    location,
    locationLabel:
      minervaLocationLabel(location),

    startsAt,

    endsAt: new Date(
      startsAt.getTime() + durationMs,
    ),

    isBigSale,
  }
}

// ============================================================
// VISITAS DE UN BLOQUE
// ============================================================

export function visitsForBlock(
  blockIndex: number,
): MinervaVisit[] {
  const blockStart = addDays(
    ANCHOR_UTC,
    BLOCK_DURATION_DAYS * blockIndex,
  )

  // Cada bloque avanza cuatro listas:
  //
  // 1,2,3,4
  // 5,6,7,8
  // 9,10,11,12
  // ...
  // 21,22,23,24
  // y vuelve a 1.

  const firstList = wrapListNumber(
    1 + blockIndex * 4,
  )

  const visit1Start = blockStart

  const visit2Start = addDays(
    blockStart,
    7,
  )

  const visit3Start = addDays(
    blockStart,
    14,
  )

  // La Gran Venta empieza el jueves
  // de la cuarta semana:
  // 24 días después del inicio del bloque.

  const bigSaleStart = addDays(
    blockStart,
    24,
  )

  return [
    createVisit(
      firstList,
      'foundation',
      visit1Start,
      NORMAL_DURATION_MS,
      false,
    ),

    createVisit(
      wrapListNumber(firstList + 1),
      'crater',
      visit2Start,
      NORMAL_DURATION_MS,
      false,
    ),

    createVisit(
      wrapListNumber(firstList + 2),
      'fortAtlas',
      visit3Start,
      NORMAL_DURATION_MS,
      false,
    ),

    createVisit(
      wrapListNumber(firstList + 3),
      'whitespring',
      bigSaleStart,
      BIG_SALE_DURATION_MS,
      true,
    ),
  ]
}

// ============================================================
// ESTADO ACTUAL DE MINERVA
// ============================================================

export function getMinervaScheduleState(
  now: Date = new Date(),
): MinervaScheduleState {
  const current = new Date(now)

  const approximateBlock =
    blockIndexFor(current)

  let activeVisit: MinervaVisit | null =
    null

  let nextVisit: MinervaVisit | null =
    null

  // Igual que en SH76 Companion:
  // buscamos alrededor del bloque actual.

  for (
    let block = approximateBlock - 1;
    block <= approximateBlock + 2;
    block++
  ) {
    const visits = visitsForBlock(block)

    for (const visit of visits) {
      const isActive =
        current.getTime() >=
          visit.startsAt.getTime() &&
        current.getTime() <
          visit.endsAt.getTime()

      if (isActive) {
        activeVisit = visit
      }

      if (
        visit.startsAt.getTime() >
        current.getTime()
      ) {
        if (
          nextVisit === null ||
          visit.startsAt.getTime() <
            nextVisit.startsAt.getTime()
        ) {
          nextVisit = visit
        }
      }
    }
  }

  // Fallback de seguridad.
  if (!nextVisit) {
    nextVisit =
      visitsForBlock(
        approximateBlock + 3,
      )[0]
  }

  const relevantVisit =
    activeVisit ?? nextVisit

  const remainingMs = activeVisit
    ? activeVisit.endsAt.getTime() -
      current.getTime()
    : nextVisit.startsAt.getTime() -
      current.getTime()

  return {
    now: current,
    isPresent: activeVisit !== null,
    activeVisit,
    nextVisit,
    relevantVisit,
    remainingMs,
  }
}

// ============================================================
// PRÓXIMAS VISITAS
// ============================================================

export function getUpcomingMinervaVisits(
  from: Date = new Date(),
  blocksAhead = 7,
): MinervaVisit[] {
  const current = new Date(from)

  const approximateBlock =
    blockIndexFor(current)

  const visits: MinervaVisit[] = []

  for (
    let block = approximateBlock - 1;
    block <= approximateBlock + blocksAhead;
    block++
  ) {
    for (const visit of visitsForBlock(block)) {
      if (
        visit.endsAt.getTime() >
        current.getTime()
      ) {
        visits.push(visit)
      }
    }
  }

  visits.sort(
    (a, b) =>
      a.startsAt.getTime() -
      b.startsAt.getTime(),
  )

  return visits
}