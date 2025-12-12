"use client";

import Logo from "@/assets/images/logo";
import {
  HomeIcon,
  ArchiveBoxArrowDownIcon,
  ChevronRightIcon,
  TagIcon,
} from "@heroicons/react/24/outline";


export const SideBar = ({ activeView, setActiveView, notes }) => {

  const handleClick = (buttonName) => {
    setActiveView(buttonName);
  };

  console.log("Notes in SideBar:", notes);

 const tags = notes?.reduce((acc, note) => {
  // ignore archived notes
  if (note.archived) return acc;

  // ignore notes without tags
  if (!note.tag) return acc;

  // add tag only if not already added
  if (!acc.includes(note.tag)) {
    acc.push(note.tag);
  }

  return acc;
}, []) || [];


  return (
    <div>
      <div>
        <Logo className="mb-5" />
        <div className="flex flex-col gap-4 pb-4 border-b-1 border-gray-300">
          <button
            className={`cursor-pointer flex justify-between items-center ${
              activeView === "allNotes" ? "bg-neutral-100 rounded-lg" : ""
            }`}
            onClick={() => handleClick("allNotes")}
          >
            <div className="flex gap-3 p-2">
              <HomeIcon
                className={`w-4 stroke-2 ${
                  activeView === "allNotes"
                    ? "stroke-blue-600"
                    : "stroke-neutral-700"
                }`}
              />
              <p>All Notes</p>
            </div>
            {activeView === "allNotes" && (
              <ChevronRightIcon className="w-4 mr-3 stroke-neutral-700 stroke-3" />
            )}
          </button>

          <button
            className={`cursor-pointer flex justify-between items-center ${
              activeView === "archivedNotes" ? "bg-neutral-100 rounded-lg" : ""
            }`}
            onClick={() => handleClick("archivedNotes")}
          >
            <div className="flex gap-3 p-2">
              <ArchiveBoxArrowDownIcon
                className={`w-4 stroke-2 ${
                  activeView === "archivedNotes"
                    ? "stroke-blue-600"
                    : "stroke-neutral-700"
                }`}
              />
              <p>Archived Notes</p>
            </div>
            {activeView === "archivedNotes" && (
              <ChevronRightIcon className="w-4 mr-3 stroke-neutral-700 stroke-3" />
            )}
          </button>
        </div>

        <div className="mt-4">
          <h1 className="text-sm font-medium text-neutral-500"> Tags </h1>
          {tags.length === 0 ? (
            <p className="text-xs text-neutral-400 mt-2">No tags yet.</p>
          ) : (
            tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleClick(`tag:${tag}`)}
                className={`flex items-center w-full py-2 px-3 gap-2 rounded-lg cursor-pointer hover:bg-neutral-100 ${
                  activeView === `tag:${tag}`
                    ? "bg-neutral-100 text-neutral-950"
                    : "text-neutral-700"
                }`}
              >
                <TagIcon
                  className={`w-5 h-5 ${
                    activeView === `tag:${tag}`
                      ? "stroke-blue-600"
                      : "stroke-neutral-700"
                  }`}
                />
                <p>{tag}</p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
