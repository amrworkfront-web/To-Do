"use client";

import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import taskApi from "../_utils/taskApi";

export default function StatsCard() {
  const getData = async () => {
  const res = await taskApi.getTasks();
    return res.data.data;  };

  const { data, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: getData,
  });

  if (isLoading) return <p>Loading...</p>;

  const completedCount = data?.filter((dt) => dt.completed).length ?? 0;
  const activeCount = (data?.length ?? 0) - completedCount;

  const stats = [
    {
      label: "Total Tasks",
      icon: BarChart3,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      accentColor: "bg-blue-100 dark:bg-blue-900/30",
      value: data?.length ?? 0,
    },
    {
      label: "Completed",
      icon: CheckCircle2,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      accentColor: "bg-green-100 dark:bg-green-900/30",
      value: completedCount,
    },
    {
      label: "Active Tasks",
      icon: Zap,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      accentColor: "bg-purple-100 dark:bg-purple-900/30",
      value: activeCount,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mt-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            className="col-span-2 min-w-264px hover:cursor-pointer"
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <div className={`${stat.color} p-8 rounded-xl text-2xl text-gray-700`}>
              <div className="flex justify-between">
                <p>{stat.label}</p>
                <div className={`${stat.accentColor} p-2 rounded-xl`}>
                  <Icon />
                </div>
              </div>
              <p className="text-3xl text-white font-bold">{stat.value}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
