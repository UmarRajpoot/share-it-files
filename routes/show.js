import { Router } from "express";
import File from "../models/file.js";

const router = Router();

router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({
      uuid: req.params.uuid,
    });

    if (!file) {
      return res.render("download", { error: "Link has been Expired" });
    }
    return res.render("download", {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
    });
  } catch (error) {
    return res.render("download", { error: "Something Went Wrong" });
  }
});

export default router;
