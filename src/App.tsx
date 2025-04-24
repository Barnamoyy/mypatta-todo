import "./App.css";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

import { Layout } from "../src/components/Layout";
import { Routes, Route, useLocation } from "react-router-dom";

// pages
import AllTasks from "./pages/AllTasks";
import CompletedTasks from "./pages/CompletedTasks";
import IncompleteTasks from "./pages/IncompleteTasks";
import TodayTasks from "./pages/TodayTasks";
import ScheduledTasks from "./pages/ScheduledTasks";

function App() {
  const location = useLocation();

  const routeTitleMap: { [key: string]: string } = {
    "/": "All Tasks",
    "/All": "All Tasks",
    "/Completed": "Completed Tasks",
    "/Flagged": "Incomplete Tasks",
    "/Today": "Today’s Tasks",
    "/Scheduled": "Scheduled Tasks",
  };

  console.log(location.pathname)

  const title = routeTitleMap[location.pathname] || "TaskFlow";
  return (
    <>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <Layout>
          <div className="space-y-4">
            <h2 className="text-2xl lg:text-4xl font-bold">
              {title}
            </h2>
            <p className="text-sm lg:text-md text-slate-500 font-semibold">
            Action is the foundational key to all success ~ Pablo Picasso
            </p>
            <Routes>
              <Route path="/" element={<AllTasks />} />
              <Route path="/all" element={<AllTasks />} />
              <Route path="/completed" element={<CompletedTasks />} />
              <Route path="/flagged" element={<IncompleteTasks />} />
              <Route path="/today" element={<TodayTasks />} />
              <Route path="/scheduled" element={<ScheduledTasks />} />
            </Routes>
          </div>
        </Layout>
      </SignedIn>
    </>
  );
}

export default App;
