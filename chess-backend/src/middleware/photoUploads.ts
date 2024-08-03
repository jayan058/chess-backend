import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid"; //For obatining unique photo names
import { Request, Response, NextFunction } from "express";

// Resolve the path relative to the project root
const uploadsPath = path.resolve(__dirname, "..", "uploads");
const defaultPhotoPath = path.resolve(
  __dirname,
  "..",
  "uploads",
  "defaultPhoto.png",
); // Path to the default photo

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    // Append UUID to the original filename to ensure uniqueness
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname);
    const filename = `${path.basename(file.originalname, ext)}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
});

export let uploadPhotoMiddleware = upload.single("photo");

// Middleware to handle default photo if the user uploads no photo
export const setDefaultPhotoMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) {
    req.file = {
      fieldname: "photo",
      originalname: "defaultPhoto.png",
      encoding: "7bit",
      mimetype: "image/jpeg",
      destination: path.dirname(defaultPhotoPath),
      filename: "defaultPhoto.png",
      path: defaultPhotoPath,
      size: 0,
    } as Express.Multer.File;
  }
  next();
};
