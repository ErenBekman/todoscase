import { defineStore } from "pinia";
import { api } from "@/utils/axios";

export const useTodoStore = defineStore({
  id: "Todo",
  persist: true,
  state: () => ({
    todos: [],
  }),
  getters: {
    totalTodos: (state) => state.todos.length,
  },
  actions: {
    async fetchTodos(search = "", searchTags = "") {
      const { data } = await api.get("/todo", { params: { search, searchTags } });
      this.todos = data.data;
    },
    async addTodo({ text, tags }) {
        const { data } = await api.post("/todo", { text, tags });
        this.todos.push(data);
    },
    async searchTodos(searchText) {
      await this.fetchTodos(searchText, "");
    },
    async searchTags(searchTags) {
      await this.fetchTodos("", searchTags);
    },
    async removeTodo(id) {
      await api.delete(`/todo/${id}`);
      this.todos = this.todos.filter(todo => todo._id !== id);
    },
    async completeTodo(id) {
      await api.put(`/todo/${id}`, { isCompleted: !this.todos.find(todo => todo._id === id).isCompleted });
      const todo = this.todos.find(todo => todo._id === id);
      if (todo) {
        todo.isCompleted = !todo.isCompleted;
      }
    },
    async editTodo(data) {
      const formData = new FormData();
      for (let key in data) {
          formData.append(key, data[key]);
      }
      await api.put(`/todo/${data._id}`, formData, {
        headers: {"Content-Type": "multipart/form-data"}
      });
      this.fetchTodos();
    },
  },
});
