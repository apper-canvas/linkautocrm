import { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import TaskList from "@/components/organisms/TaskList";
import TaskForm from "@/components/organisms/TaskForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import taskService from "@/services/api/taskService";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [tasksData, contactsData, dealsData] = await Promise.all([
        taskService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      setTasks(tasksData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTask = () => {
    setEditTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditTask(null);
  };

  const handleFormSuccess = () => {
    loadData();
  };

  if (loading) {
    return (
      <div>
        <Header 
          title="Tasks"
          action={true}
          actionLabel="Add Task"
          onAction={handleAddTask}
        />
        <div className="p-6">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header 
          title="Tasks"
          action={true}
          actionLabel="Add Task"
          onAction={handleAddTask}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Tasks"
        action={true}
        actionLabel="Add Task"
        onAction={handleAddTask}
      />
      
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {tasks.length === 0 ? (
            <Empty
              message="No tasks yet"
              description="Create your first task to start tracking your follow-ups and to-dos"
              actionLabel="Add Task"
              onAction={handleAddTask}
              icon="CheckSquare"
            />
          ) : (
            <TaskList
              tasks={tasks}
              contacts={contacts}
              deals={deals}
              onEdit={handleEditTask}
              onRefresh={loadData}
            />
          )}
        </div>
      </div>

      <TaskForm
        isOpen={showForm}
        onClose={handleFormClose}
        task={editTask}
        contacts={contacts}
        deals={deals}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default Tasks;