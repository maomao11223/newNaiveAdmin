<script setup lang="ts">
  import { toRefs, ref, watch } from "vue";
  import { type FormRules, UploadFileInfo } from "naive-ui";
  import { uploadApi } from "@/api/menu/list";

  const props = defineProps({
    showModal: {
      type: Boolean,
      default: false,
    },
  });

  const emits = defineEmits(["update:show-modal"]);

  const defaultFormValueRef = ref({
    storeId: 0,
    file: new FormData(),
  });

  const rules: FormRules = {
    storeId: {
      required: true,
      trigger: ["blur", "input"],
      message: "必填",
      type: "number",
    },
    fileLength: {
      required: true,
      trigger: ["blur", "input"],
      message: "必填",
      type: "number",
    },
  };

  const { showModal } = toRefs(props);

  const modalFormParams = ref({
    storeId: 0,
    fileLength: 0,
    file: new FormData(),
  });

  const formBtnLoading = ref(false);

  const formRef: any = ref(null);

  const resetForm = () => {
    console.log("🚀 ~  formRef.value:", formRef.value);
    formRef.value.restoreValidation();
    Object.assign(modalFormParams.value, defaultFormValueRef.value);
  };

  // const handleChange = (evt) => {

  //   console.log("🚀 ~ options:", evt.target.files);

  //   const formData = new FormData();

  //   formData.append("file", evt.target.files[0]);

  //   modalFormParams.value.file = formData;
  //   modalFormParams.value.fileLength = evt.target.files.length;
  // };
  const handleChange = (options: { fileList: UploadFileInfo[] }) => {
    let formData = new FormData();

    formData.append("file", options.fileList[0]);

    // modalFormParams.value.file = formData;

    ////////////////
    modalFormParams.value.file = options.fileList[0];

    modalFormParams.value.fileLength = options.fileList.length;
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

      await uploadApi({
        storeId: modalFormParams.value.storeId,
        params: {
          file: modalFormParams.value.file.file,
          filename: modalFormParams.value.file.name,
        },
      });
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
    Object.assign(modalFormParams.value, defaultFormValueRef.value);
  };
</script>
<template>
  <n-modal
    :show="showModal"
    :on-after-enter="setModalFormParams"
    :show-icon="false"
    preset="dialog"
    title="上傳"
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
        label="storeId"
        path="storeId"
      >
        <n-input-number
          :min="0"
          v-model:value="modalFormParams.storeId"
        />
      </n-form-item>
      <!-- <n-form-item
        label="file"
        path="fileLength"
      >
        <input
          type="file"
          accept=".csv"
          @change="handleChange"
        />
      </n-form-item> -->
      <n-form-item
        label="file"
        path="fileLength"
      >
        <n-upload
          ref="upload"
          action=""
          accept=".csv"
          :max="1"
          :default-upload="false"
          @change="handleChange"
        >
          <n-button>选择文件</n-button>
        </n-upload>
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
