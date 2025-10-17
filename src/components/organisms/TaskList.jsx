import { useState } from "react";
import { format, isAfter, isBefore, isToday } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";
import { cn } from "@/utils/cn";
import taskService from "@/services/api/taskService";

const TaskList = ({ tasks, contacts, deals, onEdit, onRefresh }) => {
  const [deleteTask, setDeleteTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const getRelatedEntityName = (task) => {
    if (task.relatedEntityType === "contact") {
      const contact = contacts.find(c => c.Id === parseInt(task.relatedEntityId));
      return contact?.name || "Unknown Contact";
    } else if (task.relatedEntityType === "deal") {
      const deal = deals.find(d => d.Id === parseInt(task.relatedEntityId));
      return deal?.name || "Unknown Deal";
    }
    return "";
  };

  const getTaskPriority = (task) => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    
    if (task.completed) return "completed";
    if (isBefore(dueDate, today)) return "overdue";
    if (isToday(dueDate)) return "today";
    return "upcoming";
  };

  const handleToggleComplete = async (task) => {
    try {
      await taskService.update(task.Id, { 
        ...task, 
        completed: !task.completed 
      });
      toast.success(task.completed ? "Task marked as incomplete" : "Task completed!");
      onRefresh();
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    if (!deleteTask) return;
    
    setLoading(true);
    try {
      await taskService.delete(deleteTask.Id);
      toast.success("Task deleted successfully");
      onRefresh();
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setLoading(false);
      setDeleteTask(null);
    }
  };

  const priorityStyles = {
    completed: "bg-success-50 border-success-200",
    overdue: "bg-error-50 border-error-200",
    today: "bg-warning-50 border-warning-200",
    upcoming: "bg-white border-gray-200"
  };

  return (
    <>
      <div className="space-y-3">
        {tasks.map((task) => {
          const priority = getTaskPriority(task);
          return (
            <div
              key={task.Id}
              className={cn(
                "p-4 rounded-lg border-l-4 transition-all hover:shadow-sm",
                priorityStyles[priority]
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <button
                    onClick={() => handleToggleComplete(task)}
                    className={cn(
                      "mt-1 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors",
                      task.completed
                        ? "bg-success-500 border-success-500 text-white"
                        : "border-gray-300 hover:border-primary-500"
                    )}
                  >
                    {task.completed && (
                      <ApperIcon name="Check" className="h-3 w-3" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <p className={cn(
                      "text-sm font-medium",
                      task.completed 
                        ? "text-gray-500 line-through" 
                        : "text-gray-900"
                    )}>
                      {task.description}
                    </p>
                    
                    <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                      <span>
                        Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </span>
                      {getRelatedEntityName(task) && (
                        <span>
                          Related to: {getRelatedEntityName(task)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {priority === "overdue" && !task.completed && (
                    <span className="text-xs font-medium text-error-600 bg-error-100 px-2 py-1 rounded">
                      Overdue
                    </span>
                  )}
                  {priority === "today" && !task.completed && (
                    <span className="text-xs font-medium text-warning-600 bg-warning-100 px-2 py-1 rounded">
                      Due Today
                    </span>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(task)}
                  >
                    <ApperIcon name="Edit" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTask(task)}
                    className="text-error-600 hover:text-error-700"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTask}
        onClose={() => setDeleteTask(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete this task? This action cannot be undone.`}
        confirmLabel={loading ? "Deleting..." : "Delete"}
        variant="danger"
      />
    </>
  );
};

export default TaskList;