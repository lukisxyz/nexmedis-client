<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="max-w-2xl mx-auto text-center">
    <h1 class="text-4xl font-bold mb-6">Welcome</h1>

    <div class="space-y-6">
      <div v-if="!authStore.isAuthenticated" class="space-x-4">
        <router-link
          to="/login"
          class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Login
        </router-link>
        <router-link
          to="/register"
          class="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium"
        >
          Register
        </router-link>
      </div>

      <div v-else>
        <p class="text-lg mb-4">Wellcome Back</p>
        <router-link
          to="/profile"
          class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Go to Profile Page
        </router-link>
      </div>
    </div>
  </div>
</template>
