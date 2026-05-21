"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type InquiryType = "consulting" | "digital-marketing" | "partnership" | "other";

const inquiryTypes: { value: InquiryType; label: string }[] = [
  { value: "consulting", label: "E-Commerce Consulting" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "partnership", label: "Brand Partnership" },
  { value: "other", label: "Other" },
];

function ContactFormInner() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") as InquiryType | null;

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    type: (typeParam && inquiryTypes.some((t) => t.value === typeParam)
      ? typeParam
      : "consulting") as InquiryType,
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("server error");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong — please email karendelgadoc2@gmail.com directly.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-[var(--beige)] p-12 text-center space-y-4">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)]">
          Message Sent
        </p>
        <h2 className="text-3xl font-light">Thank you, {form.name}.</h2>
        <p className="text-[var(--muted)] leading-relaxed max-w-sm mx-auto">
          I&apos;ve received your message and will be in touch within 48 hours.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full border border-[var(--beige)] bg-transparent px-4 py-3 text-sm text-[var(--charcoal)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--taupe)] transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-[var(--taupe)] mb-2">
            Name <span className="text-[var(--taupe)]">*</span>
          </label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-[var(--taupe)] mb-2">
            Brand / Company
          </label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
            placeholder="Brand name"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase text-[var(--taupe)] mb-2">
          Email <span className="text-[var(--taupe)]">*</span>
        </label>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="you@brand.com"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase text-[var(--taupe)] mb-3">
          What are you looking for? <span className="text-[var(--taupe)]">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {inquiryTypes.map(({ value, label }) => (
            <label
              key={value}
              className={`flex items-center gap-3 border px-4 py-3 cursor-pointer transition-colors text-sm ${
                form.type === value
                  ? "border-[var(--charcoal)] text-[var(--charcoal)]"
                  : "border-[var(--beige)] text-[var(--muted)] hover:border-[var(--taupe)]"
              }`}
            >
              <input
                type="radio"
                name="type"
                value={value}
                checked={form.type === value}
                onChange={() => set("type", value)}
                className="sr-only"
              />
              <span
                className={`w-3 h-3 rounded-full border shrink-0 ${
                  form.type === value
                    ? "border-[var(--charcoal)] bg-[var(--charcoal)]"
                    : "border-[var(--muted)]"
                }`}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase text-[var(--taupe)] mb-2">
          Message <span className="text-[var(--taupe)]">*</span>
        </label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Tell me about your brand and what you're hoping to achieve..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === "error" && (
        <p className="text-xs text-[var(--muted)]">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full text-xs tracking-[0.2em] uppercase bg-[var(--charcoal)] text-[var(--cream)] py-4 hover:bg-[var(--taupe)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Sending…" : "Send Message →"}
      </button>
    </form>
  );
}

export default function ContactForm() {
  return (
    <Suspense fallback={null}>
      <ContactFormInner />
    </Suspense>
  );
}
