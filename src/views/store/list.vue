<template>
  <n-card
    :bordered="false"
    class="proCard"
  >
    <BasicForm
      @register="register"
      @submit="handleSubmit"
      @reset="handleReset"
      :showAdvancedButton="false"
    >
      <template #statusSlot="{ model, field }">
        <n-input v-model:value="model[field]" />
      </template>
    </BasicForm>

    <BasicTable
      :columns="columns"
      :dataSource="tableData"
      :row-key="(row: ListData) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="1090"
      :pagination="false"
    >
      <template #tableTitle>
        <n-button
          type="primary"
          @click="addTable"
        >
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新建
        </n-button>
      </template>
    </BasicTable>
  </n-card>
  <Modal
    :showModal="showModal"
    :formParams="formParams"
    @update:show-modal="
      (inShowModal) => {
        showModal = false;
        if (inShowModal) {
          findStore();
        }
      }
    "
  />
</template>

<script lang="ts" setup>
  import { h, reactive, ref, onMounted } from "vue";
  import { BasicTable, TableAction } from "@/components/Table";
  import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
  import { findApi, deleteApi } from "@/api/store/list";
  import { columns, ListData } from "./columns";
  import { PlusOutlined } from "@vicons/antd";
  import Modal from "@/components/business/store/modal.vue";

  onMounted(async () => {
    await findStore();
  });

  const tableData = ref<storeInfo[]>([]);

  const schemas: FormSchema[] = [
    {
      field: "Name",
      component: "NInput",
      label: "Name",
      componentProps: {
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: "Type",
      component: "NInput",
      label: "Type",
      componentProps: {
        showButton: false,
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  const actionRef = ref();

  const showModal = ref(false);
  const formParams = reactive({
    Id: 0,
    Type: "",
    Name: "",
  });

  const actionColumn = reactive({
    width: 50,
    title: "操作",
    key: "action",
    fixed: "right",
    render(record) {
      return h(TableAction as any, {
        style: "button",
        actions: [
          {
            label: "刪除",
            type: "error",
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: ["basic_list"],
          },
          {
            label: "編輯",
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true;
            },
            auth: ["basic_list"],
          },
        ],
      });
    },
  });

  const [register] = useForm({
    gridProps: { cols: "1 s:1 m:2 l:3 xl:4 2xl:4" },
    labelWidth: 80,
    schemas,
  });

  interface storeInfo {
    Id: string;
    Name: string;
    Type: string;
  }

  interface reqInfo {
    field: string;
    value: string;
    operand: string;
    logic: string;
  }

  const findStore = async (req?) => {
    // console.log("🚀 ~ req:", req);
    let request: Array<reqInfo> = [];
    if (req) {
      Object.keys(req).forEach((key) => {
        const tempReq: reqInfo = {
          field: key,
          value: req[key],
          operand: "like",
          logic: "AND",
        };
        request.push(tempReq);
      });
    }
    const res = await findApi(request);

    tableData.value.length = 0;

    res.forEach((store: storeInfo) => {
      tableData.value.push(store);
    });
  };

  function addTable() {
    formParams.Id = 0;
    showModal.value = true;
  }

  function handleEdit(record: Recordable) {
    showModal.value = true;
    console.log("🚀 ~ formParams:", formParams);
    Object.assign(formParams, record);
    console.log("🚀 ~ formParams:", formParams);
  }

  function handleDelete(record: Recordable) {
    window.$dialog.warning({
      title: "警告",
      content: "確定要刪除?",
      positiveText: "确定",
      negativeText: "不确定",
      onPositiveClick: async () => {
        // console.log('🚀 ~ value:', value);
        const res = await deleteApi(record);
        console.log("🚀 ~ res:", res.Message);
        window.$message.success(res.Message);
        findStore();
      },
    });
  }

  function handleSubmit(values: Recordable) {
    // console.log(values);
    findStore(values);
  }

  function handleReset(values: Recordable) {
    console.log(values);
    findStore(values);
  }
</script>

<style lang="less" scoped></style>
