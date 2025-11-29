import mongoose, { Schema } from "mongoose";

const notesSchema = new mongoose.Schema({
    title: {type: String, required: true},
    tag: {type: String, required: true},
    note: {type: String, required: true},
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 👈 link to user
    archived: { type: Boolean, default: false },
}, { timestamps: true });


const Notes = mongoose.models.Notes || mongoose.model("Notes", notesSchema)

export default Notes