import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import taskService from "@/services/api/taskService";

const TaskForm = ({ 
  isOpen, 
  onClose, 
  task = null, 
  contacts = [],
  deals = [],
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    description: task?.description || "",
    dueDate: task?.dueDate || "",
    completed: task?.completed || false,
    relatedEntityType: task?.relatedEntityType || "contact",
    relatedEntityId: task?.relatedEntityId || ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const taskData = {
        ...formData,
        relatedEntityId: formData.relatedEntityId ? 
          parseInt(formData.relatedEntityId) : null
      };
      
      if (task) {
        await taskService.update(task.Id, taskData);
        toast.success("Task updated successfully");
      } else {
        await taskService.create(taskData);
        toast.success("Task created successfully");
      }
      
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        description: "",
        dueDate: "",
        completed: false,
        relatedEntityType: "contact",
        relatedEntityId: ""
      });
    } catch (error) {
      toast.error(`Failed to ${task ? "update" : "create"} task`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    let value = e.target.value;
    
    if (field === "completed") {
      value = e.target.checked;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const getRelatedEntities = () => {
    return formData.relatedEntityType === "contact" ? contacts : deals;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? "Edit Task" : "Add New Task"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Description *"
          type="textarea"
          value={formData.description}
          onChange={handleChange("description")}
          error={errors.description}
          placeholder="Enter task description"
          rows={3}
        />
        
        <FormField
          label="Due Date *"
          type="input"
          inputType="date"
          value={formData.dueDate}
          onChange={handleChange("dueDate")}
          error={errors.dueDate}
        />
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="completed"
            checked={formData.completed}
            onChange={handleChange("completed")}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="completed" className="text-sm font-medium text-gray-700">
            Mark as completed
          </label>
        </div>
        
        <FormField
          label="Related to"
          type="select"
          value={formData.relatedEntityType}
          onChange={handleChange("relatedEntityType")}
        >
          <option value="contact">Contact</option>
          <option value="deal">Deal</option>
        </FormField>
        
        <FormField
          label={`Select ${formData.relatedEntityType}`}
          type="select"
          value={formData.relatedEntityId}
          onChange={handleChange("relatedEntityId")}
        >
          <option value="">None</option>
          {getRelatedEntities().map((entity) => (
            <option key={entity.Id} value={entity.Id}>
              {entity.name}
            </option>
          ))}
        </FormField>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            {task ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;