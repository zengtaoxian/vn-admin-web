<template>
  <div class="box">
    <div class="main_header clear">
      <div v-if="check_perm(263)" class="input_wrap">
        <i-input placeholder="号码/区号/城市"  style:  @on-enter="search" v-model.trim="condition"></i-input>
        <span class="search_btn" @click="search"><Icon type="ios-search-strong"></Icon></span>
      </div>
      <div v-if="check_perm(133)" class="header_btn">
        <i-button type="primary" @click="modify()">
          <Icon type="plus-round"></Icon>&nbsp;&nbsp;新增号段</i-button>
      </div>
      <div v-if="check_perm(268)" class="export_btn" @click="exportData"></div>
    </div>

    <div class="new_tab_wrap" :style="{height:tabHeight+'px'}">
      <table class="new_table">
      <tr class="tab_th">
        <th class="text_left pad_lf" width="50"  align="left">序号</th>
        <th class="text_left pad_lf" width="150"  align="left">号段</th>
        <th class="text_left pad_lf" width="150"  align="left">区号</th>
        <th class="text_left pad_lf" width="150"  align="left">城市</th>
        <th class="text_left pad_lf" width="150"  align="left">运营商</th>
        <th class="text_left pad_lf" width="150"  align="left">操作</th>
      </tr>
      <tr class="tba_content" v-for="(item,index) in listData">
        <td class="pad_lf" v-html="index+1"></td>
        <td class="pad_lf" v-html="item.numberPrefix"></td>
        <td class="pad_lf" v-html="item.areaCode"></td>
        <td class="pad_if" v-html="item.cityName"></td>
        <td class="pad_lf">
          <span v-if="item.numberType=='0'">移动</span>
          <span v-else-if="item.numberType=='1'">联通</span>
          <span v-else="item.numberType=='2'">电信</span>
        </td>
        <td class="pad_lf">
          <span v-if="check_perm(134)" class="tab_del_btn" @click="modify(item)">修改</span>
          <Poptip confirm title="您确认删除吗？" @on-ok="del(item.id)" @on-cancel="cancel"><span v-if="check_perm(135)" class="tab_del_btn">删除</span></Poptip>
        </td>
      </tr>
    </table>
    </div>
    <div class="page_btm_div" v-if="totalCount">
      <Page class="page_iview_right" :total="totalCount" :page-size="pageSize" :current="currentPage" :page-size-opts="pageOpt" size="small" show-elevator show-sizer show-total placement="top" @on-change="getNumberPageChange" @on-page-size-change="getNumberPageSizeChange"></Page>
    </div>

    <Modal v-model="modal1" :mask-closable="false" :title="titleName" @on-ok="handleSubmit('formValidate')"
    @on-cancel="handleReset('formValidate')">
      <Row>
        <Col span="3">
        &nbsp;</Col>
      </Row>
      <row>
        <Col span="21" offset="1">
        <Form ref="formValidate" :label-width="80">
          <FormItem class="ivu-form-item-required" label="号段">
            <Input class="ivu-form-item-required" v-model="numberPrefix" placeholder="请输入7位号段"></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="区号" prop="areaCode">
            <Input v-model="areaCode" placeholder="区号：0755"></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="运营商" prop="numberType">
            <el-radio-group v-model="numberType"  shape="circle" size="small">
              <el-radio-button label="0">移动</el-radio-button>
              <el-radio-button label="1">联通</el-radio-button>
              <el-radio-button label="2">电信</el-radio-button>
            </el-radio-group>
          </FormItem>
          <FormItem label="操作" v-model="params" v-show="false">
          </FormItem>
          <!--<FormItem >-->
            <!--<Button type="primary" @click="handleSubmit('formValidate')" style="float:right">保存</Button>-->
            <!--<Button type="ghost" @click="handleReset('formValidate')"  style="margin-right: 10px;float:right">取消</Button>-->
          <!--</FormItem>-->
          <div class="footer_modal">
            <Button type="ghost" class="sub_btn_size" @click="handleReset">取消</Button>
            <Button type="primary" class="sub_btn_size" @click="handleSubmit('formValidate')">保存</Button>
          </div>
        </Form>

        </Col>
      </row>
      </Row>
    </Modal>

  </div>
</template>
<script>

import {mapGetters} from "vuex";
import {perm} from "@/utils/perm.js";

import * as util from "@/common/js/util";
import {
  fetch_number_info,
  add_number_info,
  del_number_info,
  update_number_info,
  DownLoadFile
} from '@/api/api';

  export default {
    data() {
      return {
        tabHeight:500,
        totalCount : 0,
        currentPage : 1,
        pageSize : util.pageSize,
        pageOpt: util.pageOpt,
        modal1: false,
        condition: "",
        titleName: "新增号段",
        numberPrefix: '',
        areaCode: "",
        numberType:'1',
        params: "",
        listData: [
        ]
      };
    },

    created(){
      this.tabHeight = (document.documentElement.clientHeight - 160 - 40);
      this.getNumberList();
    },

    computed: {
      ...mapGetters({
        check_perm: "main/check_perm",
      })
    },

    methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // TO DO check params operater
          if(this.numberPrefix=="" || this.areaCode==""){
            this.$Message.error('必填项不能为空');
            return;
          }

          if(!util.isPhoneSection(this.numberPrefix)){
            this.$Message.error('输入的号段不正确, 请重新输入7位数号段');
            return ;
          }

          if(!util.isAreCode(this.areaCode)){
            this.$Message.error('输入的区号不正确, 请重新输入');
            return ;
          }

          this.modal1 = false;
          if(this.params){
            this.modifyNumber(this.params);
          }else{
            this.setNumberList();
          }
        } else{
          this.$Message.error('Fail!');
        }
      })
    },

    handleReset (name) {
      this.modal1 = false;
    },

    cancel() {
//      this.$Message.info("点击了取消");
    },

    modify(item){
      if (item){
        this.titleName="修改号段";
        this.areaCode=item.areaCode;
        this.numberPrefix=item.numberPrefix;
        this.numberType=item.numberType;
        this.params=item.id;
      }else{
        this.titleName="新增号段";
        this.areaCode="";
        this.numberPrefix="";
        this.numberType="0";
        this.params="";
      }
      this.modal1=true;
    },

    del(number){
      this.deleteNumber(number);
    },

    exportData(type) {
      if(this.totalCount == 0){
        this.$Message.error("数据为空，不能导出");
        return
      }
      DownLoadFile({
          url: '/vcloud/sysManage/numInfo/exportNumber', data: {
            condition: this.condition
          }
      });
    },

      //获取号段列表
    getNumberList() {
      fetch_number_info(
        {
          condition: this.condition,
          pageNo: this.currentPage,
          pageNum: this.pageSize
        }
      ).then(response => {
        if(response.data.respCode==0){
          this.totalCount = response.data.totalCount;
          this.listData = response.data.list;
        }else{
          this.$Message.error("获取数据失败");
        }
      })
      .catch(err => {
        console.log(err);
        this.$Message.error("获取数据失败");
      });
    },

      //新增号码段
    setNumberList() {
      add_number_info(
        {
          createUser: localStorage.getItem('USER'),
          areaCode: this.areaCode,
          numberType: this.numberType,
          numberPrefix: this.numberPrefix
        }
      ).then(response => {
        if(response.data.respCode==0){
          this.$Message.info(response.data.msg);
          this.getNumberList();
        }else{
          this.$Message.error(response.data.msg);
          return;
        }
      })
      .catch(err => {
        console.log(err);
        this.$Message.error("号段添加失败");
      });
    },

    //删除号码段
    deleteNumber(number) {
      del_number_info(
        {
          id: number
        }
      ).then(response => {
        if(response.data.respCode==0){
          this.$Message.info(response.data.msg);
          this.getNumberList();
        }else{
          this.$Message.error(response.data.msg);
          return ;
        }
      })
      .catch(err => {
        console.log(err);
        this.$Message.error("号段删除失败");
        return ;
      });
    },

    // 修改号码段
    modifyNumber(indexId){
      update_number_info(
        {
          id: indexId,
          areaCode: this.areaCode,
          numberType: this.numberType,
          numberPrefix: this.numberPrefix
        }
      ).then(response => {
        if(response.data.respCode==0){
          this.currentPage = this.currentPage;
          this.$Message.info(response.data.msg);
          this.getNumberList();
        }else{
          this.$Message.error(response.data.msg);
          return ;
        }
      })
      .catch(err => {
        console.log(err);
        this.$Message.error("修改号段失败");
      });
    },

    getNumberPageChange(page) {
      this.currentPage = page
      this.getNumberList()
    },

    getNumberPageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getNumberList()
    },

    search(){
      this.pageNo = 1;
      this.getNumberList();
    }
  },
  };
</script>

<style lang="less">
  @import "../../common/less/number.less";
</style>
