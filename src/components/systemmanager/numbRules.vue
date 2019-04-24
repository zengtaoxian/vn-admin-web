<style lang="less">
@import "../../common/less/client.less";
</style>
<template>
  <div class="box">
    <div class="main_header clear">
      <div class="input_wrap">
        <i-input placeholder="编号名称"  style:></i-input>
      </div>
      <div class="header_btn">
        <i-button type="primary" @click="modify()">
          <Icon type="plus-round"></Icon>&nbsp;&nbsp;新增编号</i-button>
      </div>
    </div>


    <div class="tab_wrap">
      <i-table :columns="columns1" :data="data1" class="table" ref="table" :height="tabHeight" :loading="loading"></i-table>
    </div>
    <div class="page_btm_div" v-if="totalCount">
      <Page class="page_iview_right" :total="totalCount"  :page-size="pageSize" :current="currentPage" :page-size-opts="pageOpt" size="small" show-elevator show-sizer show-total placement="top" @on-change="getPageChange" @on-page-size-change="getPageSizeChange"></Page>
    </div>
    <Modal v-model="modal1" :title="titleName" @on-ok="ok" @on-cancel="cancel" :scrollable="scrollable">
      <Form ref="formValidate" :model="formValidate" :label-width="150">
        <Row>
          <Col span="3">基本信息</Col>
        </Row>
        <row>
          <Col span="20" offset="3">
          <FormItem class="ivu-form-item-required" label="编码名称" prop="numberName">
            <Input v-model="formValidate.numberName" placeholder="订单编号规则"></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required" size="small" label="编号规则公式" prop="numberRuleExpressions">
            <Input v-model="formValidate.numberRuleExpressions" placeholder="%[cmd]%[]"></Input>
          </FormItem>
          </Col>
        </row>

      </Form>
      <div class="footer">
        <Button type="ghost" class="subbtn" @click="handleReset('formValidate')">取消</Button>
        <Button type="primary" class="subbtn" @click="handleSubmit('formValidate')">保存</Button>
      </div>
    </Modal>
    <!--<Page :total="totalCount"  :page-size="pageSize" :current="currentPage" :page-size-opts="pageOpt" size="small" show-elevator show-sizer show-total placement="top" class="page" @on-change="getPageChange" @on-page-size-change="getPageSizeChange"></Page>-->
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import * as util from "@/common/js/util";
export default {
  data() {
    return {
      tabHeight:'500',
      loading:false,
      totalCount : 0,
      currentPage : 1,
      pageSize : util.pageSize,
      pageOpt: util.pageOpt,
      condition: "",
      titleName: '',
      scrollable: true,
      modal1: false,
      formValidate: {
        numberName: "",
        numberRuleExpressions: ""
      },
      columns1: [
        {
          title: "序号",
          key: "number",
          width: 80
        },
        {
          title: "编号名称",
          key: "numberName"
        },
        {
          title: "编号规则公式",
          key: "numberRuleExpressions"
        },
        {
          title: "操作",
          key: "operate",
          render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {
                        type: 'ghost',
                        size: 'small'
                    },
                    style: {
                      // marginRight: '5px',
                      border: "none",
                      class: "tab_del_btn",
                      color: "#0eb2f6",
                      cursor: "pointer",
                    },

                    on: {
                        click: () => {
                            this.modify(params.index)
                        }
                    }
                }, '编辑'),
                h('Button', {
                    props: {
                        type: 'ghost',
                        size: 'small'
                    },
                    style: {
                        // marginRight: '5px',
                        border: "none",
                        class: "tab_del_btn",
                        color: "#0eb2f6",
                        cursor: "pointer",
                    },

                    on: {
                        click: () => {
                            this.delete(params.index)
                        }
                    }
                }, '删除')

                ]);
            }
        },
      ],
      data1: [
        {
          number: 1,
          numberName: "订单编号规则",
          numberRuleExpressions: "q123"
        },
        {
          number: 2,
          numberName: "商品编号规则",
          numberRuleExpressions: "safds"
        }
      ],
    };
  },
  created() {
    this.tabHeight = (document.documentElement.clientHeight - 160 - 40);
    this.getNumberRulesList();
  },
  computed: mapGetters(["system"]),
  methods: {
    out() {
      alert(111);
    },
    ok() {
//      this.$Message.info("点击了确定");
    },
    cancel() {
//      this.$Message.info("点击了取消");
    },

    modify(indexId){
      if(indexId==""){
        this.titleName="修改编号";
        this.formValidate.numberName=this.data1[indexId].numberName;
        this.formValidate.numberRuleExpressions=this.data1[indexId].numberRuleExpressions;
      }else{
        this.titleName="新增编号";
        this.formValidate.numberName="";
        this.formValidate.numberRuleExpressions="";
      }
      this.modal1=true
    },

    delete(indexId){
      this.data1.splice(indexId, 1);
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
    // 获取客户列表
    getNumberRulesList() {
      this.$http({
        method: "post",
        url: "vcloud/cusManage/customer/queryCustomerList",
        data: {
          condition: "",
          pageNo: 1,
          pageNum: 10
        }
      })
        .then(response => {
        })
        .catch(err => {
          console.log(err);
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
  }
};
</script>
