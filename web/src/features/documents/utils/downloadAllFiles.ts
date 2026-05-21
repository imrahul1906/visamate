// web/src/features/documents/utils/downloadAllFiles.ts

import type { DocumentItem, UploadsMap } from "@/types/document";
import { triggerDownload } from "@/lib/utils/download";

// ─────────────────────────────────────────────────────────────
// ZIP download helper (browser-side, no server needed)
//
// Attempts real ZIP via dynamic import of jszip.
// Falls back to downloading files individually if jszip is absent.
// ─────────────────────────────────────────────────────────────

export async function downloadAllFiles(uploads: UploadsMap, allDocs: DocumentItem[]) {
  try {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    const folder = zip.folder("visa-documents")!;
    for (const [docId, file] of Object.entries(uploads)) {
      const doc = allDocs.find(d => d.id === docId);
      const safeName = doc ? `${doc.name.replace(/[^a-z0-9]/gi, "_")}_${file.name}` : file.name;
      folder.file(safeName, file);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    triggerDownload(blob, "visa-documents.zip");
  } catch {
    // Fallback: download files one-by-one
    for (const [, file] of Object.entries(uploads)) {
      triggerDownload(file, file.name);
      await new Promise(r => setTimeout(r, 300));
    }
  }
}