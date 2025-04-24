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

export const useIncompleteTasks = () => {
  const { user } = useUser();
  const [incompleteTasks, setIncompleteTasks] = useState<TaskProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      const incompleteTasks = await getTaskByCompletionStatus({
        userId: user.id,
        taskIsCompleted: false,
      });

      setIncompleteTasks(incompleteTasks || []);
    } catch (err) {
      console.error("Failed to fetch active tasks", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [user]);

  return { incompleteTasks, loading, refetch: fetchTasks };
};
