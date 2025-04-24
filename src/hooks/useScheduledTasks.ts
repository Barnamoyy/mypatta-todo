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

export const useScheduledTasks = () => {
  const { user } = useUser();

  //   states
  const [scheduledTasks, setScheduledTasks] = useState<TaskProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split("T")[0];
      const allTasks = await getAllTasks({ userId: user.id });

      const futureTasks = allTasks.filter(
        (task: TaskProps) => task.taskDueDate > today
      );

      setScheduledTasks(futureTasks);
    } catch (err) {
      console.error("Failed to fetch completed tasks", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [user]);

  return { scheduledTasks, loading, refetch: fetchTasks };
};
