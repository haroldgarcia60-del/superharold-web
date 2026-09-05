import {NextResponse} from 'next/server'

const UPLOADS_PLAYLIST_ID = 'UUIDb_mbeBjw5m3d_f4k5u4A'

type YouTubePlaylistItem = {
  snippet?: {
    title?: string
    description?: string
    publishedAt?: string
    thumbnails?: {
      high?: {
        url: string
        width: number
        height: number
      }
      medium?: {
        url: string
        width: number
        height: number
      }
    }
    resourceId?: {
      videoId?: string
    }
  }
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      {error: 'Falta YOUTUBE_API_KEY'},
      {status: 500},
    )
  }

  const url =
    `https://www.googleapis.com/youtube/v3/playlistItems` +
    `?part=snippet` +
    `&playlistId=${UPLOADS_PLAYLIST_ID}` +
    `&maxResults=12` +
    `&key=${apiKey}`

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 1800,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'Error de YouTube API',
          details: data,
        },
        {status: response.status},
      )
    }

    const videos = (data.items as YouTubePlaylistItem[] | undefined)
      ?.map((item) => {
        const videoId = item.snippet?.resourceId?.videoId

        if (!videoId) {
          return null
        }

        return {
          id: videoId,
          title: item.snippet?.title || 'Sin título',
          description: item.snippet?.description || '',
          publishedAt: item.snippet?.publishedAt || '',
          thumbnail:
            item.snippet?.thumbnails?.high?.url ||
            item.snippet?.thumbnails?.medium?.url ||
            '',
          url: `https://www.youtube.com/watch?v=${videoId}`,
        }
      })
      .filter(Boolean) || []

    return NextResponse.json({
      videos,
    })
  } catch {
    return NextResponse.json(
      {error: 'No se pudo conectar con YouTube'},
      {status: 500},
    )
  }
}