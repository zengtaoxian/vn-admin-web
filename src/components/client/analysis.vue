<style lang="less">
  .tabs_chart_mod{
    .echarts{
      width: 100%;
      height: 350px;
    }
  }
  .analysi_tabs{
    .ivu-tabs-bar{
      margin-bottom: 0;
    }
  }
</style>

<template>
  <div class="box">
    <div>
      <Tabs v-model="analysisValuel" :name="analysisValuel" class="tabs_check tabs_list analysi_tabs"  type="card" :animated="animated" @on-click="tabClick">
        <TabPane label="销售分析" name="name1" v-if="havePerm('261')">
          <div class="tabs_chart_main">
            <Row>
              <Col span="12">
              <div class="tabs_chart_mod">
                <div class="chart_mod_wrap">
                  <div  class="no_data" v-if="saleObj.series[0].data.length == 0">销售额暂无数据</div>
                  <chart
                  :options="salePieOpt"
                    ref="salePie"
                    auto-resize
                  />

                </div>

              </div>
              </COl>
              <Col span="12">
              <div class="tabs_chart_mod">
                <div class="chart_mod_wrap">
                  <div class="no_data" v-if="grossObj.series[0].data.length == 0">毛利暂无数据</div>
                  <chart  :options="grossPieOpt" ref="grossPie" auto-resize />
                </div>

              </div>
              </COl>
            </Row>
            <div class="tab_chart_list clear">
              <div class="tab_chart_list_head" span="50">
                销售分布
                <div class="tab_export_btn" @click="salesExportData"></div>
              </div>

              <div class="tab_wrap">
                <Table :columns="saleList" :data="salesData" :height="tabHeight" @on-sort-change="saleSortChange" :loading="loading"></Table>
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane label="无资源订单" name="name2" v-if="havePerm('260')">
          <div class="main_header clear">
          <div v-if="havePerm('208')" id="input_wrap_middle">
            <i-input placeholder="销售名称/归属地/订单编号" style:
            @on-click="search" @on-enter="search" v-model.trim="condition"></i-input>
            <span class="search_btn" @click="search"><Icon type="ios-search-strong"></Icon></span>
          </div>
          <div v-if="havePerm('213')" class="export_btn" @click="exportData"></div>
            <!-- <span class="export_def_btn">导出</span> -->
          </div>
          <Tag class="tag_header_mod" v-for="item in filter_item" :key="item.key" :name="item.key" closable @on-close="tag_close">
              {{item.title}}:{{item.where}}
          </Tag>
          <div class="tab_wrap" :class="resourceData.length == 0?'tab_none_data':''">
            <Table :columns="resourceList" :data="resourceData" @on-sort-change="resourceSortChange" :height="tabHeightBig" :loading="loading" @on-filter-change="table_filter_change"></Table>
          </div>
        </TabPane>
      </Tabs>
      <div class="page_btm_div" >
        <Page class="page_iview_right" :total="totalCount" :page-size="pageSize" :current="currentPage"
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
  import * as api from '@/api/api'

  // 手动引入 ECharts 各模块来减小打包体积
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/title'
  import 'echarts/lib/chart/pie'
  import pie from '@/common/data/pie.js'
  let salePieOpt = Object.assign({},pie);
  let grossPieOpt = Object.assign({},pie);

  export default {
    data() {
      return {
        analysisValuel:'name1',
        condition: "",
        currentPage: 1,
        pageSize: util.pageSize,
        totalCount:0,
        tabHeight:300,
        tabHeightBig:300,
        animated:false,
        pageOpt: util.pageOpt,
        perm: perm.commodity,
        salePieOpt,
        grossPieOpt,
        grossObj:{
          title:{
            text:'',
            subtext:'注：不包含本月'
          },
          legend:{
            data:[]
          },
          series:[
            {
              name:'',
              data:[]
            }
          ]
        },
        saleObj:{
          title:{
            text:'',
            subtext:'注：不包含本月'
          },
          legend:{
            data:[]
          },
          series:[
            {
              name:'',
              data:[]
            }
          ]
        },
        loading: false,
        range: 0,
        rangeWhere: "",
        saleList: [
          {
            title: '序号',
            key: 'id',
            type:'index',
            width: 70
          },
          {
            title: '客户编号',
            key: 'custCode',
            width:300
          },
          {
            title: '最近3个月的销售额(元)',
            key: 'lastSaleAmount',
            sortable: true
          },
          {
            title: '最近3个月毛利(元)',
            key: 'lastgrossMoney',
            sortable: true
          },
          {
            title: '毛利率',
            key: 'grossRate',
            sortable: true,
            render: (h, params) => {
              let str = params.row.grossRate + '%';
              let arr = [
                h('span', {}, str)
              ];
              return h('div', arr);
            }
          },
          {
            title: '关联销售',
            key: 'saleName'
          },
          {
            title: '关联部门',
            key: 'department'
          }
        ],
        resourceList:[
          {
            title: '序号',
            key: 'id',
            type:'index',
            width: 70
          },
          {
            title: '订单编号',
            key: 'orderId',
            width: 300
          },
          {
            title: '订单状态',
            key: 'status',
            width: 100,
            where: [],
            filters:[
              {
                label: "确认中",
                value: "0"
              },
              {
                label: "已确认",
                value: "1"
              },
              {
                label: "已取消",
                value: "2"
              },
              {
                label: "已终止",
                value: "3"
              },
              {
                label: "执行中",
                value: "4"
              },
              {
                label: "已暂停",
                value: "5"
              }
            ],
            filterMultiple: true,
            filterRemote: function(value,key,column) {
              column.where = value.join(',');
            }
          },
          {
            title: '资源类别',
            key: 'orderRequestType',
            width:120,
            where: "",
            filters: [],
            filterMultiple: true,
            filterRemote: function(value,key,column) {
              column.where = value.join(',');
            }
          },
          {
            title: '计费类别',
            key: 'requestChargeType',
            width:100,
          },
          {
            title: '需求量（E1）',
            key: 'requirementAmount',
            sortable: true,
            width: 200,
            render: (h, params) => {
              let str = '';
              let arr = '';
              let value = params.row.requirementAmount;
              if(value == "-1"){
                str = '-';
              }else{
                str = value;
              }
              arr = [h('span', {}, str)];
              return h('div', arr);
            }
          },
          {
            title: '创建时间',
            key: 'createTime',
            width: 200,
            sortable: 'custom'
          },
          {
            title: '使用场景',
            key: 'usePlace',
            width:160
          },
          {
            title: '三网',
            key: 'operatorType',
            width:100,
            where: "",
            filters: [
              {
                label: "全网",
                value: "0"
              },
              {
                label: "移动",
                value: "1"
              },
              {
                label: "联通",
                value: "2"
              },
              {
                label: "电信",
                value: "3"
              }
            ],
            filterMultiple: true,
            filterRemote: function(value,key,column) {
              column.where = value.join(',');
            }
          },
          {
            title: '归属地',
            key: 'requestCity',
            width:100
          },
          {
            title: '销售名称',
            key: 'saleman',
            width:140
          },
          {
            title: '销售部门',
            key: 'departmentName',
            width:140
          }
        ],
        resourceData: [],
        salesData: [],
        filter_item:[],
        filter_where: {},

      }
    },
    computed: mapGetters(
      {
        perm_info: "main/perm_info"
      }
    ),
    watch: {
     perm_info(newData,old){
      this.init();
     }
    },

    created:function(){
      //获取商品类型/类型
      this.tabHeightBig = (document.documentElement.clientHeight - 240);
      this.init();
    },


    methods:{
      havePerm(id) {
        return this.perm_info.indexOf(id) != -1;
      },

      init(){
        if(this.havePerm('261')){
          this.analysisValuel = "name1";
          this.getCustomerPie();
          this.get_sale_list();
        }else if(this.havePerm('260')){
          this.analysisValuel = "name2";
          this.condition = "";
          this.currentPage = 1;
          this.totalCount = 0;
          this.pageSize = util.pageSize;
          this.get_goods_type();
          this.get_resource_list();
        }else{

        }
      },

      tabClick(){
        //点击菜单
          this.condition = "";
          this.currentPage = 1;
          this.totalCount = 0;
          this.pageSize = util.pageSize;
          this.range = "0";
          this.rangeWhere = "requirementAmount";
        if(this.analysisValuel == 'name1'){
          this.getCustomerPie();
          this.get_sale_list();
        }else{
          this.get_goods_type();
          this.get_resource_list();
        }
      },

      resourceSortChange(params){
        // asc 从小到大
          this.range = (params.order == "asc" ? 1 : 0);
          this.currentPage = 1;
          this.rangeWhere = params.key;
          this.get_resource_list();
      },

      saleSortChange(params){
        this.range = (params.order == "asc" ? 1 : 0);
        this.currentPage = 1;
        this.rangeWhere = params.key;
        this.get_sale_list();

      },

      table_filter_change(col) {
        //重置操作
        if(col._filterChecked.length == 0){
          this.filter_item.forEach(function(value, index){
            if(value.key == col.key){
              this.filter_item.splice(index, 1);
            }
          }, this);

          delete this.filter_where[col.key];
          this.currentPage = 1;
          this.get_resource_list();
          return ;
        }

        this.filter_where[col.key] = col.where;
        if (col.where) {
          let flag = false;
          this.filter_item.forEach(function(value, index){
            if(col.key == value.key){
              let tmpcol = col;
              if(col.key == "operatorType"){
                tmpcol.where = tmpcol.where.replace(/0/, "全网").replace(/1/, "移动").replace(/2/,"联通").replace(/3/,"电信");
              }else if(col.key == "status"){
                tmpcol.where = tmpcol.where.replace(/0/,"确认中").replace(/1/,"已确认").replace(/2/,"已取消").replace(/3/, "已终止").replace(/4/, "执行中").replace(/5/, "已暂停");
              }
              this.filter_item.splice(index, 1, tmpcol);
              flag = true;
            }
          }, this);

          if(!flag){
            let tmpcol = col;
            if(col.key == "operatorType"){
              tmpcol.where = tmpcol.where.replace(/0/, "全网").replace(/1/, "移动").replace(/2/,"联通").replace(/3/,"电信");
            }else if(col.key == "status"){
              tmpcol.where = tmpcol.where.replace(/0/, "确认中").replace(/1/,"已确认").replace(/2/,"已取消").replace(/3/, "已终止").replace(/4/, "执行中").replace(/5/, "已暂停");
            }
            this.filter_item.push(tmpcol);
          }
        }
        this.currentPage = 1;
        this.get_resource_list();
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
            this.resourceList.forEach(function (value, index) {
              if(value.key == "orderRequestType"){
                this.resourceList[index].filters = resp_data;
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
        this.filter_item.forEach(function(value, index){
          if(value.key == name){
            value._filterChecked = [];
            value._isFiltered = false;
            delete this.filter_where[value.key];
            this.filter_item.splice(index, 1);
          }
        }, this);

        this.currentPage = 1;
        this.get_resource_list();
      },

      get_resource_list(){
        this.loading = true;
        api.fetch_no_resource_list(
          {
            condition: this.condition,
            where: JSON.stringify(this.filter_where),
            pageNo: this.currentPage,
            pageNum: this.pageSize,
            range: this.range,
            rangeWhere: this.rangeWhere
          }
        ).then(response => {
          this.loading = false;
          if (response.data.respCode == 0) {
            this.resourceData = response.data.list;
            this.totalCount = response.data.totalCount;
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

      get_sale_list(){
        this.loading = true;
        api.fetchCustomerList(
          {
            where: JSON.stringify(this.filter_where),
            pageNo: this.currentPage,
            pageNum: this.pageSize,
            range: this.range,
            rangeWhere: this.rangeWhere
          }
        ).then(response => {
          this.loading = false;
          if (response.data.respCode == 0) {
            this.salesData = response.data.list;
            this.totalCount = response.data.totalCount;
          } else {
            this.salesData = [];
            this.totalCount = 0;
            this.$Message.error(response.data.msg);
          }
        }).catch(err => {
          console.log(err);
          this.loading = false;
          this.$Message.error("获取列表信息失败");
        });
      },

      exportData() {
        if(this.totalCount == 0){
          this.$Message.error("数据为空，不能导出");
          return
        }
        var whereStr = JSON.stringify(this.filter_where).replace(/"/g, '\'')
        api.DownLoadFile({
          url: '/vcloud/statisticsManage/customer/exportLessResource', data: {
            condition: this.condition,
            range: this.range,
            where: whereStr,
            rangeWhere: this.rangeWhere
          }
        })
      },
      salesExportData() {
        if(this.totalCount == 0){
          this.$Message.error("数据为空，不能导出");
          return
        }
        api.DownLoadFile({
          url: '/vcloud/statisticsManage/customer/exportSaleAnalyseList', data: {
            range: this.range,
            rangeWhere: this.rangeWhere
          }
        })
      },

      getPageChange(page) {
        this.currentPage = page;
        if(this.analysisValuel == 'name1'){
          this.get_sale_list();
        }else{
          this.get_resource_list();
        }
      },

      getPageSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.get_resource_list();
      },

      search(){
        this.currentPage = 1;
        this.get_resource_list();
      },
      getCustomerPie(){
        api.fetchCustomerPie({}).then((res)=>{
          let grossPieDom = this.$refs.grossPie;
          let salePieDom = this.$refs.salePie;
          if(res.data.respCode == '0'){



            let grossLegend = [];
            let grossData = [];
            for(let i = 0;i<res.data.map.gross.length;i++){
              if(res.data.map.gross[i].lastgrossMoney != 0){
                grossData.push({
                  value: res.data.map.gross[i].lastgrossMoney,
                  name: res.data.map.gross[i].customName
                })
                grossLegend.push(res.data.map.gross[i].customName);
              }
            }

            let saleLegend = [];
            let saleData = [];

            for(let i = 0;i<res.data.map.sale.length;i++){
              if(res.data.map.sale[i].lastSaleAmount != 0){
                saleData.push({
                  value: res.data.map.sale[i].lastSaleAmount,
                  name: res.data.map.sale[i].customName
                })
                saleLegend.push(res.data.map.sale[i].customName);
              }
            }


            //最近3个月毛利TOP10
//            let grossObj = Object.assign({},pieConfig);
            this.grossObj.title.text = '最近3个月毛利TOP10';
            this.grossObj.legend.data = grossLegend;
            this.grossObj.series[0].data = grossData;
            this.grossObj.series[0].name = '最近3个月毛利TOP10';

            //销售额TOP10
//            let saleObj = Object.assign({},pieConfig);
            this.saleObj.title.text = '最近3个月销售额TOP10';
            this.saleObj.legend.data = saleLegend;
            this.saleObj.series[0].data = saleData;
            this.saleObj.series[0].name = '最近3个月销售额TOP10';


            salePieDom.mergeOptions(this.saleObj);
            grossPieDom.mergeOptions(this.grossObj);

          }else{
            this.$Message.error(res.data.msg);
          }
        }).catch((err)=>{
          console.log(err)
        })
      },
      getCustomerList(){
        api.fetchCustomerList({
          pageNo:1,
          pageNum:30
        }).then((res)=>{
          if(res.data.respCode == '0'){
            this.salesData = res.data.list
          }else{
            this.$Message.error(res.data.msg);
          }
        }).then((err)=>{
          console.log(err)
        })
      },
    },

    mounted () {
    },

    components: {
      chart: ECharts
    }
  };
</script>
