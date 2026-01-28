"use client";

import { openConfirmModal } from "@/store/modals/ConfirmModalSlice";
import {
  ArchiveBoxArrowDownIcon,
  ArrowPathIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { useDispatch } from "react-redux";

export const NoteActions = ({ activeView, selectedNote, refreshNotes }) => {
  const dispatch = useDispatch();

  const handleAction = (type) => {
    if (!selectedNote?._id) return;
    dispatch(openConfirmModal({ type, noteId: selectedNote._id }));
  }
  return (
    <div className="flex flex-col items-start gap-4 py-5">
      {activeView === "archivedNotes" ? (
        <button 
        onClick={() => handleAction('restore')}
        className="cursor-pointer flex items-center gap-2 border border-neutral-300 dark:border-gray-600 text-neutral-950 dark:text-gray-100 font-medium text-sm px-4 py-3 rounded-lg w-full hover:bg-neutral-100 dark:hover:bg-gray-800">
          <ArrowPathIcon className="w-5 h-5 stroke-neutral-950 dark:stroke-gray-100" />
          <p>Restore Note</p>
        </button>
      ) : (
        <button 
        onClick={() => handleAction('archive')}
        className="cursor-pointer flex items-center gap-2 border border-neutral-300 dark:border-gray-600 text-neutral-950 dark:text-gray-100 font-medium text-sm px-4 py-3 rounded-lg w-full hover:bg-neutral-100 dark:hover:bg-gray-800">
          <ArchiveBoxArrowDownIcon className="w-5 h-5 stroke-neutral-950 dark:stroke-gray-100" />
          <p>Archive Note</p>
        </button>
      )}
      <button 
      onClick={() => handleAction('delete')}
      className="cursor-pointer flex items-center gap-2 border border-neutral-300 dark:border-gray-600 text-neutral-950 dark:text-gray-100 font-medium text-sm px-4 py-3 rounded-lg w-full hover:bg-neutral-100 dark:hover:bg-gray-800">
        <TrashIcon className="w-5 h-5 stroke-neutral-950 dark:stroke-gray-100" />
        <p>Delete Note</p>
      </button>
    </div>
  );
};
