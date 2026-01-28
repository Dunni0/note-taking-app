import connectToDB from "../../../../lib/db";
import Notes from "../../../../models/Notes";
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";


// creates new items
export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, tag, note } = await request.json();
  console.log("SESSION:", session);
  console.log("Received tag:", tag, "Type:", typeof tag);

  // Parse comma-separated tags into array
  const tagsArray = typeof tag === 'string' 
    ? tag.split(',').map(t => t.trim()).filter(t => t !== '')
    : Array.isArray(tag) ? tag : [];

  console.log("Parsed tags array:", tagsArray);

  await connectToDB();
  await Notes.create({
    title,
    tag: tagsArray,
    note,
    userId: new mongoose.Types.ObjectId(session.user.id), // comes from auth
  });

  return NextResponse.json(
    { msg: "notes created successfully" },
    { status: 201 }
  );
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();

  const getNotes = await Notes.find({ userId: session.user.id });

  return NextResponse.json({ getNotes });
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {id, title, tag, note } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
    }

    console.log("Update - Received tag:", tag, "Type:", typeof tag);

    // Parse comma-separated tags into array
    const tagsArray = typeof tag === 'string' 
      ? tag.split(',').map(t => t.trim()).filter(t => t !== '')
      : Array.isArray(tag) ? tag : [];

    console.log("Update - Parsed tags array:", tagsArray);

    await connectToDB();

    // Ensure the note belongs to the logged-in user
    const updatedNote = await Notes.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { title, tag: tagsArray, note },
      { new: true, runValidators: false } // return updated document
    );

    if (!updatedNote) {
      return NextResponse.json({ error: "Note not found or not authorized" }, { status: 404 });
    }

    return NextResponse.json(
      { msg: "Note updated successfully", note: updatedNote },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}


export async function PATCH(request) {
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, archived } = await request.json();
    if (!id) return NextResponse.json({ error: "Note ID is required" }, { status: 400 });

    await connectToDB();

    // Convert both _id and userId to ObjectId
    const noteId = new mongoose.Types.ObjectId(id);
    const userId = new mongoose.Types.ObjectId(session.user.id);

    // Better boolean conversion
    let archivedBoolean;
    if (typeof archived === 'boolean') {
      archivedBoolean = archived;
    } else if (typeof archived === 'string') {
      archivedBoolean = archived.toLowerCase() === 'true';
    } else {
      archivedBoolean = Boolean(archived);
    }

    console.log("Updating note:", { 
      _id: noteId, 
      userId, 
      archived: archivedBoolean,
      originalArchived: archived,
      typeOfArchived: typeof archived
    });

    const updatedNote = await Notes.findOneAndUpdate(
      { _id: noteId, userId },
      { $set: { archived: archivedBoolean } },
      { new: true }
    );

    if (!updatedNote)
      return NextResponse.json({ error: "Note not found or not authorized" }, { status: 404 });

    return NextResponse.json({
      msg: archivedBoolean ? "Note archived successfully" : "Note restored successfully",
      note: updatedNote,
    }, { status: 200 });

  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: error.message || "Failed to update note" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
    }

    await connectToDB();

    const deleted = await Notes.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!deleted) {
      return NextResponse.json({ error: "Note not found or not authorized" }, { status: 404 });
    }

    return NextResponse.json(
      { msg: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
