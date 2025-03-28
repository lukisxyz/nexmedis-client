<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const props = defineProps({
  profile: Object,
})
const emit = defineEmits(['cancel'])

const fullName = ref(props.profile?.full_name || '')
const phoneNumber = ref(props.profile?.phone_number || '')
const address = ref(props.profile?.address || '')
const error = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    emit('cancel')

    if (props.profile) {
      await authStore.updateProfile({
        full_name: fullName.value,
        phone_number: phoneNumber.value,
        address: address.value,
      })
    } else {
      await authStore.createProfile({
        full_name: fullName.value,
        phone_number: phoneNumber.value,
        address: address.value,
      })
    }

    await authStore.getProfile()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to save profile'
    console.error('Error:', error.value)
  } finally {
    loading.value = false
  }
}

// Watch for prop changes and update the form
watch(
  () => props.profile,
  (newProfile) => {
    fullName.value = newProfile?.full_name || ''
    phoneNumber.value = newProfile?.phone_number || ''
    address.value = newProfile?.address || ''
  },
)
</script>

<template>
  <div class="bg-card rounded-lg p-6 shadow">
    <h2 class="text-xl font-bold mb-4">{{ profile ? 'Edit Profile' : 'Create Your Profile' }}</h2>

    <div v-if="error" class="p-4 text-sm text-destructive bg-destructive/10 rounded">
      {{ error }}
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm mb-2" for="full_name">Full Name</label>
        <input
          id="full_name"
          v-model="fullName"
          required
          class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm mb-2" for="phone_number">Phone Number</label>
        <input
          id="phone_number"
          v-model="phoneNumber"
          required
          class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm mb-2" for="address">Address</label>
        <input
          id="address"
          v-model="address"
          required
          class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div class="flex gap-2">
        <button
          type="submit"
          class="w-full bg-primary text-primary-foreground h-10 px-4 py-2 rounded-md"
        >
          {{ loading ? 'Saving...' : 'Save' }}
        </button>
        <button
          type="button"
          @click="$emit('cancel')"
          class="w-full bg-muted text-foreground h-10 px-4 py-2 rounded-md"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
