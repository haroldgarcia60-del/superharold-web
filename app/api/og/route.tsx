import {ImageResponse} from 'next/og'
import {NextRequest} from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url)

  const image = searchParams.get('image')
  const title = searchParams.get('title') || 'SuperHarOld'
  const game = searchParams.get('game') || 'Fallout 76'
  const section = searchParams.get('section') || ''

  if (!image) {
    return new Response('Falta la imagen', {
      status: 400,
    })
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          background:
            'linear-gradient(135deg, #070A0D 0%, #182029 55%, #070A0D 100%)',
          color: 'white',
          padding: '42px',
          gap: '42px',
          alignItems: 'center',
        }}
      >
        {/* PORTADA */}
        <div
          style={{
            width: '500px',
            height: '546px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0D1217',
            border: '2px solid #182029',
            borderRadius: '28px',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <img
            src={image}
            alt=""
            width="500"
            height="546"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* INFORMACIÓN */}
        <div
          style={{
            flex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '24px',
              fontWeight: 700,
              color: '#D4146E',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '18px',
            }}
          >
            {game}
            {section ? ` · ${section}` : ''}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: title.length > 65 ? '42px' : '50px',
              fontWeight: 900,
              lineHeight: 1.08,
              marginBottom: '30px',
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 'auto',
              paddingBottom: '12px',
              fontSize: '28px',
              fontWeight: 800,
              color: '#B6D900',
            }}
          >
            SuperHarOld
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}