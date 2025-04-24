// components
import Tasksheet from "@/components/ui_components/Tasksheet";
import TaskCard from "@/components/ui_components/TaskCard";
import Modal from "@/components/ui_components/Modal";

// hooks
import { useState, useEffect } from "react";
import { useIncompleteTasks, TaskProps } from "@/hooks/useIncompleteTasks";
import { useUser } from "@clerk/clerk-react";

// controllers
import { listenToStorageChanges } from "@/controllers/storageListener";
import { DeleteTask } from "@/controllers/deleteTask";

const IncompleteTasks = () => {
  // image
  const emptyImage = "/empty2.svg";

  const { user } = useUser();
  const { incompleteTasks, loading, refetch } = useIncompleteTasks();
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  //   task info
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

  const handleSelect = (taskId: string) => {
    // If not in selection mode, enter it
    if (!selectionMode) {
      setSelectionMode(true);
    }

    // Toggle the selected task
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );

    // If no tasks are selected after this operation, exit selection mode
    if (selectedTaskIds.length === 1 && selectedTaskIds.includes(taskId)) {
      setSelectionMode(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    for (const taskId of selectedTaskIds) {
      DeleteTask({ userId: user.id, taskId });
    }
    setSelectedTaskIds([]);
    setSelectionMode(false);
    refetch();
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
      {selectedTaskIds.length > 0 && (
        <div className="w-full flex justify-end items-center">
          <button
            onClick={() => setDialogOpen(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full lg:w-auto"
          >
            Delete Selected ({selectedTaskIds.length})
          </button>
        </div>
      )}
      {incompleteTasks && incompleteTasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {[...(incompleteTasks || [])].reverse().map((task: any) => (
            <TaskCard
              task={task}
              onOpen={handleOpen}
              onSelect={handleSelect}
              isSelected={selectedTaskIds.includes(task.taskId)}
              enableSelectionMode={selectionMode}
            />
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
        description="Are you sure you want to delete all selected tasks? This action cannot be undone."
        fields={[]} // no input fields needed
        onSubmit={handleDelete}
        showCancelButton={true}
        buttonColor="bg-red-600"
      />
    </>
  );
};

export default IncompleteTasks;
