// app/documents/downloadAllFiles.ts

import type { DocumentItem, UploadsMap } from "../../../types/document";

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
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "visa-documents.zip";
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    // Fallback: download files one-by-one
    for (const [, file] of Object.entries(uploads)) {
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
      await new Promise(r => setTimeout(r, 300));
    }
  }
}