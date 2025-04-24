import { useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TimerReset, CheckCircle2 } from "lucide-react";

type TaskCardProps = {
  taskName: string;
  taskDescription: string;
  taskDueDate: string;
  taskId: string;
  taskIsCompleted: boolean;
  taskPriority: string;
};

interface TaskCardComponentProps {
  task: TaskCardProps;
  onOpen: (
    task: Omit<
      TaskCardProps,
      "onOpen" | "onSelect" | "isSelected" | "enableSelectionMode"
    >
  ) => void;
  onSelect?: (taskId: string) => void;
  isSelected?: boolean;
  enableSelectionMode?: boolean;
}

const TaskCard = ({
  task,
  onOpen,
  onSelect,
  isSelected,
  enableSelectionMode,
}: TaskCardComponentProps) => {
  const imageSrc = task.taskIsCompleted ? "/inactive.svg" : "/active.svg";
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  
  // Handle the start of a potential long press
  const handlePressStart = useCallback(() => {
    isLongPress.current = false;
    
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      onSelect?.(task.taskId);
    }, 500);
  }, [task.taskId, onSelect]);
  
  // Handle the end of a press
  const handlePressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);
  
  // Handle click with long press detection
  const handleClick = useCallback(() => {
    if (isLongPress.current) {
      // Long press already handled the selection
      isLongPress.current = false;
      return;
    }
    
    if (enableSelectionMode) {
      onSelect?.(task.taskId);
    } else {
      onOpen(task);
    }
  }, [enableSelectionMode, onOpen, onSelect, task]);

  return (
    <div
      className={`py-2 cursor-pointer`}
      onMouseDown={handlePressStart}
      onTouchStart={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchEnd={handlePressEnd}
      onClick={handleClick}
    >
      <Card
        key={task.taskId}
        className={`${
          task.taskIsCompleted ? "bg-[#fffafa]" : "bg-white"
        } w-full border-0 relative overflow-hidden cursor-pointer p-0 shadow-[0px_2px_10px_0px_rgba(0,_0,_0,_0.1)] ${
          isSelected ? "bg-blue-200" : ""
        }`}
      >
        <div className="flex flex-row h-full">
          {/* Left Side Content */}
          <div className="flex-1 p-4 z-10 flex flex-col gap-y-4">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-md lg:text-xl text-slate-700 font-semibold font-sans">
                {task.taskIsCompleted ? (
                  <s>{task.taskName}</s>
                ) : (
                  <>{task.taskName}</>
                )}
              </CardTitle>
              <CardDescription className="text-sm lg:text-md font-serif font-regular text-slate-500 truncate overflow-hidden whitespace-nowrap">
                {task.taskDescription}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-x-2 items-center">
                  <TimerReset className="text-slate-400" size={20} />
                  <span className="text-[16px] lg:text-md text-slate-500">
                    {task.taskDueDate}
                  </span>
                </div>
                <div className="flex flex-row gap-x-2 items-center">
                  <CheckCircle2 className="text-slate-400" size={20} />
                  <span
                    className={`text-[14px] lg:text-[16px] ${
                      task.taskIsCompleted ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {task.taskIsCompleted ? "Completed" : "Not Completed"}
                  </span>
                </div>
              </div>
            </CardContent>
          </div>

          {/* Right Side Image with Fade */}
          <div className="relative w-[200px] min-w-[80px] lg:w-[300px] lg:min-w-[200px] h-auto">
            <img
              src={imageSrc}
              alt="task illustration"
              className="absolute top-0 right-0 left-1/5 lg:left-0 h-full w-full object-cover rounded-r-md"
            />
            <div className="absolute right-0 top-0 h-full w-[80px] lg:w-[150px] bg-gradient-to-l from-white to-transparent" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TaskCard;
