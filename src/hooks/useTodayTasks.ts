// hooks/useCompletedTasks.ts
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { getTaskByDueDate } from "@/controllers/getTask";

export type TaskProps = {
  taskName: string;
  taskDescription: string;
  taskDueDate: string;
  taskId: string;
  taskIsCompleted: boolean;
  taskPriority: string;
};

export const useTodayTasks = () => {
  const { user } = useUser();

  //   states
  const [todayTasks, setTodayTasks] = useState<TaskProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      const today = new Date().toLocaleDateString("en-CA");;
      const todayTasks = await getTaskByDueDate({
        userId: user.id,
        taskDueDate: today,
      });

      setTodayTasks(todayTasks || []);
    } catch (err) {
      console.error("Failed to fetch completed tasks", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [user]);

  return { todayTasks, loading, refetch: fetchTasks };
};
