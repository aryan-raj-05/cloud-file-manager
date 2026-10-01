import multer from "multer";
import { Router } from "express";

import { authUser } from "../../middlewares/auth-utils.js";
import { asyncHandler } from "../../middlewares/async.js";
import { validateBody, validateParams } from "../../middlewares/validate.js";
import {
  fileMetadata,
  updateFileNode,
  createFolderSchema,
  fileIdentifierSchema,
} from "./schemas.js";
import {
  createFolder,
  createPresignedS3Url,
  getAllFiles,
  handleFileUpload,
  markFileUploadComplete,
  moveFileOrFolder,
} from "./files.controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

export const fileSystemRouter: Router = Router();

fileSystemRouter.get("/", authUser, asyncHandler(getAllFiles));

fileSystemRouter.post(
  "/",
  authUser,
  upload.single("file"),
  asyncHandler(handleFileUpload),
);

fileSystemRouter.post(
  "/upload-url",
  authUser,
  validateBody(fileMetadata),
  asyncHandler(createPresignedS3Url),
);

fileSystemRouter.post(
  "/:fileId/complete",
  authUser,
  validateParams(fileIdentifierSchema),
  validateBody(fileMetadata),
  asyncHandler(markFileUploadComplete),
);

fileSystemRouter.post(
  "/folder",
  authUser,
  validateBody(createFolderSchema),
  asyncHandler(createFolder),
);

fileSystemRouter.patch(
  "/:fileId",
  authUser,
  validateParams(fileIdentifierSchema),
  validateBody(updateFileNode),
  asyncHandler(moveFileOrFolder),
);
