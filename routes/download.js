import { Router } from "express";
import File from "../models/file.js";
import Path from "path";
import { fileURLToPath } from "url";
const router = Router();

router.get("/:uuid", async (req, res) => {
  const file = await File.findOne({
    uuid: req.params.uuid,
  });
  if (!file) {
    return res.render("download", { error: "Link has been Expired" });
  }
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = Path.dirname(__filename);
  const filePath = `${__dirname}/../${file.path}`;

  res.download(filePath);
});

export default router;
