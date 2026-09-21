import { Router } from "express";
import multer from "multer";

import { authUser } from "../../middlewares/auth-utils.js";
import { asyncHandler } from "../../middlewares/async.js";
import { handleFileUpload } from "./files.controller.js";

export const fileSystemRouter: Router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

fileSystemRouter.post(
  "/",
  authUser,
  upload.single("file"),
  asyncHandler(handleFileUpload),
);
