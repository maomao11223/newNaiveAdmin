<template>
  <n-card
    :bordered="false"
    class="proCard"
  >
    歡迎進入點餐系統
  </n-card>
  <n-card
    :bordered="false"
    class="proCard mt-4"
  >
    不知道吃甚麼嗎? 輪盤轉起來
    <section class="flex">
      <div class="w-50">
        <n-form
          :label-width="90"
          label-placement="left"
          ref="formRef"
          class="py-8"
        >
          <n-form-item label="店名">
            <n-input
              v-model:value="list"
              placeholder="輸入名單"
            />
          </n-form-item>
          <div style="margin-left: 80px">
            <n-space>
              <n-button
                type="primary"
                @click="formSubmit"
                >提交预约</n-button
              >
              <n-button
                @click="resetForm"
                type="danger"
                >清空</n-button
              >
            </n-space>
          </div>
        </n-form></div
      >
      <div class="w-50"> </div>
    </section>
  </n-card>
</template>

<script lang="ts" setup>
  import { ref } from "vue";

  const list = ref([]);
</script>

<style lang="less" scoped></style>
