<template>
  <dropdown trigger="click" transfer placement="bottom-start">
    <DatePicker
      transfer
      confirm
      :open="open"
      :value="value"
      :options="options"
      :type="timeType"
      @on-change="handleChange"
      @on-clear="handleClear"
      @on-ok="handleOk">
      <a href="javascript:void(0)" @click="handleClick">
        {{ title }}
        <Icon type="ios-calendar-outline"></Icon>
      </a>
    </DatePicker>
  </dropdown>
</template>

<script>
  export default {
    name: "dateFilter",
    props: {
      title: String,
      fn: Function,
      timeType: {
        type: String,
        validator: value => {
          return ["year", "month", "date", "datetime"].indexOf(value) !== -1;
        },
        default: "date"
      }
    },
    data () {
      return {
        open: false,
        value: "",
        flag: "start",
        startValue: "",
        endValue: "",
        options: {}
      }
    },
    created: function () {
      var that = this;
      this.options = {
        disabledDate (date) {
          var today = new Date();
          today.setHours(0, 0, 0, 0);
          let flag = false;
          if (that.timeType === 'year') {
            today.setFullYear(today.getFullYear(), 0, 1);
            flag = date && date.valueOf() >= today.valueOf();
          } else if (that.timeType === 'month') {
            today.setFullYear(today.getFullYear(), today.getMonth(), 1);
            flag = date && date.valueOf() >= today.valueOf();
          } else if (that.timeType === 'date') {
            flag = date && date.valueOf() >= today.valueOf();
          } else {
            flag = date && date.valueOf() > today.valueOf();
          }
          return flag;
        },
        shortcuts: [
          {
            text: '开始时间',
            onClick: (picker) => {
              picker.$el.children[0].children[0].style.cssText = 'background:#00b4ff;color:#fff;';
              picker.$el.children[0].children[2].style.cssText = '';
              this.flag = "start";
            }
          },
          {
            text: this.startValue ? this.startValue : "无",
            onClick: (picker) => {
              this.flag = "start";
            }
          },
          {
            text: '结束时间',
            onClick: (picker) => {
              picker.$el.children[0].children[0].style.cssText = '';
              picker.$el.children[0].children[2].style.cssText = 'background:#00b4ff;color:#fff;';
              this.flag = "end";
            }
          },
          {
            text: this.endValue ? this.endValue : "无",
            onClick: (picker) => {
              this.flag = "end";
            }
          },
        ]
      }
    },
    methods: {
      handleClick () {
        this.open = !this.open;
      },
      handleChange (date) {
        if (date) {
          if (this.flag === "start") {
            //更新开始时间
            this.startValue = date;
            this.options.shortcuts[1].text = date;
          } else {
            //更新结束时间
            if (this.timeType === "datetime" && this.startValue === date) {
              date = date.replace("00:00:00", "23:59:59");
            }
            this.endValue = date;
            this.options.shortcuts[3].text = date;
          }
        }
      },
      handleClear() {
        this.open = false;
        this.startValue = "";
        this.options.shortcuts[1].text = "无";
        this.endValue = "";
        this.options.shortcuts[3].text = "无";
        if (this.fn) {
          this.fn(this.startValue, this.endValue);
        }
      },
      handleOk () {
        let startValue = "";
        let endValue = "";

        this.open = false;
        if (this.timeType === "year") {
          if (this.startValue) {
            startValue = this.startValue + "-01-01 00:00:00";
          }

          if (this.endValue) {
            endValue = this.endValue + "-01-01 23:59:59";
          }
        } else if (this.timeType === "month") {
          if (this.startValue) {
            startValue = this.startValue + "-01 00:00:00";
          }

          if (this.endValue) {
            endValue = this.endValue + "-01 23:59:59";
          }
        } else if (this.timeType === "date") {
          if (this.startValue) {
            startValue = this.startValue + " 00:00:00";
          }

          if (this.endValue) {
            endValue = this.endValue + " 23:59:59";
          }
        } else {
          if (this.startValue) {
            startValue = this.startValue;
          }

          if (this.endValue) {
            endValue = this.endValue;
          }
        }

        if (this.fn) {
          this.fn(startValue, endValue);
        }
      }
    }
  }
</script>

<style>
  .ivu-picker-panel-body-wrapper.ivu-picker-panel-with-sidebar{
    padding-left: 150px !important;
  }
  .ivu-picker-panel-sidebar{
    margin-left: -150px !important;
    width: 150px !important;
    padding-top: 10px;
  }
</style>
