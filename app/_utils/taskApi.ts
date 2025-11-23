import axiosClient from "./axiosClient";

const getTasks = (userId: string) => {
  return axiosClient.get(`/tasks?filters[userId][$eq]=${userId}`);
};
const createTask = (task: { title: string; description?: string }) => {
  return axiosClient.post("/tasks", { data: task });
};
const deleteTask = (id: string,) => {
  return axiosClient.delete(`/tasks/${id}`);
};
const taskStatus = (id: string,status:boolean) => {
  return axiosClient.put(`/tasks/${id}`,{ data: {completed: status} });
};
const updateTask = (id:string,task:  { title: string; description?: string }) => {
  return axiosClient.put(`/tasks/${id}`,{ data: task });
};
const searchTasks = (query: string) => {
  return axiosClient.get(`/tasks?filters[title][$contains]=${query}`);
};

export default {
  getTasks,
  createTask,
  deleteTask,
  taskStatus,
  updateTask,
  searchTasks
};
