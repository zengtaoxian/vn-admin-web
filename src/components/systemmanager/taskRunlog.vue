<template>
  <div class="box">

    <div class="main_header clear">
      <div class="input_wrap">
        <i-input placeholder="批次号/任务标识"  @on-enter="search" v-model.trim="condition"  style:></i-input>
        <span class="search_btn" @click="search"><Icon type="ios-search-strong"></Icon></span>
      </div>
    </div>

    <div class="tab_wrap">
      <i-table :columns="columns1" :data="data1" class="table" ref="table" :height="tabHeight" :loading="loading" :no-data-text="noDataText"></i-table>
    </div>
    <div class="page_btm_div" v-if="totalCount">
      <Page class="page_iview_right" :total="totalCount" :page-size="pageSize" :current="currentPage" :page-size-opts="pageOpt" size="small" show-elevator show-sizer show-total placement="top" @on-change="getTaskRunLogPageChange" @on-page-size-change="getTaskRunLogPageSizeChange"></Page>
    </div>
  </div>
</template>

<script>

import {mapGetters} from "vuex";
import * as util from "@/common/js/util";

import {
  fetch_taskRun_log_info
} from '@/api/api';

  export default {
    data() {
      return {
        noDataText:"加载中...",
        tabHeight:'500',
        loading:false,
        condition : "",
        totalCount : 0,
        currentPage : 1,
        pageSize : util.pageSize,
        pageOpt: util.pageOpt,
        columns1: [
          {
            title: "序号",
            type: "index",
            key: "id",
            width: 70
          },
          {
            title: "批次号",
            key: "pljypich",
            width: 400
          },
          {
            title: "日志时间",
            key: "pljioysj",
            width: 300
          },
          {
            title: "运行信息",
            key: "yunxxinx"
          }
        ],
        data1: [

        ]
      };
    },
    created(){
      this.tabHeight = (document.documentElement.clientHeight - 160 - 40);
      this.getTaskRunLogList()
    },
    computed: mapGetters(["system"]),
    methods: {
      getTaskRunLogList(){
        this.noDataText = "加载中...";
        this.loading = true;
        fetch_taskRun_log_info({
              condition : this.condition,
              pageNo : this.currentPage,
              pageNum : this.pageSize
          }).then((response)=>{
          if(response.data.respCode == 0){
            this.totalCount = response.data.totalCount;
            this.data1 = response.data.list;
          }else{
            this.$Message.error(response.data.msg);
          }
          this.noDataText = '暂无数据';
          this.loading = false;
        }).catch((err) =>{
          console.log(err);
          this.$Message.error("获取任务运行日志失败");
          this.noDataText = '暂无数据';
          this.loading = false;
        })
      },

    getTaskRunLogPageChange(page) {
        this.currentPage = page
        this.getTaskRunLogList()
      },

    getTaskRunLogPageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getTaskRunLogList();
      },

    search(){
      this.pageNo = 1;
      this.getTaskRunLogList();
    }
    }
  };
</script>


<style lang="less">
  @import "../../common/less/syslog.less";
</style>
