// components/Layout.tsx
import React from "react";
import { useState } from "react";


import { Sidebar } from "./ui_components/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SidebarInset } from "./ui/sidebar";
import { Plus } from "lucide-react";
import Modal from "./ui_components/Modal";

// controllers 
import { v4 as uuidv4 } from "uuid";
import { AddTask } from "@/controllers/addTask";
import { useUser } from "@clerk/clerk-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {

  const [dialogOpen, setDialogOpen] = useState(false);

  const { user } = useUser();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full overflow-y-auto">
        <Sidebar className="h-full" />
      </div>

      <SidebarInset className="bg-white flex-1 overflow-hidden">
        {/* Content Area */}
        <div className="flex flex-col h-full">
          <header className="h-12 flex items-center px-4 shrink-0 bg-[#fffdf7]">
            {/* Mobile Sidebar Trigger */}
            <Sheet>
              <SheetTrigger className="md:hidden">
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-fit max-w-none">
                <Sidebar className="border-0 h-full" />
              </SheetContent>
            </Sheet>
          </header>

          <main className="flex-1 overflow-auto px-4 lg:px-10 bg-[#fffdf7]">{children}</main>
        </div>
      </SidebarInset>

      {/* Floating Add Task Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setDialogOpen(true)}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Add Task Modal */}
      <Modal
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        title="Add New Task"
        description="Enter the task details below."
        fields={[
          {
            id: "title",
            label: "Task Title",
            placeholder: "e.g., Buy groceries",
            type: "text",
          },
          {
            id: "description",
            label: "Description",
            placeholder: "e.g., Milk, Eggs, Bread",
            type: "text",
          },
          {
            id: "dueDate",
            label: "Due Date",
            placeholder: "e.g., 2023-10-01",
            type: "date",
          },
        ]}
        onSubmit={(data) => {
          const taskId = uuidv4(); // generate a unique ID
          const userId = user?.id || ""; // optional: pass as prop/context
          AddTask({
            taskName: data.title,
            taskDescription: data.description,
            taskDueDate: data.dueDate,
            taskId,
            taskIsCompleted: false,
            userId,
          });
        }}
      />
    </div>
  );
}
