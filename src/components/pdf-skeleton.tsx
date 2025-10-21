export function PDFSkeleton() {
  return (
    <div
      className="flex h-screen flex-col"
      style={{ backgroundColor: "#fafafa" }}
    >
      {/* Header */}
      <div
        className="border-b p-4 shadow-sm"
        style={{ borderColor: "#e5e7eb", backgroundColor: "#ffffff" }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="animate-shimmer h-8 w-8 rounded-lg"
              style={{ backgroundColor: "#e5e7eb" }}
            />
            <div
              className="animate-shimmer h-6 w-48 rounded-lg"
              style={{ backgroundColor: "#e5e7eb" }}
            />
          </div>
          <div className="flex gap-2">
            <div
              className="animate-shimmer h-8 w-8 rounded-lg"
              style={{ backgroundColor: "#f0f0f0" }}
            />
            <div
              className="animate-shimmer h-8 w-8 rounded-lg"
              style={{ backgroundColor: "#f0f0f0" }}
            />
            <div
              className="animate-shimmer h-8 w-8 rounded-lg"
              style={{ backgroundColor: "#f0f0f0" }}
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div
        className="flex items-center gap-2 border-b p-3 shadow-sm"
        style={{ borderColor: "#e5e7eb", backgroundColor: "#ffffff" }}
      >
        <div
          className="animate-shimmer h-8 w-8 rounded-lg"
          style={{ backgroundColor: "#e5e7eb" }}
        />
        <div
          className="animate-shimmer h-8 w-12 rounded-lg"
          style={{ backgroundColor: "#f0f0f0" }}
        />
        <div
          className="animate-shimmer h-8 w-8 rounded-lg"
          style={{ backgroundColor: "#e5e7eb" }}
        />
        <div className="flex-1" />
        <div
          className="animate-shimmer h-8 w-20 rounded-lg"
          style={{ backgroundColor: "#e5e7eb" }}
        />
      </div>

      {/* Content area */}
      <div
        className="flex-1 overflow-y-auto p-6"
        style={{ backgroundColor: "#fafafa" }}
      >
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Page 1 */}
          <div
            className="space-y-4 rounded-xl border p-8 shadow-lg"
            style={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <div className="space-y-3">
              <div
                className="animate-shimmer h-5 w-full rounded-lg"
                style={{ backgroundColor: "#e5e7eb" }}
              />
              <div
                className="animate-shimmer h-4 w-5/6 rounded-lg"
                style={{ backgroundColor: "#f0f0f0" }}
              />
              <div
                className="animate-shimmer h-4 w-4/5 rounded-lg"
                style={{ backgroundColor: "#f0f0f0" }}
              />
            </div>
            <div
              className="animate-shimmer h-40 w-full rounded-lg"
              style={{ backgroundColor: "#e5e7eb" }}
            />
            <div className="space-y-3">
              <div
                className="animate-shimmer h-4 w-full rounded-lg"
                style={{ backgroundColor: "#f0f0f0" }}
              />
              <div
                className="animate-shimmer h-4 w-full rounded-lg"
                style={{ backgroundColor: "#f0f0f0" }}
              />
              <div
                className="animate-shimmer h-4 w-3/4 rounded-lg"
                style={{ backgroundColor: "#f0f0f0" }}
              />
            </div>
          </div>

          {/* Page 2 */}
          <div
            className="space-y-4 rounded-xl border p-8 shadow-lg"
            style={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <div
              className="animate-shimmer h-6 w-1/2 rounded-lg"
              style={{ backgroundColor: "#e5e7eb" }}
            />
            <div className="space-y-3">
              <div
                className="animate-shimmer h-4 w-full rounded-lg"
                style={{ backgroundColor: "#f0f0f0" }}
              />
              <div
                className="animate-shimmer h-4 w-full rounded-lg"
                style={{ backgroundColor: "#f0f0f0" }}
              />
              <div
                className="animate-shimmer h-4 w-5/6 rounded-lg"
                style={{ backgroundColor: "#f0f0f0" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="animate-shimmer h-28 rounded-lg"
                style={{ backgroundColor: "#e5e7eb" }}
              />
              <div
                className="animate-shimmer h-28 rounded-lg"
                style={{ backgroundColor: "#e5e7eb" }}
              />
            </div>
          </div>

          {/* Page 3 */}
          <div
            className="space-y-4 rounded-xl border p-8 shadow-lg"
            style={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb" }}
          >
            <div className="space-y-3">
              <div
                className="animate-shimmer h-5 w-full rounded-lg"
                style={{ backgroundColor: "#e5e7eb" }}
              />
              <div
                className="animate-shimmer h-4 w-full rounded-lg"
                style={{ backgroundColor: "#f0f0f0" }}
              />
              <div
                className="animate-shimmer h-4 w-2/3 rounded-lg"
                style={{ backgroundColor: "#f0f0f0" }}
              />
            </div>
            <div
              className="animate-shimmer h-44 w-full rounded-lg"
              style={{ backgroundColor: "#e5e7eb" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
