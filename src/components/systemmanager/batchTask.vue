<template>
  <div class="box">

    <div class="main_header clear">
      <div v-if="check_perm(266)" class="input_wrap">
        <i-input placeholder="批次号/任务标识"  style: @on-enter="search" v-model.trim="condition"></i-input>
        <span class="search_btn" @click="search"><Icon type="ios-search-strong"></Icon></span>
      </div>
    </div>
     <Tag v-for="item in filter_item" :key="item.key" :name="item.key" closable @on-close="tag_close">
      {{item.title}}:{{item.where}}
    </Tag>
    <div class="tab_wrap">
      <i-table :columns="columns1" :data="data1" class="table" ref="table" :height="tabHeight" :loading="loading" :no-data-text="noDataText" @on-filter-change="table_filter_change"></i-table>
    </div>

    <div class="page_btm_div" v-if="totalCount">
      <Page class="page_iview_right" :total="totalCount" :page-size="pageSize" :current="currentPage" :page-size-opts="pageOpt" size="small" show-elevator show-sizer show-total placement="top" @on-change="getBatchTaskPageChange" @on-page-size-change="getBatchTaskPageSizeChange"></Page>
    </div>

    <Modal
        v-model="MsgModal"
        title="失败原因"
        :content="content"
        scrollable
        width="900px"
        transfer
        closable>
        {{content}}
    </Modal>

  </div>
</template>

<script>
  import {mapGetters} from "vuex";

import {
  fetch_batch_task_info,
  update_batch_task_info
} from '@/api/api';
import * as util from "@/common/js/util";

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
      content: "",
      MsgModal: false,
      filter_item: [],
      taskStatusFilters: [
        {
            label: '待处理',
            value: "待处理"
        },
        {
            label: '暂停并重新就绪',
            value: "暂停并重新就绪"
        },
        {
            label: '正分配',
            value: "正分配"
        },
        {
            label: '处理中',
            value: "处理中"
        },
        {
            label: '处理成功',
            value: "处理成功"
        },
        {
            label: '处理失败',
            value: "处理失败"
        },
        {
            label: '已中断',
            value: "已中断"
        },
        {
            label: '已停止',
            value: "已停止"
        }
      ],
      columns1: [
        {
          title: "序号",
          type: "index",
          key: "indexId",
          width: 70
        },
        {
          title: "批次号",
          key: "pljypich",
          width: 300
        },
        {
          title: "执行批次",
          key: "plrwzxpc",
          width: 180
        },
        {
          title: "任务标识",
          key: "piljybss",
          width: 120
        },
        {
          title: "任务中文名称",
          key: "pljyzwmc",
          width: 250
        },
        {
          title: "累计耗时（秒）",
          key: "ljhaoshi",
          width: 120
        },
        {
          title: "任务状态",
          key: "jiaoyzht",
          width: 100,
          where: "",
          filters: [
              {
                  label: '待处理',
                  value: "待处理"
              },
              {
                  label: '暂停并重新就绪',
                  value: "暂停并重新就绪"
              },
              {
                  label: '正分配',
                  value: "正分配"
              },
              {
                  label: '处理中',
                  value: "处理中"
              },
              {
                  label: '处理成功',
                  value: "处理成功"
              },
              {
                  label: '处理失败',
                  value: "处理失败"
              },
              {
                  label: '已中断',
                  value: "已中断"
              },
              {
                  label: '已停止',
                  value: "已停止"
              }
          ],
          filterMultiple: false,
          filterRemote (value, row, column) {
              if (value == "待处理") {
                this.jiaoyzht = "onprocess";
              } else if (value == "暂停并重新就绪") {
                this.jiaoyzht = "reonprocess";
              }else if (value == "正分配") {
                this.jiaoyzht = "distributing";
              }else if (value == "处理中") {
                this.jiaoyzht = "processing";
              }else if (value == "处理成功") {
                this.jiaoyzht = "success";
              }else if (value == "处理失败") {
                this.jiaoyzht = "failure";
              }else if (value == "已中断") {
                this.jiaoyzht = "interrupted";
              }else if(value == '已停止'){
                this.jiaoyzht = "stopped";
              }else{
                this.jiaoyzht = "";
              }
              column.where = value.join(',');
              this.currentPage = 1;
              this.getBatchTaskList();
          },
          render: (h, params) => {
              let str = '';
              let arr = '';
              let status = params.row.jiaoyzht;
              if(status == 'onprocess'){
                str = '待处理';
              }else if(status == 'reonprocess'){
                str = '暂停并重新就绪'
              }else if(status == 'processing'){
                str = '处理中'
              }else if(status == 'success'){
                str = '处理成功'
              }else if(status == 'failure'){
                str = '处理失败'
              }else if(status == 'interrupted'){
                str = '已中断'
              }else{
                str = '已停止'
              }
              if(status == 'failure'){
                arr = [
                  h('span', {
                    style: {
                      // marginRight: '5px',
                        border: "none",
                        class: "tab_del_btn",
                        color: "#CD0000",
                        cursor: "pointer"
                      }
                  }, str)
                ];
              }else{
                arr = [
                  h('span', {
                    style: {
                      // marginRight: '5px',
                        border: "none",
                        class: "tab_del_btn",
                        color: "#666",
                        cursor: "pointer"
                      }
                  }, str)
                ];
              }
              return h('div', arr);
            }
        },
        {
          title: "任务提交时间",
          key: "plrwtjsj",
          width: 170
        },
        {
          title: "服务标识",
          key: "fuwbiaoz",
          width: 300
        },
        {
          title: "操作",
          key: "operator",
          width: 150,
          render: (h, params) => {
            if(this.check_perm(153)){
              if(this.data1[params.index].jiaoyzht == "failure"){
                return h('span', [
                  h('span', {
                  style: {
                    border: "none",
                    class: "tab_del_btn",
                    color: "#0eb2f6",
                    cursor: "pointer",
                  },
                  class:'tab_childer_btn',
                  on: {
                    click: () => {
                        this.runAgain(params.index);
                    }
                  }
                }, '重跑'),
                h('span', {
                  style: {
                    border: "none",
                    class: "tab_del_btn",
                    color: "#0eb2f6",
                    cursor: "pointer",
                  },
                  class:'tab_childer_btn',
                  on: {
                    click: () => {
                        this.check(params.index);
                    }
                  }
                }, '失败原因')
                ]);
              }else{
                return h('span', [
                  h('span', {
                    style: {
                      border: "none",
                      class: "tab_del_btn",
                      color: "#0eb2f6",
                      cursor: "pointer"
                    },
                    class:'tab_childer_btn',
                    on: {
                      click: () => {
                          this.runAgain(params.index);
                      }
                    }
                }, '重跑')
                ]);
              }
            }
          }
        }
      ],
      data1: [
      ]
    };
  },
  created(){
    this.tabHeight = (document.documentElement.clientHeight - 160 - 40);
    this.jiaoyzht="";
    this.getBatchTaskList()
  },
  computed: {
    ...mapGetters({
      check_perm: "main/check_perm",
    })
  },

  methods: {

    runAgain(indexId){
      this.pljypich=this.data1[indexId].pljypich;
      // this.jiaoyzht=this.data1[indexId].jiaoyzht;
      this.updateBatchTask();
    },

    getBatchTaskList(){
      this.noDataText = "加载中...";
      this.loading = true;
      fetch_batch_task_info({
            condition : this.condition,
            pageNo : this.currentPage,
            pageNum : this.pageSize,
            jiaoyzht: this.jiaoyzht
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
        this.$Message.error("获取批量任务信息失败");
        this.noDataText = '暂无数据';
        this.loading = false;
      })
    },

    updateBatchTask(){
      update_batch_task_info({
            condition : this.condition,
            pageNo : this.currentPage,
            pageNum : this.pageSize,
            pljypich: this.pljypich,
            jiaoyzht: "onprocess"
        }).then((response)=>{
          if(response.data.respCode == 0){
            this.$Message.success(response.data.msg);
            // this.jiaoyzht = "";
            this.getBatchTaskList();
          }else{
            this.$Message.error(response.data.msg);
          }
      }).catch((err) =>{
        console.log(err);
        this.$Message.error("更新批量任务信息失败");
      })
    },

    check(indexId){
      this.content = this.data1[indexId].cuowxinx + this.data1[indexId].cuowduiz;
      this.MsgModal = true;
    },

    table_filter_change(col) {
        //重置操作
        if(col._filterChecked.length == 0){
          this.filter_item.forEach(function(value, index){
            if(value.key == col.key){
              this.filter_item.splice(index, 1);
            }
          }, this);
          return ;
        }

        if (col.where) {
          let flag = false;
          this.filter_item.forEach(function(value, index){
            if(col.key == value.key){
              this.filter_item.splice(index, 1, {key: col.key, title: col.title, where: col.where});
              flag = true;
            }
          }, this);

          if(!flag){
            this.filter_item.push({key: col.key, title: col.title, where: col.where});
          }
        }
      },

    tag_close(event, name) {
        this.filter_item.forEach(function(value, index){
          if(value.key == name){
            this.filter_item.splice(index, 1);
          }
        }, this);

        var tmp;

        this.columns1.forEach(function(value, index, arr){
          if(value.key == name){
            tmp = index;
            this.columns1[index].filters = [];
          }
        }, this);

        if(name == "jiaoyzht"){
          this.columns1[tmp].filters = this.taskStatusFilters;
        }else{
          ;
        }

        this.jiaoyzht = "";
        this.currentPage = 1;
        this.getBatchTaskList();
      },

    getBatchTaskPageChange(page) {
      this.currentPage = page
      this.getBatchTaskList()
    },

    getBatchTaskPageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getBatchTaskList()
    },

    search(){
      this.currentPage=1;
      this.getBatchTaskList();
    }
  }
};
</script>


<style lang="less">
  @import "../../common/less/syslog.less";
  @import "../../common/less/main.less";
</style>
