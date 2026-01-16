import { Outlet } from "react-router-dom";
import AgentSidebar from "../components/AgentSidebar";

const AgentLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AgentSidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AgentLayout;
