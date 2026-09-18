"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { contactFormSchema, type ContactFormValues } from "@/lib/contact-form-schema";
import { submitInquiry } from "@/lib/inquiries-client";
import { sendToWeb3Forms } from "@/lib/web3forms-client";

type Status = "idle" | "sending" | "success" | "error";

const fieldClassName =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20";
const labelClassName = "mb-1 block text-xs font-medium text-stone-600";
const errorClassName = "mt-1 text-xs text-red-600";

export function ContactForm({
  apiUrl,
  propertyId,
  propertyTitle,
}: {
  apiUrl: string;
  propertyId: string;
  propertyTitle: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { message: "Quiero detalles sobre esta propiedad" },
  });

  async function onSubmit(values: ContactFormValues) {
    setStatus("sending");

    try {
      await submitInquiry(apiUrl, { ...values, propertyId });
      reset();
      setStatus("success");
      void sendToWeb3Forms({ ...values, propertyId, propertyTitle });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-card-border bg-card px-4 py-6 text-center">
        <p className="text-sm font-medium text-stone-900">¡Consulta enviada!</p>
        <p className="mt-1 text-sm text-stone-600">
          Te contactaremos a la brevedad sobre esta propiedad.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="contact-name" className={labelClassName}>
          Nombre
        </label>
        <input id="contact-name" type="text" className={fieldClassName} {...register("name")} />
        {errors.name && <p className={errorClassName}>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClassName}>
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          className={fieldClassName}
          {...register("email")}
        />
        {errors.email && <p className={errorClassName}>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="contact-phone" className={labelClassName}>
          Teléfono
        </label>
        <input id="contact-phone" type="tel" className={fieldClassName} {...register("phone")} />
        {errors.phone && <p className={errorClassName}>{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClassName}>
          Mensaje
        </label>
        <textarea
          id="contact-message"
          rows={4}
          className={fieldClassName}
          {...register("message")}
        />
        {errors.message && <p className={errorClassName}>{errors.message.message}</p>}
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">No pudimos enviar tu consulta. Intenta nuevamente.</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Enviando…" : "Enviar consulta"}
      </button>
    </form>
  );
}
