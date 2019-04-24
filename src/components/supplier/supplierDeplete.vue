<style lang="less">
  .tabs_chart_mod {
    .echarts {
      width: 100%;
      height: 350px;
    }
  }
</style>

<template>
  <div class="box">
    <div>
      <Tabs class="tabs_check tabs_list analysi_tabs" v-model="tabvalue" :name="tabvalue" type="card"
            :animated="animated" @on-click="tabChange()">
        <TabPane v-if="check_perm('267')" label="消耗分析" name="consumer">
          <div class="tabs_chart_main">
            <Row>
              <Col span="12">
              <div class="tabs_chart_mod">
                <div class="chart_mod_wrap">
                  <div  class="no_data" v-if="consumerObj.series[0].data.length == 0">销售额暂无数据</div>
                  <chart :options="pie" ref="consumerPie" auto-resize></chart>
                </div>
              </div>
              </Col>
              <Col span="12">
              <div class="tabs_chart_mod">
                <div class="chart_mod_wrap">
                  <div  class="no_data" v-if="grossObj.series[0].data.length == 0">销售额暂无数据</div>
                  <chart :options="pie" ref="grossPie" auto-resize></chart>
                </div>
              </div>
              </Col>
            </Row>
            <div class="tab_chart_list clear">
              <div class="tab_chart_list_head">
                消耗分布
                <div class="tab_export_btn" @click="exportData"></div>
              </div>
              <Table :columns="consumerList" :data="consumerTableData" @on-sort-change="comsumerSortChange"
                     :loading="loading"></Table>
            </div>
          </div>
        </TabPane>
        <TabPane v-if="check_perm('238')" label="资源分布列表" name="resourceList">
          <div class="main_header clear">

            <!--<RadioGroup v-model="monthSelect" v-for="(item, index) in monthList" type="button" size="large"-->
                        <!--@on-change="selectMonthData">-->
              <!--<Radio :label="index">{{item}}</Radio>-->
            <!--</RadioGroup>-->
            <div style="float: left;font-size: 14px;">
              请选择时间：
              <Select v-model="monthSelect" @on-change="selectMonthData" style="width: 100px;">
                <Option v-for="(item, index) in monthList" :value="index" :key="index">{{ item }}</Option>
              </Select>
            </div>
            <Tag class="tag_header_mod" v-for="item in filter_item" :key="item.key" :name="item.key" closable
                 @on-close="tag_close">
              {{item.title}}:{{item.where}}

            </Tag>

            <div class="export_btn" @click="exportDataClick"></div>
          </div>
          <div class="tab_wrap" :class="resourceData.length == 0?'tab_none_data':''">
            <Table :columns="resourcesList" :data="resourceData" :loading="loading" @on-sort-change="resourceSortChange"
                   :height="tabHeightBig" @on-filter-change="table_filter_change"></Table>
          </div>
        </TabPane>
      </Tabs>
      <div class="page_btm_div" v-if="totalCount">
        <Page class="page_iview_right" v-if="totalCount" :total="totalCount" :page-size="pageSize"
              :current="currentPage"
              :page-size-opts="pageOpt" size="small" show-elevator show-sizer show-total placement="top"
              @on-change="getPageChange" @on-page-size-change="getPageSizeChange"></Page>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from "vuex";

  import {perm} from "@/utils/perm.js";
  import * as util from "@/common/js/util";
  import ECharts from 'vue-echarts/components/ECharts.vue'

  // 手动引入 ECharts 各模块来减小打包体积
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/title'
  import 'echarts/lib/chart/pie'
  import pie from '@/common/data/pie.js'
  import * as api from '@/api/api'

  export default {
    data() {
      return {
        model11:12,
        grossObj: {
          title: {
            text: '最近3个月毛利TOP10',
            subtext: '注：不包含本月',
          },
          legend: {
            data: [],
          },
          series: [
            {
              name: '毛利',
              type: 'pie',
              data: [],
            }
          ]
        },
        consumerObj: {
          title: {
            text: '最近3个月消耗TOP10',
            subtext: '注：不包含本月',
          },
          legend: {
            data: [],
          },
          series: [
            {
              name: '消耗',
              type: 'pie',
              data: [],
            }
          ]
        },
        animated: false,
        tabHeightBig: 500,
        totalCount: 0,
        currentPage: 1,
        pageSize: util.pageSize,
        pageOpt: util.pageOpt,
        perm: perm.commodity,
        pie,
        monthSelect: 12,
        loading: false,
        tabvalue: '',
        range: 0,
        condition: "",
        rangeWhere: "",
        consumerTableData: [],
        filter_item: [],
        monthList: [],
        resourceData: [],
        cityNameFilters: [],
        consumerList: [
          {
            title: '序号',
            key: 'index',
            type: 'index',
            width: 70
          },
          {
            title: '供应商名称',
            key: 'supplierName',
            width: 150
          },
          {
            title: '供应商编号',
            key: 'supplierCode',
            width: 300
          },
          {
            title: '最近3个月消耗(元)',
            key: 'costTotalConsumption',
//            width:160,
            sortable: true
          },
          {
            title: '最近3个月毛利(元)',
            key: 'platformProfit',
//            width: 160,
            sortable: true
          },
          {
            title: '毛利率',
            key: 'grossProfitRate',
            sortable: true,
            render: (h, params) => {
              let str = params.row.grossProfitRate + '%';
              let arr = [
                h('span', {}, str)
              ];
              return h('div', arr);
            }
          },
          {
            title: '关联商务',
            key: 'businessPerson',
//             width: 300
          },
          {
            title: '关联部门',
            key: 'businessDepartment',
//             width: 300
          }
        ],
        resourcesList: [
          {
            title: '序号',
            key: 'index',
            type: 'index',
            width: 70
          },
          {
            title: '商品编号',
            key: 'commodityCode',
            width: 300
          },
          {
            title: '商品类别',
            key: 'goodType',
            width: 100,
            where: "",
            filters: [],
            filterMultiple: true,
            filterRemote: function (value, key, column) {
              column.where = value.join(',');
            }
          },
          {
            title: '实际消耗（元）',
            key: 'costTotalConsumption',
            width: 140,
            sortable: true
          },
          {
            title: '负载率',
            key: 'fzv',
            width: 120,
            sortable: true,
            render: (h, params) => {
            let str = params.row.fzv + '%';
            let arr = [
              h('span', {}, str)
            ];
            return h('div', arr);
          }
          },
          {
            title: '库存(E1条数)',
            key: 'store',
            width: 80,
          },
          {
            title: '统计时间',
            key: 'statisticsTime',
            width: 150
          },
          {
            title: '使用场景',
            key: 'usage',
            width: 120
          },
          {
            title: '三网',
            key: 'operatorTypeName',
            width:100,
            where: "",
            filters: [
              {
                label: "移动",
                value: "0"
              },
              {
                label: "联通",
                value: "1"
              },
              {
                label: "电信",
                value: "2"
              }
            ],
            filterMultiple: true,
            filterRemote: function (value, key, column) {
              column.where = value.join(',');
            },
          },
          {
            title: '地域',
            key: 'cityName',
            width: 100,
            where: "",
            filters: [],
            filterMultiple: true,
            className:'area_table',
            filterRemote: function (value, key, column) {
              column.where = value.join(',');
            }
          },
          {
            title: '供应商',
            key: 'supplierName',
            width: 120
          },
          {
            title: '商务名称',
            key: 'businessPerson',
            width: 100
          },
          {
            title: '商务部门',
            key: 'businessDepartment',
            width: 100
          }
        ],
        filter_where: {}
      }
    },
    computed: {
      ...mapGetters({
        check_perm: "main/check_perm",
      })
    },

    watch: {
     perm_info(newData,old){
      this.init();
     }
    },
    created: function () {
      this.tabHeightBig = (document.documentElement.clientHeight - 240);
      //  获取商品类型
      this.init();
    },


    methods: {
      init(){
          if(this.check_perm('267')){
          this.tabvalue = "consumer";
          this.get_goods_type();
          this.getSupperdata();
        }else if(this.check_perm('238')){
          this.tabvalue = "resourceList";
          this.monthSelect = 12;
          this.getCityName();
          this.get_supplier_resource_list();
        }else{
          ;
        }
      },
      getSupperdata() {
        this.getSupplierTopList();
        this.rangeWhere = "grossProfitRate";
        this.getSupplierConsumerList();
      },

      tabChange() {
        this.currentPage = 1;
        this.range = 0;
        this.filter_where = {};
        this.rangeWhere = "";
        this.monthSelect = null;
        this.condition = "";
        if (this.tabvalue == "resourceList") {
          this.monthSelect = 12;
          this.getCityName();
          this.get_supplier_resource_list();
        } else {
          this.getSupperdata();
        }
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
            this.resourcesList.forEach(function (value, index) {
              if (value.key == "goodType") {
                this.resourcesList[index].filters = resp_data;
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
        this.get_supplier_resource_list();
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
          this.get_supplier_resource_list();
          return;
        }

        this.filter_where[col.key] = col.where;
        if (col.where) {
          let flag = false;
          this.filter_item.forEach(function (value, index) {
            if (col.key == value.key) {
              let tmpcol = col;
              let tmpWhere = tmpcol.where
              tmpcol.where = tmpWhere.replace(/0/, "移动").replace(/1/, "联通").replace(/2/, "电信");
              this.filter_item.splice(index, 1, tmpcol);
              flag = true;
            }
          }, this);

          if (!flag) {
            let tmpcol = col;
            let tmpWhere = tmpcol.where
            tmpcol.where = tmpWhere.replace(/0/, "移动").replace(/1/, "联通").replace(/2/, "电信");
            this.filter_item.push(tmpcol);
          }
        }
        this.currentPage = 1;
        this.get_supplier_resource_list();
      },


      selectMonthData() {
        this.currentPage = 1;
        this.get_supplier_resource_list();
      },

      get_supplier_resource_list() {
        this.loading = true;
        api.fetch_supplier_resource_table_info(
          {
            where: JSON.stringify(this.filter_where),
            pageNo: this.currentPage,
            pageNum: this.pageSize,
            range: this.range,
            rangeKey: this.rangeWhere,
            type: this.monthSelect
          }
        ).then(response => {
          this.loading = false;
          if (response.data.respCode == 0) {
            this.monthList = response.data.map.monthList;
            this.resourceData = response.data.list;
            this.totalCount = response.data.totalCount;
            // this.resourceData.forEach(function(value){
            //   this.cityNameFilters = value.cityName;
            // }, this)

            // this.resourcesList.forEach(function(value, index){
            //   if(value.key == "cityName"){

            //   }
            // }, this)

            // TODO 解析供应商资源分布列表response 消息
          } else {
            this.resourceData = [];
            this.totalCount = 0;
          }
        }).catch(err => {
          console.log(err);
          this.loading = false;
          this.$Message.error("获取列表信息失败");
        });
      },

      getSupplierConsumerList() {
        this.loading = true;
        api.fetch_supplier_consumer_table_info(
          {
            condition: this.condition,
            where: JSON.stringify(this.filter_where),
            pageNo: this.currentPage,
            pageNum: this.pageSize,
            range: this.range,
            rangeWhere: this.rangeWhere,
          }
        ).then(response => {
          this.loading = false;
          if (response.data.respCode == 0) {
            this.consumerTableData = response.data.list;
            this.totalCount = response.data.totalCount;
          } else {
            this.consumerTableData = [];
            this.totalCount = 0;
            this.$Message.error(response.data.msg);
          }
        }).catch(err => {
          console.log(err);
          this.loading = false;
          this.$Message.error("获取列表信息失败");
        });
      },

      getSupplierTopList() {
        this.loading = true;
        api.fetch_supplier_top_info({}).then(response => {
          this.loading = false;
          if (response.data.respCode == 0) {

            let consumerDOM = this.$refs.consumerPie;
            let supplierName = [];
            let costTotalConsumption = [];
            for (let i = 0; i < response.data.map.costTotalConsumptionTop.length; i++) {
              supplierName.push(response.data.map.costTotalConsumptionTop[i].supplierName);
              costTotalConsumption.push({
                value: response.data.map.costTotalConsumptionTop[i].costTotalConsumption,
                name: response.data.map.costTotalConsumptionTop[i].supplierName
              });
            }
//            let consumerObj = {
//              title: {
//                text: '最近3个月消耗TOP10',
//                subtext: '注：不包含本月',
//              },
//
//              legend: {
//                data: supplierName,
//              },
//              series: [
//                {
//                  name: '消耗',
//                  type: 'pie',
//                  data: costTotalConsumption,
//                }
//              ]
//            }

            this.consumerObj.legend.data = supplierName;
            this.consumerObj.series[0].data = costTotalConsumption;
            consumerDOM.mergeOptions(this.consumerObj);

            let grossPieDOM = this.$refs.grossPie;
            let grossSupplierName = [];
            let companyProfit = [];
            for (let i = 0; i < response.data.map.companyProfitTop.length; i++) {
              grossSupplierName.push(response.data.map.companyProfitTop[i].supplierName);
              companyProfit.push({
                value: response.data.map.companyProfitTop[i].platformProfit,
                name: response.data.map.companyProfitTop[i].supplierName
              });
            }

//            let grossObj = {
//              title: {
//                text: '最近3个月毛利TOP10',
//                subtext: '注：不包含本月',
//              },
//              legend: {
//                data: grossSupplierName,
//              },
//              series: [
//                {
//                  name: '毛利',
//                  type: 'pie',
//                  data: companyProfit,
//                }
//              ]
//            };
            this.grossObj.legend.data = grossSupplierName;
            this.grossObj.series[0].data = companyProfit;

            grossPieDOM.mergeOptions(this.grossObj);
          } else {
            this.resourceData = [];
            this.totalCount = 0;
            this.$Message.error(response.data.msg);
          }
        }).catch(err => {
          console.log(err);
          this.loading = false;
          this.$Message.error("获取列表信息失败");
        });
      },

      comsumerSortChange(params) {
        this.range = (params.order == "asc" ? 1 : 0);
        this.rangeWhere = params.key;
        this.currentPage = 1;
        this.getSupplierConsumerList();
      },

      resourceSortChange(params) {
        this.range = (params.order == "asc" ? 1 : 0);
        this.rangeWhere = params.key;
        this.currentPage = 1;
        this.get_supplier_resource_list();
      },

      getCityName(){
        api.fetch_city_list_info({}).then(response => {
          if (response.data.respCode == 0) {
            let resp_data = response.data.list;
            resp_data.forEach(function (value) {
              value.label = value.city_name;
              value.value = value.city_name;
            });

            this.resourcesList.forEach(function (value, index) {
            if (value.key == "cityName") {
              this.resourcesList[index].filters = resp_data;
            }
            }, this);

          } else {
             this.$Message.error(response.data.msg);
          }
        }).catch(err => {
          console.log(err);
          this.$Message.error("获取信息失败");
        });

      },

      getPageChange(page) {
        this.currentPage = page;

        if (this.tabvalue == "consumer") {
          this.getSupplierConsumerList();
        } else {
          this.get_supplier_resource_list();
        }

      },

      getPageSizeChange(pageSize) {
        this.pageSize = pageSize;
        if (this.tabvalue == "consumer") {
          this.getSupplierConsumerList();
        } else {
          this.get_supplier_resource_list();
        }

      },

      exportData() {
        if(this.totalCount == 0){
          this.$Message.error("数据为空，不能导出");
          return
        }
        var whereStr = JSON.stringify(this.filter_where).replace(/"/g, '\'')
        api.DownLoadFile({
          url: '/vcloud/statisticsManage/supplier/exportConsumeGPList', data: {
            range: this.range,
            rangeWhere: this.rangeWhere,
          }
        })
      },
      exportDataClick() {
        if(this.totalCount == 0){
          this.$Message.error("数据为空，不能导出");
          return
        }
        //资源分布列表数据导出
        var whereStr = JSON.stringify(this.filter_where).replace(/"/g, '\'')
        api.DownLoadFile({
          url: '/vcloud/statisticsManage/supplier/exportSysResourceList', data: {
            condition: this.condition,
            where: whereStr,
            type: this.monthSelect
          }
        })
      }
    },
    mounted() {

    },
    components: {
      chart: ECharts
    }
  };
</script>
