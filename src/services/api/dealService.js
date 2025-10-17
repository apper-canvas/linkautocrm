import dealsData from "@/services/mockData/deals.json";

class DealService {
  constructor() {
    this.storageKey = "autocrm_deals";
    this.initializeData();
  }

  initializeData() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      localStorage.setItem(this.storageKey, JSON.stringify(dealsData));
    }
  }

  getData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveData(deals) {
    localStorage.setItem(this.storageKey, JSON.stringify(deals));
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = this.getData();
        resolve([...deals]);
      }, 250);
    });
  }

  async getById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = this.getData();
        const deal = deals.find(d => d.Id === parseInt(id));
        resolve(deal ? { ...deal } : null);
      }, 200);
    });
  }

  async create(dealData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = this.getData();
        const maxId = Math.max(...deals.map(d => d.Id), 0);
const newDeal = {
          ...dealData,
          Id: maxId + 1,
          notes: dealData.notes || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        deals.push(newDeal);
        this.saveData(deals);
        resolve({ ...newDeal });
      }, 300);
    });
  }

async update(id, dealData) {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        try {
          const deals = this.getData();
          const index = deals.findIndex(d => d.Id === parseInt(id));
          if (index !== -1) {
            const oldStatus = deals[index].status;
            const newStatus = dealData.status;
            
            deals[index] = { 
              ...deals[index], 
              ...dealData,
              notes: dealData.notes || "",
              updatedAt: new Date().toISOString()
            };
            
// Check if status changed to "won" and generate email
            if (oldStatus !== "won" && newStatus === "won") {
              try {
                // Initialize ApperClient only when needed
                if (!window.ApperSDK || !window.ApperSDK.ApperClient) {
                  throw new Error("ApperSDK not loaded");
                }
                
                const { ApperClient } = window.ApperSDK;
                const apperClient = new ApperClient({
                  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
                  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
                });
                
                const result = await apperClient.functions.invoke(
                  import.meta.env.VITE_GENERATE_DEAL_EMAIL,
                  {
                    body: JSON.stringify({
                      dealName: deals[index].name,
                      dealValue: deals[index].value,
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
                  deals[index].notes = (deals[index].notes || "") + emailSection;
                }
              } catch (error) {
                console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_GENERATE_DEAL_EMAIL}. The error is: ${error.message}`);
              }
            }
            
            this.saveData(deals);
            resolve({ ...deals[index] });
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }, 300);
    });
  }
  async delete(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = this.getData();
        const filteredDeals = deals.filter(d => d.Id !== parseInt(id));
        this.saveData(filteredDeals);
        resolve(true);
      }, 250);
    });
  }
}

export default new DealService();