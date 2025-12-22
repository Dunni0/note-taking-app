import mongoose, { Schema } from "mongoose";

const notesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tag: {
      type: String,
      default: '',
      trim: true,
    },
    note: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 👈 link to user
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

console.log("NOTES SCHEMA TAG REQUIRED:", notesSchema.path("tag").isRequired);

const Notes = mongoose.models.Notes || mongoose.model("Notes", notesSchema);

export default Notes;
