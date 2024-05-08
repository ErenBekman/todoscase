<template>
    <v-app-bar elevation="0">
        <v-app-bar-title>
            <v-icon>mdi-format-list-text</v-icon>
            Todo
        </v-app-bar-title>

        <v-spacer />

        <v-btn color="blue" variant="text" class="rounded-sm"> 
            <span class="text-capitalize">Hello, {{ authStore?.user?.username ||  "admin" }} </span>
        </v-btn>
        
        <v-btn icon @click="authStore.logout">
            <v-icon>mdi-logout</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

</script>

<style lang="scss" scoped>

</style>