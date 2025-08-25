"use client"

import { Body } from "@/components/Body";
import { SideBar } from "@/components/SideBar";
import { TopNav } from "@/components/TopNav";
import { useEffect, useState } from "react";


import { useSession } from "next-auth/react";

export default function Home() {
const {data, status} = useSession()

console.log(data)

  const [view, setView] = useState("allNotes"); 
  const [notes, setNotes] = useState([]);

  const getAllNotes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notes`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Error fetching notes");
      const data = await response.json();
      setNotes(data?.getNotes || []);
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  useEffect(() => {
    getAllNotes();
  }, []);

  return (
    <div className="flex flex-row h-[100vh]">
      <nav className="w-[15rem] text-[14px] p-4 border-r-1 border-gray-300">
        <SideBar activeView={view} setActiveView={setView}  notes={notes}  />
      </nav>
      <main className="flex-1">
        <TopNav notes={notes} />
        <Body activeView={view} user={data} notes={notes} refreshNotes={getAllNotes}  />
      </main>
    </div>
  );
}
