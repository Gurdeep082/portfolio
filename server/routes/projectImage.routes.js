const express = require("express");

const router = express.Router();

router.get("/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!/^[a-zA-Z0-9_-]+$/.test(fileId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google Drive file ID",
      });
    }

    const googleUrl =
      "https://drive.usercontent.google.com/download" +
      `?export=download&confirm=t&id=${encodeURIComponent(fileId)}`;

    const response = await fetch(googleUrl);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Unable to fetch Google Drive image",
      });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";

    if (!contentType.startsWith("image/")) {
      return res.status(415).json({
        success: false,
        message: "Google Drive file is not an image",
      });
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");

    const buffer = Buffer.from(await response.arrayBuffer());
    return res.send(buffer);
  } catch (error) {
    console.error("Google Drive image proxy error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load image",
    });
  }
});

module.exports = router;
