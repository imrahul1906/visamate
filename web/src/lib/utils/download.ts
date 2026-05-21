/**
 * Triggers a browser-side file download for a given Blob or File object.
 */
export function triggerDownload(blob: Blob | File, filename: string): void {
  if (typeof window === "undefined") return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Clean up URL and remove element from DOM after a short timeout to ensure browser handles it
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
