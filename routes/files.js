import { Router } from "express";
import path from "path";
import multer from "multer";
import File from "../models/file.js";
import { v4 as uuidv4 } from "uuid";
import NodeMail from "../Services/EmailService.js";
import EmailTemplate from "../Services/EmailTemplate.js";

const router = Router();

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage,
  limits: { fileSize: 1000000 * 100 },
}).single("myfile");

router.post("/", (req, res) => {
  // Store FIle
  upload(req, res, async (err) => {
    // Validate Request
    if (!req.file) {
      return res.json({ error: "All Fields are required." });
    }
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    // Store into Database
    const file = new File({
      filename: req.file.filename,
      uuid: uuidv4(),
      path: req.file.path,
      size: req.file.size,
    });
    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
});
// Send an Email
router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "All fields are required." });
  }
  // Get Data from Database
  const file = await File.findOne({ uuid: uuid });
  if (file.sender) {
    return res.status(422).send({ error: "Email already send." });
  }
  File.sender = emailFrom;
  File.receiver = emailTo;
  // console.log(file);
  const responce = await file.save();

  // Email Send
  NodeMail({
    from: emailFrom,
    to: emailTo,
    subject: "File Sharing",
    text: `${emailFrom} Sheared a File with you.`,
    html: EmailTemplate({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size / 1000) + "KB",
      expires: "24 hours",
    }),
  });
  return res.send({ Success: true });
});

export default router;
