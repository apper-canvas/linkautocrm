import { getApperClient } from "@/services/apperClient";

class TaskService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("task_c", {
        fields: [
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "related_entity_type_c" } },
          { field: { Name: "related_entity_id_c" } }
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch tasks:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById("task_c", parseInt(id), {
        fields: [
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "related_entity_type_c" } },
          { field: { Name: "related_entity_id_c" } }
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch task:", response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error("Error fetching task:", error.message);
      return null;
    }
  }

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          description_c: taskData.description_c || "",
          due_date_c: taskData.due_date_c || "",
          completed_c: taskData.completed_c || false,
          related_entity_type_c: taskData.related_entity_type_c || "",
          related_entity_id_c: taskData.related_entity_id_c ? 
            parseInt(taskData.related_entity_id_c) : null
        }]
      };

      const response = await apperClient.createRecord("task_c", payload);

      if (!response.success) {
        console.error("Failed to create task:", response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          console.error("Failed to create task:", result.message);
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating task:", error.message);
      return null;
    }
  }

  async update(id, taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          description_c: taskData.description_c,
          due_date_c: taskData.due_date_c,
          completed_c: taskData.completed_c,
          related_entity_type_c: taskData.related_entity_type_c,
          related_entity_id_c: taskData.related_entity_id_c ? 
            parseInt(taskData.related_entity_id_c) : null
        }]
      };

      const response = await apperClient.updateRecord("task_c", payload);

      if (!response.success) {
        console.error("Failed to update task:", response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          console.error("Failed to update task:", result.message);
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating task:", error.message);
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord("task_c", {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Failed to delete task:", response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        return result.success;
      }

      return false;
    } catch (error) {
      console.error("Error deleting task:", error.message);
      return false;
    }
  }
}

export default new TaskService();