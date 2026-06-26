// import multer from "multer"

// let storage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,"./public")
//     },
//     filename:(req,file,cb)=>{
//         cb(null,file.originalname)
//     }

// })

// const upload = multer({storage})

// export default upload;

// import multer from "multer";

// const storage = multer.memoryStorage(); // ⚡ FAST (no disk write)

// const upload = multer({ storage });

// export default upload;

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // ✅ correct path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

export default multer({ storage });