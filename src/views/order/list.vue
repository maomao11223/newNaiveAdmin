<template>
  <n-card
    :bordered="false"
    class="proCard"
  >
    <BasicForm
      @register="register"
      @submit="handleSubmit"
      @reset="handleReset"
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
  import { findApi, deleteApi } from "@/api/order/list";
  import { columns, ListData } from "./columns";
  import { PlusOutlined } from "@vicons/antd";
  import Modal from "@/components/business/order/modal.vue";
  import { useRouter } from "vue-router";
  import { timestampToDate } from "@/utils/dateUtil";
  onMounted(async () => {
    await findStore();
  });

  const tableData = ref<storeInfo[]>([]);

  const router = useRouter();

  const schemas: FormSchema[] = [
    {
      field: "OrderOwner",
      component: "NInput",
      label: "OrderOwner",
      componentProps: {
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: "OrderDate",
      component: "NDatePicker",
      label: "OrderDate",
      componentProps: {
        type: "date",
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
    OrderOwner: "",
    OrderDate: "",
    OrderStatus: "",
  });

  const actionColumn = reactive({
    width: 80,
    title: "操作",
    key: "action",
    fixed: "right",
    render(record) {
      return h(TableAction as any, {
        style: "button",
        actions: [
          {
            label: "加入",
            type: "primary",
            onClick: addGroup.bind(null, record),
            ifShow: () => {
              return true;
            },
            auth: ["basic_list"],
          },
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
    labelWidth: 100,
    schemas,
  });

  interface storeInfo {
    Id: string;
    Name: string;
    Type: string;
  }

  interface reqInfo {
    field: string;
    value: any;
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
          value: null,
          operand: "like",
          logic: "AND",
        };
        if (key === "OrderDate") {
          const timestamp = req[key];

          tempReq.value = timestampToDate(timestamp);
        } else {
          tempReq.value = req[key];
        }

        request.push(tempReq);
      });
    }

    // return;
    const res = await findApi(request);

    tableData.value.length = 0;

    res.forEach((store: storeInfo) => {
      tableData.value.push(store);
    });
  };

  function addTable() {
    showModal.value = true;
    formParams.Id = 0;
  }

  function handleEdit(record: Recordable) {
    console.log("🚀 ~ record:", record);
    Object.assign(formParams, record);
    console.log("🚀 ~ record:", formParams);
    showModal.value = true;
  }
  function addGroup(record: Recordable) {
    console.log("🚀 ~ record:", record);
    router.push({ name: "orderDetail-detail", params: { OrderId: record.Id } });
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
