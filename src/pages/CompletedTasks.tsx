// components
import Tasksheet from "@/components/ui_components/Tasksheet";
import TaskCard from "@/components/ui_components/TaskCard";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui_components/Modal";

// controllers
import { deleteCompletedTasks } from "@/controllers/deleteTask";
import { listenToStorageChanges } from "@/controllers/storageListener";

// hooks
import { useState, useEffect } from "react";
import { useCompletedTasks, TaskProps } from "@/hooks/useCompletedTasks";
import { useUser } from "@clerk/clerk-react";

import { Trash2 } from "lucide-react";

const CompletedTasks = () => {
  // image
  const emptyImage = "/empty2.svg";

  const { user } = useUser();
  if (!user) return null;
  const userId = user.id;

  const { completedTasks, loading, refetch } = useCompletedTasks();

  // task info
  const [selectedTask, setSelectedTask] = useState<TaskProps>({
    taskId: "",
    taskName: "",
    taskDescription: "",
    taskDueDate: "",
    taskIsCompleted: false,
    taskPriority: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (task: TaskProps) => {
    setSelectedTask(task);
    setIsOpen(true);
  };

  // modal state
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDeleteTasks = () => {
    deleteCompletedTasks({ userId });
    setDialogOpen(false);
  };

  // listen to changes in local storage and update if changed
  useEffect(() => {
    listenToStorageChanges(() => {
      // Reload the entire page
      refetch();
    });
  }, [refetch]);

  if (loading) return <p>Loading tasks...</p>;

  return (
    <>
      {completedTasks && completedTasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          <div className="w-full flex flex-row justify-end items-center">
            <Button
              className="bg-red-500 w-full lg:w-auto"
              onClick={() => setDialogOpen(true)}
            >
              <div className="flex flex-row justify-center items-center py-2 gap-x-2">
                <Trash2 size={20} className="text-white" />
                <h4 className="text-white">Delete All Completed Tasks</h4>
              </div>
            </Button>
          </div>
          {[...(completedTasks || [])].reverse().map((task: any) => (
            <TaskCard key={task.taskId} task={task} onOpen={handleOpen} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col w-full h-full justify-center items-center">
          <img
            src={emptyImage}
            alt=""
            className="w-[400px] h-auto object-contain"
          />
          <div className="flex flex-col items-center justify-center gap-y-2 lg:gap-y-3">
            <h1 className="text-slate-700 text-2xl lg:text-3xl font-semibold">
              No tasks added
            </h1>
            <h4 className="text-slate-500 text-md font-regular text-center">
              Click on the add task button to add your first task, stay
              organised!
            </h4>
          </div>
        </div>
      )}

      <Tasksheet isOpen={isOpen} setIsOpen={setIsOpen} task={selectedTask} />

      <Modal
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete all completed tasks? This action cannot be undone."
        fields={[]} // no input fields needed
        onSubmit={handleDeleteTasks}
        showCancelButton={true}
        buttonColor="bg-red-600"
      />
    </>
  );
};

export default CompletedTasks;
