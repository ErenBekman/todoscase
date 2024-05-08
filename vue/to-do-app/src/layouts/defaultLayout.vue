<template>
    <div>
      <v-app>
        <Navbar />
        
        <router-view v-slot="{ Component }">
          <v-main>
            <component :is="Component" />
          </v-main>
        </router-view>
        <!-- <Footer /> -->
      </v-app>
    </div>
</template>

<script setup>
  import { ref } from "vue";
  import { RouterView, useRoute } from "vue-router";
  import Footer from "@/components/layouts/Footer.vue";
  import Navbar from "@/components/layouts/Footer.vue";
</script>

<style lang="scss" scoped>
</style>
