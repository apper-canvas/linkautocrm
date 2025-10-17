import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const DashboardStats = ({ contacts, deals, tasks }) => {
  const totalContacts = contacts.length;
  const activeDeals = deals.filter(deal => 
    deal.status === "lead" || deal.status === "negotiation"
  ).length;
  const totalDealValue = deals
    .filter(deal => deal.status !== "lost")
    .reduce((sum, deal) => sum + deal.value, 0);
  const pendingTasks = tasks.filter(task => !task.completed).length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      name: "Total Contacts",
      value: totalContacts,
      icon: "Users",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      name: "Active Deals",
      value: activeDeals,
      icon: "TrendingUp",
      color: "from-green-500 to-green-600", 
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      name: "Total Deal Value",
      value: formatCurrency(totalDealValue),
      icon: "DollarSign",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50", 
      iconColor: "text-purple-600"
    },
    {
      name: "Pending Tasks",
      value: pendingTasks,
      icon: "CheckSquare",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {stat.name}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stat.value}
              </p>
            </div>
            <div className={cn(
              "h-12 w-12 rounded-lg flex items-center justify-center",
              stat.bgColor
            )}>
              <ApperIcon 
                name={stat.icon} 
                className={cn("h-6 w-6", stat.iconColor)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;