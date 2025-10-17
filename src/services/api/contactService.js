import { getApperClient } from "@/services/apperClient";

class ContactService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("contact_c", {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "last_contact_date_c" } }
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch contacts:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error.message);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById("contact_c", parseInt(id), {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "last_contact_date_c" } }
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch contact:", response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error("Error fetching contact:", error.message);
      return null;
    }
  }

  async create(contactData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          name_c: contactData.name_c || "",
          company_c: contactData.company_c || "",
          email_c: contactData.email_c || "",
          phone_c: contactData.phone_c || "",
          last_contact_date_c: contactData.last_contact_date_c || ""
        }]
      };

      const response = await apperClient.createRecord("contact_c", payload);

      if (!response.success) {
        console.error("Failed to create contact:", response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          console.error("Failed to create contact:", result.message);
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating contact:", error.message);
      return null;
    }
  }

  async update(id, contactData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          name_c: contactData.name_c,
          company_c: contactData.company_c,
          email_c: contactData.email_c,
          phone_c: contactData.phone_c,
          last_contact_date_c: contactData.last_contact_date_c
        }]
      };

      const response = await apperClient.updateRecord("contact_c", payload);

      if (!response.success) {
        console.error("Failed to update contact:", response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          console.error("Failed to update contact:", result.message);
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating contact:", error.message);
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord("contact_c", {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Failed to delete contact:", response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        return result.success;
      }

      return false;
    } catch (error) {
      console.error("Error deleting contact:", error.message);
      return false;
    }
  }
}

export default new ContactService();