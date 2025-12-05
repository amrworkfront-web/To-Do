"use client";
import Task from "./task";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import taskApi from "../_utils/taskApi";
import { Todo } from "../type";
import { useUser } from "@clerk/nextjs";
export default function TasksList() {
  const queryClient = useQueryClient();
const { user, isLoaded } = useUser();


  const getData = async () => {
    if (!user?.id) return [];
    const res = await taskApi.getTasks(user.id);
    return res.data.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["todos", user?.id],
    queryFn: getData,
      enabled: !!user?.id,
  });

  const delteTask = useMutation({
    mutationFn: (id: string) => {
      return taskApi.deleteTask(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", user?.id]
 });
    },
  });

  const updateTask = useMutation({
    mutationFn:  ({ id, status }: { id: string; status: boolean }) => {
return taskApi.taskStatus(id,status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", user?.id]
 });
    },
  });

  if (!isLoaded || isLoading) {
    return <h1>loading...</h1>;
  }

  return (
    <div >
      {data?.map((task: Todo) => (
          <Task
            key={task.id}
            {...task}
            onDelete={() => delteTask.mutate(task.documentId!)}
onUpdate={() => updateTask.mutate({ id: task.documentId!, status: !task.completed })}
          />
        ))}
    </div>
  );
}
