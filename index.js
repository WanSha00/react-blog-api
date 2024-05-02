const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const categoryRoutes = require("./routes/categories");

dotenv.config();
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//db connection
connectDB();

//file upload and storage-----------

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog",
  },
});

function parsePublicId(cloudinaryUrl) {
  const parts = cloudinaryUrl.split("/");
  // Find the index of 'blog' which precedes the public ID
  const uploadIndex = parts.indexOf("blog");
  // The public ID is the next part after 'blog'
  if (uploadIndex !== -1 && uploadIndex < parts.length - 1) {
    return parts[uploadIndex + 1].split(".")[0];
  } else {
    return null;
  }
}

try {
  const upload = multer({ storage: storage });
  // Handle file upload
  app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
      const publicId = parsePublicId(req.file.path);
      res.json({ url: req.file.path, id: publicId });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  });
} catch (error) {
  console.log(error);
  res.status(500).json(error);
}

//----------------------

//routes
app.get("/", (req, res) => {
  res.send("api connected");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);

//listen to port
app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running...");
});

module.exports = app;
