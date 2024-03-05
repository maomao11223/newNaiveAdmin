<script setup lang="ts">
  import { toRefs, ref, h, watch } from "vue";
  import { type FormRules, NInput, NInputNumber, NSwitch, NSelect, NButton } from "naive-ui";
  import { addApi, updateApi } from "@/api/menu/list";

  import { AddCircleOutline } from "@vicons/ionicons5";

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

  const { showModal, formParams } = toRefs(props);

  const modalFormParams = ref({
    Id: 0,
    StoreId: "",
    ItemName: "",
    ItemSizes: [],
    ItemCustoms: [],
    ItemAdds: [],
  });

  watch(
    () => showModal.value,
    (newV) => {
      if (newV) {
        Object.assign(modalFormParams.value, formParams.value);
        console.log(modalFormParams.value);
      }
    }
  );

  const emits = defineEmits(["update:show-modal"]);

  const rules: FormRules = {
    ItemName: {
      required: true,
      trigger: ["blur", "input"],
      message: "必填",
    },
  };

  const ItemsSizeColumns = ref([
    {
      title: "SizeName",
      key: "SizeName",
      render(row, index) {
        return h(NInput, {
          value: row.SizeName,
          onUpdateValue(v) {
            console.log(row);
            row.SizeName = v;
          },
        });
      },
    },
    {
      title: "SizePrice",
      key: "SizePrice",
      render(row, index) {
        return h(NInputNumber, {
          value: row.SizePrice,
          onUpdateValue(v) {
            row.SizePrice = v;
          },
        });
      },
    },
    {
      title: "Required",
      key: "Required",
      render(row, index) {
        return h(NSwitch, {
          value: row.Required,
          onUpdateValue(v) {
            row.Required = v;
          },
        });
      },
    },
    {
      render(row, index) {
        return h(
          NButton,
          {
            type: "error",
            onClick(v) {
              console.log(row, index);
              modalFormParams.value.ItemSizes.splice(index, 1);
            },
          },
          () => "刪除"
        );
      },
    },
  ]);
  const ItemCustomsColumns = ref([
    {
      title: "OptionName",
      key: "OptionName",
      render(row, index) {
        return h(NInput, {
          value: row.OptionName,
          onUpdateValue(v) {
            console.log(row);
            row.OptionName = v;
          },
        });
      },
    },
    {
      title: "OptionItems",
      key: "OptionItems",
      render(row, index) {
        console.log("🚀 ~ v:", row.OptionItems);
        return h(NSelect, {
          multiple: true,
          filterable: true,
          tag: true,
          showArrow: false,
          show: false,
          maxTagCount: 2,
          value: row.OptionItems,
          onUpdateValue(v) {
            row.OptionItems = v;
          },
        });
      },
    },
    {
      title: "Required",
      key: "Required",
      render(row, index) {
        return h(NSwitch, {
          value: row.Required,
          onUpdateValue(v) {
            row.Required = v;
          },
        });
      },
    },
    {
      title: "Multi",
      key: "Multi",
      render(row, index) {
        return h(NSwitch, {
          value: row.Multi,
          onUpdateValue(v) {
            row.Multi = v;
          },
        });
      },
    },
    {
      render(row, index) {
        return h(
          NButton,
          {
            type: "error",
            onClick(v) {
              console.log(row, index);
              modalFormParams.value.ItemCustoms.splice(index, 1);
            },
          },
          () => "刪除"
        );
      },
    },
  ]);
  const ItemAddsColumns = ref([
    {
      title: "OptionItem",
      key: "OptionItem",
      render(row, index) {
        return h(NInput, {
          value: row.OptionItem,
          onUpdateValue(v) {
            console.log(row);
            row.OptionItem = v;
          },
        });
      },
    },
    {
      title: "OptionPrice",
      key: "OptionPrice",
      render(row, index) {
        console.log("🚀 ~ v:", row.OptionPrice);
        return h(NInputNumber, {
          multiple: true,
          filterable: true,
          tag: true,
          showArrow: false,
          show: false,
          maxTagCount: 2,
          value: row.OptionPrice,
          onUpdateValue(v) {
            row.OptionPrice = v;
          },
        });
      },
    },
    {
      render(row, index) {
        return h(
          NButton,
          {
            type: "error",
            onClick(v) {
              console.log(row, index);
              modalFormParams.value.ItemAdds.splice(index, 1);
            },
          },
          () => "刪除"
        );
      },
    },
  ]);

  const formBtnLoading = ref(false);

  const formRef: any = ref(null);

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

      window["$message"].success("成功");

      formBtnLoading.value = false;
      emits("update:show-modal", true);
    });
  }

  const cancelModal = () => {
    console.log("formRef", formRef);
    formBtnLoading.value = false;
    emits("update:show-modal");
  };

  const addRow = (type: string) => {
    const addObj = {
      ItemSizes: {
        SizeName: "",
        SizePrice: 0,
        Required: true,
      },
      ItemCustoms: {
        OptionName: "",
        OptionItems: [],
        Required: false,
        Multi: false,
      },
      ItemAdds: {
        OptionItem: "",
        OptionPrice: 0,
      },
    };
    modalFormParams.value[type].unshift(addObj[type]);
  };
</script>
<template>
  <n-modal
    style="width: 80%"
    :show="showModal"
    :on-update:show="cancelModal"
    :show-icon="false"
    preset="dialog"
    :title="modalFormParams.Id == 0 ? '新建' : '編輯'"
    @negative-click="cancelModal"
  >
    <n-form
      :model="modalFormParams"
      :rules="rules"
      ref="formRef"
      label-placement="top"
      :label-width="100"
      class="py-4"
    >
      <n-form-item
        label="ItemName"
        path="ItemName"
      >
        <n-input v-model:value="modalFormParams.ItemName" />
      </n-form-item>
      <n-form-item
        label="ItemSizes"
        path="ItemSizes"
      >
        <template #label>
          <div class="flex items-center">
            <div class="mr-4">ItemSizes</div>
            <n-button
              text
              style="font-size: 24px"
              @click="addRow('ItemSizes')"
              ><n-icon> <AddCircleOutline /> </n-icon
            ></n-button>
          </div>
        </template>
        <n-data-table
          :max-height="100"
          :columns="ItemsSizeColumns"
          :data="modalFormParams.ItemSizes"
        />
      </n-form-item>
      <n-form-item
        label="ItemCustoms"
        path="ItemCustoms"
      >
        <template #label>
          <div class="flex items-center">
            <div class="mr-4">ItemCustoms</div>
            <n-button
              text
              style="font-size: 24px"
              @click="addRow('ItemCustoms')"
              ><n-icon> <AddCircleOutline /> </n-icon
            ></n-button>
          </div>
        </template>
        <n-data-table
          :max-height="100"
          :columns="ItemCustomsColumns"
          :data="modalFormParams.ItemCustoms"
        />
      </n-form-item>
      <n-form-item
        label="ItemAdds"
        path="ItemAdds"
      >
        <template #label>
          <div class="flex items-center">
            <div class="mr-4">ItemAdds</div>
            <n-button
              text
              style="font-size: 24px"
              @click="addRow('ItemAdds')"
              ><n-icon> <AddCircleOutline /> </n-icon
            ></n-button>
          </div>
        </template>
        <n-data-table
          :max-height="100"
          :columns="ItemAddsColumns"
          :data="modalFormParams.ItemAdds"
        />
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
