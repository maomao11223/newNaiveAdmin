<template>
  <n-card
    :bordered="false"
    class="proCard"
  >
    <n-form
      :label-width="100"
      :model="formValue"
      :rules="rules"
      label-placement="left"
      ref="form1Ref"
      style="max-width: 500px; margin: 40px auto 0 80px"
    >
      <n-form-item
        label="OrderId"
        path="OrderId"
      >
        <n-input-number
          :show-button="false"
          v-model:value="formValue.OrderId"
          :disabled="true"
        />
      </n-form-item>
      <n-form-item label="StoreId">
        <n-input-number
          :show-button="false"
          :disabled="true"
          v-model:value="orderInfo.StoreId"
        />
      </n-form-item>
      <n-form-item
        label="UserName"
        path="UserName"
      >
        <n-input
          placeholder="UserName"
          v-model:value="formValue.UserName"
        />
      </n-form-item>
      <n-form-item
        label="MenuId"
        path="MenuId"
      >
        <n-select
          :options="menuDrop.options"
          v-model:value="formValue.MenuId"
          :on-update:value="
            (value) => {
              updateMenuId(value);
            }
          "
        />
      </n-form-item>
      <n-form-item label="容量">
        <n-select
          :options="sizeDrop.options"
          :value="formValue.Custom.OrderSize.SizeName"
          :on-update:value="(value) => calcTotal({ inValue: value, type: 'OrderSize' })"
        />
      </n-form-item>
      <n-form-item
        v-for="ic in selectedMenu.ItemCustoms"
        :label="ic.OptionName"
        :key="ic"
      >
        <n-radio-group
          v-model:value="selectedCustom[ic.OptionName]"
          @update:value="(value) => updateRadio({ inValue: value, type: ic.OptionName })"
        >
          <n-radio
            v-for="opt in ic.opts"
            :key="opt"
            :value="opt.value"
            >{{ opt.label }}</n-radio
          >
        </n-radio-group>
      </n-form-item>
      <n-form-item label="加料">
        <n-checkbox-group
          v-for="ic in selectedMenu.ItemAdds"
          :key="ic"
          v-model:value="selectedCustom.ItemAdds"
          @update:value="calcTotal({ type: 'ItemAdds' })"
        >
          <n-checkbox
            :value="ic.OptionItem"
            :label="`${ic.OptionItem} - NT$ ${ic.OptionPrice}`"
          />
        </n-checkbox-group>
      </n-form-item>
      <n-form-item
        label="SubTotal"
        path="SubTotal"
      >
        NT $ {{ formValue.SubTotal }}
      </n-form-item>
      <n-form-item
        label="IsPay"
        path="IsPay"
      >
        <n-checkbox
          placeholder="IsPay"
          v-model:checked="formValue.IsPay"
        />
      </n-form-item>
      <n-button
        type="primary"
        @click="formSubmit"
        :loading="submitBtn.isDisabled"
        :disabled="submitBtn.isDisabled"
        >送出訂單</n-button
      >
    </n-form>
  </n-card>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from "vue";
  import { findApi as findStoreApi } from "@/api/store/list";
  import { findApi as findMenuApi } from "@/api/menu/list";
  import { findApi as findOrderApi } from "@/api/order/list";
  import { findApi as findOrderDetailApi, updateApi, addApi } from "@/api/orderDetail/list";

  import { type FormRules } from "naive-ui";
  import { useRoute, useRouter } from "vue-router";

  onMounted(async () => {
    const routeOrderId = route.params.OrderId;
    const routeOrderDetailId = route.params.OrderDetailId;
    formValue.value.OrderId = routeOrderId;

    if (routeOrderId) {
      storeDrop.value.isDisabled = true;
      await findOrder(routeOrderId);

      await findMenu(orderInfo.value.StoreId);
    }
    updateMenuId(formValue.value.MenuId);
    if (routeOrderDetailId) {
      await findOrderDetail(routeOrderDetailId);
    } else {
      console.log(menuDrop.value.options);
      console.log(sizeDrop.value.options);
      formValue.value.MenuId = menuDrop.value.options[0].value;
      formValue.value.Custom.OrderSize = sizeDrop.value.options[0];
    }
    await findStore();

    // await findMenu(routeOrderId);
  });

  const route = useRoute();
  const router = useRouter();

  const submitBtn = ref({
    isDisabled: false,
  });
  const orderInfo = ref({
    Id: 0,
    StoreId: 0,
    OrderOwner: "",
    OrderDate: "",
    OrderAmount: 0,
    OrderStatus: "",
  });

  const formValue = ref({
    Id: 0,
    OrderId: "0",
    UserName: "",
    MenuId: 21,
    Custom: {
      OrderSize: {
        SizeName: "",
        SizePrice: 0,
      },
      OrderCustoms: [
        {
          OptionName: "",
          OptionItems: [],
        },
      ],
      OrderAdds: [
        {
          OptionItem: "",
          OptionPrice: 0,
        },
      ],
    },
    SubTotal: 0,
    IsPay: true,
  });

  const form = ref({
    Id: 0,
    OrderId: 0,
    UserName: "",
    MenuId: 21,

    OrderSize: {
      SizeName: "",
      SizePrice: 0,
    },
    OrderCustoms: [
      {
        OptionName: "",
        OptionItems: [],
      },
    ],
    OrderAdds: [
      {
        OptionItem: "",
        OptionPrice: 0,
      },
    ],

    SubTotal: 0,
    IsPay: false,
  });

  const rules: FormRules = {
    UserName: {
      required: true,
      trigger: ["blur", "input"],
      message: "必填",
    },
    MenuId: {
      type: "number",
      required: true,
      trigger: ["blur", "input"],
      message: "必填",
    },
    SubTotal: {
      type: "number",
      required: true,
      trigger: ["blur", "input"],
      message: "必填",
    },
  };

  const storeDrop = ref({
    isDisabled: false,
    options: [],
  });

  const menuDrop = ref({
    options: [],
  });

  const sizeDrop = ref({
    options: [],
  });

  //選中的菜單的相關細節資料
  const selectedMenu = ref<customs>({
    ItemSizes: [],
    ItemCustoms: [],
    ItemAdds: [],
  });

  //選中的客製化資料
  const selectedCustom = ref({ ItemAdds: [] });

  interface customs {
    ItemSizes: any[];
    ItemCustoms: any[];
    ItemAdds: any[];
  }

  const findStore = async () => {
    const res = await findStoreApi([]);

    storeDrop.value.options = res.map((store) => {
      return {
        value: store.Id,
        label: store.Name,
      };
    });
  };

  const findMenu = async (storeId) => {
    const res = await findMenuApi([
      {
        field: "storeId",
        value: `${storeId}`,
        operand: "=",
        logic: "AND",
      },
    ]);
    menuDrop.value.options = res.map((menu) => {
      return {
        ...menu,
        value: menu.Id,
        label: menu.ItemName,
      };
    });
  };

  const findOrderDetail = async (orderDetailId) => {
    const res = await findOrderDetailApi([
      {
        field: "Id",
        value: orderDetailId,
        operand: "=",
        logic: "AND",
      },
    ]);

    form.value.OrderSize.SizeName = res[0].Custom.OrderSize.SizeName;
    form.value.OrderSize.SizePrice = res[0].Custom.OrderSize.SizePrice;

    res[0].Custom.OrderCustoms.forEach((custom) => {
      selectedCustom.value[custom.OptionName] = custom.OptionItems[0];
    });

    let itemAdds = [];
    res[0].Custom.OrderAdds.forEach((item) => {
      itemAdds.push(item.OptionItem);
    });
    selectedCustom.value["ItemAdds"] = itemAdds;
    Object.keys(formValue.value).forEach((key) => {
      formValue.value[key] = res[0][key];
    });
  };
  const findOrder = async (orderId) => {
    const res = await findOrderApi([
      {
        field: "Id",
        value: orderId,
        operand: "=",
        logic: "AND",
      },
    ]);
    orderInfo.value = res[0];
  };

  //選擇新的MenuId時,更新客製內容
  const updateMenuId = (inMenuId: number) => {
    const targetMenu = menuDrop.value.options.find((menu) => {
      return menu.value == inMenuId;
    });

    targetMenu.ItemCustoms.forEach((ic) => {
      let opts = [];
      ic.OptionItems.forEach((option) => {
        opts.push({
          label: option,
          value: option,
        });
      });
      ic.opts = opts;
    });

    selectedMenu.value = targetMenu;

    sizeDrop.value.options = targetMenu.ItemSizes.map((size) => {
      return {
        ...size,
        label: `${size.SizeName} NT$ ${size.SizePrice}`,
        value: size.SizeName,
      };
    });
  };

  const calcTotal = ({ inValue = "0", type }) => {
    let total = 0;
    if (type === "OrderSize") {
      const targetSize = sizeDrop.value.options.find((size) => {
        return size.SizeName == inValue;
      });
      formValue.value.Custom.OrderSize.SizeName = targetSize.SizeName;
      formValue.value.Custom.OrderSize.SizePrice = targetSize.SizePrice;
    }

    total = total + formValue.value.Custom.OrderSize.SizePrice;

    formValue.value.Custom.OrderAdds.length = 0;

    selectedCustom.value.ItemAdds.forEach((item) => {
      const targetItem = selectedMenu.value.ItemAdds.find((itemAdd) => {
        return itemAdd.OptionItem == item;
      });

      if (targetItem) {
        formValue.value.Custom.OrderAdds.push({
          OptionItem: targetItem.OptionItem,
          OptionPrice: targetItem.OptionPrice,
        });
        total = total + targetItem?.OptionPrice;
      }
      selectedMenu.value.ItemAdds;
    });

    formValue.value.SubTotal = total;
  };

  const updateRadio = ({ inValue, type }) => {
    let targetItem = formValue.value.Custom.OrderCustoms.find((item) => {
      return item.OptionName === type;
    });

    if (targetItem) {
      targetItem.OptionItems = [inValue];
    } else {
      formValue.value.Custom.OrderCustoms.push({
        OptionName: type,
        OptionItems: [inValue],
      });
    }
  };

  const formSubmit = async () => {
    submitBtn.value.isDisabled = true;
    const res =
      formValue.value.Id === 0 ? await addApi(formValue.value) : await updateApi(formValue.value);
    console.log(res);
    if (res) {
      window["$message"].success("成功");
      router.push({ name: "orderDetail-list" });
    }
    submitBtn.value.isDisabled = false;
  };
</script>

<style lang="less" scoped></style>
