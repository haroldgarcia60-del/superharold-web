import {createClient} from 'next-sanity'

export const client = createClient({
  projectId: 'pc9qildj',
  dataset: 'production',
  apiVersion: '2026-09-03',

  // Consultamos directamente la API de Sanity.
  // Así evitamos recibir durante un tiempo una versión anterior
  // desde el CDN después de publicar cambios.
  useCdn: false,
})