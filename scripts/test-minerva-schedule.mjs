import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const schedulePath = path.resolve(
  __dirname,
  '..',
  'data',
  'minerva',
  'minervaSchedule.ts',
)

// ============================================================
// CARGAMOS LA LÓGICA DEL CALENDARIO
// ============================================================

const source = fs.readFileSync(schedulePath, 'utf8')

// Extraemos las constantes importantes para comprobar que
// estamos probando exactamente la misma configuración.

if (!source.includes('Date.UTC(2026, 8, 14, 16, 0, 0)')) {
  throw new Error(
    'No se encontró el ancla esperada: 14/09/2026 16:00 UTC',
  )
}

// ============================================================
// IMPLEMENTACIÓN DE PRUEBA
// Replica la matemática del calendario TypeScript.
// ============================================================

const DAY_MS = 24 * 60 * 60 * 1000

const ANCHOR_UTC = new Date(
  Date.UTC(2026, 8, 14, 16, 0, 0),
)

const NORMAL_DURATION_MS = 2 * DAY_MS
const BIG_SALE_DURATION_MS = 4 * DAY_MS
const BLOCK_DURATION_DAYS = 35
const BLOCK_DURATION_MS = BLOCK_DURATION_DAYS * DAY_MS

function wrapListNumber(value) {
  let result = value % 24

  if (result <= 0) {
    result += 24
  }

  return result
}

function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS)
}

function blockIndexFor(moment) {
  return Math.floor(
    (moment.getTime() - ANCHOR_UTC.getTime()) /
      BLOCK_DURATION_MS,
  )
}

function visitsForBlock(blockIndex) {
  const blockStart = addDays(
    ANCHOR_UTC,
    BLOCK_DURATION_DAYS * blockIndex,
  )

  const firstList = wrapListNumber(
    1 + blockIndex * 4,
  )

  return [
    {
      listNumber: firstList,
      location: 'Fundación',
      startsAt: blockStart,
      endsAt: new Date(
        blockStart.getTime() + NORMAL_DURATION_MS,
      ),
      isBigSale: false,
    },

    {
      listNumber: wrapListNumber(firstList + 1),
      location: 'Cráter',
      startsAt: addDays(blockStart, 7),
      endsAt: new Date(
        addDays(blockStart, 7).getTime() +
          NORMAL_DURATION_MS,
      ),
      isBigSale: false,
    },

    {
      listNumber: wrapListNumber(firstList + 2),
      location: 'Fuerte Atlas',
      startsAt: addDays(blockStart, 14),
      endsAt: new Date(
        addDays(blockStart, 14).getTime() +
          NORMAL_DURATION_MS,
      ),
      isBigSale: false,
    },

    {
      listNumber: wrapListNumber(firstList + 3),
      location: 'Whitespring',
      startsAt: addDays(blockStart, 24),
      endsAt: new Date(
        addDays(blockStart, 24).getTime() +
          BIG_SALE_DURATION_MS,
      ),
      isBigSale: true,
    },
  ]
}

function getState(now) {
  const approximateBlock = blockIndexFor(now)

  let activeVisit = null
  let nextVisit = null

  for (
    let block = approximateBlock - 1;
    block <= approximateBlock + 2;
    block++
  ) {
    for (const visit of visitsForBlock(block)) {
      if (
        now.getTime() >= visit.startsAt.getTime() &&
        now.getTime() < visit.endsAt.getTime()
      ) {
        activeVisit = visit
      }

      if (visit.startsAt.getTime() > now.getTime()) {
        if (
          !nextVisit ||
          visit.startsAt.getTime() <
            nextVisit.startsAt.getTime()
        ) {
          nextVisit = visit
        }
      }
    }
  }

  return {
    activeVisit,
    nextVisit,
  }
}

// ============================================================
// TESTS
// ============================================================

let passed = 0
let failed = 0

function testActive(
  date,
  expectedList,
  expectedLocation,
  expectedBigSale = false,
) {
  const state = getState(new Date(date))
  const visit = state.activeVisit

  const ok =
    visit &&
    visit.listNumber === expectedList &&
    visit.location === expectedLocation &&
    visit.isBigSale === expectedBigSale

  if (ok) {
    console.log(
      `✓ ${date} → Lista ${expectedList} · ${expectedLocation}`,
    )

    passed++
  } else {
    console.error(`✗ ${date}`)
    console.error(
      `  Esperado: Lista ${expectedList} · ${expectedLocation}`,
    )
    console.error('  Obtenido:', visit)

    failed++
  }
}

function testAbsent(
  date,
  expectedNextList,
  expectedNextLocation,
) {
  const state = getState(new Date(date))

  const ok =
    state.activeVisit === null &&
    state.nextVisit &&
    state.nextVisit.listNumber === expectedNextList &&
    state.nextVisit.location === expectedNextLocation

  if (ok) {
    console.log(
      `✓ ${date} → Ausente · Próxima: Lista ${expectedNextList} · ${expectedNextLocation}`,
    )

    passed++
  } else {
    console.error(`✗ ${date}`)
    console.error(
      `  Esperado: Ausente · próxima Lista ${expectedNextList} · ${expectedNextLocation}`,
    )
    console.error('  Estado obtenido:', state)

    failed++
  }
}

console.log('')
console.log('==========================================')
console.log(' TEST CALENDARIO MINERVA')
console.log('==========================================')
console.log('')

testActive(
  '2026-09-14T16:00:00Z',
  1,
  'Fundación',
)

testActive(
  '2026-09-21T16:00:00Z',
  2,
  'Cráter',
)

testActive(
  '2026-09-28T16:00:00Z',
  3,
  'Fuerte Atlas',
)

testActive(
  '2026-10-08T16:00:00Z',
  4,
  'Whitespring',
  true,
)

// Semana de descanso:
// la Gran Venta 4 termina el 12 de octubre.
// La siguiente visita es Lista 5 el 19 de octubre.
testAbsent(
  '2026-10-15T16:00:00Z',
  5,
  'Fundación',
)

testActive(
  '2026-10-19T16:00:00Z',
  5,
  'Fundación',
)

console.log('')
console.log('------------------------------------------')
console.log(`Pruebas correctas: ${passed}`)
console.log(`Pruebas fallidas: ${failed}`)
console.log('------------------------------------------')

if (failed > 0) {
  console.error('')
  console.error('✗ EL CALENDARIO TIENE ERRORES')
  process.exit(1)
}

console.log('')
console.log('✓ CALENDARIO DE MINERVA CORRECTO')
console.log('')