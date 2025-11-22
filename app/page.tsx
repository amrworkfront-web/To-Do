import Navbar from "./components/navbar";
import StatsCard from "./components/stats-card";
import AddTask from "./components/add-tsk";
import RightPanel from "./components/right-panel";
import TasksList from "./components/tasks-list";
import Sidebar from "./components/sidebar";


export default   function Home() {



  return (
    
<div className="flex">
  <div>
            <Sidebar />

  </div>
      <div className="w-full  ">
      <Navbar></Navbar>
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
 
