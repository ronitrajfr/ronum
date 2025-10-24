import { GlobalWorkerOptions } from "pdfjs-dist";
import {
  Root,
  Pages,
  Page,
  CanvasLayer,
  TextLayer,
  HighlightLayer,
  useSelectionDimensions,
  usePdf,
  calculateHighlightRects,
  type SearchResult,
  usePdfJump,
  useSearch,
  Search,
  ZoomOut,
  AnnotationLayer,
  CurrentZoom,
  ZoomIn,
  CustomLayer,
  SelectionTooltip,
} from "@anaralabs/lector";
import { PDFSkeleton } from "./pdf-skeleton";
import "pdfjs-dist/web/pdf_viewer.css";
import { Button } from "./ui/button";

import { useDebounce } from "use-debounce";
import { useEffect, useState, useRef } from "react";
import { Input } from "./ui/input";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  ZoomInIcon,
  ZoomOutIcon,
  PencilIcon,
  EraserIcon,
  HighlighterIcon,
  NotebookText,
} from "lucide-react";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

export default function PDFViewer({
  url,
  colorScheme,
  docId,
}: {
  url: string;
  colorScheme?: string;
  docId: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Root
      source={url}
      className="h-[calc(100vh-40px)] w-full"
      loader={
        <div className="p-4">
          <PDFSkeleton />
        </div>
      }
      zoomOptions={{
        minZoom: 0.5,
        maxZoom: 5,
      }}
      isZoomFitWidth
    >
      <div
        className={`bg-[${colorScheme}] absolute top-[40px] z-10 h-[calc(100vh-40px)] transform p-2 transition-all duration-300 ease-in-out ${
          sidebarOpen
            ? "visible translate-x-0 opacity-100"
            : "invisible -translate-x-full opacity-0"
        } flex flex-col`}
      >
        <Search>
          <SearchUI />
        </Search>
      </div>

      <div className="flex h-[40px] items-center justify-center gap-1 border-b p-1 text-sm">
        {/* <AnnotationToolbar /> */}
        <Button
          className=""
          variant={"ghost"}
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
          }}
        >
          <SearchIcon size={16} />
        </Button>
        <div className="flex flex-row items-center justify-center gap-0.5">
          <ZoomOut className="cursor-pointer px-3 py-1">
            <ZoomOutIcon size={15} />
          </ZoomOut>
          <CurrentZoom className="w-16 rounded-full border px-3 py-1 text-center" />
          <ZoomIn className="cursor-pointer px-3 py-1">
            <ZoomInIcon size={15} />
          </ZoomIn>
          <PageNavigationButtons docId={docId} />
        </div>
      </div>
      <HighlightLayerContent />
    </Root>
  );
}

const PageNavigationButtons = ({ docId }: { docId: string }) => {
  const pages = usePdf((state) => state.pdfDocumentProxy?.numPages);
  const currentPage = usePdf((state) => state.currentPage);
  console.log(currentPage);
  const [pageNumber, setPageNumber] = useState<number | string>(currentPage);
  const { jumpToPage } = usePdfJump();

  const docKey = `pdf-current-page-${docId}`;

  const [debouncedPage] = useDebounce(pageNumber, 500);

  const pageToSave = Number(debouncedPage);

  useEffect(() => {
    const lastPage = localStorage.getItem(docKey);
    if (lastPage) {
      const page = Number(lastPage);
      if (!isNaN(page) && page >= 1 && page <= pages) {
        jumpToPage(page, { behavior: "auto" });
        setPageNumber(page);
      }
    }
  }, [pages, docKey]);

  // Save debounced page number to localStorage
  useEffect(() => {
    if (pageToSave >= 1 && pageToSave <= pages) {
      localStorage.setItem(docKey, String(pageToSave));
    }
  }, [debouncedPage, pages, docKey]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      jumpToPage(currentPage - 1, { behavior: "auto" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages) {
      jumpToPage(currentPage + 1, { behavior: "auto" });
    }
  };

  useEffect(() => {
    setPageNumber(currentPage);
  }, [currentPage]);

  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={handlePreviousPage}
        disabled={currentPage <= 1}
        className="rounded-full disabled:opacity-40"
        aria-label="Previous page"
        size={"icon"}
        variant={"ghost"}
      >
        <ChevronLeftIcon />
      </Button>

      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={pageNumber}
          onChange={(e) => setPageNumber(e.target.value)}
          onBlur={(e) => {
            const value = Number(e.target.value);
            if (value >= 1 && value <= pages && currentPage !== value) {
              jumpToPage(value, { behavior: "auto" });
            } else {
              setPageNumber(currentPage);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          className="h-7 w-12 [appearance:textfield] rounded-md border text-center text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="text-sm font-medium text-gray-500">
          / {pages || 1}
        </span>
      </div>

      <Button
        onClick={handleNextPage}
        disabled={currentPage >= pages}
        className="rounded-full disabled:opacity-40"
        aria-label="Next page"
        size={"icon"}
        variant={"ghost"}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
};

//Highligt

const HighlightLayerContent = () => {
  const selectionDimensions = useSelectionDimensions();
  const setHighlights = usePdf((state) => state.setHighlight);

  const handleHighlight = () => {
    const dimension = selectionDimensions.getDimension();
    // console.log(dimension.highlights)
    if (dimension && !dimension.isCollapsed) {
      setHighlights(dimension.highlights);
    }
  };

  return (
    <Pages className="overflow-auto dark:brightness-[80%] dark:contrast-[228%] dark:hue-rotate-180 dark:invert-[94%]">
      <Page>
        {/* {selectionDimensions && <CustomSelect onHighlight={handleHighlight} />} */}
        <CanvasLayer className="canvasLayer" />
        <TextLayer className="textLayer" />
        <HighlightLayer className="bg-yellow-200/70" />
        <AnnotationLayer className="annotationLayer" />

        {/* <CustomLayer>
          {(pageNumber) => (
            <>
              <AnnotationLayer pageNumber={pageNumber} />
            </>
          )}
        </CustomLayer> */}
      </Page>
    </Pages>
  );
};

function CustomSelect({ onHighlight }: { onHighlight: () => void }) {
  return (
    <SelectionTooltip>
      <Button className="w-fit rounded-md px-3 py-1" onClick={onHighlight}>
        Highlight
      </Button>
    </SelectionTooltip>
  );
}

interface ResultItemProps {
  result: SearchResult;
}

//Search

function ResultItem({ result }: ResultItemProps) {
  const { jumpToHighlightRects } = usePdfJump();
  const getPdfPageProxy = usePdf((state) => state.getPdfPageProxy);

  const onClick = async () => {
    const pageProxy = getPdfPageProxy(result.pageNumber);
    const rects = await calculateHighlightRects(pageProxy, {
      pageNumber: result.pageNumber,
      text: result.text,
      matchIndex: result.matchIndex,
    });
    jumpToHighlightRects(rects, "pixels");
  };

  return (
    <div
      className="hover:bg-accent flex cursor-pointer flex-col rounded-md px-3 py-2"
      onClick={onClick}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm text-wrap text-ellipsis">{result.text}</p>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="ml-auto">Page {result.pageNumber}</span>
      </div>
    </div>
  );
}

interface ResultGroupProps {
  title: string;
  results: SearchResult[];
  displayCount?: number;
}

function ResultGroup({ title, results, displayCount }: ResultGroupProps) {
  if (!results.length) return null;

  const displayResults = displayCount
    ? results.slice(0, displayCount)
    : results;

  // console.log(results);

  return (
    <div className="space-y-2">
      {displayResults.map((result) => (
        <ResultItem
          key={`${result.pageNumber}-${result.matchIndex}`}
          result={result}
        />
      ))}
    </div>
  );
}

export function SearchUI() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const [limit, setLimit] = useState(15);
  const { searchResults: results, search } = useSearch();

  useEffect(() => {
    setLimit(5);
    search(debouncedSearchText, { limit: 15 });
  }, [debouncedSearchText]);

  const handleLoadMore = async () => {
    const newLimit = limit + 15;
    await search(debouncedSearchText, { limit: newLimit });
    setLimit(newLimit);
  };

  // console.log(results);

  return (
    <div className="flex h-full w-[25ch] max-w-[25ch] flex-col text-wrap">
      <Input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search in document..."
        className="rounded-lg border px-4 py-2"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="py-2">
          <ResultGroup title={searchText} results={[...results.exactMatches]} />
          {results.hasMoreResults && (
            <div className="mt-4 flex justify-center">
              <Button onClick={handleLoadMore}>Load More</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
