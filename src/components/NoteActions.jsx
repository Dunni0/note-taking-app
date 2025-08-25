"use client";

import {
  ArchiveBoxArrowDownIcon,
  ArchiveBoxXMarkIcon,
  ArrowPathIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import React from "react";

export const NoteActions = ({ activeView }) => {
  return (
    <div className="flex flex-col items-start gap-4 py-5">
      {activeView === "archivedNotes" ? (
        <button className="cursor-pointer flex items-center gap-2 border border-neutral-300  text-neutral-950 font-medium text-sm px-4 py-3 rounded-lg w-full  hover:bg-neutral-100 ">
          <ArrowPathIcon className="w-5 h-5 stroke-neutral-950 " />
          <p>Restore Note</p>
        </button>
      ) : (
        <button className="cursor-pointer flex items-center gap-2 border border-neutral-300  text-neutral-950 font-medium text-sm px-4 py-3 rounded-lg w-full  hover:bg-neutral-100">
          <ArchiveBoxArrowDownIcon className="w-5 h-5 stroke-neutral-950 " />
          <p>Archive Note</p>
        </button>
      )}
      <button className="cursor-pointer flex items-center gap-2 border border-neutral-300   text-neutral-950 font-medium text-sm px-4 py-3 rounded-lg w-full   hover:bg-neutral-100">
        <TrashIcon className="w-5 h-5 stroke-neutral-950  " />
        <p>Delete Note</p>
      </button>
      {activeView !== "archivedNotes" && (
        <button className="flex items-center gap-2 border border-neutral-300   text-neutral-950 font-medium text-sm px-4 py-3 rounded-lg w-full   hover:bg-neutral-100">
          <ArchiveBoxXMarkIcon className="w-5 h-5 stroke-neutral-950  " />
          <p>Delete All Notes</p>
        </button>
      )}
    </div>
  );
};
