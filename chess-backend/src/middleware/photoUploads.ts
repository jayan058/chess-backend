import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Use a UUID library to generate unique IDs

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    // Append UUID to the original filename to ensure uniqueness
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname);
    console.log(ext);
    
    const filename = `${path.basename(file.originalname, ext)}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

export let uploadPhotoMiddleware = upload.single('photo');
