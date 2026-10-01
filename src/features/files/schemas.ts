import z from "zod";

export const createFolderSchema = z.object({
  folderName: z.string(),
  parentFolder: z.string().optional(),
});

export const updateFileNode = z.object({
  newParentFolderId: z.uuid().optional(),
});

// TODO
// make types stricter
export const fileMetadata = z.object({
  extension: z.string(),
  name: z.string(),
  size: z.number(),
  mimeType: z.string(),
});

export const fileIdentifierSchema = z.object({
  fileId: z.uuid(),
});

export type CreateFolderBody = z.infer<typeof createFolderSchema>;
export type UpdateFileNode = z.infer<typeof updateFileNode>;
export type FileMetadata = z.infer<typeof fileMetadata>;
export type FileIdentifier = z.infer<typeof fileIdentifierSchema>;
