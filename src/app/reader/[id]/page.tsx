"use client";
import PDFViewer from "@/components/pdf-viewer";
import { api } from "@/trpc/react";
import { PDFSkeleton } from "@/components/pdf-skeleton";
import { useParams } from "next/navigation";
import Notes from "@/components/notes";
import { useState } from "react";
import SummaryPage from "@/app/_components/summary-page";

interface ConversationTurn {
  user: string;
  ai: string | null;
}

const ReaderView = () => {
  const params = useParams<{ id: string }>();
  const { id } = params;

  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [pageContent, setPageContent] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const paperQuery = api.paper.getPaper.useQuery(
    { paperId: id || "" },
    { enabled: !!id },
  );

  if (!id) return <p>No PDF provided.</p>;

  if (paperQuery.isLoading)
    return (
      <div className="p-4">
        <PDFSkeleton />
      </div>
    );
  if (paperQuery.isError) return <p>Error loading PDF.</p>;
  if (!paperQuery.data?.url) return <p>No PDF provided.</p>;

  return (
    <div className="flex">
      <PDFViewer
        docId={id}
        url={decodeURIComponent(paperQuery.data.url)}
        colorScheme="#000000"
        onPageContentChange={(content, page) => {
          setPageContent(content);
          setPageNumber(page);
        }}
      />
      <div className="h-screen w-full border-l p-2">
        <Notes
          serverNotes={paperQuery.data.notes?.[0]?.content || ""}
          uuid={id}
        />
        <SummaryPage
          pageContent={pageContent}
          pageNumber={pageNumber}
          paperId={id}
        />
      </div>
    </div>
  );
};

export default ReaderView;
