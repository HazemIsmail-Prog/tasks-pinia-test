<template>
  <div>
    <!-- heading -->
    <header>
      <img src="./assets/pinia-logo.svg" alt="pinia logo" />
      <h1>Pinia Tasks</h1>
    </header>

    <!-- form -->
    <div class="new-task-form">
      <TaskForm />
    </div>

    <!-- filter -->
    <nav class="filter">
      <button @click="filter = 'all'">All task</button>
      <button @click="filter = 'favs'">Fav task</button>
    </nav>

    <!-- loading -->

    <div class="loading" v-if="taskStore.isLoading">Loading tasks ...</div>

    <!-- tasks list -->
    <div class="task-list" v-if="filter === 'all'">
      <p>You have {{ taskStore.totalCount }} tasks left to do</p>
      <div v-for="task in taskStore.tasks" :key="task.id">
        <TaskDetails :task="task" />
      </div>
    </div>

    <div class="task-list" v-if="filter === 'favs'">
      <p>You have {{ taskStore.favCount }} favs left to do</p>

      <div v-for="task in taskStore.favs" :key="task.id">
        <TaskDetails :task="task" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useTaskStore } from "@/stores/TaskStore";
import TaskForm from "@/components/TaskForm.vue";
import TaskDetails from "@/components/TaskDetails.vue";

const taskStore = useTaskStore();
const filter = ref("all");

onMounted(() => {
  taskStore.getTasks();
});
</script>