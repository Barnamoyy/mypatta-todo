type TaskProps = {
  taskName: string;
  taskDescription: string;
  taskDueDate: string;
  taskId: string;
  taskIsCompleted: boolean;
  userId: string;
};

export const AddTask = ({
  taskName,
  taskDescription,
  taskDueDate,
  taskId,
  userId,
}: TaskProps) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }
    if (!taskName || !taskDescription || !taskDueDate) {
      throw new Error("All fields are required");
    }

    const existingTasks = JSON.parse(
      localStorage.getItem(`${userId}:task`) || "[]"
    );
    const newTask = {
      taskName: taskName,
      taskDescription: taskDescription,
      taskDueDate: taskDueDate,
      taskId: taskId,
      taskIsCompleted: false,
    };
    const updatedTasks = [...existingTasks, newTask];
    localStorage.setItem(`${userId}:task`, JSON.stringify(updatedTasks));
    return newTask;
  } catch (error) {
    console.error("Error adding task:", error);
  }
};
