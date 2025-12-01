import StatsCard from "./components/stats-card";
import AddTask from "./components/add-tsk";
import RightPanel from "./components/right-panel";
import TasksList from "./components/tasks-list";

export default function Home() {
  return (
    <div className="flex">

      <div className="w-full  ">
        <div className="p-6">
          <div className="grid grid-cols-8 gap-6">
            <div className="col-span-6 space-y-4">
              <StatsCard></StatsCard>
              <AddTask></AddTask>
              <TasksList></TasksList>
            </div>
            <div className="hidden md:block md:col-span-2">
              <RightPanel></RightPanel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
