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
    <section>
      <div>
        <n-form
          :label-width="90"
          label-placement="left"
          ref="formRef"
          class="py-8"
        >
          <n-form-item label="店名">
            <n-select
              placeholder="按Enter確認"
              filterable
              multiple
              tag
              :options="storeDrop"
              v-model:value="selectStores"
            />
          </n-form-item>
          <div style="margin-left: 80px">
            <n-space>
              <n-button
                type="primary"
                @click="formSubmit"
                :loading="btnSubmit.isLoading"
                :disabled="selectStores.length == 0 || btnSubmit.isDisabled"
                >產生輪盤</n-button
              >
              <n-button
                @click="resetForm"
                type="danger"
                >清空</n-button
              >
            </n-space>
          </div>
        </n-form>
      </div>

      <div
        id="app"
        style="height: 600px"
        v-if="turnTable.isShow"
      >
        <Turntable
          ref="roundTurntable"
          :prizeData="prizeData"
          :rotateCircle="rotateCircle"
          :duringTime="duringTime"
          :turntableStyleOption="turntableStyleOption"
          @end-Rotation="endRotation"
          class="turntable"
        >
          <template #item="scope">
            <div class="turntable-name">{{ scope.item.Name }}</div>
          </template>
        </Turntable>
        <div
          @click="startRotation"
          class="pointer"
        ></div>
      </div>
    </section>
  </n-card>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from "vue";
  import Turntable from "@/components/Game/turntable/index.vue";
  import { findApi } from "@/api/store/list";

  //店名drop
  const storeDrop = ref([]);
  //選中的店家
  const selectStores = ref([]);

  const turnTable = ref({ isShow: false });

  const btnSubmit = ref({
    isLoading: false,
    isDisabled: false,
  });

  // 转盘上的奖品数据
  const prizeData = ref([
    {
      id: 1,
      Name: "2000元京东券",
    },
  ]);
  // 转动的圈数
  const rotateCircle = ref(6);
  // 转动需要持续的时间（s）
  const duringTime = ref(4.5);
  // 转盘样式的选项
  const turntableStyleOption = ref({
    // 背景色
    // prizeBgColors: ["#AE3EFF"],
    // 转盘的外边框颜色
    borderColor: "#199301",
  });
  // 中奖的奖品的index
  const prizeIndex = ref(-1);
  // 用来锁定转盘，避免同时多次点击转动
  const isLocking = ref(false);

  const roundTurntable = ref();

  const startRotation = () => {
    // 如果还不可以转动
    if (!canBeRotated()) {
      return false;
    }
    // 开始转动
    // 先上锁
    isLocking.value = true;
    // 设置在哪里停下，应该与后台交互，这里随机抽取0~5
    const index = Math.floor(Math.random() * prizeData.value.length);

    prizeIndex.value = index;
    // 告诉子组件，开始转动了
    roundTurntable.value.rotate(index);
  };

  const endRotation = () => {
    // 解锁
    isLocking.value = false;
  };

  const canBeRotated = () => {
    if (isLocking.value) {
      return false;
    }
    return true;
  };

  const findStore = async () => {
    const res = await findApi([]);
    console.log(res);
    storeDrop.value = res.map((store) => {
      return {
        ...store,
        label: store.Name,
        value: store.Name,
      };
    });
  };

  const formSubmit = () => {
    turnTable.value.isShow = false;
    btnSubmit.value.isLoading = true;
    btnSubmit.value.isDisabled = true;
    prizeData.value = selectStores.value.map((store, index) => {
      return {
        id: index,
        Name: store,
      };
    });
    setTimeout(() => {
      btnSubmit.value.isDisabled = false;
      btnSubmit.value.isLoading = false;
      turnTable.value.isShow = true;
    }, 1000);
  };

  const resetForm = () => {
    selectStores.value.length = 0;
    turnTable.value.isShow = false;
  };

  onMounted(async () => {
    await findStore();
  });
</script>

<style lang="scss">
  #app {
    .turntable {
      position: absolute;
      left: calc(50% - 200px);
      top: calc(50% - 200px);
      width: 400px;
      height: 400px;
    }

    .turntable-name {
      /*background: pink;*/
      position: absolute;
      left: 10px;
      top: 20px;
      width: calc(100% - 20px);
      font-size: 26px;
      text-align: center;
      color: #fff;
    }

    .turntable-img {
      position: absolute;
      /*要居中就要50% - 宽度 / 2*/
      left: calc(50% - 80px / 2);
      top: 60px;
      width: 80px;
      height: 80px;

      img {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }

    .pointer {
      position: absolute;
      left: calc(50% - 46px);
      top: calc(50% - 50px);
      width: 100px;
      height: 100px;
      background-image: url("../../assets/images/pointer.png");
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
</style>
