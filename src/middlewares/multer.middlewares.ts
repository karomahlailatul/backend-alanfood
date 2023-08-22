import { Request } from "express";
import multer, {
  FileFilterCallback,
  Multer, 
  diskStorage,
} from "multer";
import createError from "http-errors";

const fileStorage = diskStorage({
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname.replace(/ /g, "-"));
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const fileSize = parseInt(req.headers["content-length"] || "0", 10);
  try {
    if (fileSize > 2 * 1024 * 1024) {
      throw new Error("File Picture more than 2MB");
    }
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      throw new Error("File Picture format must be PNG, JPG, or JPEG");
    }
    cb(null, true);
  } catch (error) {
    cb(createError(400, error.message));
  }
};

const upload: Multer = multer({
  storage: fileStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB (max file size)
  },
  fileFilter: fileFilter,
});

export default upload;
