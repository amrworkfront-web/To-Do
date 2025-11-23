"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import taskApi from "../_utils/taskApi";

type Task = {
  title: string;
  userId: string;
  description?: string;
};

export default function AddTask() {
  const [task, setTask] = useState<Task>({
    title: "",
    description: "",
    userId: "",
  });

  const { user } = useUser(); // 👈 الحصول على الـ user من Clerk
  const queryClient = useQueryClient();

  const addTask = useMutation({
    mutationFn: (newTask: Task) => taskApi.createTask(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });

      setTask({
        title: "",
        description: "",
        userId: "",
      });
    },
  });

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task.title.trim()) return;

    addTask.mutate({
      ...task,
      userId: user?.id || "", // 👈 هنا بنضيف الـ userId تلقائيًا
    });
  };

  return (
    <form
      onSubmit={handleAddTask}
      className="bg-gray-100 dark:bg-gray-800 flex flex-col items-center gap-4 mt-4 rounded-2xl px-6 py-4 "
    >
      <input
        type="text"
        placeholder="task title..."
        className="bg-gray-200 dark:bg-gray-700 outline-none py-2 px-4 rounded-2xl  w-full focus:ring-2 focus:ring-blue-500"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
      />

      <input
        type="text"
        placeholder="task description..."
        className="bg-gray-200 dark:bg-gray-700 outline-none py-2 px-4 rounded-2xl w-full focus:ring-2 focus:ring-blue-500"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />

      <button
        type="submit"
        className="flex justify-center items-center w-80 max-w-[80%] gap-2 bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-2xl text-white font-bold transition-all duration-200"
      >
        <Plus className="w-5 h-5" /> Add
      </button>
    </form>
  );
}
