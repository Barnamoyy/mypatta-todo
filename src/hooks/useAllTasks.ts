// hooks/useCompletedTasks.ts
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { getAllTasks } from "@/controllers/getTask";

export type TaskProps = {
  taskName: string;
  taskDescription: string;
  taskDueDate: string;
  taskId: string;
  taskIsCompleted: boolean;
  taskPriority: string;
};

export const useAllTasks = () => {
  const { user } = useUser();

  //   states
  const [allTasks, setAllTasks] = useState<TaskProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      const allTasks = await getAllTasks({
        userId: user.id,
      });

      setAllTasks(allTasks || []);
    } catch (err) {
      console.error("Failed to fetch completed tasks", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [user]);

  return { allTasks, loading, refetch: fetchTasks };
};
