import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============================================================
// RUTAS
// ============================================================

const frontendRoot = path.resolve(__dirname, '..')

const companionRoot = path.resolve(
  frontendRoot,
  '..',
  '..',
  'sh_76_companion',
)

const minervaDataPath = path.join(
  companionRoot,
  'lib',
  'data',
  'minerva_data.dart',
)

const minervaImagesSource = path.join(
  companionRoot,
  'assets',
  'images',
  'minerva',
)

const outputDataDirectory = path.join(
  frontendRoot,
  'data',
  'minerva',
)

const outputJsonPath = path.join(
  outputDataDirectory,
  'minerva.json',
)

const outputImagesDirectory = path.join(
  frontendRoot,
  'public',
  'images',
  'minerva',
)

// ============================================================
// COMPROBACIONES INICIALES
// ============================================================

function requireFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} no encontrado:\n${filePath}`)
  }
}

function requireDirectory(directoryPath, label) {
  if (!fs.existsSync(directoryPath)) {
    throw new Error(`${label} no encontrado:\n${directoryPath}`)
  }
}

requireFile(minervaDataPath, 'minerva_data.dart')
requireDirectory(minervaImagesSource, 'Carpeta de imágenes de Minerva')

fs.mkdirSync(outputDataDirectory, {recursive: true})
fs.mkdirSync(outputImagesDirectory, {recursive: true})

// ============================================================
// LEER DART
// ============================================================

const dart = fs.readFileSync(minervaDataPath, 'utf8')

// ============================================================
// EXTRAER PLANES
// ============================================================

const plans = []

const planRegex =
  /'([0-9A-F]+)'\s*:\s*MinervaPlan\(\s*([\s\S]*?)\n\s*\),/g

let planMatch

while ((planMatch = planRegex.exec(dart)) !== null) {
  const mapFormId = planMatch[1]
  const body = planMatch[2]

  const getString = (field) => {
    const regex = new RegExp(
      `${field}:\\s*'((?:\\\\'|[^'])*)'`,
    )

    const match = body.match(regex)

    if (!match) {
      return null
    }

    return match[1].replace(/\\'/g, "'")
  }

  const getNumber = (field) => {
    const regex = new RegExp(`${field}:\\s*(\\d+)`)
    const match = body.match(regex)

    return match ? Number(match[1]) : null
  }

  const normalListsMatch = body.match(
    /normalLists:\s*\[([^\]]*)\]/,
  )

  const normalLists = normalListsMatch
    ? normalListsMatch[1]
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
        .map(Number)
    : []

  plans.push({
    formId: getString('formId') || mapFormId,
    name: getString('name') || '',
    editorId: getString('editorId') || '',
    price: getNumber('price'),
    basePrice: getNumber('basePrice'),
    priceSource: getString('priceSource') || '',
    tierEditorId: getString('tierEditorId'),
    tierFormId: getString('tierFormId'),
    normalLists,
  })
}

// ============================================================
// EXTRAER LAS 24 LISTAS
// ============================================================

const saleLists = []

const saleListsStart = dart.indexOf(
  'const Map<int, MinervaSaleList> minervaSaleLists',
)

if (saleListsStart === -1) {
  throw new Error('No se encontró minervaSaleLists.')
}

const saleListsEnd = dart.indexOf(
  'List<MinervaPlan> plansForMinervaList',
  saleListsStart,
)

if (saleListsEnd === -1) {
  throw new Error(
    'No se encontró el final del bloque minervaSaleLists.',
  )
}

const saleListsBlock = dart.slice(
  saleListsStart,
  saleListsEnd,
)

const saleRegex =
  /(\d+):\s*MinervaSaleList\(\s*([\s\S]*?)\n\s*\),/g

let saleMatch

while ((saleMatch = saleRegex.exec(saleListsBlock)) !== null) {
  const number = Number(saleMatch[1])
  const body = saleMatch[2]

  const isBigSale =
    /isBigSale:\s*true/.test(body)

  const planIdsMatch = body.match(
    /planFormIds:\s*\[([^\]]*)\]/,
  )

  const componentListsMatch = body.match(
    /componentLists:\s*\[([^\]]*)\]/,
  )

  const planFormIds = planIdsMatch
    ? [...planIdsMatch[1].matchAll(/'([^']+)'/g)].map(
        (match) => match[1],
      )
    : []

  const componentLists = componentListsMatch
    ? componentListsMatch[1]
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
        .map(Number)
    : []

  saleLists.push({
    number,
    isBigSale,
    planFormIds,
    componentLists,
  })
}

// ============================================================
// RESOLVER DE IMÁGENES
// Misma lógica utilizada actualmente por SH76 Companion.
// ============================================================

function imageForPlan(plan) {
  const name = plan.name.toLocaleLowerCase('es-ES')
  const editorId = plan.editorId.toLocaleLowerCase('es-ES')

  // Pinturas y diseños
  if (name.includes('pintura de los calcinados')) {
    return 'pintura_calcinados_x01.webp'
  }

  if (name.includes('pintura de slocum')) {
    return 'slocum_joe.webp'
  }

  if (
    name.includes(
      'prototipo de servoarmadura fuego infernal',
    )
  ) {
    return 'fuego_infernal.webp'
  }

  if (
    name.includes(
      'pintura de la hermandad del acero para ametralladora',
    )
  ) {
    return 'pintura_hermandad_ametralladora.webp'
  }

  if (name.includes('águilas de sangre')) {
    return 'pintura_aguilas.webp'
  }

  if (name.includes('diseño artesanal de llamas')) {
    return 'pintura_artesanal_llamas.webp'
  }

  if (
    name.includes('diseño artesanal intergaláctico')
  ) {
    return 'pintura_intergalactica_artesanal.webp'
  }

  // Modificaciones
  if (
    editorId.includes('recipe_mod') ||
    editorId.includes('_mod_') ||
    name.includes('módulo de mochila')
  ) {
    return 'mods.webp'
  }

  // Conjuntos de armadura
  if (name.includes('armadura con púas')) {
    return 'puas.webp'
  }

  if (name.includes('armadura solar')) {
    return 'solar.webp'
  }

  if (name.includes('corazón de enredadera')) {
    return 'enredadera.webp'
  }

  if (name.includes('t-65')) {
    return 't-65.webp'
  }

  if (
    name.includes(
      'armadura interior del servicio secreto',
    )
  ) {
    return 'armadura_interior.webp'
  }

  if (name.includes('servicio secreto')) {
    return 'servicio_secreto.webp'
  }

  if (
    name.includes('sigilo chino') ||
    name.includes('sigilo china')
  ) {
    return 'china.webp'
  }

  if (
    name.includes('reconocimiento de la hermandad')
  ) {
    return 'reconocimiento_hermandad.webp'
  }

  if (name.includes('scout sigilosa')) {
    return 'scout_sigiloso.webp'
  }

  if (name.includes('marine polar')) {
    return 'marine_polar.webp'
  }

  const imageByKeyword = {
    'ametralladora gauss': 'minigauss.webp',
    'pistola gauss': 'pistola_gauss.webp',
    'escopeta gauss': 'escopeta_gauss.webp',
    lanzaplasma: 'lanza_plasma.webp',
    'cartuchos de dinamita': 'dinamita_bundle.webp',
    dinamita: 'dinamita.webp',
    bengala: 'bengala.webp',
    'pica para ganado': 'pica_de_ganado.webp',
    guantelete: 'guantelete.webp',
    'granada de flotador lanzallamas':
      'granada_flotador_lanzallamas.webp',
    'granada de flotador congelador':
      'granada_flotador_congelador.webp',
    'granada de flotador masticador':
      'granada_flotador_masticador.webp',
    'turbo-fert': 'fertilizador_turbo_fert.webp',
    'pozo de agua': 'pozo_de_agua.webp',
    'parcelas de tierra cultivable':
      'tierra_cultibable.webp',
    'la destripadora': 'destripadora.webp',
    'guja de guerra': 'guja_de_guerra.webp',
    'silbido en la oscuridad':
      'silbido_en_la_oscuridad.webp',
    'bombillas con jaula':
      'bombillas_con_jaula.webp',
    'máquina sintomática':
      'maquina_sintomatica.webp',
    'panel solar recuperado': 'panel_solar.webp',
    superreactor: 'super_reactor.webp',
    'carteles de las madrigueras':
      'carteles_madrigueras.webp',
    'carteles de la galería':
      'carteles_galeria.webp',
    gallinero: 'gallinero.webp',
    'convertidor de munición':
      'corvertidor_municion.webp',
    'lanzamisiles tormenta infernal':
      'tormenta_infernal.webp',
    'pistola cruzado': 'pistola_cruzado.webp',
    'cortador de plasma': 'cortador_plasma.webp',
    'luz de manicomio': 'luz_manicomio.webp',
    'negocio abierto': 'negocio_abierto.webp',
    'bolsa de carne': 'bolsa_carne.webp',
    'neón de saludo': 'neon_saludo.webp',
    'emmett mountain': 'emmett.webp',
    'tubo de supermutantes': 'tubo_mutante.webp',
    'medallón de la hda':
      'medallon_hermandad.webp',
    'medallón del enclave': 'medallon_enclave.webp',
    'tubo de wendigos': 'tubo_wendigo.webp',
    'pizarras científicas':
      'pizarras_cientificas.webp',
    'monstruo imparable':
      'monstruo_imparable.webp',
    'negligencia médica':
      'negligencia_medica.webp',
    partecaras: 'partecaras.webp',
    'mejor amigo de un mecánico': 'mecanico.webp',
    'superviviente solitario':
      'superviviente_solitario.webp',
    'tubo de mirelurk rey': 'rey_tubo.webp',
    'caja de suministros mediana':
      'alijo_mediano.webp',
    'lanzador de nuka': 'lanzador_de_nuka.webp',
    'gabardina de vaquero': 'gabardina.webp',
    'chaparreras de vaquero':
      'chaparreras.webp',
    'sombrero de vaquero':
      'sombrero_baquero.webp',
    'cama infantil de camión': 'cama_camion.webp',
    'sombrero con paraguas':
      'sombrero_paraguas.webp',
    'silla de necrófago':
      'silla_necrofago.webp',
    'tubo del monstruo de flatwoods':
      'tubo_flatwods.webp',
    'tubos de flotador': 'tubo_flotador.webp',
    'mochila alienígena': 'mochila_alien.webp',
    'silla de gorila': 'silla_gorila.webp',
    'emblema oceánico': 'emblema_oceanico.webp',
    'señales del acuario': 'acuario.webp',
    'busto de acero': 'busto_accero.webp',
    fundición: 'fundicion.webp',
  }

  for (const [keyword, image] of Object.entries(
    imageByKeyword,
  )) {
    if (name.includes(keyword)) {
      return image
    }
  }

  return 'mods.webp'
}

// ============================================================
// AÑADIR IMAGEN A CADA PLAN
// ============================================================

const plansWithImages = plans.map((plan) => ({
  ...plan,
  image: imageForPlan(plan),
}))

// ============================================================
// CONSTRUIR INVENTARIOS FINALES
// Incluye deduplicación de Grandes Ventas.
// ============================================================

function plansForSaleList(listNumber) {
  const sale = saleLists.find(
    (item) => item.number === listNumber,
  )

  if (!sale) {
    return []
  }

  const ids = new Set()

  if (sale.isBigSale) {
    for (const componentNumber of sale.componentLists) {
      const component = saleLists.find(
        (item) => item.number === componentNumber,
      )

      for (const formId of component?.planFormIds ?? []) {
        ids.add(formId)
      }
    }
  } else {
    for (const formId of sale.planFormIds) {
      ids.add(formId)
    }
  }

  return [...ids]
}

const finalSaleLists = saleLists.map((sale) => ({
  ...sale,
  resolvedPlanFormIds: plansForSaleList(sale.number),
}))

// ============================================================
// VALIDACIONES
// ============================================================

const knownPlanIds = new Set(
  plansWithImages.map((plan) => plan.formId),
)

const missingPlanReferences = []

for (const sale of finalSaleLists) {
  for (const formId of sale.resolvedPlanFormIds) {
    if (!knownPlanIds.has(formId)) {
      missingPlanReferences.push({
        list: sale.number,
        formId,
      })
    }
  }
}

const usedImages = new Set(
  plansWithImages.map((plan) => plan.image),
)

const missingImages = []

for (const image of usedImages) {
  const imagePath = path.join(
    minervaImagesSource,
    image,
  )

  if (!fs.existsSync(imagePath)) {
    missingImages.push(image)
  }
}

// ============================================================
// GENERAR JSON
// ============================================================

const output = {
  generatedAt: new Date().toISOString(),

  source: {
    project: 'SH76 Companion',
    file: 'lib/data/minerva_data.dart',
  },

  stats: {
    plans: plansWithImages.length,
    saleLists: finalSaleLists.length,
    bigSales: finalSaleLists.filter(
      (sale) => sale.isBigSale,
    ).length,
  },

  plans: plansWithImages,

  saleLists: finalSaleLists,
}

fs.writeFileSync(
  outputJsonPath,
  JSON.stringify(output, null, 2),
  'utf8',
)

// ============================================================
// COPIAR IMÁGENES
// ============================================================

fs.cpSync(
  minervaImagesSource,
  outputImagesDirectory,
  {
    recursive: true,
    force: true,
  },
)

// ============================================================
// INFORME
// ============================================================

console.log('')
console.log('==========================================')
console.log(' SH76 → SUPERHAROLD WEB · MINERVA')
console.log('==========================================')
console.log('')

console.log(`Planes encontrados: ${plansWithImages.length}`)
console.log(`Listas encontradas: ${finalSaleLists.length}`)
console.log(
  `Grandes Ventas: ${
    finalSaleLists.filter((sale) => sale.isBigSale)
      .length
  }`,
)

console.log(`Imágenes utilizadas: ${usedImages.size}`)

console.log('')
console.log(`JSON generado:`)
console.log(outputJsonPath)

console.log('')
console.log(`Imágenes copiadas a:`)
console.log(outputImagesDirectory)

if (missingPlanReferences.length > 0) {
  console.log('')
  console.warn(
    'AVISO: existen FormID en listas que no tienen MinervaPlan:',
  )

  console.table(missingPlanReferences)
}

if (missingImages.length > 0) {
  console.log('')
  console.warn(
    'AVISO: faltan las siguientes imágenes:',
  )

  for (const image of missingImages) {
    console.warn(`- ${image}`)
  }
}

console.log('')

if (
  plansWithImages.length === 172 &&
  finalSaleLists.length === 24 &&
  missingPlanReferences.length === 0 &&
  missingImages.length === 0
) {
  console.log('✓ DATOS DE MINERVA GENERADOS CORRECTAMENTE')
} else {
  console.log(
    '⚠ Generación completada, pero revisa los avisos anteriores.',
  )
}

console.log('')