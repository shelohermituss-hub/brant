"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function TransactionsSearch({ initialRef }: { initialRef: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialRef);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/admin/transactions?ref=${encodeURIComponent(value.trim())}`);
    } else {
      router.push("/admin/transactions");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Chèche pa referans MonCash..."
        className="h-10 flex-1 rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none focus-visible:border-green-deep"
      />
      <Button type="submit" variant="outline">
        Chèche
      </Button>
    </form>
  );
}
