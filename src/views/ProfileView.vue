<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ProfileForm from '../components/ProfileForm.vue'

const authStore = useAuthStore()
const editing = ref(false)

onMounted(async () => {
  await authStore.getProfile()
})

const toggleEdit = () => {
  console.log(editing.value)
  editing.value = !editing.value
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Profile</h1>

    <div v-if="authStore.error" class="mb-4 p-4 text-sm text-destructive bg-destructive/10 rounded">
      {{ authStore.error }}
    </div>

    <div v-if="authStore.loading" class="text-center py-8">Loading...</div>

    <div v-else-if="authStore.user">
      <div v-if="!editing" class="bg-card rounded-lg p-6 shadow">
        <div class="space-y-4">
          <div>
            <h2 class="text-sm font-medium text-muted-foreground">ID</h2>
            <p class="text-lg">{{ authStore.user.id }}</p>
          </div>
          <div>
            <h2 class="text-sm font-medium text-muted-foreground">Full Name</h2>
            <p class="text-lg">{{ authStore.user.full_name }}</p>
          </div>
          <div>
            <h2 class="text-sm font-medium text-muted-foreground">Email</h2>
            <p class="text-lg">{{ authStore.user.email }}</p>
          </div>
          <div>
            <h2 class="text-sm font-medium text-muted-foreground">Phone Number</h2>
            <p class="text-lg">{{ authStore.user.phone_number }}</p>
          </div>
          <div>
            <h2 class="text-sm font-medium text-muted-foreground">Address</h2>
            <p class="text-lg">{{ authStore.user.address }}</p>
          </div>
        </div>
        <button
          @click="toggleEdit"
          class="mt-4 w-full bg-primary text-primary-foreground h-10 px-4 py-2 rounded-md"
        >
          Edit Profile
        </button>
      </div>

      <!-- Kirim data `authStore.user` ke ProfileForm saat edit -->
      <ProfileForm v-else :profile="authStore.user" @cancel="toggleEdit" />
    </div>

    <ProfileForm v-else />
  </div>
</template>
