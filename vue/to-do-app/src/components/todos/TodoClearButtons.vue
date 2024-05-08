<template>
    <div class="d-flex align-center justify-space-between mt-5" v-if="totalTodos > 0">
        <v-btn color="blue" variant="outlined" class="rounded-sm" @click="$emit('clearCompleted')" width="45%"> Clear Completed </v-btn>
        <v-btn color="blue" class="rounded-sm" @click="$emit('clearAll')" width="45%"> Clear All </v-btn>
    </div>
</template>

<script setup>

import { ref,computed } from 'vue';
import { useTodoStore } from '@/stores/todo';
const todoStore = useTodoStore()
const totalTodos = computed(() => todoStore.totalTodos)

</script>

<style lang="scss" scoped>

</style>