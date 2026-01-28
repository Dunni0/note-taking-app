"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import TaskEmpty from "../assets/TaskEmpty.jsx";
import { ClockIcon, TagIcon } from "@heroicons/react/24/outline";
import { NoteActions } from "./NoteActions.jsx";
import { ConfirmModal } from "@/modals/ConfirmModal.jsx";
import { createNote, updateNote } from "@/store/notes/index.js";

export const Body = forwardRef(
  (
    {
      activeView,
      notes,
      user,
      loading,
      setActiveView,
      searchQuery,
      onFormStateChange,
      refreshNotes,
    },
    ref
  ) => {
    const [title, setTitle] = useState("");
    const [tag, setTag] = useState("");
    const [note, setNote] = useState("");
    const [isClickCreateNote, setIsClickCreateNote] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [hasAutoSelected, setHasAutoSelected] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [error, setError] = useState("");

    const effectiveNotes = loading ? [] : notes;

    const isFormInvalid = title.trim() === "" || note.trim() === "";

    useEffect(() => {
      onFormStateChange?.(isClickCreateNote);
    }, [isClickCreateNote, onFormStateChange]);

    useEffect(() => {
      if (activeView === "allNotes" || activeView === "archivedNotes") {
        setShowEditor(false);
        setIsClickCreateNote(false);
        setSelectedNote(null);
      }
    }, [activeView]);

    useImperativeHandle(ref, () => ({
      openCreateNote: () => {
        if (activeView === "archivedNotes") {
          setActiveView("allNotes");
        }
        setIsClickCreateNote(true);
        setSelectedNote(null);
        setTitle("");
        setTag("");
        setNote("");
        setShowEditor(true);
      },
    }));

    const handleNoteClick = (noteItem) => {
      setSelectedNote(noteItem);
      setTitle(noteItem.title);
      // Convert array back to comma-separated string for editing
      setTag(Array.isArray(noteItem.tag) ? noteItem.tag.join(', ') : noteItem.tag || '');
      setNote(noteItem.note);
      setIsClickCreateNote(true);
      setShowEditor(true);
    };

    const saveNotes = async (e) => {
      e.preventDefault();
      setError("");

      const bodyData = {
        title,
        tag,
        note,
        userId: user?.user?.id,
        ...(selectedNote ? { id: selectedNote._id } : {}),
      };

      try {
        if (selectedNote) {
          await updateNote(bodyData);
        } else {
          await createNote(bodyData);
        }

        setSelectedNote(null);
        setTitle("");
        setTag("");
        setNote("");
        setShowEditor(false);
        
        // Refresh notes after successful save
        await refreshNotes();
      } catch (error) {
        console.error("Error saving note:", error);
        setError(selectedNote ? "Failed to update note. Please try again." : "Failed to create note. Please try again.");
      }
    };

    const selectedTag = activeView?.startsWith("tag:")
      ? activeView.split(":")[1]
      : null;

    let filteredNotes = [];

    if (activeView === "allNotes") {
      filteredNotes = effectiveNotes.filter((note) => !note.archived);
    } else if (activeView === "archivedNotes") {
      filteredNotes = effectiveNotes.filter((note) => note.archived);
    } else if (selectedTag) {
      filteredNotes = effectiveNotes.filter((note) => {
        // Handle both array and string formats
        let tags = [];
        if (Array.isArray(note.tag)) {
          tags = note.tag.filter(t => t && t.trim());
        } else if (typeof note.tag === 'string' && note.tag.trim()) {
          tags = note.tag.split(',').map(t => t.trim()).filter(t => t);
        }
        
        // Handle untagged filter
        if (selectedTag === 'untagged') {
          return tags.length === 0 && !note.archived;
        }
        
        return tags.includes(selectedTag) && !note.archived;
      });
    } else {
      filteredNotes = effectiveNotes;
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filteredNotes = filteredNotes.filter(
        (note) => {
          // Handle both array and string formats
          let tags = '';
          if (Array.isArray(note.tag)) {
            tags = note.tag.join(' ');
          } else if (typeof note.tag === 'string') {
            tags = note.tag;
          }
          return note.title.toLowerCase().includes(query) ||
            tags.toLowerCase().includes(query);
        }
      );
    }

    // Automatically open first archived note on XL screens
    useEffect(() => {
      if (loading) return;

      if (activeView === "allNotes") {
        setSelectedNote(null);
        setTitle("");
        setTag("");
        setNote("");
        setIsClickCreateNote(false);
        setHasAutoSelected(false);
        return;
      }

      if (activeView === "archivedNotes" && !hasAutoSelected) {
        const archivedNotes = notes.filter((note) => note.archived);
        if (archivedNotes.length > 0) {
          const firstArchivedNote = archivedNotes[0];
          setSelectedNote(firstArchivedNote);
          setTitle(firstArchivedNote.title || "");
          setTag(Array.isArray(firstArchivedNote.tag) ? firstArchivedNote.tag.join(', ') : firstArchivedNote.tag || "");
          setNote(firstArchivedNote.note || "");
          setIsClickCreateNote(true);
          setShowEditor(false);
        } else {
          setIsClickCreateNote(false);
          setSelectedNote(null);
          setTitle("");
          setTag("");
          setNote("");
        }
        setHasAutoSelected(true);
      }
    }, [activeView, hasAutoSelected, notes, loading]);

    return (
      <div className="xl:flex h-full bg-white dark:bg-gray-900">
        {/* Notes List Sidebar */}
        <div
          className={`w-full xl:w-72 border-0 xl:border-r border-gray-300 dark:border-gray-700 overflow-y-auto p-4 bg-white dark:bg-gray-900
          ${showEditor ? "hidden" : "block"} xl:block
        `}
        >
          {/* Show Create New Note button for allNotes AND tag views */}
          {activeView === "allNotes" && !searchQuery && (
            <button
              onClick={() => {
                setIsClickCreateNote(true);
                setSelectedNote(null);
                setTitle("");
                setTag("");
                setNote("");
                setShowEditor(true);
              }}
              disabled={loading}
              className={`hidden w-full md:block py-3 rounded-lg font-bold
                ${
                  loading
                    ? "bg-blue-500 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer "
                }`}
            >
              + Create New Note
            </button>
          )}

          {/* Archived Info */}
          {activeView === "archivedNotes" &&
            !loading &&
            (filteredNotes.length === 0 ? (
              <div className="bg-neutral-100 dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 p-2 rounded-lg flex flex-col items-center justify-center gap-2 mt-3">
                <TaskEmpty className="w-16 h-16" />
                <p className="text-neutral-500 dark:text-gray-400 text-[12px] font-normal text-center">
                  No notes have been archived yet. Move notes here for
                  safekeeping.
                </p>
              </div>
            ) : (
              <div className="text-neutral-600 dark:text-gray-300 text-[14px] font-bold text-center border-2 border-dashed border-neutral-300 dark:border-gray-600 p-3 rounded-sm mt-3 ">
                <p>
                  All your archived notes are stored here. You can restore or
                  delete them anytime.
                </p>
              </div>
            ))}

          {/* Notes List */}
          {loading ? (
            <div className="flex flex-col gap-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-2 flex flex-col gap-2 animate-pulse">
                  <div className="h-4 bg-neutral-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-neutral-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-3 bg-neutral-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-neutral-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <p className="text-center text-neutral-500 dark:text-gray-400 mt-8">
              {searchQuery ? `No notes found for "${searchQuery}"` : ""}
            </p>
          ) : (
            <div className="flex flex-col flex-wrap gap-3 mb-14 md:mb-0">
              {filteredNotes.map((note) => (
                <div
                  key={note._id}
                  onClick={() => handleNoteClick(note)}
                  className={`p-2 xl:w-[16rem] cursor-pointer mt-0 md:mt-2 flex flex-col gap-2 rounded-md transition-colors
                  ${
                    selectedNote?._id === note._id
                      ? "xl:bg-neutral-100 xl:dark:bg-gray-800 hover:bg-neutral-100 dark:hover:bg-gray-800"
                      : "hover:bg-neutral-100 dark:hover:bg-gray-800 active:bg-neutral-200 dark:active:bg-gray-700"
                  }`}
                >
                  <p className="text-[14px] font-[700] text-gray-900 dark:text-gray-100">{note.title}</p>
                  {(() => {
                    const tags = Array.isArray(note.tag) 
                      ? note.tag.filter(t => t && t.trim()) 
                      : (note.tag || '').split(',').map(t => t.trim()).filter(t => t);
                    return tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tags.map((t, idx) => (
                          <span key={idx} className="bg-neutral-200 dark:bg-gray-700 py-1 px-2 rounded-sm text-[12px] font-[500] text-gray-900 dark:text-gray-100">
                            {t}
                          </span>
                        ))}
                      </div>
                    );
                  })()}
                  <p className="text-[14px] text-gray-700 dark:text-gray-300">
                    {new Date(note.updatedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Note Editor */}
        <div
          className={`flex-1 p-4 border-gray-300 dark:border-gray-700 xl:border-0 bg-white dark:bg-gray-900 ${
            showEditor ? "block" : "hidden"
          } xl:block`}
        >
          {isClickCreateNote ? (
            <form
              onSubmit={saveNotes}
              className={` ${!selectedNote ? "pb-18 md:pb-0" : ""}`}
            >
              <div className="border-b-1 border-gray-300 dark:border-gray-700 pb-3">
                {/* Error message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded">
                    {error}
                  </div>
                )}
                
                {/* Back button for small screens */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNote(null);
                    setTitle("");
                    setTag("");
                    setNote("");
                    setIsClickCreateNote(false);
                    setShowEditor(false);
                    setError("");
                  }}
                  className="xl:hidden cursor-pointer text-blue-600 mb-4 flex items-center gap-1 font-medium"
                >
                  ← Back to Notes
                </button>

                <input
                  disabled={activeView === "archivedNotes"}
                  type="text"
                  placeholder="Enter a title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-[2rem] outline-0 border-b-1 border-transparent focus:border-gray-200 dark:focus:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100"
                />
                <div className="flex gap-[4rem] mt-4">
                  <div className="flex items-center gap-1">
                    <TagIcon className="w-5 h-5 stroke-2 dark:text-gray-300" />
                    <p className="text-neutral-700 dark:text-gray-300 text-sm font-[500]">Tags</p>
                  </div>
                  <input
                    disabled={activeView === "archivedNotes"}
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Add tags separated by commas"
                    className="font-[500] w-full text-[14px] outline-0 border-b-1 border-transparent focus:border-gray-200 dark:focus:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="flex gap-[1.5rem] mt-3">
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-5 h-5 stroke-2 dark:text-gray-300" />
                    <p className="text-neutral-700 dark:text-gray-300 text-sm font-[500]">
                      Last edited
                    </p>
                  </div>
                  <input
                    type="text"
                    disabled
                    size={46}
                    className="text-sm disabled:bg-transparent text-gray-700 dark:text-gray-300"
                    value={
                      selectedNote?.updatedAt
                        ? new Date(selectedNote.updatedAt).toLocaleString()
                        : "Not yet saved"
                    }
                  />
                </div>
              </div>

              <textarea
                disabled={activeView === "archivedNotes"}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Start typing your note here..."
                className={`${
                  activeView === "archivedNotes"
                    ? "border-1 border-gray-300 dark:border-gray-600 p-2"
                    : "focus:p-2 focus:border-1 focus:border-gray-300 dark:focus:border-gray-600"
                } w-full mt-3 mb-2 h-[22rem] resize-none focus:outline-none bg-transparent text-gray-900 dark:text-gray-100`}
              />

              <div className=" border-t-1 border-t-gray-200 dark:border-t-gray-700 pt-[1rem] flex gap-4">
                <div className="max-w-2xs flex gap-4">
                  {activeView === "allNotes" && (
                    <button
                      type="submit"
                      disabled={isFormInvalid}
                      className={`font-bold px-[14px] py-[12px] text-[14px] rounded-sm
                      ${
                        isFormInvalid
                          ? "bg-blue-500 cursor-not-allowed text-white"
                          : "bg-blue-700 hover:bg-blue-600 cursor-pointer text-white"
                      }`}
                    >
                      Save Note
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedNote(null);
                      setTitle("");
                      setTag("");
                      setNote("");
                      setIsClickCreateNote(false);
                      setShowEditor(false);
                      setError("");
                    }}
                    className={`${
                      activeView === "archivedNotes"
                        ? "bg-blue-700 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    } font-bold px-[14px] py-[12px] text-[14px] rounded-sm cursor-pointer`}
                  >
                    {activeView === "archivedNotes" ? "Close" : "Cancel"}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            !loading &&
            (filteredNotes.length === 0 ? (
              <p className="text-center text-[14px] text-gray-700 dark:text-gray-300 font-[600] hidden xl:block">
                You don't have any notes available in this tab. Start a new note
                to capture your thoughts and ideas.
              </p>
            ) : (
              <p className="text-center text-[14px] text-gray-700 dark:text-gray-300 font-[600] hidden md:block">
                Select a note to view or edit it.
              </p>
            ))
          )}
        </div>

        {/* Actions (Right sidebar) */}
        {selectedNote && (
          <aside
            className={`  ${
              showEditor ? "block" : "hidden"
            } xl:block xl:w-72 p-4 border-t border-l-0 xl:border-l-1 xl:border-t-0 border-gray-300 dark:border-gray-700 pb-20 md:pb-0 bg-white dark:bg-gray-900`}
          >
            <NoteActions
              activeView={activeView}
              selectedNote={selectedNote}
              refreshNotes={refreshNotes}
            />
          </aside>
        )}

        <ConfirmModal
          refreshNotes={refreshNotes}
          onActionComplete={() => {
            setSelectedNote(null);
            setTitle("");
            setTag("");
            setNote("");
            setIsClickCreateNote(false);
            setShowEditor(false);
          }}
        />
      </div>
    );
  }
);
