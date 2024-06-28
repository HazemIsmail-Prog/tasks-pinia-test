<template>
  <div class="task">
  <h3>{{ task.title }}</h3>
  <div class="icons">
  <i @click="taskStore.deleteTask(task.id)" class="material-icons">delete</i>
  <i @click="taskStore.toggleFav(task.id)" :class="{active:task.isFav}" class="material-icons">favorite</i>
  </div>
  </div>
</template>

<script setup>
import { useTaskStore } from '@/stores/TaskStore';

const taskStore = useTaskStore()

defineProps({
  task: Object,
});
</script>