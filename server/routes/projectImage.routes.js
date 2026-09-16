const express = require("express");

const router = express.Router();
const maxImageBytes = 15 * 1024 * 1024;

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

    const response = await fetch(googleUrl, {
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Unable to fetch Google Drive image",
      });
    }

    const contentLength = Number(response.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > maxImageBytes) {
      return res.status(413).json({
        success: false,
        message: "Image is too large",
      });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";

    if (!contentType.startsWith("image/")) {
      return res.status(415).json({
        success: false,
        message: "Google Drive file is not an image",
      });
    }

    if (!response.body) {
      return res.status(502).json({
        success: false,
        message: "Google Drive returned an empty response",
      });
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");

    let bytes = 0;
    for await (const chunk of response.body) {
      bytes += chunk.length;
      if (bytes > maxImageBytes) {
        if (!res.headersSent) {
          return res.status(413).json({
            success: false,
            message: "Image is too large",
          });
        }
        res.destroy();
        return;
      }
      res.write(chunk);
    }

    return res.end();
  } catch (error) {
    if (res.headersSent) {
      res.destroy();
      return;
    }

    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return res.status(504).json({
        success: false,
        message: "Google Drive image request timed out",
      });
    }

    console.error("Google Drive image proxy error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load image",
    });
  }
});

module.exports = router;
