<template>
  <div class="box">
    <div class="main_header clear">
      <div class="input_wrap">
        <i-input placeholder="批次号/任务标识"  style: @on-enter="search" v-model.trim="condition"></i-input>
        <span class="search_btn" @click="search"><Icon type="ios-search-strong"></Icon></span>
      </div>
    </div>

    <div class="tab_wrap">
      <Table :columns="columns1" :data="data1" class="table" ref="table" :height="tabHeight" :loading="loading" :no-data-text="noDataText"></Table>
    </div>
    <div class="page_btm_div" v-if="totalCount">
      <Page class="page_iview_right" :total="totalCount" :page-size="pageSize" :current="currentPage" :page-size-opts="pageOpt" size="small" show-elevator show-sizer show-total placement="top"  @on-change="getTaskRunInfoPageChange" @on-page-size-change="getTaskRunInfoPageSizeChange"></Page>
    </div>

    <Modal
        v-model="MsgModal"
        title="失败原因"
        :content="content"
        scrollable
        closable>
      <Row>
        <Col span="22" offset="1">{{content}}</Col>
      </Row>

    </Modal>

  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {
  fetch_taskRun_info
} from '@/api/api';
import * as util from "@/common/js/util";

  export default {
    data() {
      return {
        noDataText:"加载中...",
        condition : "",
        totalCount : 0,
        currentPage : 1,
        pageSize : util.pageSize,
        pageOpt: util.pageOpt,
        loading: false,
        content: "",
        taskRunStatus: "",
        MsgModal: false,
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
            width:300
          },
          {
            title: "执行批次",
            key: "plrwzxpc",
            width:160
          },
          {
            title: "任务标识",
            key: "piljybss",
            width: 150
          },
          {
            title: "任务中文名称",
            key: "pljyzwmc",
            width: 150
          },
          {
            title: "累计耗时（秒）",
            key: "ljhaoshi",
            width: 150
          },
          {
            title: "执行状态",
            key: "zuoyzxzt",
            width: 100,
            filters: [
              {
                  label: '待处理',
                  value: "1"
              },
              {
                  label: '暂停并重新就绪',
                  value: "2"
              },
              {
                  label: '正分配',
                  value: "3"
              },
              {
                  label: '处理中',
                  value: "4"
              },
              {
                  label: '处理成功',
                  value: "5"
              },
              {
                  label: '处理失败',
                  value: "6"
              },
              {
                  label: '已中断',
                  value: "7"
              },
              {
                  label: '已停止',
                  value: "8"
              }
          ],
          filterMultiple: false,
          filterRemote (value, row) {
            if (value == "1") {
              this.taskRunStatus = "onprocess";
            } else if (value == "2") {
              this.taskRunStatus = "reonprocess";
            }else if (value == "3") {
              this.taskRunStatus = "distributing";
            }else if (value == "4") {
              this.taskRunStatus = "processing";
            }else if (value == "5") {
              this.taskRunStatus = "success";
            }else if (value == "6") {
              this.taskRunStatus = "failure";
            }else if (value == "7") {
              this.taskRunStatus = "interrupted";
            }else if(value == '8'){
              this.taskRunStatus = "stopped";
            }else{
              this.taskRunStatus = "";
            }
            this.currentPage = 1;
            this.getTaskRunInfoList();
          },
            render: (h, params) => {
              let str = '';
              let arr = '';
              let status = params.row.zuoyzxzt;
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
            title: "开始时间",
            key: "jyksshij",
            width: 200
          },
          {
            title: "执行主机",
            key: "ipdizhii",
            width: 150
          },
          {
            title: "线程名称",
            key: "xiancmic",
            width: 300
          },
          {
            title: "操作",
            key: "operater",
            width:100,
            render: (h, params) => {
              if(this.data1[params.index].zuoyzxzt == "failure"){
              return h('div', [
                h('Button', {
                    props: {
                      type: 'ghost',
                      size: 'small'
                    },
                    style: {
                      border: "none",
                      class: "tab_del_btn",
                      color: "#0eb2f6",
                      cursor: "pointer",
                    },
                    on: {
                      click: () => {
                        this.check(params.index);
                      }
                    }
                }, '失败原因')
                ]);
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
      this.zuoyzxzt = "";
      this.getTaskRunInfoList()
    },
    computed: mapGetters(["system"]),
    methods: {
      getTaskRunInfoList(){
        this.noDataText = "加载中...";
        this.loading = true;
        fetch_taskRun_info({
            condition : this.condition,
            pageNo : this.currentPage,
            pageNum : this.pageSize,
            zuoyzxzt: this.taskRunStatus
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
          console.log(err)
          this.$Message.error("获取任务运行信息失败");
          this.noDataText = '暂无数据';
          this.loading = false;
      })
      },

      check(indexId){
        this.content = this.data1[indexId].cuowxinx + this.data1[indexId].cuiwduiz;
        this.MsgModal = true;
      },

      getTaskRunInfoPageChange(page) {
        this.currentPage = page
        this.getTaskRunInfoList()
      },

      getTaskRunInfoPageSizeChange(pageSize) {
        this.pageSize = pageSize
        this.getTaskRunInfoList()
      },

      search(){
        this.pageNo=1;
        this.getTaskRunInfoList();
      }
    }
  };
</script>


<style lang="less">
  @import "../../common/less/syslog.less";
</style>
