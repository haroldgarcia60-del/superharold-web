import {PortableText, type PortableTextComponents} from '@portabletext/react'
import {urlFor} from '@/sanity/lib/image'
import ArticleImage from '@/components/ArticleImage'
import ImageGallery from '@/components/ImageGallery'

type RichContentProps = {
  value: any[]
  components?: PortableTextComponents
}

type GalleryImageValue = {
  _key?: string
  asset?: {
    _ref: string
    _type: string
  }
  alt?: string
  caption?: string
}

type GalleryValue = {
  title?: string
  images?: GalleryImageValue[]
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({children}) => (
      <p className="my-5 text-base leading-8 text-text-secondary md:text-lg">
        {children}
      </p>
    ),

    h1: ({children}) => (
      <h1 className="mb-5 mt-12 text-4xl font-black leading-tight text-white">
        {children}
      </h1>
    ),

    h2: ({children}) => (
      <h2 className="mb-4 mt-10 text-3xl font-black leading-tight text-white">
        {children}
      </h2>
    ),

    h3: ({children}) => (
      <h3 className="mb-3 mt-8 text-2xl font-black leading-tight text-white">
        {children}
      </h3>
    ),

    h4: ({children}) => (
      <h4 className="mb-3 mt-7 text-xl font-bold leading-tight text-white">
        {children}
      </h4>
    ),

    blockquote: ({children}) => (
      <blockquote className="my-8 border-l-4 border-primary pl-5 italic text-text-secondary">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({children}) => (
      <ul className="my-6 list-disc space-y-2 pl-7 text-text-secondary">
        {children}
      </ul>
    ),

    number: ({children}) => (
      <ol className="my-6 list-decimal space-y-2 pl-7 text-text-secondary">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({children}) => (
      <li className="leading-7">
        {children}
      </li>
    ),

    number: ({children}) => (
      <li className="leading-7">
        {children}
      </li>
    ),
  },

  marks: {
    strong: ({children}) => (
      <strong className="font-bold text-white">
        {children}
      </strong>
    ),

    em: ({children}) => (
      <em className="italic">
        {children}
      </em>
    ),

    code: ({children}) => (
      <code className="rounded bg-background px-1.5 py-0.5 font-mono text-sm text-primary">
        {children}
      </code>
    ),

    link: ({children, value}) => {
      const href = value?.href || ''
      const external =
        href.startsWith('http://') ||
        href.startsWith('https://')

      return (
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 transition hover:decoration-primary"
        >
          {children}
        </a>
      )
    },
  },

  types: {
    image: ({value}) => {
      if (!value?.asset) {
        return null
      }

      const src = urlFor(value)
        .width(1600)
        .url()

      return (
        <ArticleImage
          src={src}
          alt={value.alt || 'Imagen de la publicación'}
          caption={value.caption}
        />
      )
    },

    gallery: ({value}) => {
      const gallery = value as GalleryValue

      if (!gallery.images || gallery.images.length === 0) {
        return null
      }

      return (
        <ImageGallery
          title={gallery.title}
          images={gallery.images}
        />
      )
    },
  },
}

export default function RichContent({
  value,
}: RichContentProps) {
  if (!value || value.length === 0) {
    return null
  }

  return (
    <PortableText
      value={value}
      components={portableTextComponents}
    />
  )
}