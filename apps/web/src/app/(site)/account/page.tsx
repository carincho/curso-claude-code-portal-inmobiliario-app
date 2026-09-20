import type { Metadata } from "next";
import { AccountContent } from "@/components/account/AccountContent";
import { RequireAuth } from "@/components/auth/RequireAuth";

export const metadata: Metadata = {
  title: "Mi cuenta | Portal Inmobiliario",
};

export default function AccountPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <RequireAuth role="USER">
        <AccountContent />
      </RequireAuth>
    </div>
  );
}
