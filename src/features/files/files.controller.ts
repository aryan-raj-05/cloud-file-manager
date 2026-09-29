import z from "zod";
import path from "node:path";
import crypto from "node:crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { s3 } from "../../lib/s3.js";
import { prisma } from "../../lib/prisma.js";
import { config } from "../../lib/config.js";
import {
  FileSystemNodeType,
  FileUploadStatus,
} from "../../generated/prisma/enums.js";

import type { RequestHandler } from "express";
import type { FileMetadata } from "./schemas/presign-file-metadata.js";

// TODO
// 1. Validate file types and size on backend

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

  const rootFolder = await prisma.fileSystemNode.findFirst({
    where: {
      ownerId: req.user!.id,
      parentId: { equals: null },
    },
  });

  const node = await prisma.fileSystemNode.create({
    data: {
      id: fileId,
      name: file.originalname,
      type: FileSystemNodeType.file,
      uploadStatus: FileUploadStatus.completed,
      ownerId: req.user!.id,
      parentId: rootFolder!.id,
      storageKey,
      size: file.size,
      mimeType: file.mimetype,
    },
  });

  res.status(200).json(node);
};

export const getAllFiles: RequestHandler = async (req, res) => {
  const user = req.user!.id;

  const files = await prisma.fileSystemNode.findMany({
    where: { ownerId: user },
  });

  return res.status(200).json(files);
};

export const createPresignedS3Url: RequestHandler<
  {},
  any,
  FileMetadata
> = async (req, res) => {
  const { extension, name, size, mimeType } = req.body;
  const fileId = crypto.randomUUID();
  const storageKey = `users/${req.user!.id}/files/${fileId}${extension}`;

  const rootFolder = await prisma.fileSystemNode.findFirst({
    where: {
      ownerId: req.user!.id,
      parentId: { equals: null },
    },
  });

  await prisma.fileSystemNode.create({
    data: {
      id: fileId,
      name,
      type: FileSystemNodeType.file,
      uploadStatus: FileUploadStatus.uploading,
      ownerId: req.user!.id,
      parentId: rootFolder!.id,
      storageKey,
      size,
      mimeType,
    },
  });

  const command = new PutObjectCommand({
    Bucket: config.AWS_BUCKET_NAME,
    Key: storageKey,
    ContentType: mimeType,
  });

  const url = await getSignedUrl(s3 as any, command, {
    expiresIn: 60 * 5, // 5 minutes
  });

  return res.status(201).json({ uploadUrl: url, storageKey });
};

const idSchema = z.object({
  id: z.uuid(),
});

export const markFileUploadComplete: RequestHandler = async (req, res) => {
  const result = idSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: z.treeifyError(result.error) });
  }

  const { id } = result.data;

  const file = await prisma.fileSystemNode.findFirst({
    where: {
      id,
      ownerId: req.user!.id,
    },
  });

  if (!file) {
    return res.status(404).json({
      error: "File not found",
    });
  }

  const metadata = await s3.send(
    new HeadObjectCommand({
      Bucket: config.AWS_BUCKET_NAME,
      Key: file.storageKey,
    }),
  );

  await prisma.fileSystemNode.update({
    where: { id, ownerId: req.user!.id },
    data: {
      uploadStatus: FileUploadStatus.completed,
      size: metadata.ContentLength ?? file.size,
    },
  });

  return res.sendStatus(200);
};
