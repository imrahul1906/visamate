"use client";

// app/documents/page.tsx
import { Suspense } from "react";
import DocumentsContent from "./DocumentsContent";

export default function DocumentsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f8f7f4" }} />}>
      <DocumentsContent />
    </Suspense>
  );
}