"use client";

import { TrendingUp, Clock, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function RightPanel() {
  const getData = async () => {
    const res = await axios.get("http://localhost:3001/todos");
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["todos"]
,
    queryFn: getData,
  });

  if (isLoading) return <p>Loading...</p>;

  const completedTasks = data?.filter((dt) => dt.completed) ?? [];
  const completedCount = completedTasks.length;
  const activeCount = (data?.length ?? 0) - completedCount;

  return (
    <div>
      {/* Today's Focus */}
      <div className="rounded-xl p-6 my-4 shadow-lg bg-linear-to-br from-primary/10 to-primary/5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Today's Focus</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {activeCount} active task{activeCount !== 1 ? "s" : ""} to complete
        </p>
      </div>

      {/* Progress */}
      <div className="p-6 my-4 shadow-l rounded-xl    text-blue-400 bg-linear-to-br from-blue-500/10 to-blue-500/5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold ">Progress</h3>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium ">
                Completion Rate
              </span>
              <span className="text-sm font-bold ">
                {data.length > 0 ? Math.round((completedCount / data.length) * 100) : 0}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-2 bg-blue-700"
                style={{
                  width: data.length > 0 ? `${(completedCount / data.length) * 100}%` : "0%",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Completed */}
      {completedCount > 0 && (
        <div className="p-6 my-4 shadow-lg rounded-xl  bg-linear-to-br from-green-500/10 to-green-500/5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Recently Completed</h3>
          </div>

          <div className="space-y-2">
            {completedTasks.slice(-5).map((task) => (
              <p
                key={task.id}
                className="text-sm text-muted-foreground line-through truncate"
              >
                {task.title}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
