import type { RequestHandler } from "express";

import { prisma } from "../../lib/prisma.js";
import { FileSystemNodeType } from "../../generated/prisma/enums.js";

export const uploadFile: RequestHandler = async (req, res) => {
  const file = req.file as Express.MulterS3.File | undefined;

  if (!file) {
    return res.sendStatus(400);
  }

  const result = await prisma.fileSystemNode.create({
    data: {
      name: file.originalname,
      type: FileSystemNodeType.file,
      ownerId: req.user!.id,
    },
  });

  res.status(200).json({ result });
};
