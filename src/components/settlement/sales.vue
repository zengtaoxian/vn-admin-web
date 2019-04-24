<style lang="less">
</style>

<template>
  <div class="box" ref="box">
    <div class="main_header header_border clear">
      <div v-if="check_perm(85)" class="input_wrap">
        <i-input placeholder="订单编号/客户姓名/客户编号/客户邮箱" style:
                 @on-enter="search" v-model.trim="condition"></i-input>
        <span class="search_btn" @click="search"><Icon type="ios-search-strong"></Icon></span>
      </div>
      <Tag v-for="item in filter_item" :key="item.key" :name="item.key" closable @on-close="tag_close">
        {{item.title}}:{{item.where}}
      </Tag>
      <div v-if="check_perm(86)" class="export_btn" @click="showExportModal"></div>
      <div class="select_div">
        <Select v-model="selected_columns" multiple class="tab_select" @on-change="select_change">
          <Option v-for="item in all_columns" v-if="check_perm(item.rowId) && (false !== item.opt)"
                  :value="item.key" :key="item.key">
            {{item.title}}
          </Option>
        </Select>
      </div>
    </div>

    <Tabs v-model="timeChangevalue" :name="timeChangevalue" Col="100px" width="100px" @on-click="tabChange()"
          :animated="animated">
      <TabPane v-for="tab in display_tabs" :key="tab.name" :label="tab.label" :name="tab.name">
        <Row v-if="tab.name === timeChangevalue">
          <Col span="24">
          <div class="tab_wrap" :class="listData.length == 0?'tab_none_data':''">
            <Table :columns="display_columns" :data="listData"
                   :height="tabHeight" :loading="loading" @on-filter-change="table_filter_change"
                   :no-data-text="noDataText"></Table>
          </div>
          </Col>
        </Row>
      </TabPane>
    </Tabs>

    <div class="page_btm_div" v-if="totalCount">
      <Page class="page_iview_right" :total="totalCount" :page-size="pageSize" :current="currentPage"
            :page-size-opts="pageOpt" size="small" show-elevator show-sizer show-total placement="top"
            @on-change="getPageChange" @on-page-size-change="getPageSizeChange"></Page>
    </div>
    <Modal v-model="exportModal" width="300" title="导出报表" class="export_modal" @on-cancel="cancelExportModal">
      <div class="export_content">
        <p>温馨提示：</p>
        <p>1、仅导出当前查询结果</p>
        <p>2、最多导出10万条数据</p>
      </div>
      <div class="export_footer">
        <Button type="primary" size="large" style="margin-right: 10px;" :disabled="totalCount==0 || totalCount>100000"
                @click="exportData">开始导出
        </Button>
        <Button type="ghost" size="large" @click="cancelExportModal">取消</Button>
      </div>
    </Modal>
  </div>
  <!-- <div class="box" ref="box">
    <div class="main_header header_border clear">
      <div class="input_wrap">
        <i-input placeholder="商务名称\商务部门\订单编号\供应商\销售" icon="search" style: @on-change="search"
                 v-model="condition"></i-input>
      </div>
      <Tag v-for="item in filter_item" :key="item.key" :name="item.key" closable @on-close="tag_close">
        {{item.title}}:{{item.where}}
      </Tag>
      <div class="export_btn" @click="exportData"></div>
      <div class="select_div">
        <Select v-model="selected_columns" multiple class="tab_select" @on-change="select_change">
          <Option v-for="item in all_columns" v-if="check_perm(item.rowId) && (false !== item.opt)"
                  :value="item.key" :key="item.key">
            {{item.title}}
          </Option>
        </Select>
      </div>
    </div>

    <Tabs v-model="timeChangevalue" :name="timeChangevalue" Col="100px" width="100px" @on-click="tabChange()"
          :animated="animated">
      <TabPane label="日报表" name="day">
        <Row>
          <Col span="24">
          <div class="tab_wrap">
            <Table :columns="display_columns" :data="listData"
                   :height="tabHeight" :loading="loading" @on-filter-change="table_filter_change"></Table>
          </div>
          </Col>
        </Row>
      </TabPane>

      <TabPane label="周报表" name="week">
        <Row>
          <Col span="24">
          <Table :columns="display_columns" :data="listData"
                   :height="tabHeight" :loading="loading" @on-filter-change="table_filter_change"></Table>
          </Col>
        </Row>
      </TabPane>

      <TabPane label="月报表" name="month">
        <Row>
          <Col span="24">
          <Table :columns="display_columns" :data="listData"
                   :height="tabHeight" :loading="loading" @on-filter-change="table_filter_change"></Table>
          </Col>
        </Row>
      </TabPane>

      <TabPane label="年报表" name="year">
        <Row>
          <Col span="24">
          <Table :columns="display_columns" :data="listData"
                   :height="tabHeight" :loading="loading" @on-filter-change="table_filter_change"></Table>
          </Col>
        </Row>
      </TabPane>
    </Tabs>
    <div class="page_btm_div" v-if="totalCount">
      <Page class="page_iview_right" :total="totalCount" :page-size="pageSize" :current="currentPage"
            :page-size-opts="pageOpt" size="small" show-elevator show-sizer show-total placement="top"
            @on-change="getPageChange" @on-page-size-change="getPageSizeChange"></Page>
    </div>
  </div> -->
</template>
<script>
  import {mapGetters} from "vuex";
  import dateFilter from './dateFilter.vue';
  import {perm} from "@/utils/perm.js";
  import * as util from "@/common/js/util";
  import * as api from '@/api/api';

  export default {
    data() {
      return {
        exportModal:false,
        totalCount: 0,
        currentPage: 1,
        pageSize: util.pageSize,
        pageOpt: util.pageOpt,
        condition: "",
        listData: [],
        timeChangevalue: '',
        beginTime: '',
        endTime: '',
        loading: false,
        tableColumnsChecked: [],
        tabHeadList: [],
//        purviewArr: perm_info,
        tabHead: [],
        animated: false,
        tabHeight: '500',
        excludeField: "",
        noDataText: "加载中...",
        LineFilters: [
          {
            label: "呼入",
            value: "呼入"
          },
          {
            label: "呼出",
            value: "呼出"
          },
          {
            label: "呼入+呼出",
            value: "呼入+呼出"
          }
        ],
        all_columns: [
          {
            title: "序号",
            key: "id",
            width: 70,
            opt: false,
            fixed: 'left',
            render: (h, params) => {
              let str = params.row._index + 1;
              if (params.row._index == (this.listData.length - 1)) {
                str = '合计';
              }
              let arr = [
                h('span', {}, str)
              ];
              return h('div', arr);
            }
          },
          {
            title: "统计时间",
            key: "orderStatisticalTime",
            width: 170,
            renderHeader: (h, params) => {
              let timeType = "date";
              if (this.timeChangevalue === "day" || this.timeChangevalue === "week") {
                timeType = "date";
              } else {
                timeType = this.timeChangevalue
              }
              return h(dateFilter, {
                props: {
                  title: '统计时间',
                  timeType: timeType,
                  fn: (startDate, endDate) => {
                    if (!startDate || !endDate || startDate.length == 0 || endDate.length == 0) {
                      this.beginTime = "";
                      this.endTime = "";
                    } else {
                      if (this.timeChangevalue == "day") {
                        if (util.datedifference(endDate, util.getDateStr(-1)) > 0) {
                          this.$Message.error("查询起始时间或结束时间不能大于昨天");
                          return;
                        }
                        if (util.datedifference(endDate, startDate) > 10) {
                          this.$Message.error("查询天数大于10天，仅支持查询十天数据");
                          return;
                        }
                        this.beginTime = startDate;
                        this.endTime = endDate;
                      } else if (this.timeChangevalue == "week") {
                        this.beginTime = startDate;
                        this.endTime = endDate;
                      } else if (this.timeChangevalue == "month") {
                        this.beginTime = startDate.split("-")[0] + "-" + startDate.split("-")[1];
                        this.endTime = endDate.split("-")[0] + "-" + endDate.split("-")[1];
                      } else {
                        this.beginTime = startDate.split("-")[0];
                        this.endTime = endDate.split("-")[0];
                      }
                    }
                    this.currentPage = 1;
                    this.getList();
                  }
                }
              });
            },
          },
          {
            title: "订单编号",
            key: "orderId",
            width: 300

          },
          {
            title: "订单线路类型",
            key: "orderLineCategory",
            width: 150,
            whiere: "",
            render: (h, params) => {
              let str = '';
              let status = params.row.orderLineCategory;
              if (status == '0') {
                str = '呼入';
              } else if (status == '1') {
                str = '呼出'
              } else if (status == '2') {
                str = '呼入+呼出';
              } else {
                str = '/';
                ;
              }
              let arr = [
                h('span', {}, str)
              ];
              return h('div', arr);
            },
            filters: [
              {
                label: "呼入",
                value: "呼入"
              },
              {
                label: "呼出",
                value: "呼出"
              },
              {
                label: "呼入+呼出",
                value: "呼入+呼出"
              }
            ],
            filterMultiple: true,
            filterRemote: function (value, key, column) {
              column.where = value.join(',');
            }
          },
          {
            title: "订单商品类别",
            key: "orderCategory",
            // opt: false,
            width: 150,
            where: "",
            filters: [],
            filterMultiple: true,
            filterRemote: function (value, key, column) {
              column.where = value.join(',');
            }
          },
          {
            title: "订单归属销售",
            key: "saleName",
            width: 180,
            where: "",
            filters: [],
            filterMultiple: true,
            filterRemote: function (value, key, column) {
              column.where = value.join(',');
            }
          },
          {
            title: "销售归属部门",
            key: "salerDepartment",
            width: 180,
            where: "",
            filters: [],
            filterMultiple: true,
            filterRemote: function (value, key, column) {
              column.where = value.join(',');
            }
          },
          {
            title: "客户编号",
            key: "custCode",
            width: 300
          },
          {
            title: "客户邮箱",
            key: "custEmail",
            width: 200
          },
          {
            title: "客户名称",
            key: "custName",
            width: 200
          },
          {
            title: "合计详情条数",
            key: "sumItem",
            width: 200
          },
          {
            title: "销售包编号",
            key: "salePackage",
            width: 300
          },
          {
            title: "销-月租配置（元/月）",
            key: "saleMonthlyRentConfig",
            width: 170,
          },
          {
            title: "销-月租计费时长（小时）",
            key: "saleMonthlyRentCountTime",
            width: 200
          },

          {
            title: "销-月租实扣（元）",
            key: "saleMonthlyRentConsumption",
            width: 150
          },
          {
            title: "销-低消配置（元/月）",
            key: "saleLowConfig",
            width: 170,
            render: (h, params) => {
              let str;
              if (this.timeChangevalue == "day" || this.timeChangevalue == "week") {
                str = '/';
              } else {
                str = params.row.saleLowConfig;
              }
              let arr = [h('span', {}, str)];
              return h('div', arr);
            }
          },
          {
            title: "销-低消计费时长（小时）",
            key: "saleLowCountTime",
            width: 200,
            render: (h, params) => {
              let str;
              if (this.timeChangevalue == "day" || this.timeChangevalue == "week") {
                str = '/';
              } else {
                str = params.row.saleLowCountTime;
              }
              let arr = [h('span', {}, str)];
              return h('div', arr);
            }
          },
          {
            title: "销-低消应扣款（元）",
            key: "saleLowShouldConsumption",
            width: 160,
            render: (h, params) => {
              let str;
              if (this.timeChangevalue == "day" || this.timeChangevalue == "week") {
                str = '/';
              } else {
                str = params.row.saleLowShouldConsumption;
              }
              let arr = [h('span', {}, str)];
              return h('div', arr);
            }
          },
          {
            title: "销-低消实扣（元）",
            key: "saleLowConsumption",
            width: 150,
            render: (h, params) => {
              let str;
              if (this.timeChangevalue == "day" || this.timeChangevalue == "week") {
                str = '/';
              } else {
                str = params.row.saleLowConsumption;
              }
              let arr = [h('span', {}, str)];
              return h('div', arr);
            }
          },
          {
            title: "销-流量计费时长（秒）",
            key: "saleFlowCountTime",
            width: 180
          },
          {
            title: "销-流量实扣（元）",
            key: "saleFlowConsumption",
            width: 150
          },
          {
            title: "客户总消耗（元）",
            key: "saleTotalConsumption",
            width: 150
          },
          {
            title: "挂牌包编号",
            key: "listingPackage",
            width: 300
          },
          {
            title: "挂-月租配置（元/月）",
            key: "listingMonthlyRentConfig",
            width: 170
          },
          {
            title: "挂-月租计费时长（小时）",
            key: "listingMonthlyRentCountTime",
            width: 200
          },
          {
            title: "挂-月租实扣（元）",
            key: "listingMonthlyRentConsumption",
            width: 150
          },
          {
            title: "挂-低消配置（元/月）",
            key: "listingLowConfig",
            width: 170,
            render: (h, params) => {
              let str;
              if (this.timeChangevalue == "day" || this.timeChangevalue == "week") {
                str = '/';
              } else {
                str = params.row.listingLowConfig;
              }
              let arr = [h('span', {}, str)];
              return h('div', arr);
            }
          },
          {
            title: "挂-低消计费时长（小时）",
            key: "listingLowCountTime",
            width: 200,
            render: (h, params) => {
              let str;
              if (this.timeChangevalue == "day" || this.timeChangevalue == "week") {
                str = '/';
              } else {
                str = params.row.listingLowCountTime;
              }
              let arr = [h('span', {}, str)];
              return h('div', arr);
            }
          },
          {
            title: "挂-低消应扣款（元）",
            key: "listingLowShouldConsumption",
            width: 160,
            render: (h, params) => {
              let str;
              if (this.timeChangevalue == "day" || this.timeChangevalue == "week") {
                str = '/';
              } else {
                str = params.row.listingLowShouldConsumption;
              }
              let arr = [h('span', {}, str)];
              return h('div', arr);
            }
          },
          {
            title: "挂-低消实扣（元）",
            key: "listingLowConsumption",
            width: 150,
            render: (h, params) => {
              let str;
              if (this.timeChangevalue == "day" || this.timeChangevalue == "week") {
                str = '/';
              } else {
                str = params.row.listingLowConsumption;
              }
              let arr = [h('span', {}, str)];
              return h('div', arr);
            }
          },
          {
            title: "挂-流量计费时长（秒）",
            key: "listingFlowCountTime",
            width: 180
          },
          {
            title: "挂-流量实扣（元）",
            key: "listingFlowConsumption",
            width: 150
          },
          {
            title: "平台总消耗（元）",
            key: "listingTotalConsumption",
            width: 150
          },
          {
            title: "销售毛利（元）",
            key: "saleProfit",
            width: 150
          }
        ],
        display_tabs: [
          {
            name: "day",
            label: "日报表"
          },
          {
            name: "week",
            label: "周报表"
          },
          {
            name: "month",
            label: "月报表"
          },
          {
            name: "year",
            label: "年报表"
          }
        ],
        selected_columns: [],
        display_columns: {},
        filter_where: {},
        filter_item: [],
      };
    },
    components: {
      dateFilter: dateFilter
    },
    computed: {
      ...mapGetters({
        check_perm: "main/check_perm",
      })
    },
    created: function () {
      this.tabHeight = (document.documentElement.clientHeight - 160 - 120)
      this.beginTime = "";
      this.endTime = "";
      this.timeChangevalue = "day";
      this.condition = "";
      this.init();
      this.getList();
    },
    methods: {

      init() {
        //获取商品类型/类型
        this.get_goods_type();

        //获取销售名称
        this.get_saleman_name();

        //获取部门名称
        this.get_department_name();

        //获取初始列选择
        this.all_columns.forEach(function (value) {
          this.selected_columns.push(value.key);
        }, this);

        this.select_change();
      },

      select_change() {
        //改变显示列
        let display_columns = [];
        this.all_columns.forEach(function (value) {
          if (false === value.opt || this.selected_columns.indexOf(value.key) !== -1) {
            display_columns.push(value);
          }
        }, this);
        this.display_columns = display_columns;
      },

      get_goods_type() {
        this.loading = false;
        api.fetchGoodType().then(response => {
          this.loading = true;
          if (response.data.respCode == 0) {
            let resp_data = response.data.list;
            resp_data.forEach(function (value) {
              value.label = value.typeName;
              value.value = value.typeName;
            });

            //设置过滤项
            this.all_columns.forEach(function (value, index) {
              if (value.key == "orderCategory" || value.key == "commodityCategory") {
                this.all_columns[index].filters = resp_data;
              }
            }, this);

          } else {
            this.$Message.error(response.data.msg);
          }
        }).catch(err => {
          this.loading = true;
          this.$Message.error("获取列表信息失败");
        });
      },

      get_saleman_name() {
        this.loading = true;
        api.fetchquerySaleMan({
          roleName: "销售"
        }).then(response => {
          this.loading = false;
          if (response.data.respCode == 0) {
            let resp_data = response.data.list;
            resp_data.forEach(function (value) {
              value.label = value.userName;
              value.value = value.userName;
            });

            //设置过滤项
            this.all_columns.forEach(function (value, index) {
              if (value.key == "saleName") {
                this.all_columns[index].filters = resp_data;
              }
            }, this);

          } else {
            this.$Message.error(response.data.msg);
          }
        }).catch(err => {
          this.loading = false;
          this.$Message.error("获取列表信息失败");
        });
      },

      get_department_name() {
        this.loading = true;
        api.fetchUserDepartmentList().then(response => {
          this.loading = false;
          if (response.data.respCode == 0) {
            let resp_data = response.data.list;
            resp_data.forEach(function (value) {
              value.label = value.departmentName;
              value.value = value.departmentName;
            });

            //设置过滤项
            this.all_columns.forEach(function (value, index) {
              if (value.key == "salerDepartment" || value.key == "businessDepartment") {
                this.all_columns[index].filters = resp_data;
              }
            }, this);

          } else {
            this.$Message.error(response.data.msg);
          }
        }).catch(err => {
          this.loading = false;
          this.$Message.error("获取列表信息失败");
        });
      },

      table_filter_change(col) {
        //重置操作
        if (col._filterChecked.length == 0) {
          this.filter_item.forEach(function (value, index) {
            if (value.key == col.key) {
              this.filter_item.splice(index, 1);
            }
          }, this);

          delete this.filter_where[col.key];
          this.currentPage = 1;
          this.getList();
          return;
        }

        this.filter_where[col.key] = col.where;
        if (col.where) {
          let flag = false;
          this.filter_item.forEach(function (value, index) {
            if (col.key == value.key) {
              this.filter_item.splice(index, 1, col);
              flag = true;
            }
          }, this);

          if (!flag) {
            this.filter_item.push(col);
          }
        }
        this.currentPage = 1;
        this.getList();
      },

      tag_close(event, name) {
        this.filter_item.forEach(function (value, index) {
          if (value.key == name) {
            value._filterChecked = [];
            value._isFiltered = false;
            delete this.filter_where[value.key];
            this.filter_item.splice(index, 1);
          }
        }, this);

        this.currentPage = 1;
        this.getList();
      },

      exportData() {
        this.exportModal = false;
        let excludeField = "";
        this.all_columns.forEach(function (allValue) {
          let flag = false;
          this.display_columns.forEach(function (displayValue) {
            if (displayValue.key == allValue.key) {
              flag = true;
            }
          }, this);
          if (flag == false) {
            excludeField += allValue.key + ",";
          }
        }, this);
        excludeField = excludeField.substring(0, excludeField.lastIndexOf(','));
        var whereStr = JSON.stringify(this.filter_where).replace(/"/g, '\'');
        api.DownLoadFile({
          url: '/vcloud/settlementCenter/saleDeptReport/saleExcel', data: {
            condition: this.condition,
            category: this.timeChangevalue,
            beginTime: this.beginTime,
            endTime: this.endTime,
            excludeField: excludeField,
            where: whereStr
          }
        });
      },

      getList(beginDate, endDate) {
        this.loading = true;
        api.fetch_sales_report_info(
          {
            condition: this.condition,
            pageNo: this.currentPage,
            pageNum: this.pageSize,
            category: this.timeChangevalue,
            beginTime: this.beginTime,
            endTime: this.endTime,
            where: JSON.stringify(this.filter_where)
          }
        ).then(response => {
          this.loading = false;
          if (response.data.respCode == 0) {
            this.listData = response.data.list;
            this.totalCount = response.data.totalCount;
            if (this.totalCount == 0) {
              this.noDataText = "暂无数据";
            } else {
              this.listData.push(response.data.settlementCenterBean);
            }
          } else {
            this.listData = [];
            this.totalCount = 0;
            this.noDataText = "暂无数据";
            this.$Message.error(response.data.msg);
          }
        })
          .catch(err => {
            this.loading = false;
            this.noDataText = "暂无数据";
            console.log(err);
            this.$Message.error("获取列表信息失败");
          });
      },

      tabChange() {
        this.beginTime = "";
        this.endTime = "";
        this.condition = this.condition,
          this.category = this.timeChangevalue,
          this.currentPage = 1;
        this.getList()
      },

      getPageChange(page) {
        this.currentPage = page
        this.getList()
      },

      getPageSizeChange(pageSize) {
        this.pageSize = pageSize
        this.getList()
      },

      search() {
        if (!util.settlementInput(this.condition)) {
          this.$Message.info("纯数字查询至少需要5个数字");
          return;
        }
        this.currentPage = 1;
        this.getList();

      },
      showExportModal() {
        this.exportModal = true;
      },
      cancelExportModal() {
        this.exportModal = false;
      }
    }
  };
</script>
