
// delete task by id 
export const DeleteTask = ({userId, taskId}:{userId:string, taskId:string}) => {
    try {
        const taskJson = localStorage.getItem(`${userId}:task`);
        if (!taskJson) {
            throw new Error("No tasks found");
        }

        const tasks = JSON.parse(taskJson);
        const updatedTasks = tasks.filter((task: { taskId: string }) => task.taskId !== taskId);

        localStorage.setItem(`${userId}:task`, JSON.stringify(updatedTasks));

        return true; 

    } catch (error) {
        console.error("Error deleting task:", error);
        return false;
    }
}

// delete all completed tasks 
export const deleteCompletedTasks = ({userId}:{userId: string}) => {
    try {
        const taskJson = localStorage.getItem(`${userId}:task`);
        if (!taskJson) {
            throw new Error("No tasks found");
        }

        const tasks = JSON.parse(taskJson);
        const updatedTasks = tasks.filter((task: {taskIsCompleted: boolean}) => task.taskIsCompleted !== true);
        localStorage.setItem(`${userId}:task`, JSON.stringify(updatedTasks));

        return true; 
    } catch (error) {
        console.error(error)
        return false
    }
}

