<template>
  <CommonPage>
    <template #action>
      <n-button v-permission="'AddUser'" type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        新增
      </n-button>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :is-pagination="false"
      :get-data="findStoreList"
    >
      <MeQueryItem label="名稱" :label-width="50">
        <n-input v-model:value="queryItems.username" type="text" placeholder="請輸入" clearable />
      </MeQueryItem>

      <MeQueryItem label="分類" :label-width="50">
        <n-select
          v-model:value="queryItems.enable"
          clearable
          :options="[{ label: '手搖', value: 1 }]"
        />
      </MeQueryItem>
    </MeCrud>
  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NSwitch, NTag } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem, MeModal } from '@/components'
import { useCrud } from '@/composables'
import v1 from '@/api/index'

defineOptions({ name: 'StoreList' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  // findStoreList()
  $table.value?.handleSearch()
})

const genders = [
  { label: '男', value: 1 },
  { label: '女', value: 2 },
]
const roles = ref([])

const columns = [
  {
    title: 'Id',
    key: 'Id',
    width: 80,
  },
  { title: '名稱', key: 'Name', width: 150, ellipsis: { tooltip: true } },
  {
    title: '分類',
    key: 'Type',
    width: 200,
    ellipsis: { tooltip: true },
  },

  {
    title: '状态',
    key: 'enable',
    width: 120,
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          value: row.enable,
          loading: !!row.enableLoading,
        },
        {
          checked: () => '启用',
          unchecked: () => '停用',
        }
      ),
  },
  {
    title: '操作',
    key: 'actions',
    width: 80,
    align: 'right',
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            secondary: true,
          },
          {
            default: () => '編輯',
            icon: () => h('i', { class: 'i-carbon:user-role text-14' }),
          }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
          },
          {
            default: () => '删除',
            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
          }
        ),
      ]
    },
  },
]

const findStoreList = async () => {
  console.log('queryItems', queryItems.value)
  const res = await v1.storeApi.findStore([])
  console.log(res)
  return res
}
</script>
