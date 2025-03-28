<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

const handleSubmit = async () => {
  try {
    await authStore.register({
      email: email.value,
      password: password.value,
    })
    router.push('/')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    error.value = err.toString()
  }
}
</script>

<template>
  <div class="mx-auto max-w-sm space-y-6">
    <div class="space-y-2 text-center">
      <h1 class="text-3xl font-bold">Register</h1>
      <p class="text-gray-500 dark:text-gray-400">Create an account to get started</p>
    </div>
    <div v-if="error" class="p-4 text-sm text-destructive bg-destructive/10 rounded">
      {{ error }}
    </div>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-2">
        <label class="block text-sm mb-2" for="email"> Email </label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
        />
      </div>
      <div class="space-y-2">
        <label class="block text-sm mb-2" for="password"> Password </label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-primary text-primary-foreground h-10 px-4 py-2 rounded-md"
        :disabled="authStore.loading"
      >
        {{ authStore.loading ? 'Loading...' : 'Register' }}
      </button>
    </form>
    <div class="text-center text-sm">
      Already have an account?
      <router-link to="/login" class="text-primary hover:underline"> Login </router-link>
    </div>
  </div>
</template>
