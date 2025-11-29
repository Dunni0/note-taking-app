// // import { MoonIcon } from "@heroicons/react/24/outline";
// // import { SunIcon } from "@heroicons/react/24/outline";
// // import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
// // import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// // export const TopNav = ({notes}) => {
// //   return (
// //     <div className="flex items-center justify-between px-8 py-4 border-b border-b-neutral-200 w-full">
// //       <h1 className="text-2xl font-extrabold"> All Notes ({notes.length}) </h1>

// //       <div className="flex items-center gap-3">
// //         <div className="flex relative items-center ">
// //           <MagnifyingGlassIcon className="w-5 h-5 stroke-neutral-500 absolute ml-3" />
// //           <input
// //             type="search"
// //             name="search"
// //             id="search"
// //             className="py-3 px-9 border text-neutral-950  placeholder-neutral-500 border-neutral-200 rounded-lg decoration-neutral-300 text-sm focus:outline-none"
// //             placeholder="Search by title, content, or tags..."
// //             size={28}
// //           />
// //         </div>
// //         <div className="flex items-center gap-3">
// //           <button
// //             className="py-3 px-3 hover:bg-neutral-200 border border-neutral-200 cursor-pointer rounded-lg"
// //           >
// //               <MoonIcon className="w-5 h-5 stroke-neutral-500" />
// //           </button>
// //           <button
// //             className="py-3 px-3 hover:bg-neutral-200 border border-neutral-200 rounded-lg cursor-pointer"
// //           >
// //             <ArrowLeftEndOnRectangleIcon className="w-5 h-5 stroke-neutral-500" />
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// "use client";

// import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { useEffect, useState } from "react";

// export const TopNav = ({
//   notes,
//   activeView,
//   searchQuery,
//   onSearchChange,
//   isFormOpen,
// }) => {
//   const [allNotesCount, setAllNotesCount] = useState([]);
//   const [archivedNotesCount, setArchivedNotesCount] = useState([]);

//   useEffect(() => {
//     // Filter notes based on active view for counts
//     const allNotes = notes?.filter((note) => !note.archived) || [];
//     const archivedNotes = notes?.filter((note) => note.archived) || [];
    
//     setAllNotesCount(allNotes);
//     setArchivedNotesCount(archivedNotes);
//   }, [notes]);

//   // Get the tag name if we're in a tag view
//   const getTagName = () => {
//     if (activeView.startsWith("tag:")) {
//       return activeView.split(":")[1];
//     }
//     return "";
//   };

//   // Get filtered notes count for the current tag view
//   const getTagNotesCount = () => {
//     if (activeView.startsWith("tag:")) {
//       const tagName = getTagName();
//       return notes?.filter((note) => note.tag === tagName && !note.archived) || [];
//     }
//     return [];
//   };

//   const tagNotesCount = getTagNotesCount();

//   return (
//     <div className="border-b border-gray-300 p-4">
//       <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
//         {/* Title Section */}
//         <div className="flex items-center gap-4 mb-4 xl:mb-0">
//           <h1 className="text-2xl font-extrabold hidden md:block mb-0 md:mb-2 xl:mb-0">
//             {searchQuery.trim() ? (
//               <>
//                 Search Results for:{" "}
//                 <span className="text-blue-600">{searchQuery}</span>
//               </>
//             ) : activeView.startsWith("tag:") ? (
//               <>Tag: {getTagName()} ({tagNotesCount.length})</>
//             ) : activeView === "archivedNotes" ? (
//               <>Archived Notes ({archivedNotesCount.length})</>
//             ) : (
//               <>All Notes ({allNotesCount.length})</>
//             )}
//           </h1>
//         </div>

//         {/* Search Bar */}
//         <div className="relative w-full xl:w-80">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
//           </div>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => onSearchChange(e.target.value)}
//             className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
//             placeholder="Search notes..."
//           />
//         </div>
//       </div>

//       {/* Mobile Title - shows when not searching and not in form */}
//       {!searchQuery.trim() && !isFormOpen && (
//         <h1 className="text-xl font-bold mt-2 md:hidden">
//           {activeView.startsWith("tag:") ? (
//             <>Tag: {getTagName()}</>
//           ) : activeView === "archivedNotes" ? (
//             <>Archived</>
//           ) : (
//             <>All Notes</>
//           )}
//         </h1>
//       )}

//       {/* Mobile Search Results Info */}
//       {searchQuery.trim() && (
//         <p className="text-sm text-gray-600 mt-2 md:hidden">
//           Found {notes?.filter(note => 
//             note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             note.tag.toLowerCase().includes(searchQuery.toLowerCase())
//           ).length || 0} results for "{searchQuery}"
//         </p>
//       )}
//     </div>
//   );
// };
import Logo from "@/assets/images/logo";
import {
  MoonIcon,
  ArrowLeftEndOnRectangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export const TopNav = ({
  notes,
  activeView,
  searchQuery,
  onSearchChange,
  isFormOpen,
}) => {
  const allNotesCount = notes.filter((note) => !note.archived);
  const archivedNotesCount = notes.filter((note) => note.archived);

  return (
    <>
      {/* ===== Mobile Header ===== */}
      <div className="flex items-center md:hidden bg-gray-200 px-4 py-5">
        <Logo />
      </div>

      <div className="flex md:flex-col xl:flex-row xl:items-center justify-between px-0 md:px-4 pt-4 md:py-4 border-b-0 md:border-b border-b-neutral-200 w-full">
        
        {/* ===== Title Section ===== */}
        <h1 className="text-2xl font-extrabold hidden md:block mb-0 md:mb-2 xl:mb-0">
          {searchQuery.trim() ? (
            <>
              Search Results for:{" "}
              <span className="text-blue-600">{searchQuery}</span>
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
              <MagnifyingGlassIcon className="w-5 h-5 stroke-neutral-500 absolute left-3 top-3" />
              <input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                type="search"
                className="w-full py-3 px-9 border text-neutral-950 placeholder-neutral-500 border-neutral-200 rounded-lg text-sm focus:outline-none"
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
            <div className="flex relative items-center w-full md:w-auto">
              <MagnifyingGlassIcon className="w-5 h-5 stroke-neutral-500 absolute ml-3" />
              <input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                type="search"
                className="w-full md:w-auto py-3 px-9 border text-neutral-950 placeholder-neutral-500 border-neutral-200 rounded-lg text-sm focus:outline-none"
                placeholder="Search by title or tags..."
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="py-3 px-3 hover:bg-neutral-200 border border-neutral-200 rounded-lg cursor-pointer">
                <ArrowLeftEndOnRectangleIcon className="w-5 h-5 stroke-neutral-500" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* ===============  SEARCH BAR + ACTION BUTTONS (XL+) ================ */}
        {/* =================================================================== */}
        <div className="hidden xl:flex items-center gap-3 px-4 md:px-0 w-full md:w-auto">
          <div className="flex relative items-center">
            <MagnifyingGlassIcon className="w-5 h-5 stroke-neutral-500 absolute ml-3" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              type="search"
              className="w-full md:w-auto py-3 px-9 border text-neutral-950 placeholder-neutral-500 border-neutral-200 rounded-lg text-sm focus:outline-none"
              placeholder="Search by title or tags..."
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="py-3 px-3 hover:bg-neutral-200 border border-neutral-200 rounded-lg cursor-pointer">
              <ArrowLeftEndOnRectangleIcon className="w-5 h-5 stroke-neutral-500" />
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* ===============  SMALL SCREENS – CREATE FORM TITLE ================ */}
        {/* =================================================================== */}
        {isFormOpen && activeView === "allNotes" && (
          <div className="flex md:hidden items-center w-full px-4">
            <p className="text-2xl font-bold">Create New Note</p>
          </div>
        )}

      </div>
    </>
  );
};