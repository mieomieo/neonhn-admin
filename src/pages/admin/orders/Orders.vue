<template>
  <div class="orders-table flex">
    <va-card class="flex mb-4">
      <va-card-content>
        <div class="table-wrapper">
          <table class="va-table va-table--striped va-table--hoverable">
            <thead>
              <tr>
                <th>{{ t('No.') }}</th>
                <th>{{ t('tables.headings.email') }}</th>
                <th>{{ t('Order ID') }}</th>
                <th>{{ t('tables.headings.orderDate') }}</th>
                <th>{{ t('Design') }}</th>
                <th>{{ t('tables.headings.orderDesign') }}</th>
                <th>{{ t('tables.headings.orderOptions') }}</th>
                <th>{{ t('Informations') }}</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(order, index) in orders" :key="order.orderId">
                <td>{{ ++index }}</td>
                <td>{{ order.userEmail }}</td>
                <td>{{ order.orderId }}</td>
                <td>{{ order.date }}</td>
                <td>
                  <a class="va-text-primary download-btn" :href="order.encodedDesign" target="_blank"><b>link</b> </a>
                </td>
                <td>
                  <b class="va-text-primary download-btn" @click="downloadSvg(order.fileSVG)"> Download file</b>
                </td>
                <td>{{ order.options }}</td>
                <td>{{ order.informations }}</td>
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
  import { getFirebaseOrders, db } from '../../../firebase'
  import dayjs from 'dayjs'
  import { useI18n } from 'vue-i18n'
  import { saveAs } from 'file-saver'
  import { onValue, ref as firebaseRef } from 'firebase/database'

  const { t } = useI18n()
  const ordersFromApi = ref([])

  const orders = computed(() => {
    return Object.entries(ordersFromApi.value)
      .map(([userId, orders]) => {
        return Object.entries(orders).map(([orderId, order]) => {
          const dataEncode = order.encodedDesign
          // const host = window.location.origin
          const host = 'https://neon-hn.netlify.app/'
          const path = 'create-your-own'
          const designUrl = host + path + '?data=' + dataEncode
          return {
            orderId,
            date: dayjs(order.date).format('DD/MM/YYYY'),
            userEmail: order.email,
            encodedDesign: designUrl,
            fileSVG: order.fileSVG,
            options: order.options,
            informations: order.info,
          }
        })
      })
      .flat()
      .slice()
      .reverse()
  })

  async function downloadSvg(link: string) {
    if (!link) {
      throw Error('Missing link download')
    }
    const fileName = getFileNameFromURL(link)
    const res = await fetch(link)
    saveAs(await res.blob(), fileName, { type: 'image/svg+xml' })
  }

  function getFileNameFromURL(url: string) {
    // Extract the substring after the last "/" character
    const filenameWithParams = url.substring(url.lastIndexOf('/') + 1)

    // Extract the filename from the substring before the "?" character
    const filename = filenameWithParams.substring(0, filenameWithParams.indexOf('?'))

    // Decode the filename from URL format
    return decodeURIComponent(filename).replace('orders/', '')
  }

  onMounted(async () => {
    const ordersRef = firebaseRef(db, 'orders')
    onValue(ordersRef, async (snapshow) => {
      ordersFromApi.value = await getFirebaseOrders()
    })
    console.log('ordersFromApi', ordersFromApi.value)
  })
</script>

<style scoped>
  .download-btn {
    cursor: pointer;
  }
  .orders-table {
    .table-wrapper {
      overflow: auto;
    }

    .va-table {
      width: 100%;
    }
  }
</style>
