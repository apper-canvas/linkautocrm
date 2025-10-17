import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.storageKey = "autocrm_tasks";
    this.initializeData();
  }

  initializeData() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      localStorage.setItem(this.storageKey, JSON.stringify(tasksData));
    }
  }

  getData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveData(tasks) {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getData();
        resolve([...tasks]);
      }, 250);
    });
  }

  async getById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getData();
        const task = tasks.find(t => t.Id === parseInt(id));
        resolve(task ? { ...task } : null);
      }, 200);
    });
  }

  async create(taskData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getData();
        const maxId = Math.max(...tasks.map(t => t.Id), 0);
        const newTask = {
          ...taskData,
          Id: maxId + 1,
          createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        this.saveData(tasks);
        resolve({ ...newTask });
      }, 300);
    });
  }

  async update(id, taskData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getData();
        const index = tasks.findIndex(t => t.Id === parseInt(id));
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...taskData };
          this.saveData(tasks);
          resolve({ ...tasks[index] });
        } else {
          resolve(null);
        }
      }, 300);
    });
  }

  async delete(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = this.getData();
        const filteredTasks = tasks.filter(t => t.Id !== parseInt(id));
        this.saveData(filteredTasks);
        resolve(true);
      }, 250);
    });
  }
}

export default new TaskService();