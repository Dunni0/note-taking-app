"use client";
import { useState, useEffect } from "react";
import TaskEmpty from "../assets/TaskEmpty.jsx";
import { ClockIcon, TagIcon } from "@heroicons/react/24/outline";
import { NoteActions } from "./NoteActions.jsx";

export const Body = ({ activeView, notes, refreshNotes, user }) => {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [note, setNote] = useState("");
  const [isClickCreateNote, setIsClickCreateNote] = useState(false);

  const [selectedNote, setSelectedNote] = useState(null);

  const handleNoteClick = (noteItem) => {
    setSelectedNote(noteItem);
    setTitle(noteItem.title);
    setTag(noteItem.tag);
    setNote(noteItem.note);
    setIsClickCreateNote(true);
  };

  const saveNotes = async (e) => {
    e.preventDefault();

    const method = selectedNote ? "PUT" : "POST";
    const bodyData = selectedNote
      ? { id: selectedNote._id, title, tag, note, userId: user?.user?.id } // PUT
      : { title, tag, note, userId: user?.user?.id };
    console.log(bodyData, "body data", selectedNote);
    try {
      const res = await fetch(`http://localhost:3000/api/notes`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
      if (res.ok) {
        console.log("You have successfully added a note!");
        setSelectedNote(null);
        setTitle("");
        setTag("");
        setNote("");
        await refreshNotes();
        // setIsClickCreateNote(false);
      } else {
        throw new Error("Error occurred while creating new item");
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const selectedTag = activeView?.startsWith("tag:")
    ? activeView.split(":")[1]
    : null;

  const filteredNotes = selectedTag
    ? notes.filter((note) => note.tag === selectedTag)
    : notes;

  return (
    <div className="flex h-[89vh]">
      <div className="w-72 p-4 border-r-1 border-gray-300 h-h-[89vh] overflow-y-scroll">
        <button
          onClick={() => {
            setIsClickCreateNote(true);
            setSelectedNote(null);  
            setTitle("");           
            setTag("");              
            setNote("");             
          }}
          className="hover:bg-blue-700 text-white w-full py-3 rounded-lg font-bold cursor-pointer bg-blue-600"
        >
          + Create New Note
        </button>
        {activeView === "archivedNotes" && (
          <div className="bg-neutral-100 border border-neutral-200 p-2 rounded-lg flex flex-col items-center justify-center gap-2 mt-3">
            <TaskEmpty className="w-16 h-16" />
            <p className="text-neutral-500 text-[12px] font-normal text-center">
              No notes have been archived yet. Move notes here for safekeeping,
              or create a new note.
            </p>
          </div>
        )}
        {filteredNotes.map((note) => (
          <div
            key={note._id}
            onClick={() => handleNoteClick(note)}
            className="p-2 hover:bg-neutral-100 cursor-pointer mt-2 flex flex-col gap-3"
          >
            <p className="text-[14px] font-[700]">{note.title}</p>
            <p className="bg-neutral-200 w-fit py-1 px-1 rounded-sm text-[12px] font-[500]">
              {note.tag}
            </p>
            <p className="text-[14px]">30 June 2025</p>
          </div>
        ))}
      </div>

      <main className="flex-1 p-4">
        {isClickCreateNote ? (
          <form onSubmit={saveNotes}>
            <div className="border-b-1 border-gray-300 pb-6">
              <input
                type="text"
                placeholder="Enter a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-[2rem] outline-0 border-b-1 border-transparent focus:border-gray-200"
              />
              <div className="flex gap-[4rem] mt-8">
                <div className="flex items-center gap-1">
                  <TagIcon className="w-5 h-5 stroke-2" />
                  <p className="text-neutral-700 text-sm font-[500]"> Tags </p>
                </div>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Add tags separated by commas (e.g. Work, Planning)"
                  className="font-[500] w-full text-[14px] outline-0 border-b-1 border-transparent focus:border-gray-200"
                />
              </div>
              <div className="flex gap-[1.5rem] mt-3">
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-5 h-5 stroke-2" />
                  <p className="text-neutral-700 text-sm font-[500]">
                    Last edited
                  </p>
                </div>
                <input
                  type="text"
                  disabled
                  size={46}
                  className="text-sm placeholder:text-sm disabled:bg-transparent"
                  placeholder="Not yet saved"
                />
              </div>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Start typing your note here..."
              className="w-full mt-3 mb-3 h-[22rem] resize-none focus:p-2 focus:border-1 focus:border-gray-300 focus:outline-none"
            />
            <div className="border-t-1 border-t-gray-300 pt-[1.5rem] flex gap-4">
              <button
                type="submit"
                className="bg-blue-700 text-white px-[14px] py-[12px] text-[14px] font-[500] rounded-sm hover:bg-blue-600"
              >
                Save Note
              </button>
              <button
                type="button"
                onClick={() => setIsClickCreateNote(false)}
                className="bg-gray-100 px-[14px] py-[12px] font-[500] text-[14px] rounded-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : notes.length === 0 ? (
          <p className="text-center text-[14px] font-[500]">
            You don’t have any notes available in this tab. Start a new note to
            capture your thoughts and ideas.
          </p>
        ) : (
          <p className="text-center text-[14px] font-[500]">
            Select a note to view or edit it.
          </p>
        )}
      </main>

      <aside className="w-72 p-4 border-l-1 border-gray-300">
       {selectedNote &&
         <NoteActions activeView={activeView}/>
       }
      </aside>
    </div>
  );
};
