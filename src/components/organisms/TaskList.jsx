import React, { useState } from "react";
import { format, isAfter, isBefore, isToday } from "date-fns";
import { toast } from "react-toastify";
import taskService from "@/services/api/taskService";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";
const TaskList = ({ tasks, contacts, deals, onEdit, onRefresh }) => {
  const [deleteTask, setDeleteTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const getRelatedEntityName = (task) => {
if (task.related_entity_type_c === "contact") {
      const contact = contacts.find(c => c.Id === parseInt(task.related_entity_id_c));
      return contact?.name_c || "Unknown Contact";
    } else if (task.related_entity_type_c === "deal") {
      const deal = deals.find(d => d.Id === parseInt(task.related_entity_id_c));
      return deal?.name_c || "Unknown Deal";
    }
    return "";
  };

const getTaskPriority = (task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(task.due_date_c);
    if (isBefore(dueDate, today)) return "overdue";
    if (isToday(dueDate)) return "today";
    return "upcoming";
  };

const handleToggleComplete = async (task) => {
    try {
      await taskService.update(task.Id, { 
        ...task,
        completed_c: !task.completed_c
      });
      toast.success(task.completed_c ? "Task marked as incomplete" : "Task completed!");
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
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleComplete(task)}
                  className="mt-1 flex-shrink-0"
                >
                  <div
                    className={cn(
                      "h-5 w-5 rounded border-2 flex items-center justify-center transition-colors",
                      task.completed_c
                        ? "bg-success-500 border-success-500 text-white"
                        : "border-gray-300 hover:border-success-500"
                    )}
                  >
                    {task.completed_c && <ApperIcon name="Check" size={14} />}
                  </div>
                </button>
 
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        task.completed_c 
                          ? "text-gray-500 line-through" 
                          : "text-gray-900"
                      )}
                    >
                      {task.description_c}
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <ApperIcon name="Calendar" size={14} />
                      Due: {format(new Date(task.due_date_c), "MMM d, yyyy")}
                    </span>
                    {getRelatedEntityName(task) && (
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Link" size={14} />
                        {getRelatedEntityName(task)}
                      </span>
                    )}
                  </div>
                </div>
 
                <div className="flex items-center gap-1">
                  {priority === "overdue" && !task.completed_c && (
                    <Badge variant="error" className="text-xs">
                      Overdue
                    </Badge>
                  )}
                  {priority === "today" && !task.completed_c && (
                    <Badge variant="warning" className="text-xs">
                      Today
                    </Badge>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(task)}
                  >
                    <ApperIcon name="Edit" size={16} />
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