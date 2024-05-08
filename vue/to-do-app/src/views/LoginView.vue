<template>
    <v-container class="login-container">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="mx-auto" elevation="0">
            <v-card-title class="text-center">Todo App Login</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="handleSubmit">
                <v-text-field
                  v-model="email"
                  label="Email Address"
                  required
                  outlined
                  autocomplete="email"
                />
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  required
                  outlined
                  autocomplete="current-password"
                />
                <v-btn color="primary" dark block type="submit">Sign In</v-btn>
                <span v-if="loginError" class="red--text">Login Error! Wrong Email or password!</span>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>

<script setup>

import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('admin@admin.com');
const password = ref('admin');
const loginError = ref(false);

const handleSubmit = async () => {
  try {
    await authStore.login({email: email.value, password: password.value }).then((user) => {
      loginError.value = false;
      router.push('/');
    });
  } catch (error) {
    loginError.value = true;
  }
};

</script>

<style lang="scss" scoped>

.login-container {
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>