<style lang="less">
  @import "../../common/less/client.less";

  .detail_btn_go, .detail_btn_go:hover {
    color: #00b4ff;
    padding-left: 36px;
    padding-right: 36px;
    background: #fff;
    border: #00b4ff solid 1px;
  }

</style>
<template>
  <div class="box">

    <div class="main_header clear" >
      <div class="input_wrap" v-if="havePerm('44')">
        <i-input placeholder="供应商编号/供应商名称/联系手机" style: @on-enter="search" v-model.trim="condition"></i-input>
        <span class="search_btn" @click="search"><Icon type="ios-search-strong"></Icon></span>
      </div>

      <div class="header_btn" v-if="havePerm('43')">
        <i-button type="primary" @click="modify()">
          <Icon type="plus-round"></Icon>&nbsp;&nbsp;新增供应商
        </i-button>
      </div>
      <div class="export_btn" v-if="havePerm('45')" @click="exportData"></div>
      <!--<div class="select_div">-->
      <!--<Select v-model="tableColumnsChecked" multiple class="tab_select"  @on-change="changeTableColumns">-->
      <!--<Option v-for="item in tabHeadList" :value="item.key" :key="item.key">{{ item.title }}</Option>-->
      <!--</Select>-->
      <!--</div>-->
    </div>

    <div class="tab_wrap">
      <Table :columns="columns1" :data="listData" :height="tabHeight" :loading="loading" :no-data-text="noDataText"></Table>
    </div>
    <div class="page_btm_div" v-if="totalCount">
      <Page class="page_iview_right" :total="totalCount" :page-size="pageNum" :current="pageNo"
            :page-size-opts="pageOpt" size="small" show-elevator show-sizer show-total placement="top"
            @on-change="getPageChange" @on-page-size-change="getPageSizeChange"></Page>
    </div>


    <Modal v-model="modal1" :title="titleName" :mask-closable="false" @on-ok="ok" @on-cancel="cancel" :scrollable="scrollable" width="680">
      <Form ref="formValidate" :label-width="100">
        <Row>
          <Col offset="1" span="6" style="font-size: 14px;">
          基本信息</Col>
        </Row>
        <row>
          <Col class="margin_bt0" span="22" offset="1">
          <FormItem label="供应商编码" v-if="formValidate.id==''?false:true">
            <Input v-model="formValidate.supplierNo" :disabled="true"></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="供应商名称">
            <Input v-model="formValidate.supplierName" :maxlength="64" placeholder="长度不超过64，由（中文、英文、数字、下划线_或中划线-）组成"></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="联系人">
            <Input v-model="formValidate.supplierPerson" :maxlength="10" placeholder="10字以内"></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="联系手机">
            <Input v-model="formValidate.phone" placeholder="11位有效数字手机号码" :maxlength="32"></Input>
          </FormItem>
          <FormItem label="联系座机">
            <Row>
              <!-- <Col class="margin_bt0" span="6">
                 <Input  placeholder="区号" v-model="formValidate.areaCode"></Input>
               </Col>-->
              <!--<Col class="margin_bt0" span="17" offset="1">-->
              <Input placeholder="座机号" v-model="formValidate.mobile" :maxlength="32"></Input>
              <!--</Col>-->
            </Row>
          </FormItem>
          <FormItem label="邮箱地址" class="email">
            <Input v-model="formValidate.email" :maxlength="32" placeholder="请输入正确的邮箱地址"></Input>
          </FormItem>
          <FormItem label="详细地址" class="address">
            <Input v-model="formValidate.address" type="textarea" :maxlength="128" placeholder="详细街道信息" :autosize="{minRows: 2,maxRows: 5}"></Input>
          </FormItem>
          </Col>
        </row>
        <Row>
          <Col span="22" offset="1" class="role">
          <FormItem class="ivu-form-item-required saleManId" label="关联商务">
            <Select v-model="formValidate.salemanId" filterable placeholder='请选择'>
              <Option v-for="item in saleManList" :value="item.id" :key="item.id">{{ item.userName }}</Option>
            </Select>
          </FormItem>
          <!--<FormItem class="ivu-form-item-required saleManId" label="供应商级别">
            &lt;!&ndash; <Input v-model="formValidate.level" placeholder="1-10字以内"></Input> &ndash;&gt;
            <el-radio-group v-model="formValidate.level">
              <el-radio-button :label="0">无级别</el-radio-button>
              <el-radio-button :label="1">普通</el-radio-button>
              <el-radio-button :label="2">皇冠</el-radio-button>
              <el-radio-button :label="3">钻石</el-radio-button>
            </el-radio-group>
          </FormItem>-->
          <!-- <FormItem class="createPerson" label="创建人">
            <div>{{formValidate.serviceTypeId}}</div>
          </FormItem> -->
          <FormItem class="ivu-form-item-required " label="创建人" v-show="formValidate.id == ''?false:true ">
            <Input v-model="formValidate.createUser" :disabled="true"></Input>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="22" offset="1">
          <FormItem class="ivu-form-item-required " label="资源类别">
            <CheckboxGroup v-model="formValidate.serviceType" class="morecheck">
              <Checkbox v-for="goods in resourcesList" :label="goods.id" :key="goods.id">{{goods.typeName}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="操作" v-model="formValidate.id" v-show="false"></FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22" offset="1">
          <!--<div class="footer">-->
            <!--<Button type="ghost" class="subbtn" @click="handleReset('formValidate')">取消</Button>-->
            <!--<Button type="primary" class="subbtn" @click="handleSubmit('formValidate')">保存</Button>-->
          <!--</div>-->
            <div class="footer_modal">
              <Button type="ghost" class="sub_btn_size" @click="handleReset('formValidate')">取消</Button>
              <Button type="primary" class="sub_btn_size" @click="handleSubmit('formValidate')" :disabled="disable">保存</Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal v-model="isDatailShow"  class="detail_modal" @on-ok="ok" @on-cancel="cancel" width="680">
      <!--<div :style="{display:isDatailShow?'block':'none'}" class="detail_alert" style="display:none">-->
      <div>
        <div slot="header">
          <div class="detail_top  clear">
            <img class="top_img" src="../../assets/images/client_img.png" alt="">
            <div class="detail_top_right">
              <p class="title">{{formValidate.supplierName}}</p>
              <p class="code">{{formValidate.supplierNo}}</p>
            </div>
            <span class="top_btn">
            <span class="btn" @click="modify(formValidate); " v-if="havePerm('48')">编辑</span>
              <!--  <span class="btn" @click="deleteSupplier(formValidate.id); ">删除供应商</span>-->
          </span>
            <!--<span class="detail_close" @click="closeDetail">-->
            <!--<i class="ivu-icon ivu-icon-ios-close-empty"></i>-->
          <!--</span>-->
          </div>
        </div>

        <div>
          <Tabs class="tabs_check" v-model="tabName" :name="tabName" type="card" :animated="animated"
                @on-click="tabChange()">
            <TabPane label="基本资料"  v-if="havePerm('47')" name="basicInfo">
              <div class="tabs_detail_content_top">
                <ul class="tabs_detail_top_ul">
                  <li class="tabs_detail_top_li">
                    <h4 class="tabs_detail_top_title">供应商级别</h4>
                    <div class="tabs_detail_top_text" :title="formValidate.level" v-html="formValidate.level?formValidate.level:'-'"></div>
                  </li>
                  <li class="tabs_detail_top_li">
                    <h4 class="tabs_detail_top_title">关联商务</h4>
                    <div class="tabs_detail_top_text" :title="formValidate.saleman" v-html="formValidate.saleman?formValidate.saleman:'-'">无级别</div>
                  </li>
                  <li class="tabs_detail_top_li">
                    <h4 class="tabs_detail_top_title">联系人</h4>
                    <div class="tabs_detail_top_text" :title="formValidate.supplierPerson"
                         v-html="formValidate.supplierPerson?formValidate.supplierPerson:'-'"></div>
                  </li>
                  <li class="tabs_detail_top_li">
                    <h4 class="tabs_detail_top_title">联系手机</h4>
                    <div class="tabs_detail_top_text" :title="formValidate.phone"  v-html="formValidate.phone?formValidate.phone:'-'"></div>
                  </li>
                </ul>
              </div>


              <div class="tabs_detail_con">
                <ul class="tabs_detail_con_ul">
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/phone_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg" v-html="formValidate.mobile"></p>
                      <p class="tdetail_msg_text">联系座机号</p>
                    </div>
                  </li>
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/email_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg" v-html="formValidate.email" ></p>
                      <p class="tdetail_msg_text">邮箱地址</p>
                    </div>
                  </li>
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/address_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg" :title="formValidate.address" v-html="formValidate.address"></p>
                      <p class="tdetail_msg_text">详细地址</p>
                    </div>
                  </li>
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/title_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg" v-html="formValidate.createTime"></p>
                      <p class="tdetail_msg_text">创建时间</p>
                    </div>
                  </li>
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/people_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg" v-html="formValidate.createUser"></p>
                      <p class="tdetail_msg_text">创建人</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="tabs_detail_type">
                <div class="title_name">资源类别：</div>
                <ul class="tabs_detail_list">
                  <li class="clear" v-for="goods in resourcesList" v-if="formValidate.serviceType.includes(goods.id )">
                    <span class="icon_ziyuan" :class="goods.typeContext"></span>{{goods.typeName}}
                    <!--<img src="../../assets/images/95_img.png" alt="">{{goods.typeName}}-->
                  </li>
                </ul>
              </div>
            </TabPane>
            <TabPane v-if="havePerm('235')" label="数据统计" name="dataStats">
              <div class="detail_tab_wrap">
                <div class="detail_tab_mod">
                  <div class="check_mod_btn" style="bottom: 20px;left:20px;top: auto;right: auto">
                    <el-radio-group v-model="radio4" size="medium" @change="pieTimeChange()">
                      <el-radio-button label="0">累计到上月</el-radio-button>
                      <el-radio-button label="1">上月</el-radio-button>
                    </el-radio-group>
                  </div>
                  <div class="chart_mod_wrap">
                    <div v-if="pieRingsData.series[0].data.length == 0" class="no_data">资源消耗暂无数据</div>
                    <chart
                      :options="pieRings"
                      ref="pieRings"
                      theme="ovilia-green"
                      auto-resize
                    />
                    <!--<ul class="pie_list_data">-->
                    <!--<li>1</li>-->
                    <!--</ul>-->
                  </div>
                </div>
                <div class="border_top"></div>
                <div class="detail_tab_mod">
                  <div class="check_mod_btn">
                    <el-radio-group v-model="radio5" size="medium" @change="lineTimeChange()">
                      <el-radio-button label="1">最近30天</el-radio-button>
                      <el-radio-button label="0">月</el-radio-button>
                    </el-radio-group>
                  </div>
                  <div>
                    <div class="chart_mod_wrap">
                      <div v-if="lineOption.series[0].data.length == 0 && lineOption.series[1].data.length == 0"
                           class="no_data">消耗毛线暂无数据
                      </div>
                      <chart
                        :options="line"
                        ref="line"
                        theme="ovilia-green"
                        auto-resize
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane v-if="havePerm('236')" label="订单统计" name="orderStats">
              <div class="detail_tab_wrap">
                <div class="detail_tab_mod mixing_tab_mod">
                  <!--       <div class="check_mod_btn">
                          <el-radio-group v-model="radio6" size="medium" @click="orderStatsChange">
                            <el-radio-button label="累计"></el-radio-button>
                            <el-radio-button label="上月"></el-radio-button>
                          </el-radio-group>
                        </div> -->
                  <div class="chart_mod_wrap">
                    <div v-if="barLineOpt.series[0].data.length == 0 && barLineOpt.series[1].data.length == 0"
                         class="no_data">暂无数据
                    </div>

                    <chart
                      :options="barLine"
                      ref="barLine"
                      theme="ovilia-green"
                      auto-resize
                    />
                  </div>
                </div>
                <div class="total_numb">累计新增订单：{{orderTotal}}&nbsp;&nbsp;个</div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {mapGetters} from "vuex";
  import {
    fetchSupplierList,
    fetchAddSupplier,
    fetchUpdateSupplier,
    fetchGoodType,
    fetchDeleteSupplier,
    fetchquerySaleMan,
    DownLoadFile,
    fetch_supplier_stats_info,
    fetch_supplier_pie_info,
    fetch_supplier_line_info
  } from '@/api/api';
  import * as util from '@/common/js/util.js';

  import ECharts from 'vue-echarts/components/ECharts.vue'

  // 手动引入 ECharts 各模块来减小打包体积
  import 'echarts/lib/chart/pie'
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/title'
  import pieRings from '@/common/data/pie_rings'
  import line from '@/common/data/line.js'
  import barLine from '@/common/data/bar_line.js'



  line.title.text = '消耗&毛利曲线图'
  export default {
    data() {
      return {
        noDataText: '加载中...',
        disable: false,
        pieRingsData: {
          title: {
            text: '',
            textAlign: 'center',
            subtext: '累计消耗金额',
            x: 150,
            y: 130,
            textStyle: {
              fontWeight: 'normal',
              fontSize: 20
            }
          },
          tooltip: {
            show: true,
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            right: 200,
            textStyle: {
              color: '#7b7b7b'
            },
            data: [],
          },
          series: [{
            type: 'pie',
            data: []
          }]
        },
        barLineOpt: {
          legend: {
            data: ['进行中订单', '新增订单'],
          },
          title: {
            text: '订单统计'
          },
          xAxis: {
            data: [],
          },
          series: [{
            name: '进行中订单',
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbol: 'emptyCircle',
            symbolSize: 15,
            itemStyle: {
              normal: {
                barBorderRadius: 5,
                color: '#16b9c0',
                label: {
                  show: true,
                  position: "top",
                  formatter: function (p) {
                    return p.value > 0 ? (p.value) : '';
                  }
                }
              }
            },
            data: []
          }, {
            name: '新增订单',
            type: 'bar',
            barWidth: 20,
            itemStyle: {
              normal: {
                barBorderRadius: 5,
                color: '#00b4ff',
                label: {
                  show: true,
                  position: "top",
                  formatter: function (p) {
                    return p.value > 0 ? (p.value) : '';
                  }
                }
              }
            },
            data: []
          }]
        },
        lineOption: {
          legend: {
            data: ['成本消耗', '平台毛利']
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
          },
          series: [
            {
              name: '成本消耗',
              type: 'line',
              stack: '总量',
              data: []
            },
            {
              name: '平台毛利',
              type: 'line',
              stack: '总量',
              data: []
            }
          ]
        },
        tabName: "",
        barLine,
        radio4: '0',
        pieRings,
        line,
        radio5: '0',
        columns1: [
          {
            title: "序号",
            key: "id",
            type: "index",
            width: 70
          },
          {
            title: "供应商编号",
            key: "supplierNo",
            className: 'wid400',
            width: 240
          },
          {
            title: "供应商名称",
            key: "supplierName",

          },
          /* {
             title: "联系人",
             key: "supplierPerson",

           },
           {
             title: "联系手机",
             key: "phone",

           },
           {
             title: "邮箱",
             key: "email",

           },*/
          {
            title: "资源类别",
            key: "typeName",

          },
          {
            title: "创建时间",
            key: "createTime",

          },
          {
            title: "创建人",
            key: "createUser",

          },
          {
            title: "关联商务",
            key: "saleman",

          },
          {
            title: "累计销售额",
            key: "saleTotal",

          },
          {
            title: "上月销售额",
            key: "lastMothCast",

          },
          {
            title: "完成订单数",
            key: "orderTotal",
          },
          {
            title: "操作",
            key: "111",
            width: 70,
            render: (h, params) => {
              let arr = [
                h('span', {
                  props: {
                    type: 'text',
                  },
                  class: 'tab_childer_btn',
                  on: {
                    click: () => {
                      this.tabName = "basicInfo";
                      this.showDetail(params.row)
                    }
                  }
                }, '详情')
              ];
              return h('div', arr);
            }
          }
        ],
        animated: false,
        listData: [],
        loading: false,
        tabHeight: '500',
        totalCount: 0,
        pageNo: 1,
        pageNum: 30,
        condition: '',
        pageOpt: [30, 50, 100],
        scrollable: true,
        modal1: false,
        resourcesList: [],
        saleManList: [],
        titleName: "",
        saleTotal: "",
        lastMothCast: "",
        orderTotal: "",
        isDatailShow: false,
        formValidate: {
          id: "",
          supplierNo: "",
          supplierName: "",
          supplierPerson: "",
          phone: "",
          email: "",
          address: "",
          salemanId: "",
          serviceType: [],
          saleman: "",
          createTime: "",
          createUser: localStorage.getItem('USER'),
          mobile: ""
        }
      };
    },
    created() {

      this.tabHeight = (document.documentElement.clientHeight - 160 - 40);
      this.getSupplierList();
      this.getGoodAllTypeList();
      this.getAllSalerList();
      if(!this.havePerm('46')){
          this.columns1.splice(this.columns1.length-1,this.columns1.length);
      }

    },
    computed: mapGetters(
      {
        perm_info: "main/perm_info"
      }
    ),
    methods: {
      havePerm(id) {
        return this.perm_info.indexOf(id) != -1;
      },
      out() {
        alert(111);
      },
      ok() {
//        this.$Message.info("点击了确定");
      },
      cancel() {
//        this.$Message.info("点击了取消");
      },
      exportData(type) {
        if(this.totalCount == 0){
          this.$Message.error("数据为空，不能导出");
          return
        }
        DownLoadFile({
          url: '/vcloud/supplierManage/supplier/exportSupplierList', data: {
            condition: this.condition
          }
        });
      },
      getPageChange(page) {
        this.pageNo = page
        this.getSupplierList();
      },

      getPageSizeChange(pageNum) {
        this.pageNum = pageNum
        this.getSupplierList();
      },

      search() {
        this.pageNo = 1;
        this.getSupplierList();
      },

      closeDetail() {
        this.isDatailShow = false;
      },
      //添加或者修改供应商
      modify(item) {
        if (item) {
          this.isDatailShow = false;
          this.titleName = "修改供应商";
          this.formValidate.salemanId = parseInt(this.formValidate.salemanId);
        } else {
          this.titleName = "新增供应商";
          this.formValidate.supplierNo = "";
          this.formValidate.supplierName = "";
          this.formValidate.supplierPerson = "";
          this.formValidate.phone = "";
          this.formValidate.mobile = "";
          this.formValidate.email = "";
          this.formValidate.address = "";
          this.formValidate.salemanId = "";
          this.formValidate.serviceType = [1];
          this.formValidate.id = '';
          this.formValidate.createUser = localStorage.getItem('USER');
        }
        this.modal1 = true;
      },

      //显示详情页面
      showDetail(item) {
        this.formValidate.email = item.email==undefined?'': item.email;
        this.formValidate.userName = item.userName==undefined?'': item.userName;
        this.formValidate.departmentId = item.departmentId==undefined?'': item.departmentId;
        this.formValidate.supplierNo = item.supplierNo;
        this.formValidate.supplierName = item.supplierName;
        this.formValidate.supplierPerson = item.supplierPerson==undefined?'': item.supplierPerson;
        this.formValidate.phone = item.phone ==undefined?'': item.phone;
        this.formValidate.mobile = item.mobile ==undefined?'': item.mobile;
        this.formValidate.saleman = item.saleman==undefined?'': item.saleman;
        this.formValidate.address = item.address ==undefined?'': item.address;
        this.formValidate.salemanId = item.salemanId ==undefined?'': item.salemanId;
        this.formValidate.serviceType = [];
        var serviceTypeArray = item.serviceType.split(',');
        for (var i = 0; i < serviceTypeArray.length; i++) {
          serviceTypeArray[i] = parseInt(serviceTypeArray[i]);
        }
        this.formValidate.serviceType = serviceTypeArray;
        this.formValidate.createUser = item.createUser == undefined?'': item.createUser;
        this.formValidate.createTime = item.createTime  == undefined?'': item.createTime;
        this.formValidate.id = item.id;
        this.saleTotal = item.saleTotal;
        this.lastMothCast = item.lastMothCast;
        this.orderTotal = item.orderTotal;
        this.isDatailShow = true;
      },

      handleReset(name) {
        this.modal1 = false;
        this.$refs[name].resetFields();
      },
      // 获取供应商列表
      getSupplierList() {
        this.noDataText = "加载中...";
        this.loading = true;
        fetchSupplierList(
          {
            condition: this.condition,
            pageNo: this.pageNo,
            pageNum: this.pageNum
          }
        ).then((res) => {
          if (res.data.respCode == '0') {
            this.listData = res.data.list;
            this.totalCount = res.data.totalCount;
          } else {
            this.$Message.error(res.data.msg);
          }
          this.noDataText = '暂无数据';
          this.loading = false;
        }).catch((err) => {
          console.log(err)
          this.noDataText = '暂无数据';
          this.loading = false;
        })
      },
      //获取所有资源
      getGoodAllTypeList() {
        fetchGoodType(
          {}
        ).then((res) => {
          if (res.data.respCode == '0') {
            this.resourcesList = res.data.list;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //获取所有关联商务
      getAllSalerList() {
        fetchquerySaleMan(
          {
            roleName: "商务"
          }
        ).then((res) => {

          if (res.data.respCode == '0') {
            this.saleManList = res.data.list;
          }
        }).catch((err) => {
          console.log(err)
        })
      },

      //删除供应商
      deleteSupplier(id) {
        fetchDeleteSupplier(
          {
            id: id
          }
        ).then((res) => {
          if (res.data.respCode == '0') {
            this.saleManList = res.data.list;
          }
        }).catch((err) => {
          console.log(err)
        })
      },

      //供应商添加验证
      addValidate() {
        if (this.formValidate.supplierName == "") {
          this.$Message.info("供应商名称不为空");
          return false;
        }else if(!util.isName(this.formValidate.supplierName)){
          this.$Message.info("供应商名称格式不对");
          return false;
        }
        ;
        if (this.formValidate.email != "" && (!util.isEmail(this.formValidate.email))) {
          this.$Message.info("邮箱格式不对");
          return false;
        }
        if (this.formValidate.supplierPerson == "") {
          this.$Message.info("联系人不为空");
          return false;
        }
        ;
        if (this.formValidate.phone == "") {
          this.$Message.info("联系手机不为空");
          return false;
        } else if (!util.isPhone(this.formValidate.phone)) {
          this.$Message.info("联系手机格式不对");
          return false;
        }
        ;
        if (this.formValidate.mobile != "" && (!util.isMobile(this.formValidate.mobile))) {
          this.$Message.info("联系座机格式不对");
          return false;
        }
        if (this.formValidate.salemanId == "") {
          this.$Message.info("所属商务不为空");
          return false;
        }
        if (this.formValidate.serviceType == '') {
          this.$Message.info("请勾选资源类型");
          return false;
        }
        ;

        return true;
      },

      getSupplierOrderStatsInfo() {
        fetch_supplier_stats_info(
          {
            id: this.formValidate.id
          }
        ).then((res) => {
          if (res.data.respCode == '0') {
            let barBom = this.$refs.barLine;
            let xAxisData = [];
            let executData = [];
            let orderMountData = [];

            for (let i = 0; i < res.data.list.length; i++) {
              xAxisData.push(res.data.list[i].month);
              executData.push(res.data.list[i].executeAmount);
              orderMountData.push(res.data.list[i].orderAmount);

            }

//            let bar = {
//              legend: {
//                data: ['进行中订单', '新增订单'],
//                textStyle: {
//                  color: '#90979c'
//                }
//              },
//              title: {
//                text: '订单统计'
//              },
//              xAxis: {
//                data: xAxisData,
//              },
//              series: [{
//                name: '进行中订单',
//                type: 'line',
//                smooth: true,
//                showAllSymbol: true,
//                symbol: 'emptyCircle',
//                symbolSize: 15,
//                itemStyle: {
//                  normal: {
//                    barBorderRadius: 5,
//                    color: '#16b9c0',
//                    label: {
//                      show: true,
//                      position: "top",
//                      formatter: function (p) {
//                        return p.value > 0 ? (p.value) : '';
//                      }
//                    }
//                  }
//                },
//                data: executData
//              }, {
//                name: '新增订单',
//                type: 'bar',
//                barWidth: 20,
//                itemStyle: {
//                  normal: {
//                    barBorderRadius: 5,
//                    color: '#00b4ff',
//                    label: {
//                      show: true,
//                      position: "top",
//                      formatter: function (p) {
//                        return p.value > 0 ? (p.value) : '';
//                      }
//                    }
//                  }
//                },
//                data: orderMountData
//              }]
//            };


            this.barLineOpt.xAxis.data = xAxisData;
            this.barLineOpt.series[0].data = executData;
            this.barLineOpt.series[1].data = orderMountData;


            barBom.mergeOptions(this.barLineOpt)


          } else {
            this.$Message.error(res.data.msg);
          }
        }).catch((err) => {
          this.$Message.error(res.data.msg);
          console.log(err)
        })
      },

      getSupplierPieData() {
        fetch_supplier_pie_info(
          {
            id: this.formValidate.id,
            type: this.radio4
          }
        ).then((res) => {
          if (res.data.respCode == '0') {
            let pieRingBom = this.$refs.pieRings;
            let value = [];
            let name = [];
            // let total = res.data.total


            for (let i = 0; i < res.data.list.length; i++) {
              if(res.data.list[i].value != '0'){
                name.push(res.data.list[i].name);
                value.push({value: res.data.list[i].value, name: res.data.list[i].name});
              }
            }

//            let pieRingsData = {
//              title: {
//                text: this.saleTotal,
//                textAlign: 'center',
//                subtext: '累计消耗金额',
//                x: 150,
//                y: 130,
//                textStyle: {
//                  fontWeight: 'normal',
//                  fontSize: 20
//                }
//              },
//              tooltip: {
//                show: true,
//                trigger: 'item',
//                formatter: "{b}: {c} ({d}%)"
//              },
//              legend: {
//                orient: 'vertical',
//                right: 200,
//                textStyle: {
//                  color: '#7b7b7b'
//                },
//                data: name,
//              },
//              series: [{
//                type: 'pie',
//                data: value
//              }]
//            };

//            if(){
//
//              this.pieRingsData.title.text = this.saleTotal;
////              lastMothCast
//            }
            if(this.radio4 == 0){
              this.pieRingsData.title.text = this.saleTotal;
            }else{
              this.pieRingsData.title.text = this.lastMothCast;
            }
            this.pieRingsData.legend.data = name;
            this.pieRingsData.series[0].data = value;


            pieRingBom.mergeOptions(this.pieRingsData)


          } else {
            this.$Message.error(res.data.msg);
          }
        }).catch((err) => {
          this.$Message.error("获取数据失败");
          console.log(err)
        })
      },

      getSupplierLineData() {
        fetch_supplier_line_info(
          {
            id: this.formValidate.id,
            type: this.radio5
          }
        ).then((res) => {
          if (res.data.respCode == '0') {
            let lineBom = this.$refs.line;
            let time = [];
            let costTotalConsumption = [];
            let platformProfit = [];

            for (let i = 0; i < res.data.list.length; i++) {
              time.push(res.data.list[i].time);
              costTotalConsumption.push(res.data.list[i].costTotalConsumption);
              platformProfit.push(res.data.list[i].platformProfit);
            }

//            let lineOption = {
//              legend: {
//                data: ['成本消耗', '平台毛利']
//              },
//              xAxis: {
//                type: 'category',
//                boundaryGap: false,
//                data: time,
//                "axisLine": {
//                  lineStyle: {
//                    color: '#90979c'
//                  }
//                },
//              },
//              series: [
//                {
//                  name: '成本消耗',
//                  type: 'line',
//                  stack: '总量',
//                  data: costTotalConsumption
//                },
//                {
//                  name: '平台毛利',
//                  type: 'line',
//                  stack: '总量',
//                  data: platformProfit
//                }
//              ]
//            };
            this.lineOption.xAxis.data = time;
            this.lineOption.series[0].data = costTotalConsumption;
            this.lineOption.series[1].data = platformProfit;


            lineBom.mergeOptions(this.lineOption)

          } else {
            this.$Message.error(res.data.msg);
          }
        }).catch((err) => {
          this.$Message.error(res.data.msg);
          console.log(err)
        })
      },

      getSupplierDataStatsInfo() {
        this.getSupplierPieData();
        this.getSupplierLineData();
      },

      // 表单验证
      handleSubmit(name) {
        this.disable = true;
        let data = Object.assign({}, this.formValidate);
        data.serviceType = data.serviceType.join(',');

        if (data.id == "") {
          if (this.addValidate()) {
            //添加表单提交
            fetchAddSupplier(
              data
            ).then((res) => {
              if (res.data.respCode == '0') {
                this.$Message.success(res.data.msg);
                this.modal1 = false;
                this.getSupplierList();
              } else if (res.data.respCode == '1') {
                this.$Message.error(res.data.msg);
              }
              this.disable = false;
            }).catch((err) => {
              console.log(err)
              this.disable = false;
            })
          }else{
            this.disable = false;
          }
        } else {
          if (this.addValidate()) {
            //编辑表单提交
            fetchUpdateSupplier(
              data
            ).then((res) => {
              if (res.data.respCode == '0') {
                this.$Message.success(res.data.msg);
                this.modal1 = false;
                this.getSupplierList();
              } else if (res.data.respCode == '1') {
                this.$Message.error(res.data.msg);
              }
              this.disable = false;
            }).catch((err) => {
              console.log(err)
              this.disable = false;
            })
          }else{
            this.disable = false;
          }
        }
      },

      tabChange(name) {
        if (this.tabName == "basicInfo") {
          ;
        } else if (this.tabName == "dataStats") {
          this.radio4 = 0;
          this.radio5 = 1;
          this.getSupplierDataStatsInfo();
        } else {      // orderStats
          this.getSupplierOrderStatsInfo();
        }
      },

      pieTimeChange() {
        this.getSupplierPieData();
      },

      lineTimeChange() {
        this.getSupplierLineData();
      }
    },
    components: {
      chart: ECharts
    }

  };
</script>
