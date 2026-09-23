import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { FavoritesProvider } from "@/components/favorites/FavoritesProvider";
import { FlashProvider } from "@/components/flash/FlashProvider";
import { getApiUrl } from "@/lib/get-api-url";
import { getSiteUrl } from "@/lib/get-site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "Portal Inmobiliario";
const SITE_DESCRIPTION = "Encuentra propiedades en venta y arriendo en México.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <FlashProvider>
          <AuthProvider apiUrl={getApiUrl()}>
            <FavoritesProvider>{children}</FavoritesProvider>
          </AuthProvider>
        </FlashProvider>
      </body>
    </html>
  );
}
