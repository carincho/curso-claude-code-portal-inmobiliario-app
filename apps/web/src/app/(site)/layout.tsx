import { Suspense, type ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={<div className="sticky top-0 z-50 h-16 bg-header" />}>
        <Header />
      </Suspense>
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
