"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-700 text-xs disabled:opacity-50"
    >
      {loading ? "…" : "Eliminar"}
    </button>
  );
}
