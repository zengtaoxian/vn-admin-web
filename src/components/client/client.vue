<style lang="less">
  @import "../../common/less/client.less";
</style>
<template>
  <div class="box">
    <!--<div class="top">-->
    <!--<div class="inp">-->
    <!--<i-input placeholder="客户编号/客户名称/联系手机" icon="search" style: v-model="condition" @on-change="search"></i-input>-->
    <!--</div>-->
    <!--<div class="export"><img src="../../assets/export.jpg" alt="" @click="exportData(1)"></div>-->
    <!--<div id="btn">-->
    <!--<i-button type="primary" @click="clientAdd" class="btn">-->
    <!--<Icon type="plus-round"></Icon>&nbsp;&nbsp;新增客户</i-button>-->
    <!--</div>-->
    <!--</div>-->
    <div class="main_header clear">
      <div class="input_wrap" v-if="havePerm('51')">
        <i-input placeholder="客户编号/客户名称/联系手机" style: v-model.trim="condition" @on-enter="search"></i-input>
        <span class="search_btn" @click="search"><Icon type="ios-search-strong"></Icon></span>
      </div>

      <div class="header_btn" v-if="havePerm('50')">
        <i-button type="primary" @click="clientAdd">
          <Icon type="plus-round"></Icon>&nbsp;&nbsp;新增客户
        </i-button>
      </div>
      <div class="export_btn" @click="exportData" v-if="havePerm('52')"></div>
    </div>


    <!-- <i-table :columns="columns1" :data="data1" class="table" ref="table"></i-table> -->

    <div class="tab_wrap">
      <Table :columns="columns1" :data="listData" :height="tabHeight" :loading="loading"
             :no-data-text="noDataText"></Table>
    </div>

    <div class="page_btm_div">
      <Page class="page_iview_right" :total="totalCount" :page-size="pageNum" :current="pageNo"
            :page-size-opts="pageOpt" size="small"
            show-elevator show-sizer show-total placement="top" @on-change="getPageChange"
            @on-page-size-change="getPageSizeChange"></Page>
    </div>

    <!--<table class="new_table">-->
    <!--<tr>-->
    <!--<th class="text_left pad_lf">序号</th>-->
    <!--<th class="text_left pad_lf">客户编号</th>-->
    <!--<th class="text_left pad_lf">客户名称</th>-->
    <!--<th class="text_left pad_lf">联系人</th>-->
    <!--<th class="text_left pad_lf">联系手机</th>-->
    <!--<th class="text_left pad_lf">邮箱</th>-->
    <!--<th class="text_left pad_lf">关联销售</th>-->
    <!--<th class="text_left pad_lf">客户级别</th>-->
    <!--<th class="text_left pad_lf">创建时间</th>-->
    <!--<th class="text_left pad_lf">创建人</th>-->
    <!--<th class="text_left pad_lf">需求资源</th>-->
    <!--<th class="text_left pad_lf">完成订单数</th>-->
    <!--<th class="text_left pad_lf">操作</th>-->
    <!--</tr>-->
    <!--<tr v-for="(list,index) in listData">-->
    <!--<td class="pad_lf" v-html="index+1"></td>-->
    <!--<td class="pad_lf" v-html="list.customNo"></td>-->
    <!--<td class="pad_lf" v-html="list.customName"></td>-->
    <!--<td class="pad_lf" v-html="list.customPerson"></td>-->
    <!--<td class="pad_lf" v-html="list.mobile"></td>-->
    <!--<td class="pad_lf" v-html="list.email"></td>-->
    <!--<td class="pad_lf" v-html="list.saleManName"></td>-->
    <!--<td class="pad_lf" v-html="list.level"></td>-->
    <!--<td class="pad_lf" v-html="list.createTime"></td>-->
    <!--<td class="pad_lf" v-html="list.createUser"></td>-->
    <!--<td class="pad_lf" >{{list.serviceTypeList|filterResources}}</td>-->
    <!--<td class="pad_lf">{{list.orderFinCount}}</td>-->
    <!--<td class="pad_lf"><span class="tab_del_btn" @click="showDetail(list.id)">详情</span></td>-->
    <!--</tr>-->
    <!--</table>-->


    <Modal v-model="modal1" :mask-closable="false" :title="modal1Title" @on-ok="ok" @on-cancel="cancel" :scrollable="scrollable" width="650"
           :styles="styles">
      <Form ref="formValidate" :label-width="100">
        <Row>
          <Col offset="1" span="6">
          基本信息</Col>
        </Row>
        <row>
          <Col class="margin_bt0" span="22" offset="1">
          <FormItem v-if="formValidate.customNo" label="客户编码" class="model_text_btm">
            <div v-html="formValidate.customNo"></div>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="客户名称" prop="customName">
            <Input v-model="formValidate.customName" placeholder="2-10字以内"></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="联系人" prop="contactPerson">
            <Input v-model="formValidate.customPerson" placeholder="2-10字以内"></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="联系手机" prop="contactPerson">
            <Input v-model="formValidate.mobile" placeholder="11有效数字手机号" :maxlength="landlineLen"></Input>
          </FormItem>
          <FormItem label="联系座机">
            <Row>
              <Col class="margin_bt0" span="6">
              <Input placeholder="区号" v-model="formValidate.areaCode" :maxlength="areaCodeLen"></Input>
              </Col>
              <Col class="margin_bt0" span="17" offset="1">
              <Input placeholder="座机号" v-model="formValidate.Landline" :maxlength="landlineLen"></Input>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="邮箱地址" class="email">
            <Input v-model="formValidate.email" placeholder="邮箱地址" :maxlength="64"></Input>
          </FormItem>
          <FormItem label="详细地址" class="address">
            <Input v-model="formValidate.address" :maxlength="250" placeholder="详细街道信息" type="textarea"
                   :autosize="{minRows: 2,maxRows: 5}"></Input>
          </FormItem>
          </Col>
        </row>
        <Row>
          <Col span="22" offset="1" class="role">
          <FormItem class="ivu-form-item-required saleManId" label="关联销售">
            <Select v-model="formValidate.saleManId" filterable placeholder='请选择'>
              <Option v-for="item in cityList" :value="item.id" :key="item.id">{{ item.userName }}</Option>
            </Select>
          </FormItem>
          <FormItem class="ivu-form-item-required saleManId" label="客户级别">
            <el-radio-group v-model="formValidate.level" size="small">
              <el-radio-button :label="0">无级别</el-radio-button>
              <el-radio-button :label="1">普通</el-radio-button>
              <el-radio-button :label="2">皇冠</el-radio-button>
              <el-radio-button :label="3">钻石</el-radio-button>
            </el-radio-group>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1" span="6" class="ivu-form-item-required">
          需求资源</Col>
        </Row>
        <Row>
          <Col span="20" offset="4">
          <el-checkbox-group v-model="formValidate.serviceTypeId">
            <el-checkbox class="check_box_el" v-for="city in resourcesList" :label="city.id" :key="city.id">
              {{city.typeName}}
            </el-checkbox>
          </el-checkbox-group>
          </Col>
        </Row>
        <Row>
          <Col span="22" offset="1">
          <!--<div class="footer">-->
          <!--<Button type="ghost" class="subbtn" @click="handleReset('formValidate')">取消</Button>-->
          <!--<Button type="primary" class="subbtn" @click="addClient()">保存</Button>-->
          <!--</div>-->
          <div class="footer_modal">
            <Button type="ghost" class="sub_btn_size" @click="handleReset('formValidate')">取消</Button>
            <Button type="primary" class="sub_btn_size" @click="addClient">保存</Button>
          </div>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal v-model="isDatailShow" class="detail_modal" width="680">
      <div>
        <div slot="header">
          <div class="detail_top clear">
            <img class="top_img" src="../../assets/images/client_img.png" alt="">
            <div class="detail_top_right">
              <p class="title" v-html="formValidate.customName==''?'-':formValidate.customName"></p>
              <p class="code" v-html="formValidate.customNo==''?'-':formValidate.customNo"></p>
            </div>
            <span class="top_btn" v-if="havePerm('55')">
            <span class="btn" @click="editClientShow(formValidate.id)">编辑</span>
          </span>
          </div>
        </div>

        <div>
          <Tabs class="tabs_check" v-model="detailValuel" :name="detailValuel" type="card" :animated="animated"
                @on-click="detailTabClick">
            <TabPane label="基本资料" name="detailmsg" v-if="havePerm('262')">
              <div class="tabs_detail_content_top">
                <ul class="tabs_detail_top_ul">
                  <li class="tabs_detail_top_li">
                    <h4 class="tabs_detail_top_title">客户级别</h4>
                    <div class="tabs_detail_top_text" v-html="formValidate.levelName?formValidate.levelName:'-'"></div>
                  </li>
                  <li class="tabs_detail_top_li">
                    <h4 class="tabs_detail_top_title">关联销售</h4>
                    <div class="tabs_detail_top_text" v-html="formValidate.saleManName"></div>
                  </li>
                  <li class="tabs_detail_top_li">
                    <h4 class="tabs_detail_top_title">联系人</h4>
                    <div class="tabs_detail_top_text"
                         v-html="formValidate.customPerson?formValidate.customPerson:'-'"></div>
                  </li>
                  <li class="tabs_detail_top_li">
                    <h4 class="tabs_detail_top_title">联系手机</h4>
                    <div class="tabs_detail_top_text" v-html="formValidate.mobile?formValidate.mobile:'-'"></div>
                  </li>
                </ul>
              </div>
              <div class="tabs_detail_con">
                <ul class="tabs_detail_con_ul">
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/phone_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg" v-html="formValidate.phone?formValidate.phone:'-'"></p>
                      <p class="tdetail_msg_text">联系座机号</p>
                    </div>
                  </li>
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/email_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg" v-html="formValidate.email?formValidate.email:'-'"></p>
                      <p class="tdetail_msg_text">邮箱地址</p>
                    </div>
                  </li>
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/address_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg" :title="formValidate.address" v-html="formValidate.address?formValidate.address:'-'"></p>
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
                  <li class="clear" v-for="list in formValidate.list">
                    <span class="icon_ziyuan" :class="list.typeContext"></span><!--{{list.typeContext}}-->
                    <!--<img src="../../assets/images/95_img.png" alt="">{{list.typeName}}-->
                    {{list.typeName}}
                  </li>
                </ul>
              </div>
            </TabPane>
            <TabPane label="数据统计" name="detailCount" v-if="havePerm('259')">
              <div class="detail_tab_wrap">
                <div class="detail_tab_mod">
                  <div class="check_mod_btn">
                    <el-radio-group v-model="radio4" size="medium" @change="changeBarHorizontal">
                      <el-radio-button label="0">累计到上月</el-radio-button>
                      <el-radio-button label="1">上月</el-radio-button>
                    </el-radio-group>
                  </div>
                  <div class="chart_mod_wrap">
                    <div v-if="barHorizontalOpt.series[0].data.length == 0" class="no_data">暂无数据</div>
                    <chart
                      :options="barHorizontal"
                      ref="barHorizontal"
                      theme="ovilia-green"
                      auto-resize
                    />
                  </div>

                </div>
                <div class="border_top"></div>
                <div class="detail_tab_mod">
                  <div class="check_mod_btn">
                    <el-radio-group v-model="radio5" size="medium" @change="onChangeLineCount">
                      <el-radio-button label="0">最近30天</el-radio-button>
                      <el-radio-button label="1">月</el-radio-button>
                    </el-radio-group>
                  </div>
                  <div class="chart_mod_wrap">
                    <div v-if="lineOpt.series[0].data.length == 0 && lineOpt.series[1].data.length == 0"
                         class="no_data">暂无数据
                    </div>
                    <chart
                      :options="line"
                      ref="lineCount"
                      theme="ovilia-green"
                      auto-resize
                    />

                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Modal>

  </div>
</template>
<script>
  import * as util from 'common/js/util'
  import {mapGetters} from "vuex";

  import * as api from "@/api/api"


  import ECharts from 'vue-echarts/components/ECharts.vue'

  // 手动引入 ECharts 各模块来减小打包体积
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/title'
  import barHorizontal from '@/common/data/bar_horizontal.js'
  import line from '@/common/data/line.js'


  barHorizontal.title.text = '订单消耗';
  line.title.text = '销售额&销售毛利曲线图'
  export default {
    data() {
      return {
        noDataText: '加载中...',
        modal1Title: '新增客户',
        ThisId: null,
        detailValuel: 'detailmsg',
        line,
        barHorizontal,
        radio5: '0',
        barHorizontalOpt: {
          title: {
            text: '订单消耗'
          },
          legend: {
            data: ['订单消耗']
          },
          yAxis: {
            data: [],
          },
          series: [{
            name: name,
            data: []
          }]
        },
        lineOpt: {
          title: {
            text: '销售额&销售毛利曲线图'
          },
          legend: {
            data: ['销售额', '销售毛利']
          },
          xAxis: {
            data: [],
          },
          series: [{
            name: '销售额',
            data: []
          }, {
            name: '销售毛利',
            data: []
          }]
        },
        radio4: '0',
        animated: false,
        detailStyle: {
          right: 0,
          top: 0,
          bottom: 0,
          'z-index': 10,
        },
        columns1: [
          {
            title: "序号",
            key: "id",
            type: "index",
            width: 70
          },
          {
            title: "客户编号",
            key: "customNo",
            width: 300
          },
          {
            title: "客户名称",
            key: "customName",
//            width: 160
          },
          // {
          //   title: "联系人",
          //   key: "customPerson",
          //   width: 150
          // },
          // {
          //   title: "联系手机",
          //   key: "mobile",
          //   width: 120
          // },
          // {
          //   title: "邮箱",
          //   key: "email",
          //   width: 160
          // },
          {
            title: "关联销售",
            key: "saleManName",
//            width: 150
          },
          {
            title: "客户级别",
            key: "level",
//            width: 100
          },
          {
            title: "创建时间",
            key: "createTime",
            width: 160
          },
          {
            title: "创建人",
            key: "createUser",
//            width: 150
          },
          {
            title: "需求资源",
            key: "serviceTypeList",
//            width: 200,
            render: (h, params) => {
              let str = this.filterResList(params.row.serviceTypeList);
              let arr = [
                h('div', {
                  class: 'tab_row_over'
                }, str)
              ];
              return h('div', arr);
            }
          },
          {
            title: "完成订单数",
            key: "orderFinCount",
//            width: 100
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
                      this.showDetail(params.row)
                    }
                  }
                }, '详情')
              ];
              return h('div', arr);
            }
          }

        ],
        number: true,
        areaCodeLen: 4,
        landlineLen: 11,
        tabHeight: '500',
        loading: false,
        isDatailShow: false,
        modalDetailStyle: {top: '10px', bottom: '10px'},
        scrollable: true,
        modal1: false,
        resourcesList: [],
        listData: [],
        condition: '',
        pageNo: 1,
        pageNum: util.pageSize,
        totalCount: 0,
        pageOpt: util.pageOpt,
        styles: {top: '10px', bottom: '10px'},
        cityList: [],
        formValidate: {
          customNo: '',
          createUser: 'admin',
          customName: '',
          customPerson: '',
          mobile: '',
          email: '',
          address: '',
          saleManId: '',
          level: 0,
          levelName: '',
          serviceTypeId: [],
          areaCode: '',
          Landline: ''
        }
      };
    },
    filters: {
      filterResources: function (list) {
        let arr = [];
        for (let i = 0; i < list.length; i++) {
          arr.push(list[i].typeName)
        }
        return arr.join('，')
      }
    },
    created() {
      //控制详情按钮的权限显示
      if (!this.havePerm('53')) {
        this.columns1.splice(this.columns1.length - 1, 1)
      }

      this.tabHeight = (document.documentElement.clientHeight - 160 - 40);
      this.getQueryGoodType();
      this.getClientList();

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

      filterResList(list) {
        let arr = [];
        for (let i = 0; i < list.length; i++) {
          arr.push(list[i].typeName)
        }
        return arr.join('，')
      },
      out() {
        alert(111);
      },
      ok() {
        // this.$Message.info("点击了确定");
      },
      cancel() {
        // this.$Message.info("点击了取消");
      },
      exportData(type) {
        if(this.totalCount == 0){
          this.$Message.error("数据为空，不能导出");
          return
        }
        api.DownLoadFile({
          url: '/vcloud/cusManage/customer/exportCustomerList', data: {
            condition: this.condition
          }
        });
      },
      // 表单验证
      handleSubmit(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            this.modal1 = false;
            this.$Message.success("Success!");
          } else {
            this.$Message.error("Fail!");
          }
        });
      },
      handleReset(name) {
        this.modal1 = false;
        this.$refs[name].resetFields();
      },
      getQueryGoodType() {
        api.fetchGoodType().then((res) => {
          if (res.data.respCode == '0') {
            this.resourcesList = res.data.list;
          } else {
            this.$Message.error('商品类型查询失败，请刷新重试！');
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      clientAdd() {
        this.formValidate = {
          customNo: '',
          createUser: '',
          customName: '',
          customPerson: '',
          mobile: '',
          email: '',
          address: '',
          saleManId: '',
          level: 0,
          serviceTypeId: [],
          areaCode: '',
          Landline: ''
        };
        this.modal1Title = '新增客户';
        this.modal1 = true;
        this.getQuerySaleMan();
      },
      getClientList() {
        this.noDataText = "加载中...";
        this.loading = true;
        // 获取客户列表
        api.fetchqueryCustomerList({
          condition: this.condition,
          pageNo: this.pageNo,
          pageNum: this.pageNum,
          source: "1"
        }).then(res => {

          if (res.data.respCode == '0') {
            this.listData = res.data.list;
            this.totalCount = res.data.totalCount;
          } else {
            this.$Message.error(res.data.msg);
          }
          this.loading = false;
          this.noDataText = '暂无数据';
        })
          .catch(err => {
            console.log(err);
            this.noDataText = '暂无数据';
          });
      },

      getPageChange(page) {

        this.pageNo = page
        this.getClientList();
      },

      getPageSizeChange(pageNum) {
        this.pageNum = pageNum
        this.getClientList();
      },
      search() {
        this.pageNo = 1;
        this.getClientList();
      },
      getQuerySaleMan() {
        //获取关联销售
        api.fetchquerySaleMan({
          roleName: '销售'
        }).then((res) => {

          if (res.data.respCode == '0') {
            this.cityList = res.data.list;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      addClient() {

        if (this.formValidate.customName == '' || this.formValidate.customPerson == '' || this.formValidate.mobile == '' || this.formValidate.saleManId == '') {
          this.$Message.error('必填项不能为空！');
          return
        }

        if (this.formValidate.customName.length < 2 || this.formValidate.customName.length > 10 || this.formValidate.customPerson.length < 2 || this.formValidate.customPerson.length > 10) {
          this.$Message.error('请填写大于2，小于10的字！');
          return
        }

        if (this.formValidate.mobile.length != 11 || !util.isPhone(this.formValidate.mobile)) {
          this.$Message.error('请正确的填写手机号码！');
          return
        }

        if (this.formValidate.areaCode || this.formValidate.Landline) {
          if (!util.isNumb(this.formValidate.areaCode) || this.formValidate.areaCode == '' || !util.isAreCode(this.formValidate.areaCode)) {
            this.$Message.error('请输入正确的区号！');
            return
          }

          if (!util.isNumb(this.formValidate.Landline) || this.formValidate.Landline == '' || this.formValidate.Landline.length < 6) {
            this.$Message.error('请输入正确的座机号码！');
            return
          }
        }

        if (this.formValidate.serviceTypeId.length == 0) {
          this.$Message.error('需求资源不能为空！');
          return
        }

        if (this.formValidate.email.length > 0) {
          var regMail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
          if (!regMail.test(this.formValidate.email)) {
            this.$Message.error("请输入正确的邮箱!");
            return
          }
        }

        this.formValidate.createUser = localStorage.getItem('USER');

        let data = Object.assign({}, this.formValidate);
        data.serviceTypeId = data.serviceTypeId.join(',');
        data.phone = data.areaCode + data.Landline;

        if (data.id) {
          api.fetchCustomerUpdate(data).then((res) => {

            if (res.data.respCode == '0') {
              this.modal1 = false;
              this.isDatailShow = false;
              this.$Message.success('修改成功！');
              this.pageNo = 1;
              this.getClientList();
            } else {
              this.$Message.info(res.data.msg);
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          api.fetchCustomerAdd(data).then((res) => {

            if (res.data.respCode == '0') {
              this.modal1 = false;
              this.isDatailShow = false;
              this.$Message.success('添加成功！');
              this.pageNo = 1;
              this.getClientList();
            } else {
              this.$Message.info(res.data.msg);
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      closeDetail() {
        this.isDatailShow = false;
      },
      showDetail(item) {


        //客户编号
        this.ThisId = item.customNo;

        //this.detailValuel = 'detailmsg';

        if (this.havePerm('259') && this.havePerm('262')) {
          this.detailValuel = "detailmsg";
        } else if (this.havePerm('259') && !this.havePerm('262')) {
          this.detailValuel = "detailCount";
          this.getConsume();
          this.getCountSaleMoney();
        } else if (!this.havePerm('259') && this.havePerm('262')) {
          this.detailValuel = "detailmsg";
        }

        let cityArrSmall = ['020', '010', '021', '029', '028', '027', '024', '022', '023'];


        api.fetchCustomerDetail({
          id: item.id
        }).then((res) => {

          if (res.data.respCode == '0') {
            this.isDatailShow = true;
            this.formValidate = res.data.map;
            this.formValidate.saleManId = isNaN(parseInt(this.formValidate.saleManId)) ? '' : parseInt(this.formValidate.saleManId);
            let serviceTypeId = this.formValidate.serviceTypeId.split(',');
            for (let i = 0; i < serviceTypeId.length; i++) {
              serviceTypeId[i] = parseInt(serviceTypeId[i]);
            }

            if (this.formValidate.phone) {

              if (cityArrSmall.indexOf(this.formValidate.phone.substring(0, 3)) == -1) {
                this.formValidate.areaCode = this.formValidate.phone.substring(0, 4);
                this.formValidate.Landline = this.formValidate.phone.substring(4);
              } else {
                this.formValidate.areaCode = this.formValidate.phone.substring(0, 3);
                this.formValidate.Landline = this.formValidate.phone.substring(3);
              }


            }

            this.formValidate.serviceTypeId = serviceTypeId;
          } else {
            this.$Message.success(res.data.msg);
          }
        }).catch((err) => {
          console.log(err)
        })

      },
      editClientShow(id) {
        this.isDatailShow = false;
        this.modal1Title = '修改客户';
        this.modal1 = true;
        this.getQuerySaleMan();
      },
      getConsume() {
//        获取订单消耗
        api.fetchGetConsume({
          id: this.ThisId,
          type: this.radio4
        }).then((res) => {

          if (res.data.respCode == '0') {
            let barHorizontalDom = this.$refs.barHorizontal;
            let yAxisData = [];
            let seriesData = [];
            let name = '';
            if (this.radio4 == 0) {
              name = '累计到上月'
            } else {
              name = '上月'
            }
            for (let i = 0; i < res.data.list.length; i++) {
              if (res.data.list[i].consume && res.data.list[i].consume != "0") {
                seriesData.push(res.data.list[i].consume);
                yAxisData.push(res.data.list[i].typeName);
              }
            }

            this.barHorizontalOpt.yAxis.data = yAxisData;
            this.barHorizontalOpt.series[0].name = name;
            this.barHorizontalOpt.series[0].data = seriesData;
            barHorizontalDom.mergeOptions(this.barHorizontalOpt);
          } else {
            this.$Message.error(res.data.msg);
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      getCountSaleMoney() {
        api.fetchCountSaleMoney({
          id: this.ThisId,
          type: this.radio5
        }).then((res) => {
          if (res.data.respCode == '0') {

            let lineCount = this.$refs.lineCount;
            let xAxisData = [];
            let seriesData1 = [];
            let seriesData2 = [];
            let name = '';
            if (this.radio4 == 0) {
              name = '累计到上月'
            } else {
              name = '上月'
            }
            for (let i = 0; i < res.data.list.length; i++) {
//              if (res.data.list[i].saleMoney != 0) {
                seriesData1.push(res.data.list[i].saleMoney);
                seriesData2.push(res.data.list[i].saleRate);
                xAxisData.push(res.data.list[i].day);
//              }
            }

            this.lineOpt.xAxis.data = xAxisData;
            this.lineOpt.series[0].data = seriesData1;
            this.lineOpt.series[1].data = seriesData2;
            lineCount.mergeOptions(this.lineOpt);


          } else {
            this.$Message.error(res.data.msg);
          }

        }).catch((err) => {
          console.log(err)
        })
      },
      detailTabClick() {
        //详情页面切换到数据统计页面
        if (this.detailValuel == 'detailCount') {
          this.radio4 = 0;
          this.radio5 = 0;
          this.getConsume();
          this.getCountSaleMoney();
        }

      },
      changeBarHorizontal() {
        this.getConsume();
      },
      onChangeLineCount() {
        this.getCountSaleMoney();
      }
    },
    components: {
      chart: ECharts
    }
  };
</script>
