import connectToDB from "../../../../lib/db";
import Notes from "../../../../models/Notes";
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from "mongoose";


// creates new items
export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, tag, note } = await request.json();
  console.log("SESSION:", session);

  await connectToDB();
  await Notes.create({
    title,
    tag,
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


    await connectToDB();

    // Ensure the note belongs to the logged-in user
    const updatedNote = await Notes.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { title, tag, note },
      { new: true } // return updated document
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
