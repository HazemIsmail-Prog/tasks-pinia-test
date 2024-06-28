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
import { computed, ref } from "vue";

const tasksCollectionRef = collection(db, "tasks");
const tasksCollectionQuery = query(tasksCollectionRef, orderBy("date", "desc"));

export const useTaskStore = defineStore("taskStore", () => {
  const tasks = ref([]),
    isLoading = ref(false),
    favs = computed(() => tasks.value.filter((t) => t.isFav)),
    totalCount = computed(() => tasks.value.length),
    favCount = computed(() => {
      return tasks.value.reduce((accumlator, currentValue) => {
        return currentValue.isFav ? accumlator + 1 : accumlator;
      }, 0);
    });

  function getTasks() {
    isLoading.value = true;
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
      tasks.value = fbTasks;
    });
    isLoading.value = false;
  }

  function addTask(task) {
    try {
      addDoc(tasksCollectionRef, {
        title: task.title,
        isFav: task.isFav,
        date: Date.now(),
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  function deleteTask(id) {
    deleteDoc(doc(tasksCollectionRef, id));
  }
  function toggleFav(id) {
    const task = tasks.value.find((t) => t.id === id);
    updateDoc(doc(tasksCollectionRef, id), {
      isFav: !task.isFav,
    });
  }
  return {
    tasks,
    isLoading,
    favs,
    favCount,
    totalCount,
    getTasks,
    addTask,
    deleteTask,
    toggleFav,
  };
});
