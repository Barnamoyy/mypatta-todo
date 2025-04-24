// components/ui_components/Sidebar.tsx
import React from "react";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserButton } from "@clerk/clerk-react";

import { useNavigate } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  companyName?: string;
}

interface TaskCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color?: string;
}

export function Sidebar({
  className,
  companyName = "TaskFlow",
  ...props
}: SidebarProps) {
  const navigate = useNavigate();
  const handleClick = (category: string) => {
    navigate(`/${category}`);
  };

  // Task categories with counts as shown in the image
  // images
  const todayImg = "/today.png";
  const completeImg = "/complete.png";
  const incompleteImg = "/incomplete.png";
  const scheduleImg = "/schedule.png";
  const allImg = "/all.png";

  const categories: TaskCategory[] = [
    {
      id: "today",
      name: "Today",
      icon: <img src={todayImg} className="w-[24px] h-auto" />,
    },
    {
      id: "scheduled",
      name: "Scheduled",
      icon: <img src={scheduleImg} className="w-[24px] h-auto" />,
    },
    {
      id: "all",
      name: "All",
      icon: <img src={allImg} className="w-[24px] h-auto" />,
    },
    {
      id: "flagged",
      name: "Flagged",
      icon: <img src={incompleteImg} className="w-[24px] h-auto" />,
    },
    {
      id: "completed",
      name: "Completed",
      icon: <img src={completeImg} className="w-[24px] h-auto" />,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full w-40 lg:w-fit bg-[#fefae0] py-4",
        className
      )}
      {...props}
    >
      {/* Company Name */}
      <div className="px-4 py-4 flex items-center">
        <span className="text-lg lg:text-xl font-bold font-sans">
          {companyName}
        </span>
      </div>

      <ScrollArea className="flex-1 h-full overflow-y-auto" type="scroll">
        {/* Task Categories */}
        <div className="px-4 py-2">
          <div className="flex flex-col justify-center items-center gap-y-4 mt-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group relative flex justify-center w-full"
              >
                <button
                  onClick={() => handleClick(category.name)}
                  className="p-4 rounded-full bg-amber-300 hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  {category.icon}
                </button>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      <div className="w-full flex justify-center items-center">
          <UserButton/>
      </div>
    </div>
  );
}
