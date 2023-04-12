<template>
  <form @submit.prevent="onsubmit">
    <va-input
      v-model="email"
      class="mb-3"
      type="email"
      :label="t('auth.email')"
      :error="!!emailErrors.length"
      :error-messages="emailErrors"
    />

    <va-input
      v-model="password"
      class="mb-3"
      type="password"
      :label="t('auth.password')"
      :error="!!passwordErrors.length"
      :error-messages="passwordErrors"
    />
    <p v-if="firebaseError" class="va-text-danger">
      {{ firebaseError }}
    </p>
    <div class="d-flex justify-center mt-3">
      <va-button class="my-0" @click="onsubmit">{{ t('auth.login') }}</va-button>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { signIn } from '../../../firebase'
  import { useGlobalStore } from '../../../stores/global-store'
  const { t } = useI18n()

  const email = ref('')
  const password = ref('')
  const emailErrors = ref<string[]>([])
  const passwordErrors = ref<string[]>([])
  const firebaseError = ref('')
  const router = useRouter()
  const store = useGlobalStore()

  const formReady = computed(() => !emailErrors.value.length && !passwordErrors.value.length)

  async function onsubmit() {
    if (!formReady.value) return

    emailErrors.value = email.value ? [] : ['Email is required']
    passwordErrors.value = password.value ? [] : ['Password is required']
    if (emailErrors.value.length || passwordErrors.value.length) return
    try {
      const { user } = await signIn(email.value, password.value)
      if (user && user.email) {
        localStorage.setItem('UID', user.uid)
        localStorage.setItem('email', user.email)
        store.changeUserName(user.email)
        await router.push({ name: 'dashboard' })
      }
    } catch (e: any) {
      firebaseError.value = e?.message
      console.log(e)
    }
  }
</script>
