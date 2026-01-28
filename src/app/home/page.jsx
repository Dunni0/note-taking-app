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
import { useDispatch, useSelector } from "react-redux";
import { openConfirmModal } from "@/store/modals/ConfirmModalSlice";
import { getAllNotes } from "@/store/notes";

export default function Home() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  const bodyRef = useRef(null);
  const { data: sessionData } = useSession();

  const [view, setView] = useState("allNotes");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Apply dark mode class to html element
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('dark', 'light');
    if (theme === "dark") {
      html.classList.add("dark");
    }
  }, [theme]);

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
    <div className="flex h-screen overflow-x-hidden overflow-y-visible transition-colors duration-300 bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <nav className="hidden md:block w-[17rem] p-4 text-[14px] xl:border-r border-gray-300 dark:border-gray-700">
        <SideBar
          activeView={view}
          setActiveView={setView}
          notes={notes}
          refreshNotes={refetch}
        />
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col border-l border-gray-300 dark:border-gray-700 xl:border-0">
        <TopNav
          notes={notes}
          activeView={view}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isFormOpen={isFormOpen}
        />

        <div className="flex-1 overflow-y-scroll bg-white dark:bg-gray-900">
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

            <div className="bg-gray-200 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between px-6 py-3 transition-colors duration-300">
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
                <p className="text-xs text-gray-900 dark:text-gray-100">Home</p>
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
                <p className="text-xs text-gray-900 dark:text-gray-100">Archived</p>
              </button>

              {/* Logout */}
              <button
                onClick={() =>
                  dispatch(openConfirmModal({ type: "logout", noteId: null }))
                }
                className="flex flex-col items-center cursor-pointer text-gray-500 dark:text-gray-400 transition-colors duration-300"
              >
                <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
                <p className="text-xs text-gray-900 dark:text-gray-100">Logout</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
