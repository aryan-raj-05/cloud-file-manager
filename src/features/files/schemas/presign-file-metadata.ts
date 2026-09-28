import z from "zod";

// TODO
// make types stricter
export const fileMetadata = z.object({
  extension: z.string(),
  name: z.string(),
  size: z.number(),
  mimeType: z.string(),
});

export type FileMetadata = z.infer<typeof fileMetadata>;
