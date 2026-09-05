import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-surface-light bg-background/60">
            <div className="mx-auto max-w-7xl px-6 py-9">

                {/* CONTENIDO PRINCIPAL */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">

                    {/* SUPERHAROLD */}
                    {/* SUPERHAROL */}
                    <div>
                        <h2 className="text-xl font-black text-primary">
                            Superharold
                        </h2>

                        <p className="mt-4 text-sm font-bold uppercase tracking-widest text-white">
                            Contacto
                        </p>

                        <a
                            href="mailto:sup3rharold@gmail.com"
                            className="mt-2 inline-block text-sm text-text-secondary transition hover:text-primary"
                        >
                            sup3rharold@gmail.com
                        </a>
                    </div>

                    {/* CONTENIDO */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
                            Contenido
                        </h3>

                        <div className="mt-3 flex flex-col gap-2 text-sm text-text-secondary">
                            <Link
                                href="/fallout-76"
                                className="transition hover:text-primary"
                            >
                                Fallout 76
                            </Link>

                            <Link
                                href="/otros-juegos"
                                className="transition hover:text-primary"
                            >
                                Otros juegos
                            </Link>

                            <Link
                                href="/videos"
                                className="transition hover:text-primary"
                            >
                                Vídeos
                            </Link>

                            <Link
                                href="/herramientas"
                                className="transition hover:text-primary"
                            >
                                Herramientas
                            </Link>
                        </div>
                    </div>

                    {/* COMUNIDAD */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
                            Comunidad
                        </h3>

                        <div className="mt-3 flex flex-col gap-2 text-sm text-text-secondary">

                            <a
                                href="https://www.youtube.com/@superharold"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition hover:text-primary"
                            >
                                YouTube
                            </a>

                            <a
                                href="https://x.com/SuperHarOld8"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition hover:text-primary"
                            >
                                X / Twitter
                            </a>

                            <a
                                href="https://discord.gg/rbPeePrpPa"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition hover:text-primary"
                            >
                                Discord
                            </a>

                        </div>
                    </div>

                    {/* SH76 COMPANION */}
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-primary">
                            SH76 Companion
                        </p>

                        <h3 className="mt-2 text-lg font-black">
                            Fallout 76 en tu móvil
                        </h3>

                        <p className="mt-2 max-w-xs text-sm leading-6 text-text-secondary">
                            Lleva las herramientas de SH76 Companion contigo en Android.
                        </p>

                        <a
                            href="https://play.google.com/store/apps/details?id=com.superharold.sh76companion"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-block rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-black transition hover:bg-primary-pressed"
                        >
                            Descargar en Google Play
                        </a>
                    </div>

                </div>

                {/* PARTE INFERIOR */}
                <div className="mt-8 flex flex-col gap-3 border-t border-surface-light pt-5 text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between">

                    <p>
                        © 2026 SuperHarOld · SH76 Companion
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/privacidad"
                            className="transition hover:text-primary"
                        >
                            Privacidad
                        </Link>

                        <Link
                            href="/cookies"
                            className="transition hover:text-primary"
                        >
                            Cookies
                        </Link>

                        <Link
                            href="/aviso-legal"
                            className="transition hover:text-primary"
                        >
                            Aviso legal
                        </Link>
                    </div>

                </div>

            </div>
        </footer>
    )
}