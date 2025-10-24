-- CreateTable
CREATE TABLE "Notes" (
    "id" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "content" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Paper_name_author_idx" ON "Paper"("name", "author");

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE CASCADE;
