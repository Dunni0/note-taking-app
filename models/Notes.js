import mongoose, { Schema } from "mongoose";

const notesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tag: {
      type: [String],
      default: [],
    },
    note: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Delete the model if it exists to force schema update
if (mongoose.models.Notes) {
  delete mongoose.models.Notes;
}

const Notes = mongoose.model("Notes", notesSchema);

export default Notes;
