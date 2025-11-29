// "use client"

// import { Body } from "@/components/Body";
// import { SideBar } from "@/components/SideBar";
// import { TopNav } from "@/components/TopNav";
// import { useEffect, useState } from "react";


// import { useSession } from "next-auth/react";

// export default function Home() {
// const {data, status} = useSession()

// console.log(data)

//   const [view, setView] = useState("allNotes"); 
//   const [notes, setNotes] = useState([]);

//   const getAllNotes = async () => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notes`, {
//         cache: "no-store",
//       });
//       if (!response.ok) throw new Error("Error fetching notes");
//       const data = await response.json();
//       setNotes(data?.getNotes || []);
//     } catch (error) {
//       console.log("Fetch error:", error);
//     }
//   };

//   useEffect(() => {
//     getAllNotes();
//   }, []);

//   return (
//     <div className="flex flex-row h-[100vh]">
//       <nav className="w-[15rem] text-[14px] p-4 border-r-1 border-gray-300">
//         <SideBar activeView={view} setActiveView={setView}  notes={notes}  />
//       </nav>
//       <main className="flex-1">
//         <TopNav notes={notes} />
//         <Body activeView={view} user={data} notes={notes} refreshNotes={getAllNotes}  />
//       </main>
//     </div>
//   );
// }


"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { Body } from "@/components/Body";
import { SideBar } from "@/components/SideBar";
import { TopNav } from "@/components/TopNav";

import {
  HomeIcon,
  ArchiveBoxIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { FaPlus } from "react-icons/fa";

export default function Home() {
  const bodyRef = useRef(null);
  const { data: sessionData } = useSession();

  const [view, setView] = useState("allNotes");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search query
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch notes
  const getAllNotes = async (query = "") => {
    const url = query
      ? `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/api/notes?search=${encodeURIComponent(query)}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notes`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch notes");
    const data = await res.json();
    return data?.getNotes || [];
  };

  const {
    data: notes = [],
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["notes", debouncedQuery],
    queryFn: () => getAllNotes(debouncedQuery),
    enabled: true,
    keepPreviousData: false,
  });

  const isLoading = isFetching || isSearching;

  return (
    <div className="flex h-screen overflow-x-hidden overflow-y-visible transition-colors duration-300">
      {/* Sidebar */}
      <nav className="hidden md:block w-[17rem] p-4 text-[14px] xl:border-r border-gray-300">
        <SideBar
          activeView={view}
          setActiveView={setView}
          notes={notes}
          refreshNotes={refetch}
        />
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col border-l border-gray-300 xl:border-0">
        <TopNav
          notes={notes}
          activeView={view}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isFormOpen={isFormOpen}
        />

        <div className="flex-1 overflow-y-scroll">
          <Body
            ref={bodyRef}
            activeView={view}
            setActiveView={setView}
            user={sessionData}
            notes={notes}
            loading={isLoading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFormStateChange={setIsFormOpen}
            refreshNotes={refetch}
          />

          {/* Mobile Bottom Bar */}
          <div className="md:hidden fixed bottom-0 left-0 w-full">
            {!isLoading && view === "allNotes" && !isFormOpen && (
              <button
                onClick={() => bodyRef.current?.openCreateNote()}
                className="fixed bottom-20 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50"
              >
                <FaPlus className="w-5 h-5" />
              </button>
            )}

            <div className="bg-gray-200 border-t border-gray-200 flex justify-between px-6 py-3 transition-colors duration-300">
              {/* Home */}
              <button
                onClick={() => setView("allNotes")}
                className={`flex flex-col items-center cursor-pointer transition-colors duration-300 ${
                  view === "allNotes"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <HomeIcon className="w-5 h-5" />
                <p className="text-xs">Home</p>
              </button>

              {/* Archived */}
              <button
                onClick={() => setView("archivedNotes")}
                className={`flex flex-col items-center cursor-pointer transition-colors duration-300 ${
                  view === "archivedNotes"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <ArchiveBoxIcon className="w-5 h-5" />
                <p className="text-xs">Archived</p>
              </button>

              {/* Logout */}
              <button className="flex flex-col items-center cursor-pointer text-gray-500 dark:text-gray-400 transition-colors duration-300">
                <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
                <p className="text-xs">Logout</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}