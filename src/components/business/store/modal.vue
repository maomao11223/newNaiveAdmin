<script setup lang="ts">
  import { ref, watch } from "vue";
  import { type FormRules } from "naive-ui";
  import { addApi, updateApi } from "@/api/store/list";

  const props = defineProps({
    formParams: {
      required: true,
      type: Object,
    },
    showModal: {
      type: Boolean,
      default: false,
    },
  });

  const emits = defineEmits(["update:show-modal"]);

  const defaultFormValueRef = ref({
    Id: 0,
    Name: "",
    Type: "",
  });

  const rules: FormRules = {
    Name: {
      required: true,
      trigger: ["blur", "input"],
      message: "必填",
    },
    Type: {
      required: true,
      trigger: ["blur", "input"],
      message: "必填",
    },
  };

  const modalFormParams = ref({
    Id: 0,
    Name: "",
    Type: "",
  });

  const formBtnLoading = ref(false);

  const formRef: any = ref(null);

  const resetForm = () => {
    console.log("🚀 ~  formRef.value:", formRef.value);
    formRef.value.restoreValidation();
    Object.assign(modalFormParams.value, defaultFormValueRef.value);
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

      modalFormParams.value.Id == 0
        ? await addApi(modalFormParams.value)
        : await updateApi(modalFormParams.value);
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

  const setModalFormParams = () => {
    if (modalFormParams.value.Id == 0) {
      Object.assign(modalFormParams.value, defaultFormValueRef.value);
    } else {
      Object.assign(modalFormParams.value, props.formParams);
    }
  };

  watch(
    () => props.showModal,
    (newV) => {
      if (newV) {
        Object.assign(modalFormParams.value, props.formParams);
      }
    }
  );
</script>
<template>
  <n-modal
    :show="showModal"
    :on-after-enter="setModalFormParams"
    :show-icon="false"
    preset="dialog"
    :title="props.formParams.Id == 0 ? '新建' : '編輯'"
    @negative-click="cancelModal"
  >
    <n-form
      :model="modalFormParams"
      :rules="rules"
      ref="formRef"
      label-placement="left"
      :label-width="80"
      class="py-4"
    >
      <n-form-item
        label="Name"
        path="Name"
      >
        <n-input v-model:value="modalFormParams.Name" />
      </n-form-item>
      <n-form-item
        label="Type"
        path="Type"
      >
        <n-input v-model:value="modalFormParams.Type" />
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
