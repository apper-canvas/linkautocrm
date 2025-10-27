import { getApperClient } from "@/services/apperClient";

class DealService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("deal_c", {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { 
            field: { name: "contact_id_c" }, 
            referenceField: { field: { Name: "name_c" } } 
          }
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch deals:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error.message);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById("deal_c", parseInt(id), {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { 
            field: { name: "contact_id_c" }, 
            referenceField: { field: { Name: "name_c" } } 
          }
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch deal:", response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error("Error fetching deal:", error.message);
      return null;
    }
  }

  async create(dealData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          name_c: dealData.name_c || "",
          contact_id_c: parseInt(dealData.contact_id_c),
          value_c: parseFloat(dealData.value_c),
          status_c: dealData.status_c || "lead",
          notes_c: dealData.notes_c || ""
        }]
      };

const response = await apperClient.createRecord("deal_c", payload);

      if (!response.success) {
        console.error("Failed to create deal:", response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          // Fetch the complete deal record to ensure all fields are populated
          const createdDeal = await this.getById(result.data.Id);
          return createdDeal;
        } else {
          console.error("Failed to create deal:", result.message);
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating deal:", error.message);
      return null;
    }
  }

  async update(id, dealData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Get current deal to check status change
      const currentDeal = await this.getById(id);
      const oldStatus = currentDeal?.status_c;
      const newStatus = dealData.status_c;

      const payload = {
        records: [{
          Id: parseInt(id),
          name_c: dealData.name_c,
          contact_id_c: parseInt(dealData.contact_id_c),
          value_c: parseFloat(dealData.value_c),
          status_c: dealData.status_c,
          notes_c: dealData.notes_c || ""
        }]
      };

      // Check if status changed to "won" and generate email
      if (oldStatus !== "won" && newStatus === "won") {
        try {
          if (!window.ApperSDK || !window.ApperSDK.ApperClient) {
            throw new Error("ApperSDK not loaded");
          }

          const { ApperClient } = window.ApperSDK;
          const emailClient = new ApperClient({
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
          });

          const result = await emailClient.functions.invoke(
            import.meta.env.VITE_GENERATE_DEAL_EMAIL,
            {
              body: JSON.stringify({
                dealName: dealData.name_c,
                dealValue: dealData.value_c,
                contactName: dealData.contactName || "Valued Customer"
              }),
              headers: {
                "Content-Type": "application/json"
              }
            }
          );

          if (result.success === false) {
            console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_GENERATE_DEAL_EMAIL}. The response body is: ${JSON.stringify(result)}.`);
          } else if (result.success && result.email) {
            const timestamp = new Date().toLocaleString();
            const emailSection = `\n\n--- AI Generated Email (${timestamp}) ---\n${result.email}\n--- End of Generated Email ---`;
            payload.records[0].notes_c = (dealData.notes_c || "") + emailSection;
          }
        } catch (error) {
          console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_GENERATE_DEAL_EMAIL}. The error is: ${error.message}`);
        }
      }

      const response = await apperClient.updateRecord("deal_c", payload);

      if (!response.success) {
        console.error("Failed to update deal:", response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          console.error("Failed to update deal:", result.message);
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating deal:", error.message);
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord("deal_c", {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Failed to delete deal:", response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        return result.success;
      }

      return false;
    } catch (error) {
      console.error("Error deleting deal:", error.message);
      return false;
    }
  }
}

export default new DealService();