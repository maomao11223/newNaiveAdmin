<template>
  <div
    class="turntable"
    ref="turntable"
  >
    <div
      class="myTurntable"
      :style="{ transform: rotateAngle, transition: rotateTransition }"
    >
      <canvas
        id="canvas"
        ref="canvas"
      >
        当前浏览器版本过低，请使用其他浏览器尝试
      </canvas>
      <div class="prize-container">
        <div
          v-for="(item, index) in prizeData"
          class="item"
          :style="getRotateAngle(index)"
          :key="index"
        >
          <slot
            name="item"
            :item="item"
          ></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  //參考: https://github.com/LiaPig/vue-round-turntable/blob/master/src/App.vue
  export default {
    name: "RoundTurntable",
    props: {
      prizeData: {
        required: true,
        type: Array,
      },
      rotateCircle: {
        default: 6,
        type: Number,
      },
      turntableStyleOption: {
        type: Object,
        default: () => {
          return {
            // 背景色
            prizeBgColors: ["#AE3EFF", "#4D3FFF", "#FC262C", "#3A8BFF", "#EE7602", "#FE339F"],
            // 转盘的外边框颜色
            borderColor: "#199301",
          };
        },
      },
      duringTime: {
        type: Number,
        default: 4.5,
      },
    },
    data() {
      return {
        // 开始转动的角度
        startRotateDegree: 0,
        rotateAngle: 0,
        rotateTransition: "",
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      // 根据index计算每一格要旋转的角度的样式
      getRotateAngle(index) {
        const angle = (360 / this.prizeData.length) * index + 180 / this.prizeData.length;
        return {
          transform: `rotate(${angle}deg)`,
        };
      },
      // 初始化圆形转盘canvas
      init() {
        // 各种数据
        const data = this.turntableStyleOption;
        const prizeNum = this.prizeData.length;
        const { prizeBgColors, borderColor } = data;
        //如果沒有傳入背景顏色
        const defaultPrizeBgColors = [];
        if (!prizeBgColors) {
          for (let i = 0; i < prizeNum; i++) {
            const newColor = this.color16();
            console.log("🚀 ~ newColor:", newColor);
            defaultPrizeBgColors.push(newColor);
          }
        }
        console.log("🚀 ~ prizeBgColors:", defaultPrizeBgColors);
        // 开始绘画
        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext("2d");
        const canvasW = (this.$refs.canvas.width = this.$refs.turntable.clientWidth); // 画板的高度
        const canvasH = (this.$refs.canvas.height = this.$refs.turntable.clientHeight); // 画板的宽度
        // translate方法重新映射画布上的 (0,0) 位置
        ctx.translate(0, canvasH);
        // rotate方法旋转当前的绘图，因为文字适合当前扇形中心线垂直的！
        ctx.rotate((-90 * Math.PI) / 180);
        // 圆环的外圆的半径
        const outRadius = canvasW / 2;
        // 圆环的内圆的半径
        const innerRadius = 0;
        const baseAngle = (Math.PI * 2) / prizeNum; // 计算每个奖项所占角度数
        ctx.clearRect(0, 0, canvasW, canvasH); //去掉背景默认的黑色
        ctx.strokeStyle = borderColor; // 设置画图线的颜色
        for (let index = 0; index < prizeNum; index++) {
          const angle = index * baseAngle;
          ctx.fillStyle = prizeBgColors ? prizeBgColors[index] : defaultPrizeBgColors[index]; //设置每个扇形区域的颜色
          ctx.beginPath(); //开始绘制
          // 标准圆弧：arc(x,y,radius,startAngle,endAngle,anticlockwise)
          ctx.arc(canvasW * 0.5, canvasH * 0.5, outRadius, angle, angle + baseAngle, false);
          ctx.arc(canvasW * 0.5, canvasH * 0.5, innerRadius, angle + baseAngle, angle, true);
          ctx.stroke(); //开始链线
          ctx.fill(); //填充颜色
          ctx.save(); //保存当前环境的状态
        }
      },
      // 转动起来
      rotate(index) {
        // 运转时长
        const duringTime = this.duringTime;
        const rotateAngle =
          this.startRotateDegree +
          this.rotateCircle * 360 +
          360 -
          (180 / this.prizeData.length + (360 / this.prizeData.length) * index) -
          (this.startRotateDegree % 360);
        this.startRotateDegree = rotateAngle;
        this.rotateAngle = `rotate(${rotateAngle}deg)`;
        this.rotateTransition = `transform ${duringTime}s cubic-bezier(0.250, 0.460, 0.455, 0.995)`;
        setTimeout(() => {
          this.$emit("end-Rotation");
        }, duringTime * 1000 + 500);
      },

      //隨機產生顏色
      color16() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
        return color;
      },
    },
  };
</script>

<style scoped lang="scss">
  .turntable {
    /*background-color: red;*/
    position: absolute;
    left: 0;
    top: 0;
    text-align: center;
    transform: translateZ(0);

    .myTurntable {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }

    .prize-container {
      position: absolute;
      left: 25%;
      top: 0;
      width: 50%;
      height: 50%;

      .item {
        /*background: pink;*/
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        transform-origin: center bottom;
      }
    }
  }
</style>
