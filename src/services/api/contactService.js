import contactsData from "@/services/mockData/contacts.json";

class ContactService {
  constructor() {
    this.storageKey = "autocrm_contacts";
    this.initializeData();
  }

  initializeData() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      localStorage.setItem(this.storageKey, JSON.stringify(contactsData));
    }
  }

  getData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveData(contacts) {
    localStorage.setItem(this.storageKey, JSON.stringify(contacts));
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const contacts = this.getData();
        resolve([...contacts]);
      }, 250);
    });
  }

  async getById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const contacts = this.getData();
        const contact = contacts.find(c => c.Id === parseInt(id));
        resolve(contact ? { ...contact } : null);
      }, 200);
    });
  }

  async create(contactData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const contacts = this.getData();
        const maxId = Math.max(...contacts.map(c => c.Id), 0);
        const newContact = {
          ...contactData,
          Id: maxId + 1,
          createdAt: new Date().toISOString()
        };
        contacts.push(newContact);
        this.saveData(contacts);
        resolve({ ...newContact });
      }, 300);
    });
  }

  async update(id, contactData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const contacts = this.getData();
        const index = contacts.findIndex(c => c.Id === parseInt(id));
        if (index !== -1) {
          contacts[index] = { ...contacts[index], ...contactData };
          this.saveData(contacts);
          resolve({ ...contacts[index] });
        } else {
          resolve(null);
        }
      }, 300);
    });
  }

  async delete(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const contacts = this.getData();
        const filteredContacts = contacts.filter(c => c.Id !== parseInt(id));
        this.saveData(filteredContacts);
        resolve(true);
      }, 250);
    });
  }
}

export default new ContactService();