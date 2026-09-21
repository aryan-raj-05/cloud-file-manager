import path from "node:path";
import crypto from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import type { RequestHandler } from "express";

import { s3 } from "../../lib/s3.js";
import { prisma } from "../../lib/prisma.js";
import { config } from "../../lib/config.js";
import { FileSystemNodeType } from "../../generated/prisma/enums.js";

// This may need changes, storing files in memory may cause crash
// For now a memory limit is set in the upload engine defined in
// file router
export const handleFileUpload: RequestHandler = async (req, res) => {
  const file = req.file!;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileId = crypto.randomUUID();
  const extension = path.extname(file.originalname);

  const storageKey = `users/${req.user!.id}/files/${fileId}${extension}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: config.AWS_BUCKET_NAME,
      Key: storageKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        uploadedBy: req.user!.id,
      },
    }),
  );

  const node = await prisma.fileSystemNode.create({
    data: {
      id: fileId,
      name: file.originalname,
      type: FileSystemNodeType.file,
      ownerId: req.user!.id,
      storageKey,
      size: file.size,
      mimeType: file.mimetype,
    },
  });

  res.status(200).json(node);
};
