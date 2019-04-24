<style lang="less">
  @import "../../common/less/number.less";
</style>
<style scoped>
  .new_tab_wrap .new_table{
    border-top: 1px solid #e9eaec;
  }
</style>
<template>
  <div class="box">
    <div class="main_header clear">
      <div v-if="check_perm(264)" class="input_wrap">
        <i-input placeholder="国家名称/计费前缀"  style:  @on-enter="search" v-model.trim="condition"></i-input>
        <span class="search_btn" @click="search"><Icon type="ios-search-strong"></Icon></span>
      </div>
      <div v-if="check_perm(142)" class="header_btn">
        <i-button type="primary" @click="modify()">
          <Icon type="plus-round"></Icon>&nbsp;&nbsp;新增费率</i-button>
      </div>
      <!-- <div v-if="check_perm(143)" class="export_btn" @click="exportData"></div> -->
    </div>
    <!-- <i-table :columns="columns1" :data="listData" class="table" ref="table"></i-table> -->
    <div class="new_tab_wrap" :style="{height:tabHeight+'px'}">
      <table class="new_table">
        <tr class="tab_th">
          <th class="text_left pad_lf">序号</th>
          <th class="text_left pad_lf">国家名称</th>
          <th class="text_left pad_lf">计费前缀</th>
          <th class="text_left pad_lf">计费前缀长度</th>
          <th class="text_left pad_lf">费率(元)</th>
          <th class="text_left pad_lf">计费周期(秒)</th>
          <th class="text_left pad_lf">备注</th>
          <th class="text_left pad_lf">操作</th>
        </tr>
        <tr class="tba_content" v-for="(item,index) in listData">
          <td class="pad_lf" v-html="index+1"></td>
          <td class="pad_lf" v-html="item.areaName"></td>
          <td class="pad_lf" v-html="item.prefix"></td>
          <td class="pad_if" v-html="item.prefixLen"></td>
          <td class="pad_if" v-html="item.fee"></td>
          <td class="pad_if" v-html="item.billCycle"></td>
          <td class="pad_if" v-html="item.remark"></td>
          <td class="pad_lf">
            <span v-if="check_perm(145)" class="tab_del_btn" @click="modify(item)">修改</span>
           <!-- <span v-if="check_perm(144)" class="tab_del_btn" @click="del(item.id)">删除</span>-->
            <Poptip confirm title="您确认删除吗？" @on-ok="del(item.id)" @on-cancel="cancel"><span v-if="check_perm(144)" class="tab_del_btn">删除</span></Poptip>
          </td>
        </tr>
      </table>
    </div>

    <!--<Page :total="totalCount"  :page-size="pageSize" :current="currentPage" :page-size-opts="pageOpt" size="small" show-elevator show-sizer show-total placement="top" class="page" @on-change="getInternationalPageChange" @on-page-size-change="getInternationalPageSizeChange"></Page>-->
    <div class="page_btm_div" v-if="totalCount">
      <Page class="page_iview_right" :total="totalCount"  :page-size="pageSize" :current="currentPage" :page-size-opts="pageOpt" size="small" show-elevator show-sizer show-total placement="top" @on-change="getInternationalPageChange" @on-page-size-change="getInternationalPageSizeChange"></Page>
    </div>

    <Modal v-model="modal1" :mask-closable="false" :title="titleName" @on-ok="handleSubmit('formValidate')" @on-cancel="handleReset('formValidate')">
      <Row>
        <Col span="3">
        &nbsp;</Col>
      </Row>
      <row>
        <Col span="21" offset="1">
        <Form ref="formValidate" :label-width="80">
          <FormItem class="ivu-form-item-required" label="国家名称" prop="areaName">
            <Input v-model="areaName" placeholder="CHINA"></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="计费前缀" prop="prefix">
            <Input v-model="prefix" placeholder="0755"></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="前缀长度" prop="prefix">
            <Input v-model="prefixLen" placeholder="4" ></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="计费周期" prop="billCycle">
            <Input v-model="billCycle" placeholder="60"></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="计费费率" prop="fee">
            <Input v-model="fee" placeholder="8.88"></Input>
          </FormItem>
          <FormItem class="tdetail_msg_text" label="备注" prop="remark">
            <Input v-model="remark" placeholder="备注"></Input>
          </FormItem>
          <FormItem label="操作" v-model="params" v-show="false"></FormItem>
          <!--<FormItem >-->
            <!--<Button type="primary" @click="handleSubmit('formValidate')" style="float:right" >保存</Button>-->
            <!--<Button type="ghost" @click="handleReset('formValidate')"  style="margin-right: 10px;float:right">取消</Button>-->
          <!--</FormItem>-->
          <div class="footer_modal">
            <Button type="ghost" class="sub_btn_size" @click="handleReset('formValidate')">取消</Button>
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
import {
  fetch_international_info,
  add_international_info,
  del_international_info,
  update_international_info,
  DownLoadFile
} from '@/api/api';
import * as util from "@/common/js/util"

  export default {
    data() {
      return {
        tabHeight:500,
        totalCount : 0,
        currentPage : 1,
        pageSize : util.pageSize,
        pageOpt: util.pageOpt,
        condition: "",
        modal1: false,
        titleName: "",
        areaName: '',
        prefix: '',
        prefixLen: " ",
        fee:'',
        billCycle: '',
        remark:'',
        params: "",
        listData: [

        ]
      };
    },
    created(){
      this.tabHeight = (document.documentElement.clientHeight - 160 - 40);
      this.getInternationalList();
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
            // TO DO params check
            if(this.areaName=="" || this.prefix=="" || this.prefixLen=="" ||
              this.billCycle=="" || this.fee==""){
              this.$Message.error('必填项不能为空');
              return;
            }
            this.modal1 = false;
            if(this.params){
              this.modifyInternational(this.params);
            }else{
              this.setInternationalList();
            }
          } else {

            this.$Message.error('Fail!');
          }
        })
      },
      handleReset (name) {
        this.modal1 = false;
        // this.$refs[name].resetFields();
      },
      cancel() {
//        this.$Message.info("点击了取消");
      },

      exportData(type) {
        DownLoadFile({
          url: '/vcloud/sysManage/nationFeeExcel', data: {
            condition: this.condition
          }
        });
      },

      modify(item){
        if(item){
          this.titleName="修改国际费率表";
          this.areaName=item.areaName;
          this.prefix=item.prefix;
          this.prefixLen=item.prefixLen;
          this.billCycle=item.billCycle;
          this.fee=item.fee;
          this.remark=item.remark;
          this.params=item.id;
        }else{
          this.titleName="新增国际费率表";
          this.areaName="";
          this.prefix="";
          this.prefixLen="";
          this.billCycle="";
          this.fee="";
          this.remark="";
          this.params = "";
        }
        this.modal1=true;
      },

      del(indexId){
        this.deleteinternational(indexId);
      },

      //获取国际费率表列表
      getInternationalList() {
       fetch_international_info(
         {
            condition: this.condition,
            pageNo: this.currentPage,
            pageNum: this.pageSize
          }
        ).then(response => {
          if(response.data.respCode == 0){
            this.listData = response.data.list;
            this.totalCount = response.data.totalCount;
          }else{
            this.$Message.error(response.data.msg);
            return ;
          }
        })
        .catch(err => {
          console.log(err);
          this.$Message.error("获取国际费率表失败")
        });
    },

    setInternationalList() {
      add_international_info(
        {
          createUser: localStorage.getItem("USER"),
          fee: this.fee,
          billCycle: this.billCycle,
          areaName: this.areaName,
          prefix: this.prefix,
          remark: this.remark,
        }
      ).then(response => {
        if(response.data.respCode == 0){
          this.$Message.info(response.data.msg);
          this.getInternationalList();
        }else{
          this.$Message.error(response.data.msg);
        }
        })
        .catch(err => {
          console.log(err);
          this.$Message.error("新增国际费率失败");
        });
    },

    modifyInternational(indexId){
      update_international_info({
          id: indexId,
          fee: this.fee,
          billCycle: this.billCycle,
          areaName: this.areaName,
          prefix: this.prefix,
          prefixLen: this.prefixLen,
          remark: this.remark
        }
      ).then(response => {
          if(response.data.respCode == 0){
            this.$Message.info(response.data.msg);
            this.getInternationalList();
          }else{
            this.$Message.error(response.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
          this.$Message.error("修改国际费率失败")
        });
    },

    deleteinternational(indexId){
      del_international_info({
          id: indexId
        }
      ).then(response => {
        if(response.data.respCode == 0){
          this.$Message.info(response.data.msg);
          this.getInternationalList();
        }else{
          this.$Message.error(response.data.msg);
        }
        })
        .catch(err => {
          console.log(err);
          this.$Message.error("删除国际费率失败");
        });
    },

    getInternationalPageChange(page) {
      this.currentPage = page
      this.getInternationalList()
    },

    getInternationalPageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getInternationalList()
    },

    search(){
      this.currentPage=1;
      this.getInternationalList();
    }
  }
};
</script>

