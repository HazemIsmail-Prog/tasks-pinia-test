import { db } from "@/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import { defineStore } from "pinia";

const tasksCollectionRef = collection(db, "tasks");
const tasksCollectionQuery = query(tasksCollectionRef, orderBy("date", "desc"));

export const useTaskStore = defineStore("taskStore", {
  state: () => ({
    tasks: [],
    isLoading: false,
  }),
  getters: {
    favs() {
      return this.tasks.filter((t) => t.isFav);
    },
    favCount() {
      return this.tasks.reduce((accumlator, currentValue) => {
        return currentValue.isFav ? accumlator + 1 : accumlator;
      }, 0);
    },
    totalCount: (state) => {
      return state.tasks.length;
    },
  },
  actions: {
    getTasks() {
      this.isLoading = true;
      onSnapshot(tasksCollectionQuery, (querySnapshot) => {
        const fbTasks = [];
        querySnapshot.forEach((doc) => {
          const task = {
            id: doc.id,
            title: doc.data().title,
            isFav: doc.data().isFav,
          };
          fbTasks.push(task);
        });
        this.tasks = fbTasks;
      });
      this.isLoading = false;
    },

    addTask(task) {
      try {
        addDoc(tasksCollectionRef, {
          title: task.title,
          isFav: task.isFav,
          date: Date.now(),
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    deleteTask(id) {
      deleteDoc(doc(tasksCollectionRef, id));
    },
    toggleFav(id) {
      const task = this.tasks.find((t) => t.id === id);
      updateDoc(doc(tasksCollectionRef, id), {
        isFav: !task.isFav,
      });
    },
  },
});
