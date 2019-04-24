<style lang="less">
</style>

<template>
  <div class="box" ref="box">
    <div class="main_header  clear">
      <div class="header_select_title">
        <Select v-model="modelSelect">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div v-if="check_perm(255)" class="input_wrap" style="width: 300px;">
        <i-input placeholder="支持模糊搜索" title="订单编号/客户名称
        /客户编号/客户邮箱/商品编号/供应商名称/供应商编号/供应商邮箱/callid/主叫/被叫" style: @on-click="search" @on-enter="search"
                 v-model.trim="condition"></i-input>
        <span class="search_btn" @click="search"><Icon type="ios-search-strong"></Icon></span>
      </div>

      <Tag v-for="item in filter_item" :key="item.key" :name="item.key" closable @on-close="tag_close">
        {{item.title}}:{{item.where}}
      </Tag>

      <div v-if="check_perm(256)" class="export_btn" @click="showExportModal"></div>
      <div class="select_div">
        <Select v-model="selected_columns" multiple class="tab_select" @on-change="select_change">
          <Option v-for="item in perm_columns" v-if="check_perm(item.rowId) && (false !== item.opt)"
                  :value="item.key" :key="item.key">
            {{item.title}}
          </Option>
        </Select>
      </div>
    </div>

    <div class="tab_wrap" :class="listData.length == 0?'tab_none_data':''">
      <Table :columns="display_columns" :data="listData"
             :height="tabHeight" :loading="loading" @on-filter-change="table_filter_change"
             :no-data-text="noDataText">
      </Table>
    </div>

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
</template>
<script>

  import {mapGetters} from "vuex";
  import dateFilter from './dateFilter.vue';
  import {perm} from "@/utils/perm.js";
  import * as api from '@/api/api';
  import * as util from '@/common/js/util'

  export default {
    data() {
      return {
        exportModal:false,
        cityList: [
          {
            value: 'orderId',
            label: '订单编号'
          },
          {
            value: 'custName',
            label: '客户名称'
          },
          {
            value: 'custCode',
            label: '客户编号'
          },
          {
            value: 'custEmail',
            label: '客户邮箱'
          },
          {
            value: 'commodityCode',
            label: '商品编号'
          },
          {
            value: 'supplierName',
            label: '供应商名称'
          },
          {
            value: 'supplierCode',
            label: '供应商编号'
          },
          {
            value: 'supplierEmail',
            label: '供应商邮箱'
          },
          {
            value: 'callId',
            label: 'callid'
          },
          {
            value: 'callingPhoneNum',
            label: '主叫'
          },
          {
            value: 'calledPhoneNum',
            label: '被叫'
          }
        ],
        modelSelect: 'custName',
        totalCount: 0,
        currentPage: 1,
        pageSize: util.pageSize,
        pageOpt: util.pageOpt,
        condition: '',
        beginTime: '',
        endTime: '',
        listData: [],
        loading: false,
        animated: false,
        tabHeight: '500',
        timeType: "datetime",
        selected_columns: [],
        display_columns: {},
        filter_where: {},
        filter_item: [],
        perm_columns: [],
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
            type: "index",
            width: 70,
            opt: false,
            fixed: 'left'
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
            where: "",
            render: (h, params) => {
              let str = '';
              let status = params.row.orderLineCategory;
              if (status == '0') {
                str = '呼入';
              } else if (status == '1') {
                str = '呼出';
              } else if (status == '2') {
                str = '呼入+呼出';
              } else {
                str = '-';
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
            title: "订单网关",
            key: "orderGateway",
            width: 200,
            rowId: 179

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
            rowId: 181,
            where: "",
            filters: [],
            filterMultiple: true,
            filterRemote: function (value, key, column) {
              column.where = value.join(',');
            }
          },
          {
            title: "商品编号",
            key: "commodityCode",
            width: 300
          },
          {
            title: "商品网关",
            key: "commodityGateway",
            width: 200,
            rowId: 185
          },
          {
            title: "商品线路类型",
            key: "commodityLineCategory",
            width: 200,
            where: "",
            render: (h, params) => {
              let str = '';
              let status = params.row.commodityLineCategory;
              if (status == '0') {
                str = '呼入';
              } else if (status == '1') {
                str = '呼出';
              } else if (status == '2') {
                str = '呼入+呼出';
              } else {
                str = '-';
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
            title: "商品类别",
            key: "commodityCategory",
            width: 150,
            rowId: 186,
            where: "",
            filters: [],
            filterMultiple: true,
            filterRemote: function (value, key, column) {
              column.where = value.join(',');
            },
          },
          {
            title: "供应商编号",
            key: "supplierCode",
            width: 300,
            rowId: 187
          },
          {
            title: "供应商邮箱",
            key: "supplierEmail",
            width: 250,
            rowId: 188
          },
          {
            title: "供应商名称",
            key: "supplierName",
            width: 200,
            rowId: 189
          },
          {
            title: "商务",
            key: "businessPerson",
            width: 100,
            rowId: 190,
            where: "",
            filters: [],
            filterMultiple: true,
            filterRemote: function (value, key, column) {
              column.where = value.join(',');
            }
          },
          {
            title: "商务归属部门",
            key: "businessDepartment",
            width: 200,
            rowId: 191,
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
            width: 300,
            rowId: 182
          },
          {
            title: "客户邮箱",
            key: "custEmail",
            width: 200,
            rowId: 183
          },
          {
            title: "客户名称",
            key: "custName",
            width: 200,
            rowId: 184
          },
          {
            title: "callid",
            key: "callId",
            width: 500
          },
          {
            title: "主叫",
            key: "callingPhoneNum",
            width: 150
          },
          {
            title: "被叫",
            key: "calledPhoneNum",
            width: 150
          },
          {
            title: "开始计费时间",
            key: "startCallTime",
            width: 200
          },
          {
            title: "结束计费时间",
            key: "endCallTime",
            width: 200,
            renderHeader: (h, params) => {
              return h(dateFilter, {
                props: {
                  title: params.column.title,
                  timeType: this.timeType,
                  fn: (startDate, endDate) => {
                    if (!startDate || !endDate || startDate.length == 0 || endDate.length == 0) {
                      startDate = "";
                      endDate = "";
                    }
                    if (endDate.slice(11) == "00:00:00") {
                      endDate = endDate.slice(0, 10) + " " + "23:59:59";
                    }
                    this.beginTime = startDate;
                    this.endTime = endDate;
                    this.currentPage = 1;
                    this.getList();
                  }
                }
              });
            },
          },
          {
            title: "挂断方",
            key: "whoStopCall",
            width: 90,
            render: (h, params) => {
              let str = '';
              let status = params.row.whoStopCall;
              if (status == '0') {
                str = '主叫';
              } else if (status == '1') {
                str = '被叫'
              } else if (status == '2') {
                str = '系统挂断';
              } else {
                str = '-'
              }

              let arr = [
                h('span', {}, str)
              ];
              return h('div', arr);
            }
          },
          {
            title: "结束原因",
            key: "stopReason",
            width: 90
          },
          {
            title: "消耗时长（秒）",
            key: "callTime",
            width: 150
          },
          {
            title: "销-资费项",
            key: "saleCategory",
            width: 90,
            render: (h, params) => {
              let str = '';
              let status = params.row.saleCategory;
              if (status == '0') {
                str = '流量'
              } else if (status == '1') {
                str = '包月'
              } else {
                str = '-'
              }
              let arr = [
                h('span', {}, str)
              ];
              return h('div', arr);
            }
          },
          {
            title: "销-线路类型",
            key: "saleLineCategory",
            width: 200,
            render: (h, params) => {
              let str = '';
              let status = params.row.saleLineCategory;
              if (status == '0') {
                str = '国际';
              } else if (status == '1') {
                str = '分网网内长市合一'
              } else if (status == '2') {
                str = '分网网内固话长途（长市区分）';
              } else if (status == '3') {
                str = '分网网内固话短途（长市区分）'
              } else if (status == '4') {
                str = '分网网内手机长途（长市区分）';
              } else if (status == '5') {
                str = '分网网内手机短途（长市区分）'
              } else if (status == '6') {
                str = '分网网间长市合一';
              } else if (status == '7') {
                str = '分网网间固话长途（长市区分）'
              } else if (status == '8') {
                str = '分网网间固话短途（长市区分）';
              } else if (status == '9') {
                str = '分网网间手机长途（长市区分）'
              } else if (status == '10') {
                str = '分网网间手机短途（长市区分）';
              } else if (status == '11') {
                str = '全网本地固话'
              } else if (status == '12') {
                str = '全网长途固话';
              } else if (status == '13') {
                str = '全网本地手机'
              } else if (status == '14') {
                str = '全网长途手机';
              } else {
                str = '全网';
              }
              let arr = [
                h('span', {}, str)
              ];
              return h('div', arr);
            }
          },
          {
            title: "销-客户计费模式",
            key: "saleCustChargeType",
            width: 200,
            render: (h, params) => {
              let str = '';
              let status = params.row.saleCustChargeType;
              if (status == '0') {
                str = '固定计费（流量）';
              } else if (status == '1') {
                str = '两段计费（流量）'
              } else if (status == '2') {
                str = '折算成小时（包月）';
              } else {
                str = '-';
              }
              let arr = [
                h('span', {}, str)
              ];
              return h('div', arr);
            }
          },
          {
            title: "销-前计费周期（秒）",
            key: "saleBeforeChargeCycle",
            width: 160
          },
          {
            title: "销-前计费周期价格（元）",
            key: "saleBeforeChargeCyclePrice",
            width: 200
          },
          {
            title: "销-前计费周期消耗（元）",
            key: "saleBeforeChargeCycleConsumption",
            width: 200
          },
          {
            title: "销-固定计费周期（秒）",
            key: "saleChargeCycle",
            width: 180
          },
          {
            title: "销-计费单元（个）",
            key: "saleChargeUnit",
            width: 150
          },
          {
            title: "销-每单元费率（元）",
            key: "saleChargeUnitPrice",
            width: 160
          },
          {
            title: "销-计费时长（秒）",
            key: "saleCountTime",
            width: 150
          },
          {
            title: "销-固定周期消耗（元）",
            key: "saleChargeCycleConsumption",
            width: 180
          },
          {
            title: "客户消耗（元）",
            key: "saleTotalConsumption",
            width: 140
          },
          {
            title: "挂-资费项",
            key: "listingCategory",
            width: 100,
            render: (h, params) => {
              let str = '';
              let status = params.row.listingCategory;
              if (status == '0') {
                str = '流量'
              } else if (status == "1") {
                str = '包月'
              } else {
                str = '-';
              }
              let arr = [
                h('span', {}, str)
              ];
              return h('div', arr);
            }
          },
          {
            title: "挂-线路类型",
            key: "listingLineCategory",
            width: 150,
            render: (h, params) => {
              let str = '';
              let status = params.row.listingLineCategory;
              if (status == '0') {
                str = '国际';
              } else if (status == '1') {
                str = '分网网内长市合一'
              } else if (status == '2') {
                str = '分网网内固话长途（长市区分）';
              } else if (status == '3') {
                str = '分网网内固话短途（长市区分）'
              } else if (status == '4') {
                str = '分网网内手机长途（长市区分）';
              } else if (status == '5') {
                str = '分网网内手机短途（长市区分）'
              } else if (status == '6') {
                str = '分网网间长市合一';
              } else if (status == '7') {
                str = '分网网间固话长途（长市区分）'
              } else if (status == '8') {
                str = '分网网间固话短途（长市区分）';
              } else if (status == '9') {
                str = '分网网间手机长途（长市区分）'
              } else if (status == '10') {
                str = '分网网间手机短途（长市区分）';
              } else if (status == '11') {
                str = '全网本地固话'
              } else if (status == '12') {
                str = '全网长途固话';
              } else if (status == '13') {
                str = '全网本地手机'
              } else if (status == '14') {
                str = '全网长途手机';
              } else {
                str = '全网';
              }
              let arr = [
                h('span', {}, str)
              ];
              return h('div', arr);
            }
          },

          {
            title: "挂-客户计费模式",
            key: "listingCustChargeType",
            width: 200,
            render: (h, params) => {
              let str = '';
              let status = params.row.listingCustChargeType;
              if (status == '0') {
                str = '固定计费（流量）';
              } else if (status == '1') {
                str = '两段计费（流量）'
              } else if (status == '2') {
                str = '折算成小时（包月）';
              } else {
                str = '-';
              }
              let arr = [
                h('span', {}, str)
              ];
              return h('div', arr);
            }
          },
          {
            title: "挂-前计费周期（秒）",
            key: "listingBeforeChargeCycle",
            width: 160
          },
          {
            title: "挂-前计费周期价格（元）",
            key: "listingBeforeChargeCyclePrice",
            width: 200
          },
          {
            title: "挂-前计费周期消耗（元）",
            key: "listingBeforeChargeCycleConsumption",
            width: 200
          },
          {
            title: "挂-固定计费周期（秒）",
            key: "listingChargeCycle",
            width: 180
          },
          {
            title: "挂-计费单元（个）",
            key: "listingChargeUnit",
            width: 150
          },
          {
            title: "挂-每单元费率（元）",
            key: "listingChargeUnitPrice",
            width: 160
          },
          {
            title: "挂-计费时长（秒）",
            key: "listingCountTime",
            width: 150
          },
          {
            title: "挂-固定周期消耗（元）",
            key: "listingChargeCycleConsumption",
            width: 180
          },
          {
            title: "平台消耗（元）",
            key: "listingingTotalConsumption",
            width: 140
          },
          {
            title: "成-资费项",
            key: "costCategory",
            width: 90,
            render: (h, params) => {
              let str = '';
              let status = params.row.costCategory;
              if (status == '0') {
                str = '流量'
              } else if (status == '1') {
                str = '包月'
              } else {
                str = '-';
              }
              let arr = [
                h('span', {}, str)
              ];
              return h('div', arr);
            }
          },
          {
            title: "成-线路类型",
            key: "costLineCategory",
            width: 250,
            render: (h, params) => {
              let str = '';
              let status = params.row.costLineCategory;
              if (status == '0') {
                str = '国际';
              } else if (status == '1') {
                str = '分网网内长市合一'
              } else if (status == '2') {
                str = '分网网内固话长途（长市区分）';
              } else if (status == '3') {
                str = '分网网内固话短途（长市区分）'
              } else if (status == '4') {
                str = '分网网内手机长途（长市区分）';
              } else if (status == '5') {
                str = '分网网内手机短途（长市区分）'
              } else if (status == '6') {
                str = '分网网间长市合一';
              } else if (status == '7') {
                str = '分网网间固话长途（长市区分）'
              } else if (status == '8') {
                str = '分网网间固话短途（长市区分）';
              } else if (status == '9') {
                str = '分网网间手机长途（长市区分）'
              } else if (status == '10') {
                str = '分网网间手机短途（长市区分）';
              } else if (status == '11') {
                str = '全网本地固话'
              } else if (status == '12') {
                str = '全网长途固话';
              } else if (status == '13') {
                str = '全网本地手机'
              } else if (status == '14') {
                str = '全网长途手机';
              } else {
                str = '全网';
              }
              let arr = [
                h('span', {}, str)
              ];
              return h('div', arr);
            }
          },
          {
            title: "成-客户计费模式",
            key: "costCustChargeType",
            width: 200,
            render: (h, params) => {
              let str = '';
              let status = params.row.costCustChargeType;
              if (status == '0') {
                str = '固定计费（流量）';
              } else if (status == '1') {
                str = '两段计费（流量）'
              } else if (status == '2') {
                str = '折算成小时（包月）';
              } else {
                str = '-';
              }
              let arr = [
                h('span', {}, str)
              ];
              return h('div', arr);
            }
          },
          {
            title: "成-前计费周期（秒）",
            key: "costBeforeChargeCycle",
            width: 160
          },
          {
            title: "成-前计费周期价格（元）",
            key: "costBeforeChargeCyclePrice",
            width: 200
          },
          {
            title: "成-前计费周期消耗（元）",
            key: "costBeforeChargeCycleConsumption",
            width: 200
          },
          {
            title: "成-固定计费周期（秒）",
            key: "costChargeCycle",
            width: 180
          },
          {
            title: "成-计费单元（个）",
            key: "costChargeUnit",
            width: 150
          },
          {
            title: "成-每单元费率（元）",
            key: "costChargeUnitPrice",
            width: 160
          },
          {
            title: "成-计费时长（秒）",
            key: "costCountTime",
            width: 150
          },
          {
            title: "成-固定周期消耗（元）",
            key: "costChargeCycleConsumption",
            width: 180
          },
          {
            title: "成本消耗（元）",
            key: "costTotalConsumption",
            width: 140
          },
          {
            title: "销售毛利（销售-挂牌）",
            key: "saleProfit",
            width: 180
          },
          {
            title: "平台毛利（挂牌-成本）",
            key: "platformProfit",
            width: 180
          },
          {
            title: "企业毛利（销售-成本）",
            key: "companyProfit",
            width: 180
          }
        ]
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
      this.tabHeight = (document.documentElement.clientHeight - 180 - 40);
      this.init();
      this.getList();
    },
    methods: {
      init() {

        //获取销售名称
        this.get_saleman_name();

        //获取部门名称
        this.get_department_name();

        //获取商品类型/类别
        this.get_goods_type();

        //获取商务
        this.get_businessPerson_name();

        //获取初始列选择
        this.all_columns.forEach(function (value) {
          if (this.check_perm(value.rowId)) {
            //获取权限列选择
            this.perm_columns.push(value);

            //获取初始列选择
            this.selected_columns.push(value.key);
          }
        }, this);

        this.select_change();
      },

      select_change() {
        //改变显示列
        let display_columns = [];
        this.perm_columns.forEach(function (value) {
          if (false === value.opt || this.selected_columns.indexOf(value.key) !== -1) {
            display_columns.push(value);
          }
        }, this);
        this.display_columns = display_columns;
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

      get_goods_type() {
        this.loading = true;
        api.fetchGoodType().then(response => {
          this.loading = false;
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
          this.loading = false;
          this.$Message.error("获取列表信息失败");
        });
      },

      get_businessPerson_name() {
        this.loading = true;
        api.fetchquerySaleMan({
          roleName: "商务"
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
              if (value.key == "businessPerson") {
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
            this.filter_item.splice(index, 1);
            delete this.filter_where[value.key];
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
          url: '/vcloud/settlementCenter/finaDeptReport/finaDetailExcel', data: {
            condition: this.condition,
            beginTime: this.beginTime,
            endTime: this.endTime,
            excludeField: excludeField,
            where: whereStr,
            modelSelect: this.modelSelect
          }
        })
      },

      getList(beginDate, endDate) {
        this.loading = true;
        api.fetch_businessDetail_report_info(
          {
            condition: this.condition,
            pageNo: this.currentPage,
            pageNum: this.pageSize,
            beginTime: this.beginTime,
            endTime: this.endTime,
            where: JSON.stringify(this.filter_where),
            modelSelect: this.modelSelect
          }
        ).then(response => {
          this.loading = false;
          if (response.data.respCode == 0) {
            this.listData = response.data.list;
            this.totalCount = response.data.totalCount;
            if (this.totalCount == 0) {
              this.noDataText = "暂无数据";
            }
          } else {
            this.noDataText = "暂无数据";
            this.listData = [];
            this.totalCount = 0;
            this.$Message.error(response.data.msg);
          }
        }).catch(err => {
          console.log(err);
          this.loading = false;
          this.noDataText = "暂无数据";
          this.$Message.error("获取列表信息失败");
        });
      },

      getPageChange(page) {
        this.currentPage = page
        this.getList()
      },

      getPageSizeChange(pageSize) {
        this.pageSize = pageSize
        this.getList()
      },

      filterMethod() {

      },
      search() {
        if (!util.settlementInput(this.condition)) {
          this.$Message.info("纯数字查询至少需要5个数字");
          return;
        }
        // modelSelect = this.modelSelect;
        if (this.modelSelect == '') {
          this.$Message.info("请先选择要模糊搜索的列");
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



