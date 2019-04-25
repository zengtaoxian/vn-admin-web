<style lang="less">
  @import "../../common/less/syslog.less";
</style>
<style>
  .ivu-tooltip-inner {
    max-width: 400px;
    min-height: 34px;
    padding: 8px 12px;
    color: #575757;
    text-align: left;
    text-decoration: none;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
    border: #767676 solid 1px;
    word-wrap: break-word;
    white-space: normal;
  }
</style>
<template>
  <div class="box">
    <div class="main_header clear">
      <div v-if="check_perm(131)" class="input_wrap">
        <i-input placeholder="操作用户/操作类型/操作模块" @on-enter="search" v-model.trim="condition" style:></i-input>
        <span class="search_btn" @click="search"><Icon type="ios-search-strong"></Icon></span>
      </div>
      <div v-if="check_perm(132)" class="export_btn" @click="exportData"></div>
    </div>
    <div class="tab_wrap">
      <Table :columns="columns1" :data="data1" :height="tabHeight" :loading="loading" :no-data-text="noDataText"></Table>
    </div>
    <div class="page_btm_div">
      <Page class="page_iview_right" :total="totalCount" :page-size="pageSize" :current="currentPage"
            :page-size-opts="pageOpt" size="small" show-elevator show-sizer show-total placement="top"
            @on-change="getSysLogPageChange" @on-page-size-change="getSysLogPageSizeChange"></Page>
    </div>
  </div>
</template>
<script>

  import {mapGetters} from "vuex";
  import {perm} from "@/utils/perm.js";
  import dateFilter from '../Filter/dateFilter';
  import defaultTip from './defaultTip.vue'
  import {
    fetch_syslog_page_info,
    fetch_syslog_list_info,
    DownLoadFile
  } from '@/api/api';
  import * as util from "@/common/js/util";

  export default {
    data() {
      return {
        noDataText:"加载中...",
        loading: false,
        tabHeight: '500',
        condition: "",
        totalCount: 0,
        currentPage: 1,
        pageSize: util.pageSize,
        pageOpt: util.pageOpt,
        beginTime: "",
        endTime: "",
        columns1: [
          {
            title: "序号",
            type: "index",
            key: "id",
            width: 70
          },
          {
            title: "登录账号",
            key: "loginUserAcc",
            width: 250
          },
          {
            title: "用户姓名",
            key: "loginUserName",
            width: 200
          },
          {
            title: "用户角色",
            key: "loginRoleName",
            width: 250
          },
          {
            title: "操作类型",
            key: "operatorType",
            // sortable: "true",
            width: 200
          },
          {
            title: "操作模块",
            key: "operatorModel",
            width: 300
          },
          {
            title: "操作对象",
            key: "operatorObject",
            width: 300,
            render: function (h, params) {
              let arr = [];
              arr = [
                h(defaultTip, {
                  props: {
                    title: params.row.operatorObject,
                  }
                }, params.row.operatorObject),
              ]
              return h('div', arr)
            }
          },
          {
            title: "操作时间",
            key: "createTime",
            width: 200,
            renderHeader: (h, params) => {
              return h(dateFilter, {
                props: {
                  title: '操作时间',
                  fn: (startDate, endDate) => {
                    this.beginTime = startDate;
                    this.endTime = endDate;
                    this.getSyslogList()
                  }
                }
              });
            },
          },
          {
            title: "操作IP",
            key: "operatorIp",
            width: 150
          }
        ],
        data1: []
      };
    },
    created() {
      this.tabHeight = (document.documentElement.clientHeight - 160 - 40);
      this.getSyslogList()
    },

    computed: {
      ...mapGetters({
        check_perm: "main/check_perm",
      })
    },

    methods: {
      getSyslogList() {
        this.noDataText = "加载中...";
        this.loading = true;
        fetch_syslog_page_info({
          condition: this.condition,
          pageNo: this.currentPage,
          pageNum: this.pageSize,
          beginTime: this.beginTime,
          endTime: this.endTime
        }).then(response => {
          if (response.data.respCode == 0) {
            this.totalCount = response.data.totalCount;
            this.data1 = response.data.list;
          } else {
            this.$Message.error(response.data.msg);
          }
          this.noDataText = "暂无数据";
          this.loading = false;
        }).catch((err) => {
          console.log(err);
          this.$Message.error("获取系统日志失败");
          this.noDataText = "暂无数据";
          this.loading = false;
        })
      },

      exportData() {
        if(this.totalCount == 0){
          this.$Message.error("数据为空，不能导出");
          return
        }
        DownLoadFile({
          url: '/vcloud/sysManage/sysLog/exportSysLogList', data: {
            condition: this.condition
          }
        });
      },

      getSysLogPageChange(page) {
        this.currentPage = page
        this.getSyslogList()
      },

      getSysLogPageSizeChange(pageSize) {
        this.pageSize = pageSize
        this.getSyslogList()
      },

      search() {
        this.currentPage = 1;
        this.getSyslogList();
      }
    }
  };
</script>

