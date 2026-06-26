import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["pdf", "image", "note"],
    required: true
  },

  fileUrl: {
    type: String // for pdf/image
  },

  content: {
    type: String // for notes
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

export default mongoose.model("Material", materialSchema);