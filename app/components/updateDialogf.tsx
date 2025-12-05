import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import taskApi from "../_utils/taskApi";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
interface DialogDemoProps {
  title: string;
  description?: string;
  id: string;
}
export function DialogDemo({ id, title, description }: DialogDemoProps) {
  const [task, setTask] = useState({
    title,
    description: description || "",
    id ,
  });
  const { user } = useUser();
  const queryClient = useQueryClient();
  const updateTask = useMutation({
    mutationFn: (updatedTask: DialogDemoProps) =>
      taskApi.updateTask(updatedTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", user?.id] });

    },
  });
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    updateTask.mutate(task);
  };

  return (
    <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Update</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Your Task</DialogTitle>
            <DialogDescription>
              Make changes to your task here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
      <form onSubmit={handleAddTask}>
            <div className="grid gap-3">
              <label htmlFor="title-1">Title</label>
              <Input
                id="title-1"
                name="title"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
              />
            </div>
            <div className="grid gap-3">
              <label htmlFor="description-1">Description</label>
              <Input
                id="description-1"
                name="description"
                value={task.description}
                onChange={(e) =>
                  setTask({ ...task, description: e.target.value })
                }
              />
            </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
      </form>
        </DialogContent>
    </Dialog>
  );
}
