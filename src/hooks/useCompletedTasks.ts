// hooks/useCompletedTasks.ts
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { getTaskByCompletionStatus } from "@/controllers/getTask";

export type TaskProps = {
  taskName: string;
  taskDescription: string;
  taskDueDate: string;
  taskId: string;
  taskIsCompleted: boolean;
  taskPriority: string;
};

export const useCompletedTasks = () => {
  const { user } = useUser();
  const [completedTasks, setCompletedTasks] = useState<TaskProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      const completedTasks = await getTaskByCompletionStatus({
        userId: user.id,
        taskIsCompleted: true,
      });

      setCompletedTasks(completedTasks || []);
    } catch (err) {
      console.error("Failed to fetch completed tasks", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [user]);

  return { completedTasks, loading, refetch: fetchTasks };
};
