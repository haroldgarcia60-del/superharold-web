import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.superharold.es"),

  title: {
    default: "SuperHarOld | Fallout 76, guías, noticias y datamineos",
    template: "%s | SuperHarOld",
  },

  description:
    "Noticias, guías, builds, datamineos y herramientas de Fallout 76. Todo el contenido de SuperHarOld en un solo lugar.",

  applicationName: "SuperHarOld",

  authors: [
    {
      name: "SuperHarOld",
    },
  ],

  creator: "SuperHarOld",
  publisher: "SuperHarOld",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://www.superharold.es",
    siteName: "SuperHarOld",
    title: "SuperHarOld | Fallout 76, guías, noticias y datamineos",
    description:
      "Noticias, guías, builds, datamineos y herramientas de Fallout 76. Todo el contenido de SuperHarOld en un solo lugar.",
  },

  twitter: {
    card: "summary_large_image",
    title: "SuperHarOld | Fallout 76, guías, noticias y datamineos",
    description:
      "Noticias, guías, builds, datamineos y herramientas de Fallout 76. Todo el contenido de SuperHarOld en un solo lugar.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <Header />

        <div className="flex flex-1 flex-col">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}