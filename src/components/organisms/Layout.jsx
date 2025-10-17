import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0" />
      
      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;