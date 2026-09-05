import {NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)
  const query = searchParams.get('q')?.trim()

  if (!query || query.length < 2) {
    return NextResponse.json([])
  }

  try {
    const results = await client.fetch(
      `*[
        _type in ["news", "guide", "build", "datamine"] &&
        (
          title match $search ||
          summary match $search
        )
      ] | order(publishedAt desc)[0...10] {
        _id,
        _type,
        title,
        slug,
        summary,
        game->{
          name,
          slug
        }
      }`,
      {
        search: `*${query}*`,
      }
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error en API de búsqueda:', error)

    return NextResponse.json(
      {error: 'No se pudo realizar la búsqueda'},
      {status: 500}
    )
  }
}