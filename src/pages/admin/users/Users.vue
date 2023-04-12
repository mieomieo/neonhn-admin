<template>
  <div class="users-table flex">
    <va-card class="flex mb-4">
      <va-card-content>
        <div class="table-wrapper">
          <table class="va-table va-table--striped va-table--hoverable">
            <thead>
              <tr>
                <th>{{ t('tables.headings.email') }}</th>
                <th>{{ t('tables.headings.name') }}</th>
                <th>{{ t('tables.headings.userCreatedDate') }}</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="user in computedUsers" :key="user.userId">
                <td>{{ user.email }}</td>
                <td>{{ user.displayName }}</td>
                <td>{{ user.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { getFirebaseUsers } from '../../../firebase'
  import { useI18n } from 'vue-i18n'
  import dayjs from 'dayjs'

  const users = ref([])
  const computedUsers = computed(() => {
    return Object.entries(users.value).map(([userId, user]) => {
      return {
        userId: userId,
        email: user.email,
        displayName: user.displayName,
        date: dayjs(user.date).format('DD/MM/YYYY'),
      }
    })
  })
  const { t } = useI18n()

  onMounted(async () => {
    users.value = await getFirebaseUsers()
    console.log('users', users.value)
  })
</script>

<style scoped>
  .users-table {
    .table-wrapper {
      overflow: auto;
    }

    .va-table {
      width: 100%;
    }
  }
</style>
