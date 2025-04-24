type GetTaskProps = {
    userId: string;
    taskId: string;
    taskName: string;
    taskDescription: string;
    taskDueDate: string;
    taskIsCompleted: boolean;
    taskPriority: string;
}


// get all Tasks for a user 
export const getAllTasks = ({userId}:{userId:string}) => {
    return localStorage.getItem(`${userId}:task`)? JSON.parse(localStorage.getItem(`${userId}:task`) || "") : [];
}

// get task by name 
export const getTask = ({userId, taskName}:{userId: string, taskName: string}) => {
    const tasks = localStorage.getItem(`${userId}:task`) ? JSON.parse(localStorage.getItem(`${userId}:task`) || "") : [];
    return tasks.find((task: GetTaskProps) => task.taskName === taskName);
}

// get task by Due Date 
export const getTaskByDueDate = ({userId, taskDueDate}:{userId: string, taskDueDate: string}) => {
    const tasks = localStorage.getItem(`${userId}:task`) ? JSON.parse(localStorage.getItem(`${userId}:task`) || "") : [];
    return tasks.filter((task: GetTaskProps) => task.taskDueDate === taskDueDate);
}

// get task by Priority 
export const getTaskByPriority = ({userId, taskPriority}:{userId: string, taskPriority: string}) => {
    const tasks = localStorage.getItem(`${userId}:task`) ? JSON.parse(localStorage.getItem(`${userId}:task`) || "") : [];
    return tasks.filter((task: GetTaskProps) => task.taskPriority === taskPriority);
}

// get task by completion status 
export const getTaskByCompletionStatus = ({userId, taskIsCompleted}:{userId: string, taskIsCompleted: boolean}) => {
    const tasks = localStorage.getItem(`${userId}:task`) ? JSON.parse(localStorage.getItem(`${userId}:task`) || "") : [];
    return tasks.filter((task: GetTaskProps) => task.taskIsCompleted === taskIsCompleted);
}


