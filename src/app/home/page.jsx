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
import { useDispatch } from "react-redux";
import { openConfirmModal } from "@/store/modals/ConfirmModalSlice";
import { getAllNotes } from "@/store/notes";

export default function Home() {
  const dispatch = useDispatch();

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

  const {
    data: notes = [],
    isFetching,
    refetch,
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
              <button
                onClick={() =>
                  dispatch(openConfirmModal({ type: "logout", noteId: null }))
                }
                className="flex flex-col items-center cursor-pointer text-gray-500 dark:text-gray-400 transition-colors duration-300"
              >
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
