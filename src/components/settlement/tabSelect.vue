<template>
 <dropdown trigger="click" :visible="visible"  transfer placement="bottom-start">
 <a href="javascript:void(0)" @click="handleClick">
      {{ title }}
      <Icon type="ios-arrow-down"></Icon>
    </a>
    <Select v-model="checkedArr" filterable multiple transfer style="width:260px" size="small">

      <Option v-for="item in cityList" :value="item.value" :key="item.label">{{ item.value }}</Option>
    </Select>
</dropdown>
</template>
<script>
  export default {
    name: "tabSelect",
    props: {
      title: String,
      cityList: Array,
      checkedArr: Array,
      fn:Function
    },
    data() {
      return {
        visible: false,
        // open: true,
        // value: "",
      }
    },
    methods: {
      // selectchecked(){
      //   this.open=true;
      //   this.fn(this.checkedArr,this.cityList);
      // }
    handleClick(){
      this.visible = true;

    },
    test(){
    }
    }
  }
</script>
