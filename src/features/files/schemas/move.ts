import z from "zod";

export const updateFileNode = z.object({
  newParentFolderId: z.uuid().optional(),
});

export type UpdateFileNode = z.infer<typeof updateFileNode>;
