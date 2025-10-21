"use client";
import { useSearchParams } from "next/navigation";
import PDFViewer from "@/components/pdf-viewer";

export default function PDFPage() {
  const params = useSearchParams();
  const pdfUrl = params.get("q");

  if (!pdfUrl) return <p>No PDF provided.</p>;

  return (
    <div>
      <PDFViewer url={decodeURIComponent(pdfUrl)} />
    </div>
  );
}
