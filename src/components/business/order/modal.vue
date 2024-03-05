<script setup lang="ts">
  import { toRefs, ref, watch, reactive } from "vue";
  import { type FormRules } from "naive-ui";
  import { addApi, updateApi } from "@/api/order/list";
  import { findApi } from "@/api/store/list";
  import { timestampToDate } from "@/utils/dateUtil";
  const props = defineProps({
    formParams: {
      type: Object,
      required: true,
    },
    showModal: {
      type: Boolean,
      default: false,
    },
  });

  const emits = defineEmits(["update:show-modal"]);

  const defaultFormValueRef = ref({
    Id: 0,
    OrderOwner: "",
    OrderDate: 0,
    OrderStatus: "",
  });

  const rules: FormRules = {
    OrderOwner: {
      required: true,
      trigger: ["blur", "input"],
      message: "必填",
    },
    OrderDate: {
      required: true,
      type: "date",
      trigger: ["blur", "input"],
      message: "必填",
    },
    OrderStatus: {
      required: true,
      trigger: ["blur", "input"],
      message: "必填",
    },
  };

  const modalFormParams = ref({
    Id: 0,
    OrderOwner: "",
    OrderDate: 0,
    OrderStatus: "",
    StoreId: 0,
  });

  const formBtnLoading = ref(false);

  const todayTimestamp = new Date().getTime();
  const defaultDate = ref(todayTimestamp);

  const formRef: any = ref(null);
  const storeOpts = ref([]);

  const resetForm = () => {
    formRef.value.restoreValidation();
    Object.assign(modalFormParams, defaultFormValueRef.value);
  };

  function confirmForm(e) {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors) => {
      if (errors) {
        console.log("🚀 ~ errors:", errors);
        window["$message"].error("請填寫完整訊息");
        formBtnLoading.value = false;
        return;
      }

      const req = {
        ...modalFormParams.value,
        OrderAmount: 0,

        OrderDate: `${timestampToDate(modalFormParams.value.OrderDate)}T00:00:00Z`,
      };
      console.log(req);

      modalFormParams.value.Id == 0 ? await addApi(req) : await updateApi(req);
      resetForm();
      window["$message"].success("成功");

      formBtnLoading.value = false;
      emits("update:show-modal", true);
    });
  }

  const cancelModal = (isShow) => {
    formBtnLoading.value = false;
    emits("update:show-modal");
  };

  const getStoreList = async () => {
    const res = await findApi([]);

    storeOpts.value = res.map((store) => {
      return {
        label: store.Name,
        value: store.Id,
      };
    });
  };

  watch(
    () => props.showModal,
    (newV) => {
      if (newV) {
        modalFormParams.value.Id = props.formParams.Id;
        if (props.formParams.Id == 0) {
          modalFormParams.value.OrderOwner = "";
          modalFormParams.value.OrderDate = new Date().getTime();
          modalFormParams.value.OrderStatus = "";
        } else {
          modalFormParams.value.OrderOwner = props.formParams.OrderOwner;
          modalFormParams.value.OrderDate = new Date(props.formParams.OrderDate).getTime();
          modalFormParams.value.OrderStatus = props.formParams.OrderStatus;
        }
        getStoreList();
      }
    }
  );
</script>
<template>
  <n-modal
    :show="showModal"
    :show-icon="false"
    preset="dialog"
    :title="props.formParams.Id == 0 ? '新建' : '編輯'"
    @negative-click="cancelModal"
  >
    <n-form
      ref="formRef"
      label-placement="left"
      :label-width="120"
      :rules="rules"
      :model="modalFormParams"
      class="py-4"
    >
      <n-form-item
        label="OrderOwner"
        path="OrderOwner"
      >
        <n-input v-model:value="modalFormParams.OrderOwner" />
      </n-form-item>
      <n-form-item
        label="OrderDate"
        path="OrderDate"
      >
        <n-date-picker
          :default-value="defaultDate"
          v-model:value="modalFormParams.OrderDate"
        />
      </n-form-item>
      <n-form-item
        label="StoreId"
        path="StoreId"
      >
        <n-select
          v-model:value="modalFormParams.StoreId"
          :options="storeOpts"
        />
      </n-form-item>
      <n-form-item
        label="OrderStatus"
        path="OrderStatus"
      >
        <n-input v-model:value="modalFormParams.OrderStatus" />
      </n-form-item>
    </n-form>

    <template #action>
      <n-space>
        <n-button @click="cancelModal">取消</n-button>
        <n-button
          type="info"
          :loading="formBtnLoading"
          @click="confirmForm"
          >确定</n-button
        >
      </n-space>
    </template>
  </n-modal>
</template>
<style scoped></style>
