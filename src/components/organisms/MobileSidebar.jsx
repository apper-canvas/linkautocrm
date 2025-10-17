import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: "BarChart3"
    },
    {
      name: "Contacts", 
      href: "/contacts",
      icon: "Users"
    },
    {
      name: "Deals",
      href: "/deals", 
      icon: "DollarSign"
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: "CheckSquare"
    }
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="lg:hidden"
      >
        <ApperIcon name="Menu" className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className={cn(
            "fixed left-0 top-0 h-full w-64 bg-primary-800 text-white transform transition-transform duration-300",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <div className="p-6 border-b border-primary-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-lg">
                    <ApperIcon name="Zap" className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-xl font-bold">AutoCRM</h1>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-primary-100 hover:text-white"
                >
                  <ApperIcon name="X" className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <nav className="mt-6 px-3">
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary-600 text-white border-l-4 border-primary-400"
                            : "text-primary-100 hover:bg-primary-700 hover:text-white"
                        )
                      }
                    >
                      <ApperIcon name={item.icon} className="h-5 w-5 mr-3" />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileSidebar;