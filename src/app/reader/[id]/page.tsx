"use client";
import PDFViewer from "@/components/pdf-viewer";
import { api } from "@/trpc/react";
import { PDFSkeleton } from "@/components/pdf-skeleton";
import { useParams } from "next/navigation";
import Notes from "@/components/notes";
import SummaryPage from "@/app/_components/summary-page";
import { useState, useRef, useCallback } from "react";

export default function ReaderView() {
  const { id } = useParams<{ id: string }>();
  const [pageContent, setPageContent] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedText, setSelectedText] = useState("");

  const pdfWidthRef = useRef(50);
  const notesWidthRef = useRef(25);
  const summaryWidthRef = useRef(25);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pdfRef = useRef<HTMLDivElement | null>(null);
  const notesRef = useRef<HTMLDivElement | null>(null);
  const summaryRef = useRef<HTMLDivElement | null>(null);

  const draggingFirst = useRef(false);
  const draggingSecond = useRef(false);
  const rafId = useRef<number | null>(null);

  const paperQuery = api.paper.getPaper.useQuery(
    { paperId: id || "" },
    { enabled: !!id },
  );

  const updateWidths = (pdf: number, notes: number, summary: number) => {
    pdfWidthRef.current = pdf;
    notesWidthRef.current = notes;
    summaryWidthRef.current = summary;

    // Directly update DOM styles - no re-render!
    if (pdfRef.current) pdfRef.current.style.width = `${pdf}%`;
    if (notesRef.current) notesRef.current.style.width = `${notes}%`;
    if (summaryRef.current) summaryRef.current.style.width = `${summary}%`;
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    if (!draggingFirst.current && !draggingSecond.current) return;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const totalWidth = rect.width;

      if (draggingFirst.current) {
        const newPDF = (x / totalWidth) * 100;
        if (newPDF > 20 && newPDF < 80) {
          const remaining = 100 - newPDF;
          updateWidths(newPDF, remaining * 0.5, remaining * 0.5);
        }
      }

      if (draggingSecond.current) {
        const pdfPx = (pdfWidthRef.current / 100) * totalWidth;
        const remainingWidth = totalWidth - pdfPx;
        const relativeX = x - pdfPx;
        const newNotesPercent =
          (relativeX / remainingWidth) * (100 - pdfWidthRef.current);

        if (
          newNotesPercent > 10 &&
          newNotesPercent < 100 - pdfWidthRef.current - 10
        ) {
          const newSummaryPercent = 100 - pdfWidthRef.current - newNotesPercent;
          updateWidths(pdfWidthRef.current, newNotesPercent, newSummaryPercent);
        }
      }
    });
  }, []);

  const stopDrag = useCallback(() => {
    draggingFirst.current = false;
    draggingSecond.current = false;
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  }, []);

  if (!id) return <p>No PDF provided.</p>;

  if (paperQuery.isLoading)
    return (
      <div className="p-4">
        <PDFSkeleton />
      </div>
    );

  return (
    <div
      ref={containerRef}
      className="flex h-screen w-full select-none"
      onMouseMove={onMouseMove as any}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      <div
        ref={pdfRef}
        style={{ width: "50%" }}
        className="overflow-auto border-r"
      >
        <PDFViewer
          docId={id}
          url={decodeURIComponent(paperQuery.data?.url || "")}
          colorScheme="#000000"
          onPageContentChange={(content, page) => {
            setPageContent(content);
            setPageNumber(page);
          }}
          onSelectedTextChange={(text, page) => {
            setSelectedText(text);
            setPageNumber(page);
          }}
        />
      </div>

      <div
        className="w-1 cursor-col-resize bg-gray-300 hover:bg-gray-400"
        onMouseDown={() => (draggingFirst.current = true)}
      />

      <div
        ref={notesRef}
        style={{ width: "25%" }}
        className="overflow-auto border-r"
      >
        <Notes
          serverNotes={paperQuery.data?.notes?.[0]?.content || ""}
          uuid={id}
        />
      </div>

      <div
        className="w-1 cursor-col-resize bg-gray-300 hover:bg-gray-400"
        onMouseDown={() => (draggingSecond.current = true)}
      />

      <div ref={summaryRef} style={{ width: "25%" }} className="overflow-auto">
        <SummaryPage
          pageContent={pageContent}
          pageNumber={pageNumber}
          selectedText={selectedText}
          paperId={id}
          currentNotes={paperQuery.data?.notes?.[0]?.content}
          onNotesUpdated={() => paperQuery.refetch()}
        />
      </div>
    </div>
  );
}
