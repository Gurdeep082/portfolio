const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 600 },
    stack: { type: String, trim: true, maxlength: 160, default: "" },
    demoLink: { type: String, trim: true, maxlength: 500, default: "" },
    githubLink: { type: String, trim: true, maxlength: 500, default: "" },
    link: { type: String, trim: true, maxlength: 500, default: "" },
    images: { type: [String], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
