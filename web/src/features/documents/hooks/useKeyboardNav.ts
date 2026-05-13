import { useEffect } from "react";
import type { DocumentData } from "../../../types/document";

interface UseKeyboardNavParams {
  data: DocumentData | null;
  activeDocId: string | null;
  setActiveDocId: (id: string | null) => void;
}

export function useKeyboardNav({ data, activeDocId, setActiveDocId }: UseKeyboardNavParams) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!data) return;
      const allDocs = data.categories.flatMap(c => c.documents);

      if (e.key === "Escape") {
        setActiveDocId(null);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const idx = allDocs.findIndex(d => d.id === activeDocId);
        const next = allDocs[idx + 1];
        if (next) setActiveDocId(next.id);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const idx = allDocs.findIndex(d => d.id === activeDocId);
        const prev = allDocs[idx - 1];
        if (prev) setActiveDocId(prev.id);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [data, activeDocId, setActiveDocId]);
}
