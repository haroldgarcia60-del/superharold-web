import Image from 'next/image'
import {client} from '@/sanity/lib/client'

type YouTubeVideo = {
  id: string
  title: string
  description: string
  publishedAt: string
  thumbnail: string
  url: string
}

type YouTubeResponse = {
  videos?: YouTubeVideo[]
  error?: string
}

async function getVideos(): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey) {
    return []
  }

  const playlistId = 'UU IDb_mbeBjw5m3d_f4k5u4A'.replace(' ', '')

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=12&key=${apiKey}`,
    {
      next: {
        revalidate: 1800,
      },
    },
  )

  if (!response.ok) {
    return []
  }

  const data = await response.json()

  return (
    data.items
      ?.map((item: any) => {
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
            item.snippet?.thumbnails?.default?.url ||
            '',
          url: `https://www.youtube.com/watch?v=${videoId}`,
        }
      })
      .filter(Boolean) || []
  )
}

function formatDate(date: string) {
  if (!date) {
    return ''
  }

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export default async function VideosPage() {
  const videos = await getVideos()

  return (
    <main>
      {/* CABECERA */}
      <section className="border-b border-surface-light">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="font-bold uppercase tracking-widest text-secondary">
            YouTube
          </p>

          <h1 className="mt-2 text-4xl font-black md:text-5xl">
            Vídeos
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-text-secondary">
            Los últimos vídeos publicados en el canal de SuperHarOld.
          </p>
        </div>
      </section>

      {/* VÍDEOS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        {videos.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-2xl border border-surface-light bg-surface transition duration-300 hover:-translate-y-1 hover:border-primary"
              >
                {/* MINIATURA */}
                <div className="relative aspect-video overflow-hidden bg-surface-light">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/75 text-2xl text-white opacity-0 transition group-hover:opacity-100">
                      ▶
                    </div>
                  </div>
                </div>

                {/* INFORMACIÓN */}
                <div className="p-5">
                  <h2 className="line-clamp-2 text-lg font-black leading-7 transition group-hover:text-primary">
                    {video.title}
                  </h2>

                  <p className="mt-3 text-sm text-text-secondary">
                    {formatDate(video.publishedAt)}
                  </p>

                  <p className="mt-4 font-bold text-primary">
                    Ver vídeo →
                  </p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-surface-light bg-surface p-8 text-text-secondary">
            No se han podido cargar los vídeos.
          </div>
        )}
      </section>
    </main>
  )
}