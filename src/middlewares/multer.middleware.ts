import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    const originalname = file.originalname.split(".").shift();
    cb(null, originalname + "-" + uniqueSuffix + "." + fileExtension);
  },
});

export const upload = multer({ storage: storage });
