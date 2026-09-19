"use client";

import type { Role } from "@portal-inmobiliario/shared-types";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

export function RequireAuth({ role, children }: { role?: Role; children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const isAuthorized = Boolean(user) && (!role || user?.role === role);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      router.replace("/login");
    } else if (role && user.role !== role) {
      router.replace("/");
    }
  }, [isLoading, user, role, router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-16 text-center text-sm text-stone-600">
        Verificando sesión…
      </div>
    );
  }

  return <>{children}</>;
}
