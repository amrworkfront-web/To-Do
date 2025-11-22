"use client";

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { Search, Bell, Sun ,Moon} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import taskApi from "../_utils/taskApi";
import { Todo } from "../type";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
const {theme, setTheme} = useTheme();
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", debouncedSearch],
    queryFn: () =>
      taskApi.searchTasks(debouncedSearch).then((res) => res.data.data),
    enabled: debouncedSearch.length > 0,
  });

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between w-full bg-[var(--background-second)/60] backdrop-blur-3xl p-4">
      <div className="relative w-80">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-4 pr-10 py-2 rounded-lg bg-gray-700 text-white outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500 w-full"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 cursor-pointer" />

        {debouncedSearch && (
          <div className="absolute mt-1 w-full bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-auto z-50">
            {isLoading ? (
              <p className="p-2 text-gray-400">Loading...</p>
            ) : data?.length ? (
              data.map((task: Todo) => (
                <div
                  key={task.documentId}
                  className="p-2 hover:bg-gray-700 cursor-pointer"
                >
                  {task.title}
                </div>
              ))
            ) : (
              <p className="p-2 text-gray-400">No results found</p>
            )}
          </div>
        )}
      </div>

      <div className="info flex items-center gap-6">
        <Bell />
        <div onClick={()=>{setTheme(theme==='light'?'dark':'light')}}>
    
    {theme==='dark'?<Sun />:<Moon/> }  

        </div>
        <UserButton />
      </div>
    </div>
  );
}
