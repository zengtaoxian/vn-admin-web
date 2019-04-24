<style lang="less">
  @import "../../common/less/client.less";
  @import "../../common/less/billing.less";
  @import "../../common/less/main.less";

  .tab_wrap_noborder {
    .ivu-table-wrapper {
      border: none;
    }
  }
</style>
<template>
  <div class="box">
    <!--<div class="top">-->
    <!--<div class="inp">-->
    <!--<i-input placeholder="计费周期名称" icon="search" style:   v-model="condition" @on-change="search"></i-input>-->
    <!--</div>-->

    <!--<div id="btn">-->
    <!--<i-button type="primary" @click="modal1 = true" class="btn">-->
    <!--<Icon type="plus-round"></Icon>&nbsp;&nbsp;新增计费周期-->
    <!--</i-button>-->
    <!--</div>-->
    <!--</div>-->
    <div class="main_header clear">
      <div class="input_wrap" v-if="havePerm('254')">
        <i-input placeholder="计费周期名称" style: @on-enter="search" v-model.trim="condition"></i-input>
        <span class="search_btn" @click="search"><Icon type="ios-search-strong"></Icon></span>
      </div>

      <div class="header_btn" v-if="havePerm('193')">
        <i-button type="primary" @click="showCycleAdd">
          <Icon type="plus-round"></Icon>&nbsp;新增计费周期
        </i-button>
      </div>
    </div>

    <div class="tab_wrap tab_wrap_noborder">
      <i-table :columns="columns1" :data="listData" :height="tabHeight" :loading="loading" ref="table"
               :no-data-text="noDataText"></i-table>
    </div>
    <!--<div class="new_tab_wrap" ref="new_tab_wrap" :style="{height:tabHeight+'px'}">-->
    <!--<table class="new_table">-->
    <!--<tr class="tab_th">-->
    <!--<th class="text_left pad_lf">序号</th>-->
    <!--<th class="text_left pad_lf">计费周期名称</th>-->
    <!--<th class="text_left pad_lf">计费方式</th>-->
    <!--<th class="text_left pad_lf">前段秒数</th>-->
    <!--<th class="text_left pad_lf">前段价格(元)</th>-->
    <!--<th class="text_left pad_lf">计费周期(秒)</th>-->
    <!--<th class="text_left pad_lf">每个周期价(元)</th>-->
    <!--<th class="text_left pad_lf">操作</th>-->
    <!--</tr>-->
    <!--<tr class="tba_content" v-for="(item,index) in listData">-->
    <!--<td class="pad_lf" v-html="index+1"></td>-->
    <!--<td class="pad_lf" v-html="item.cycleName"></td>-->
    <!--<td class="pad_lf">-->
    <!--<span v-if="item.cycleType == '0'">固定</span>-->
    <!--<span v-else>分段</span>-->
    <!--</td>-->
    <!--<td class="pad_lf" v-html="item.firSec == ''?'-':item.firSec"></td>-->
    <!--<td class="pad_lf" v-html="item.firFee == ''?'-':item.firFee"></td>-->
    <!--<td class="pad_lf" v-html="item.secSec"></td>-->
    <!--<td class="pad_lf" v-html="item.secFee"></td>-->
    <!--<td class="pad_lf" v-if="havePerm('194')">-->
    <!--<Poptip confirm title="您确认删除这个计费周期吗？" @on-ok="del(item.id,index)" @on-cancel="cancel"><span class="tab_del_btn">删除</span></Poptip>-->
    <!--</td>-->
    <!--</tr>-->
    <!--</table>-->
    <!--</div>-->
    <Modal v-model="modal1" title="新增计费周期" @on-ok="handleSubmit('formValidate')" width="680" :mask-closable="false"
           @on-cancel="handleReset('formValidate')">
      <row>
        <Col span="21" offset="1">
        <Form ref="formValidate" class="billing_from" :label-width="80">
          <div class="commodity_title"><em class="commodity_text">计费周期名称：</em>
            <span v-if="cycleType == 0">固定</span>
            <span v-if="cycleType == 1">两段</span><em class="commodity_text">-</em>
            <span v-if="cycleType == 0"><span v-if="cycleValue!=billingInput" v-html="cycleValue"></span><span v-else
                                                                                                               v-html="billingInput"></span><em
              class="commodity_text">秒</em></span>
            <span v-if="cycleType == 0">{{cycleFee | parseFloatMoney}}元</span>
            <span v-if="cycleType == 1">
              <span v-html="firstTime"></span><em class="commodity_text">秒-</em><span >{{firstTimeMoney|parseFloatMoney}}</span><em
              class="commodity_text">元-</em>
              <span v-if="cycleType == 1"><span v-if="cycleValue!=billingInput" v-html="cycleValue"></span><span v-else
                                                                                                                 v-html="billingInput"></span><em
                class="commodity_text">秒</em></span>
              <span >{{lastTimeMoney|parseFloatMoney}}</span><em class="commodity_text">元</em>
            </span>
          </div>
          <FormItem label="计费周期">
            <el-radio-group v-model="cycleValue">
              <el-radio label="6">6秒</el-radio>
              <el-radio label="12">12秒</el-radio>
              <el-radio label="60">60秒</el-radio>
              <el-radio :label="billingInput">其他</el-radio>
            </el-radio-group>
            <Input class="input_time" v-model="billingInput" placeholder="1~180"></Input>秒
            <!--<input class="input_time" type="text" v-model="billingInput" value="" placeholder="1~180">秒-->
          </FormItem>
          <FormItem label="计费方式">
            <el-radio-group v-model="cycleType" size="small">
              <el-radio-button :label="0">固定计费</el-radio-button>
              <el-radio-button :label="1">两段计费</el-radio-button>
            </el-radio-group>
          </FormItem>
          <FormItem label="  ">
            <div v-if="cycleType == 0">每
              <span v-if="cycleValue!=billingInput">{{cycleValue}}</span>
              <span v-else>{{billingInput}}</span>秒计费
              <Input class="small_input" v-model="cycleFee" @on-blur="toFixedStr('cycleFee')"></Input>元
              <!--<input class="small_input" type="text" v-model="cycleFee"/>元-->
            </div>
            <!--<div v-if="cycleType == 1">前<input v-model="firstTime" class="small_input" type="text"/>秒内-->
            <!--<input class="small_input" type="text" v-model="firstTimeMoney"/>元，之后每{{cycleValue}}秒计费-->
            <!--<input class="small_input" type="text" v-model="lastTimeMoney"/>元-->
            <!--</div>-->

            <div v-if="cycleType == 1">前<Input class="small_input" v-model="firstTime"></Input>秒内
              <Input class="small_input" v-model="firstTimeMoney" @on-blur="toFixedStr('firstTimeMoney')"></Input>元，之后每{{cycleValue}}秒计费
              <Input class="small_input" v-model="lastTimeMoney" @on-blur="toFixedStr('lastTimeMoney')"></Input>元
            </div>
          </FormItem>
          <!--<FormItem>-->
          <!--<Button type="primary" @click="handleSubmit()" style="float:right">保存</Button>-->
          <!--<Button type="ghost" @click="handleReset()" style="margin-right: 10px;float:right">取消</Button>-->
          <!--</FormItem>-->
          <div class="footer_modal">
            <Button type="ghost" class="sub_btn_size" @click="handleReset()">取消</Button>
            <Button type="primary" class="sub_btn_size" @click="handleSubmit()">保存</Button>
          </div>
        </Form>
        </Col>
      </row>
      </Row>
    </Modal>
    <div class="page_btm_div">
      <Page class="page_iview_right" v-if="totalCount" :total="totalCount" :page-size="pageNum" :current="pageNo"
            :page-size-opts="pageOpt"
            size="small" show-elevator show-sizer show-total placement="top" @on-change="getPageChange"
            @on-page-size-change="getPageSizeChange"></Page>
    </div>
  </div>
</template>
<script>
  import * as api from "@/api/api"
  import * as util from "@/common/js/util.js"


  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        loading: false,
        noDataText: '加载中...',
        columns1: [
          {
            type: 'index',
            title: '序号',
            key: 'index',
            width: 70
          },
          {
            title: '计费周期名称',
            key: 'cycleName',
            width: 300
          },
          {
            title: '计费方式',
            key: 'cycleType',
            render: (h, params) => {
              let arr = [];
              let str = '';
              if (params.row.cycleType == '0') {
                str = '固定'
              } else {
                str = '分段'
              }
              arr.push(
                h('span', {}, str)
              );
              return h('div', arr);
            }
          },
          {
            title: '前段秒数',
            key: 'firSec',
            render: (h, params) => {
              let arr = [];
              let str = '';
              if (params.row.firSec == '') {
                str = '-'
              } else {
                str = params.row.firSec;
              }
              arr.push(
                h('span', {}, str)
              );
              return h('div', arr);
            }
          },
          {
            title: '前段价格',
            key: 'firFee',
            render: (h, params) => {
              let arr = [];
              let str = '';
              if (params.row.firFee == '') {
                str = '-'
              } else {
                str = params.row.firFee;
              }
              arr.push(
                h('span', {}, str)
              );
              return h('div', arr);
            }
          },
          {
            title: '计费周期(秒)',
            key: 'secSec'
          },
          {
            title: '每个周期价(元)',
            key: 'secFee'
          },
          {
            title: '操作(元)',
            key: 'secFee',
            width: 100,
            render: (h, params) => {
              let arr = [];
              if (this.check_perm(194)) {
                arr.push(
                  h('Poptip', {
                    props: {
                      type: 'text',
                      title: "您确认删除这个计费周期吗？",
                      confirm: true,
                      placement: "top-end",
                      transfer: true,
                    },
                    class: 'tab_childer_btn',
                    on: {
                      "on-ok": () => {
                        this.del(params.row.id, params.row._index)
                      }
                    }
                  }, '删除')
                );
              }
              return h('div', arr);
            }
          }
        ],
        tabHeight: 500,
        cycleValue: 60,
        billingInput: null,
        cycleType: 0,
        cycleName: '',
        cyclePartFee: '',
        modal1: false,
        cycleFee: "1.0",
        firstTime: "1",
        firstTimeMoney: "1.0",
        lastTimeMoney: "1.0",
        condition: '',
        pageNo: 1,
        pageNum: util.pageSize,
        totalCount: 0,
        pageOpt: util.pageOpt,
        listData: []
      };
    },
    watch: {
      billingInput(a, b) {
        if (!util.isInt(a)) {
          this.$Message.error('请选择正确的计费方式！');
          return
        }
        this.cycleValue = a;
      }
    },
    filters: {
      parseFloatMoney: function (a) {

        return isNaN(parseFloat(a)) ? '0' : parseFloat(a)
      }
    },
    computed: mapGetters(
      {
        perm_info: "main/perm_info",
        check_perm: "main/check_perm"
      }
    ),
    created: function () {
      this.tabHeight = (document.documentElement.clientHeight - 160 - 40);
      this.getList();
    },
    methods: {

      havePerm(id) {
        return this.perm_info.indexOf(id) != -1;
      },

      showCycleAdd() {

        this.billingInput = null;
        this.cycleType = "0";
        this.cycleName = "";
        this.cyclePartFee = "";
        this.cycleFee = "0";
        this.firstTime = "1";
        this.firstTimeMoney = "1.0";
        this.lastTimeMoney = "1.0";
        this.cycleValue = "60";

        this.modal1 = true;

      },

      getList() {
        this.noDataText = "加载中...";
        this.loading = true;
        //获取列表数据
        api.fetchBillingList({
          condition: this.condition,
          source: "1",
          pageNo: this.pageNo,
          pageNum: this.pageNum,
        }).then((res) => {
          if (res.data.respCode == '0') {
            this.listData = res.data.list;
            this.totalCount = res.data.totalCount;
          }
          this.noDataText = "暂无数据";
          this.loading = false;
        }).catch((err) => {
          console.log(err)
          this.noDataText = "暂无数据";
          this.loading = false;
        })
      },
      del(id, index) {

        //删除列表一项
        api.fetchBillingDel({
          id: id
        }).then((res) => {
          if (res.data.respCode == '0') {
            this.listData.splice(index, 1);
            this.$Message.success('删除成功！');
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      handleSubmit() {
        let createUser = window.localStorage.getItem('USER');
        if (!Number(this.cycleValue) || Number(this.cycleValue) <= 0 || Number(this.cycleValue) >= 180 || !util.isInt(this.cycleValue)) {
          this.$Message.error('请选择正确的计费方式！');
          return
        }


        if (this.cycleType == 0) {

          this.cycleName = '固定-周期' + this.cycleValue + 'S' + '-' + this.cycleFee;
          this.cyclePartFee = '';

          if (Number(this.cycleFee) != 0) {
            if (!Number(this.cycleFee) || Number(this.cycleFee) < 0) {
              this.$Message.error('请正确添加金额！');
              return
            }

            if (!util.isMoneyLen(this.cycleFee)) {
              this.$Message.error('金额最多只能是6位小数！');
              return
            }
          }

        } else {
          this.cycleName = '两段' + this.firstTime + 'S' + this.firstTimeMoney + '-周期' + this.cycleValue + 'S--' + this.lastTimeMoney;
          this.cycleFee = 1;


          if (Number(this.firstTimeMoney) == 0) {

            if (!Number(this.firstTime) || Number(this.firstTime) < 0) {
              this.$Message.error('请输入正确的数字！');
              return
            }

          } else {

            if (!Number(this.firstTime) || !Number(this.firstTimeMoney) || !Number(this.lastTimeMoney) || Number(this.firstTime) < 0 || Number(this.firstTimeMoney) < 0 || Number(this.lastTimeMoney < 0)) {
              this.$Message.error('请输入正确的数字！');
              return
            }

            if (!util.isMoneyLen(this.firstTimeMoney) || !util.isMoneyLen(this.lastTimeMoney)) {
              this.$Message.error('金额最多只能是6位小数！');
              return
            }

          }


          if (Number(this.lastTimeMoney) != 0) {
            if (!Number(this.firstTime) || !Number(this.firstTimeMoney) || !Number(this.lastTimeMoney) || Number(this.firstTime) < 0 || Number(this.firstTimeMoney) < 0 || Number(this.lastTimeMoney < 0)) {
              this.$Message.error('请输入正确的数字！');
              return
            }

            if (!util.isMoneyLen(this.firstTimeMoney) || !util.isMoneyLen(this.lastTimeMoney)) {
              this.$Message.error('金额最多只能是6位小数！');
              return
            }
          }


          if (!util.isInt(this.firstTime)) {
            this.$Message.error('请输入正整数！');
            return
          }


          this.firstTime = parseInt(this.firstTime);
          this.cycleFee = '';
          this.cyclePartFee = this.firstTime + ',' + this.firstTimeMoney + ',' + this.cycleValue + ',' + this.lastTimeMoney;
          this.cycleValue = '';
        }


        api.fetchBillingAdd({
          createUser: createUser,
          cycleName: this.cycleName,
          cycleType: this.cycleType,
          cycleValue: this.cycleValue,
          cycleFee: this.cycleFee,
          cyclePartFee: this.cyclePartFee
        }).then((res) => {
          if (res.data.respCode == '0') {
            this.modal1 = false;
            this.$Message.success('添加成功！');
            this.getList();
          } else {
            this.$Message.error(res.data.msg);
          }

        }).catch((err) => {
          console.log(err)
        })


      },
      handleReset() {
        this.modal1 = false;
//        this.$refs[name].resetFields();
      },
      cancel() {
        // this.$Message.info("点击了取消");
      },
      getPageChange(index) {
        this.pageNo = index;
        this.getList();
      },

      getPageSizeChange(pageNum) {
        this.pageNum = pageNum
        this.getList();
      },
      search() {
        this.pageNo = 1;
        this.getList();
      },
      toFixedStr(str) {
        if (str == 'cycleFee') {
          if (!isNaN(parseFloat(this.cycleFee))) {
            this.cycleFee = parseFloat(this.cycleFee).toFixed(6);
          } else {

            this.$Message.error('请输入正确的数字');
          }

        } else if (str == 'firstTimeMoney') {
          if (!isNaN(parseFloat(this.firstTimeMoney))) {
            this.firstTimeMoney = parseFloat(this.firstTimeMoney).toFixed(6);
          } else {

            this.$Message.error('请输入正确的数字');
          }

        } else if (str == 'lastTimeMoney') {
          if (!isNaN(parseFloat(this.lastTimeMoney))) {
            this.lastTimeMoney = parseFloat(this.lastTimeMoney).toFixed(6);
          } else {

            this.$Message.error('请输入正确的数字');
          }

        }
      }
    }
  };

</script>

