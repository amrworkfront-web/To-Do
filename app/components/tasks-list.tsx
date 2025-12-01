"use client";
import Task from "./task";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import taskApi from "../_utils/taskApi";
import { Todo } from "../type";
import { useUser } from "@clerk/nextjs";
export default function TasksList() {
  const queryClient = useQueryClient();
const {user}=useUser();


  const getData = async () => {
    const res = await taskApi.getTasks(user?.id || "");
    return res.data.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["todos"]
,
    queryFn: getData,
      enabled: !!user?.id,
  });

  const delteTask = useMutation({
    mutationFn: (id: string) => {
      return taskApi.deleteTask(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"]
 });
    },
  });

  const updateTask = useMutation({
    mutationFn:  ({ id, status }: { id: string; status: boolean }) => {
return taskApi.taskStatus(id,status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"]
 });
    },
  });
  return (
    <div >
      {isLoading ? (
        <h1>loding...</h1>
      ) : (
        data?.map((task: Todo) => (
          <Task
            key={task.id}
            {...task}
            onDelete={() => delteTask.mutate(task.documentId!)}
onUpdate={() => updateTask.mutate({ id: task.documentId!, status: !task.completed })}
          />
        ))
      )}
    </div>
  );
}
