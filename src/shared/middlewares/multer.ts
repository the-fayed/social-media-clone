import multer from 'multer';
import { Request } from 'express';

import ApiError from "../utils/api.error";

const multerOpts = () => {
  const storage = multer.diskStorage({
    filename(req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const fileFilter = (req: Request, file: any, cb: any) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images allowed", 400), false);
    }
  };
  const upload = multer({fileFilter, storage});
  return upload;
}

export const uploadArrayOfImages = (filename: string) => multerOpts().array(filename);
export const uploadSingleImage = (filename: string) => multerOpts().single(filename);