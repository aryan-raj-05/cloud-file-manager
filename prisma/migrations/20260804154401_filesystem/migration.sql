-- CreateEnum
CREATE TYPE "FileSystemNodeType" AS ENUM ('file', 'folder');

-- CreateTable
CREATE TABLE "FileSystemNode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FileSystemNodeType" NOT NULL,
    "ownerId" TEXT NOT NULL,
    "parentId" TEXT,
    "storageKey" TEXT,
    "size" INTEGER,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileSystemNode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FileSystemNode_parentId_idx" ON "FileSystemNode"("parentId");

-- CreateIndex
CREATE INDEX "FileSystemNode_ownerId_idx" ON "FileSystemNode"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "FileSystemNode_parentId_ownerId_name_key" ON "FileSystemNode"("parentId", "ownerId", "name");

-- AddForeignKey
ALTER TABLE "FileSystemNode" ADD CONSTRAINT "FileSystemNode_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileSystemNode" ADD CONSTRAINT "FileSystemNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FileSystemNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
