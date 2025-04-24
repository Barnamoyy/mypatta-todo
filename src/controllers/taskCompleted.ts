export const CompleteTask = ({
    userId,
    taskId,
    isCompleted,
  }: {
    userId: string;
    taskId: string;
    isCompleted: boolean;
  }) => {
    if (!userId || !taskId) {
      throw new Error("Missing userid or taskid");
    }
  
    try {
      const taskJson = localStorage.getItem(`${userId}:task`);
      if (!taskJson) {
        throw new Error("No tasks found");
      }
  
      const tasks = JSON.parse(taskJson);
      const updatedTasks = tasks.map(
        (task: { taskId: string; taskIsCompleted: boolean }) => {
          if (task.taskId === taskId) {
            return { ...task, taskIsCompleted: isCompleted };
          }
          return task;
        }
      );
  
      localStorage.setItem(`${userId}:task`, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error(error);
    }
  };
  