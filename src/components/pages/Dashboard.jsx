import { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import DashboardStats from "@/components/organisms/DashboardStats";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import taskService from "@/services/api/taskService";

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [contactsData, dealsData, tasksData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        taskService.getAll()
      ]);
      
      setContacts(contactsData);
      setDeals(dealsData);
      setTasks(tasksData);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div>
        <Header title="Dashboard" />
        <div className="p-6">
          <Loading variant="cards" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header title="Dashboard" />
        <div className="p-6">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Dashboard" />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Overview
            </h2>
            <DashboardStats 
              contacts={contacts}
              deals={deals}
              tasks={tasks}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {contacts.length} contacts in your database
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {deals.filter(d => d.status === "won").length} deals won
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {tasks.filter(t => !t.completed).length} tasks pending
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <a
                  href="/contacts"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Manage Contacts
                </a>
                <a
                  href="/deals"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Deals Pipeline
                </a>
                <a
                  href="/tasks"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Check Tasks
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;