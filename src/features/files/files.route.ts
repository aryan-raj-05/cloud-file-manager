import { Router } from "express";

import { upload } from "../../lib/upload.js";
import { authUser } from "../../middlewares/auth-utils.js";
import { uploadFile } from "./files.controller.js";
import { asyncHandler } from "../../middlewares/async.js";

export const fileSystemRouter: Router = Router();

fileSystemRouter.post(
  "/",
  authUser,
  upload.single("file"),
  asyncHandler(uploadFile),
);
