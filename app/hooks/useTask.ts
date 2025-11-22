"use client";
import { useUser } from "@clerk/nextjs";
export default function UseTasksApi() {
  const { user } = useUser();
return user?.id;
   ;
}