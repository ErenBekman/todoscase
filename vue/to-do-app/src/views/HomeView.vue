<template>
    <div>
        <Navbar />
        <v-card class="mx-auto" width="800" variant="flat">
            <v-card-title>
                <h3>Todo App</h3>
            </v-card-title>
            <v-card-text>
                <TodoList />
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
    import TodoList from '@/components/todos/TodoList.vue';
    import Navbar from '@/components/layouts/Navbar.vue';
</script>

<style lang="scss" scoped>
</style>