<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <nav class="border-b">
      <div class="w-full max-w-screen-md mx-auto px-4">
        <div class="flex h-16 items-center justify-between">
          <router-link to="/" class="text-xl font-bold"> Test Frontend </router-link>

          <div class="flex items-center gap-4">
            <template v-if="!authStore.isAuthenticated">
              <router-link
                to="/login"
                class="text-sm font-medium transition-colors hover:text-primary"
              >
                Login
              </router-link>
              <router-link
                to="/register"
                class="text-sm font-medium transition-colors hover:text-primary"
              >
                Register
              </router-link>
            </template>
            <template v-else>
              <router-link
                to="/profile"
                class="text-sm font-medium transition-colors hover:text-primary"
              >
                Profile
              </router-link>
              <button
                @click="handleLogout"
                class="text-sm font-medium text-destructive transition-colors hover:text-destructive/80"
              >
                Logout
              </button>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="w-full max-w-screen-md mx-auto px-4 py-8">
      <router-view />
    </main>
  </div>
</template>
