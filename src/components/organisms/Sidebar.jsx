import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ className }) => {
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
    <div className={cn("bg-primary-800 text-white", className)}>
      <div className="p-6 border-b border-primary-700">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-lg">
            <ApperIcon name="Zap" className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold">AutoCRM</h1>
        </div>
      </div>
      
      <nav className="mt-6 px-3">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
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
  );
};

export default Sidebar;