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
    <div class="mb-5">
      <n-button
        type="success"
        @click="showUploadModal = true"
        >上傳<n-icon class="ml-2"><CloudUploadOutline /></n-icon
      ></n-button>
      <n-button
        type="primary"
        class="ml-3"
        @click="downLoadFileApi"
      >
        下載<n-icon class="ml-2"><CloudDownloadOutline /></n-icon>
      </n-button>
      <a
        v-show="false"
        ref="downloadRef"
        :href="downloadFile"
        download="菜單"
      >
      </a>
    </div>
    <BasicTable
      :columns="columns"
      :dataSource="tableData"
      :row-key="(row: ListData) => row.Id"
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
  <UploadModal
    :showModal="showUploadModal"
    @update:show-modal="showUploadModal = false"
  />
</template>

<script lang="ts" setup>
  import { h, reactive, ref, onMounted } from "vue";
  import { BasicTable, TableAction } from "@/components/Table";
  import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
  import { findApi, deleteApi, downloadApi } from "@/api/menu/list";
  import { columns, ListData } from "./columns";
  import { PlusOutlined } from "@vicons/antd";
  import Modal from "@/components/business/menu/modal.vue";
  import UploadModal from "@/components/business/menu/uploadModal.vue";

  import { CloudUploadOutline, CloudDownloadOutline } from "@vicons/ionicons5";

  onMounted(async () => {
    await findStore();
  });

  const tableData = ref<menuInfo[]>([]);

  const schemas: FormSchema[] = [
    {
      field: "storeId",
      component: "NInput",
      label: "storeId",
    },
  ];

  const actionRef = ref();

  const downloadFile = ref("");
  const downloadRef = ref(null);

  const showModal = ref(false);
  const showUploadModal = ref(false);
  const formParams = reactive({
    Id: 0,
    StoreId: "",
    ItemName: "",
    ItemSizes: [],
    ItemCustoms: [],
    ItemAdds: [],
  });

  const actionColumn = reactive({
    width: 200,
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

  interface menuInfo {
    Id: number;
    StoreId: number;
    ItemName: string;
    ItemSizes: Array;
    ItemCustoms: Array;
    ItemAdds: Array;
  }

  interface reqInfo {
    field: string;
    value: string;
    operand: string;
    logic: string;
  }

  const search = ref<reqInfo[]>([]);

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
    search.value = request;
    const res = await findApi(request);

    tableData.value.length = 0;

    res.forEach((store: menuInfo) => {
      tableData.value.push(store);
    });
  };

  function addTable() {
    formParams.Id = 0;
    formParams.StoreId = "";
    formParams.ItemName = "";
    formParams.ItemSizes = [];
    formParams.ItemCustoms = [];
    formParams.ItemAdds = [];
    showModal.value = true;
  }

  function handleEdit(record: Recordable) {
    showModal.value = true;
    Object.assign(formParams, record);
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

  const downLoadFileApi = async () => {
    const res = await downloadApi(search.value);
    console.log(res);

    const urlBlob = window.URL.createObjectURL(res);
    downloadFile.value = urlBlob;
    console.log(downloadRef.value);
    setTimeout(() => {
      downloadRef.value?.click();
    }, 200);
  };
</script>

<style lang="less" scoped></style>
