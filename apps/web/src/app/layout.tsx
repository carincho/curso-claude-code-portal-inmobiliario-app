import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { FavoritesProvider } from "@/components/favorites/FavoritesProvider";
import { getApiUrl } from "@/lib/get-api-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portal Inmobiliario",
  description: "Encuentra propiedades en venta y arriendo en México.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AuthProvider apiUrl={getApiUrl()}>
          <FavoritesProvider>{children}</FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
