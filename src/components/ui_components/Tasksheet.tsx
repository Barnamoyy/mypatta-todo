import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Checkbox } from "../ui/checkbox";

import { TimerReset } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { Trash2 } from "lucide-react";
import { AlertTriangle } from "lucide-react";

// interfaces
type TaskProps = {
  taskName: string;
  taskDescription: string;
  taskDueDate: string;
  taskId: string;
  taskIsCompleted: boolean;
  taskPriority: string;
};

type TaskSheetProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  task: TaskProps;
  onTaskModified?: () => void;
};

// hooks
import { useUser } from "@clerk/clerk-react";

// controllers
import { DeleteTask } from "@/controllers/deleteTask";
import { CompleteTask } from "@/controllers/taskCompleted";

const Tasksheet = ({
  isOpen,
  setIsOpen,
  task,
  onTaskModified,
}: TaskSheetProps) => {
  // trigger the delete confirmation component
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  //   track the complete status of task
  const [isCompleted, setIsCompleted] = useState(task?.taskIsCompleted);
  useEffect(() => {
    setIsCompleted(task?.taskIsCompleted ?? false);
  }, [task?.taskIsCompleted]);

  const { user } = useUser();
  if (!user) return null;
  const userId = user.id;

  // microcontrollers
  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  const handleConfirmDelete = () => {
    if (task) {
      DeleteTask({ userId, taskId: task.taskId });
      setIsConfirmingDelete(false);
      setIsOpen(false);
      if (onTaskModified) {
        onTaskModified();
      }
    }
  };

  const handleComplete = (checked: boolean | "indeterminate") => {
    if (task && typeof checked === "boolean") {
      setIsCompleted(checked);
      CompleteTask({ userId, taskId: task.taskId, isCompleted: checked });
    }
  };
  return (
    <>
      <Sheet
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsConfirmingDelete(false);
          }
          setIsOpen(open);
        }}
      >
        <SheetContent className="bg-[#f9f9f9] min-w-full lg:min-w-[500px]">
          {!isConfirmingDelete ? (
            // Normal task view
            <>
              <SheetHeader>
                <span className="text-md font-regular text-slate-400">
                  Title
                </span>
                <SheetTitle className="text-3xl lg:text-4xl font-light font-serif">
                  {task?.taskName}
                </SheetTitle>
                <span className="text-md font-regular text-slate-400 mt-2">
                  Description
                </span>
                <SheetDescription className="text-md font-regular font-serif text-slate-500">
                  {task?.taskDescription}
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 justify-center items-start px-4 py-4">
                <div className="flex flex-row gap-x-2 items-center justify-center">
                  <TimerReset className="text-slate-400" size={24} />
                  <h1 className="text-md font-semibold text-slate-500">
                    {task?.taskDueDate}
                  </h1>
                </div>
                <div className="flex flex-row gap-x-2 items-center justify-center">
                  <CheckCircle2 className="text-slate-400" size={20} />
                  <h1
                    className={`text-md font-semibold ${
                      task?.taskIsCompleted ? "text-green-500" : "text-red-500"
                    } font-semibold text-md`}
                  >
                    {task?.taskIsCompleted ? "Completed" : "Not Completed"}
                  </h1>
                </div>
                <div className="flex flex-row gap-x-4 items-start justify-center">
                  <Checkbox
                    id="terms1"
                    checked={isCompleted}
                    onCheckedChange={(checked) => {
                      if (typeof checked === "boolean") {
                        setIsCompleted(checked); // only update local state
                      }
                    }}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms1"
                      className="text-md text-slate-600 font-regular"
                    >
                      Mark the task as completed
                    </label>
                    <p className="text-sm text-slate-500 font-regular">
                      This will mark the task as completed and move it to the
                      completed tasks list.
                    </p>
                  </div>
                </div>
              </div>
              <SheetFooter>
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    type="submit"
                    className="col-span-3 text-black"
                    variant={"outline"}
                    onClick={() => {
                      handleComplete(isCompleted); // now actually apply the change
                      setIsOpen(false);
                    }}
                  >
                    Save changes
                  </Button>
                  <Button
                    variant={"destructive"}
                    className="py-4 bg-red-600"
                    onClick={handleDeleteClick}
                  >
                    <div className="flex flex-row gap-x-2 items-center justify-center">
                      <Trash2 className="text-white" size={20} />
                      <span>Delete</span>
                    </div>
                  </Button>
                </div>
              </SheetFooter>
            </>
          ) : (
            // Confirmation view
            <>
              <SheetHeader>
                <SheetTitle className="text-lg font-medium text-red-600 flex items-center gap-2 pt-4">
                  <AlertTriangle size={20} />
                  Confirm Deletion
                </SheetTitle>
                <SheetDescription className="text-md text-slate-500 font-medium">
                  Are you sure you want to delete this task?
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 justify-center items-center px-4 py-2">
                <div className="bg-red-50 p-4 rounded-md border border-red-200 w-full">
                  <h3 className="font-semibold text-slate-800 mb-2">
                    {task?.taskName}
                  </h3>
                  <p className="text-slate-600">{task?.taskDescription}</p>
                </div>
                <p className="text-slate-500 text-center">
                  This action cannot be undone. The task will be permanently
                  deleted.
                </p>
              </div>
              <SheetFooter>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <Button
                    variant="outline"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800"
                    onClick={handleCancelDelete}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleConfirmDelete}
                  >
                    Delete Task
                  </Button>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Tasksheet;
