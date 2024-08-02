import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid"; // Use a UUID library to generate unique IDs

// Resolve the path relative to the project root
const uploadsPath = path.resolve(__dirname, "..", "uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    // Append UUID to the original filename to ensure uniqueness
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname);
    const filename = `${path.basename(
      file.originalname,
      ext,
    )}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
});

export let uploadPhotoMiddleware = upload.single("photo");
