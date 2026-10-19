import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Nunito } from "next/font/google";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { Providers } from "./providers";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "cyrillic"],
});

// Абсолютные ссылки для og:image. Vercel сам прокидывает домен продакшена.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://algoquest-rosy.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "AlgoQuest",
  description: "Алгоритмы для собеседований в формате коротких игровых уроков",
};

export const viewport: Viewport = {
  themeColor: "#7C5CFF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${nunito.variable} ${jetbrainsMono.variable} h-full antialiased`}
      // класс .dark ставит скрипт ниже до гидрации — это ожидаемое расхождение
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
