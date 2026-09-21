import path from "node:path";
import multer from "multer";
import crypto from "node:crypto";
import multerS3 from "multer-s3";

import { s3 } from "./s3.js";
import { config } from "./config.js";

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: config.AWS_BUCKET_NAME,

    metadata: (req, file, cb) => {
      cb(null, { uploadedBy: req.user!.id });
    },

    key: (req, file, cb) => {
      const filename = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
      cb(null, filename);
    },
  }),
});
