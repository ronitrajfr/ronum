"use client";
import { useSearchParams } from "next/navigation";
import PDFViewer from "@/components/pdf-viewer";
import { api } from "@/trpc/react";

export default function PDFPage() {
  const params = useSearchParams();
  const pdfId = params.get("id");

  const paperQuery = api.paper.getPaper.useQuery(
    { paperId: pdfId || "" },
    { enabled: !!pdfId },
  );

  if (!pdfId) return <p>No PDF provided.</p>;

  if (paperQuery.isLoading) return <p>Loading PDF...</p>;
  if (paperQuery.isError) return <p>Error loading PDF.</p>;
  if (!paperQuery.data?.url) return <p>No PDF provided.</p>;

  return (
    <div>
      <PDFViewer
        docId={pdfId}
        url={decodeURIComponent(paperQuery.data.url)}
        colorScheme="#000000"
      />
    </div>
  );
}
