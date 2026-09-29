import z from "zod";

export const createFolderSchema = z.object({
  folderName: z.string(),
  parentFolder: z.string().optional(),
});

export type CreateFolderBody = z.infer<typeof createFolderSchema>;
