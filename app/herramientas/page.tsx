import Link from 'next/link'

export default function HerramientasPage() {
  return (
    <main className="min-h-screen">
      {/* CABECERA */}
      <section className="border-b border-surface-light">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
          <Link
            href="/"
            className="inline-block font-semibold text-text-secondary transition hover:text-primary"
          >
            ← Volver a Inicio
          </Link>

          <p className="mt-8 font-bold uppercase tracking-[0.25em] text-secondary">
            SuperHarOld
          </p>

          <h1 className="mt-3 text-5xl font-black md:text-6xl">
            Herramientas
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-text-secondary">
            Aplicaciones y herramientas creadas para ayudarte en Fallout 76.
            Consulta información del juego, encuentra los planos de Minerva y
            accede a las utilidades de SH76.
          </p>
        </div>
      </section>

      {/* HERRAMIENTAS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="font-bold uppercase tracking-widest text-accent">
          Utilidades
        </p>

        <h2 className="mt-2 text-3xl font-black md:text-4xl">
          Herramientas de SuperHarOld
        </h2>

        <p className="mt-3 max-w-2xl leading-7 text-text-secondary">
          Accede a nuestras herramientas y aplicaciones para Fallout 76.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* SH76 COMPANION */}
          <a
            href="https://play.google.com/store/apps/details?id=com.superharold.sh76companion"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col rounded-2xl border border-surface-light bg-surface p-7 transition duration-300 hover:-translate-y-1 hover:border-primary"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-secondary">
              Aplicación
            </p>

            <h2 className="mt-3 text-3xl font-black group-hover:text-primary">
              SH76 Companion
            </h2>

            <p className="mt-4 leading-7 text-text-secondary">
              La aplicación de SuperHarOld para Fallout 76. Una herramienta
              pensada para tener información útil del juego directamente en tu
              dispositivo Android.
            </p>

            <p className="mt-auto pt-8 font-bold text-primary">
              Ver en Google Play →
            </p>
          </a>

          {/* MINERVA */}
          <Link
            href="/fallout-76/minerva"
            className="group flex h-full flex-col rounded-2xl border border-surface-light bg-surface p-7 transition duration-300 hover:-translate-y-1 hover:border-primary"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-secondary">
              Herramienta web
            </p>

            <h2 className="mt-3 text-3xl font-black group-hover:text-primary">
              Minerva
            </h2>

            <p className="mt-4 leading-7 text-text-secondary">
              Consulta dónde está Minerva, su inventario completo, los precios
              de los planos y sus próximas visitas.
            </p>

            <p className="mt-auto pt-8 font-bold text-primary">
              Abrir Minerva →
            </p>
          </Link>
        </div>
      </section>

      {/* FUTURAS HERRAMIENTAS */}
      <section className="border-y border-surface-light bg-surface/30">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <p className="font-bold uppercase tracking-widest text-secondary">
            En desarrollo
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Más herramientas próximamente
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-text-secondary">
            Seguiremos incorporando nuevas utilidades para facilitar la
            consulta de información y datos de Fallout 76.
          </p>
        </div>
      </section>
    </main>
  )
}