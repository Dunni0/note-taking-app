import Logo from "@/assets/images/logo";
import { openConfirmModal } from "@/store/modals/ConfirmModalSlice";
import { toggleTheme } from "@/store/theme/themeSlice";
import {
  ArrowLeftEndOnRectangleIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";

export const TopNav = ({
  notes,
  activeView,
  searchQuery,
  onSearchChange,
  isFormOpen,
}) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  const allNotesCount = notes.filter((note) => !note.archived);
  const archivedNotesCount = notes.filter((note) => note.archived);
  const selectedTag = activeView?.startsWith("tag:")
    ? activeView.split(":")[1]
    : null;

  return (
    <>
      {/* ===== Mobile Header ===== */}
      <div className="flex items-center md:hidden bg-gray-200 dark:bg-gray-800 px-4 py-5">
        <Logo />
      </div>

      <div className="flex md:flex-col xl:flex-row xl:items-center justify-between px-0 md:px-4 pt-4 md:py-4 border-b-0 md:border-b border-b-neutral-200 dark:border-b-gray-700 w-full bg-white dark:bg-gray-900">
        {/* ===== Title Section ===== */}
        <h1 className="text-2xl font-extrabold hidden md:block mb-0 md:mb-2 xl:mb-0 text-gray-900 dark:text-gray-100">
          {searchQuery.trim() ? (
            <>
              Search Results for:{" "}
              <span className="text-blue-600 dark:text-blue-400">{searchQuery}</span>
            </>
          ) : selectedTag ? (
            <>
              Tag:
              <span className="text-blue-600 dark:text-blue-400"> {selectedTag}</span>
            </>
          ) : activeView !== "archivedNotes" ? (
            <>All Notes ({allNotesCount.length})</>
          ) : (
            <>Archived Notes ({archivedNotesCount.length})</>
          )}
        </h1>

        {/* =================================================================== */}
        {/* ===============  SEARCH BAR – SMALL SCREENS  ====================== */}
        {/* =================================================================== */}
        {!isFormOpen && (
          <div className="flex md:hidden px-4 w-full mt-2 mb-3">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="w-5 h-5 stroke-neutral-500 dark:stroke-gray-400 absolute left-3 top-3" />
              <input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                type="search"
                className="w-full py-3 px-9 border text-neutral-950 dark:text-gray-100 placeholder-neutral-500 dark:placeholder-gray-400 border-neutral-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-sm focus:outline-none"
                placeholder="Search by title or tags..."
              />
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* ===============  SEARCH BAR + ACTION BUTTONS (MD to LG) =========== */}
        {/* =================================================================== */}
        {!isFormOpen && (
          <div className="hidden md:flex xl:hidden flex-col md:flex-row md:justify-between md:items-center gap-3 px-4 md:px-0 w-full md:w-auto">
            {/* Shared Search Input */}
            <div className="flex relative items-center w-full">
              <MagnifyingGlassIcon className="w-5 h-5 stroke-neutral-500 dark:stroke-gray-400 absolute ml-3" />
              <input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                type="search"
                className="w-full py-3 px-9 border text-neutral-950 dark:text-gray-100 placeholder-neutral-500 dark:placeholder-gray-400 border-neutral-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-sm focus:outline-none"
                placeholder="Search by title or tags..."
              />
            </div>

            <div className="flex items-center gap-3">
              {/* <button
                onClick={() => dispatch(toggleTheme())}
                className="py-3 px-3 hover:bg-neutral-200 dark:hover:bg-gray-700 border border-neutral-200 dark:border-gray-600 rounded-lg cursor-pointer"
              >
                {theme === "light" ? (
                  <MoonIcon className="w-5 h-5 stroke-neutral-500 dark:stroke-gray-400" />
                ) : (
                  <SunIcon className="w-5 h-5 stroke-neutral-500 dark:stroke-gray-400" />
                )}
              </button> */}
              <button
                onClick={() =>
                  dispatch(openConfirmModal({ type: "logout", noteId: null }))
                }
                className="py-3 px-3 hover:bg-neutral-200 dark:hover:bg-gray-700 border border-neutral-200 dark:border-gray-600 rounded-lg cursor-pointer"
              >
                <ArrowLeftEndOnRectangleIcon className="w-5 h-5 stroke-neutral-500 dark:stroke-gray-400" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* ===============  SEARCH BAR + ACTION BUTTONS (XL+) ================ */}
        {/* =================================================================== */}
        <div className="hidden xl:flex items-center gap-3 px-4 md:px-0 w-full md:w-auto">
          <div className="flex relative items-center">
            <MagnifyingGlassIcon className="w-5 h-5 stroke-neutral-500 dark:stroke-gray-400 absolute ml-3" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              type="search"
              className="w-full md:w-auto py-3 px-9 border text-neutral-950 dark:text-gray-100 placeholder-neutral-500 dark:placeholder-gray-400 border-neutral-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-sm focus:outline-none"
              placeholder="Search by title or tags..."
            />
          </div>

          <div className="flex items-center gap-3">
            {/* <button
              onClick={() => dispatch(toggleTheme())}
              className="py-3 px-3 hover:bg-neutral-200 dark:hover:bg-gray-700 border border-neutral-200 dark:border-gray-600 rounded-lg cursor-pointer"
            >
              {theme === "light" ? (
                <MoonIcon className="w-5 h-5 stroke-neutral-500 dark:stroke-gray-400" />
              ) : (
                <SunIcon className="w-5 h-5 stroke-neutral-500 dark:stroke-gray-400" />
              )}
            </button> */}
            <button
              onClick={() =>
                dispatch(openConfirmModal({ type: "logout", noteId: null }))
              }
              className="py-3 px-3 hover:bg-neutral-200 dark:hover:bg-gray-700 border border-neutral-200 dark:border-gray-600 rounded-lg cursor-pointer"
            >
              <ArrowLeftEndOnRectangleIcon className="w-5 h-5 stroke-neutral-500 dark:stroke-gray-400" />
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* ===============  SMALL SCREENS – CREATE FORM TITLE ================ */}
        {/* =================================================================== */}
        {isFormOpen && activeView === "allNotes" && (
          <div className="flex md:hidden items-center w-full px-4 border-b border-b-gray-100 dark:border-b-gray-700 pb-3">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create New Note</p>
          </div>
        )}
      </div>
    </>
  );
};
