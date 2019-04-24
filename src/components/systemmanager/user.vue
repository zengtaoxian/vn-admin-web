<template>
  <div class="box">
    <div class="main_header clear">
      <div class="input_wrap" v-if="havePerm('122')">
        <i-input placeholder="用户姓名/登录账号/角色名称/所属部门"  style: @on-enter="search" v-model.trim="condition"></i-input>
        <span class="search_btn" @click="search"><Icon type="ios-search-strong"></Icon></span>
      </div>
      <div class="header_btn" v-if="havePerm('121')">
        <i-button type="primary" @click="modify()">
          <Icon type="plus-round"></Icon>&nbsp;&nbsp;新增用户</i-button>
      </div>
      <div class="export_btn" v-if="havePerm('204')" @click="exportData"></div>
    </div>


    <div class="new_tab_wrap" :style="{height:tabHeight+'px'}">
      <table class="new_table">
        <tr class="tab_th">
          <th class="text_left pad_lf">序号</th>
          <th class="text_left pad_lf">用户姓名</th>
          <th class="text_left pad_lf">登录账号</th>
          <th class="text_left pad_lf" sortable=true>状态</th>
          <th class="text_left pad_lf">所属部门</th>
          <!--<th class="text_left pad_lf">职位</th>-->
          <th class="text_left pad_lf">角色名称</th>
          <th class="text_left pad_lf">创建人</th>
          <th class="text_left pad_lf">创建时间</th>
          <th class="text_left pad_lf"  v-if="havePerm('123')">操作</th>
        </tr>
        <tr class="tba_content" v-for="(item,index) in listData" v-if="item.id != 1">
          <td class="pad_lf" v-html="index+1"></td>
          <td class="pad_lf" v-html="item.userName"></td>
          <td class="pad_lf" v-html="item.email"></td>
          <td class="pad_lf">
            <span v-if="item.status == '0'">正常</span>
            <span v-if="item.status == '1'">停用</span>
            <span v-if="item.status == '2'">注销</span>
          </td>
          <td class="pad_lf" v-html="item.departmentName"></td>
          <!--<td class="pad_lf" v-html="item.department"></td>-->
          <td class="pad_lf" v-html="item.roleName"></td>
          <td class="pad_lf" v-html="item.createUser"></td>
          <td class="pad_lf" v-html="item.createTime"></td>
          <td class="pad_lf" v-if="havePerm('123')">
            <span class="tab_del_btn" @click="modify(item)" v-if="item.status != '2'">编辑</span>
          </td>
        </tr>
      </table>
    </div>

    <div class="page_btm_div" v-if="totalCount">
      <Page class="page_iview_right" :total="totalCount" :page-size="pageNum" :current="pageNo" :page-size-opts="pageOpt" size="small" show-elevator show-sizer show-total placement="top" @on-change="getPageChange" @on-page-size-change="getPageSizeChange"></Page>
    </div>

    <!--<Page :total="totalCount" :page-size="pageNum" :current="pageNo" :page-size-opts="pageOpt" size="small" show-elevator show-sizer show-total placement="top" class="page" @on-change="getPageChange" @on-page-size-change="getPageSizeChange"></Page>-->

    <!-- <i-table :columns="columns1" :data="listData" class="table" ref="table"></i-table> -->
    <Modal v-model="modal1" :mask-closable="false" :title="titleName" @on-ok="ok" @on-cancel="cancel" :scrollable="scrollable" width="700">
      <Form ref="formValidate" :label-width="100">
        <Row>
          <Col span="5" offset="1">基本信息</Col>
        </Row>
        <row>
          <Col span="20" offset="2">
            <FormItem  class="ivu-form-item-required " label="登录账号">
              <Input v-model="formValidate.email"  :maxlength="30" placeholder="账号为公司账号，包括@ucpaas.com" :disabled = "formValidate.id == ''?false:true "></Input>
            </FormItem>
            <FormItem class="ivu-form-item-required " label="用户姓名" >
              <Input v-model="formValidate.userName" placeholder="长度不超过30，由（中文、英文、数字、下划线_或中划线-）组成"  :maxlength="30" :disabled = "formValidate.id == ''?false:true "></Input>
            </FormItem>
            <FormItem class="ivu-form-item-required " label="联系手机">
              <Input v-model="formValidate.mobile" placeholder="已开通11位数字手机号码"></Input>
            </FormItem>
            <FormItem class="ivu-form-item-required " label="所属部门" prop="departmentId" >
              <Select v-model="formValidate.departmentId" filterable placeholder='请选择'>
                <Option v-for="item in departmentList" :value="item.id" :key="item.id">{{ item.departmentName }}</Option>
              </Select>
            </FormItem>
            <FormItem class="ivu-form-item-required " label="修改状态" v-if="formValidate.id == ''?false:true">
              <el-radio-group v-model="formValidate.status" size="small">
                <el-radio-button :label="0" v-if="havePerm('126')" >正常</el-radio-button>
                <el-radio-button :label="1" v-if="havePerm('125')" >停用</el-radio-button>
                <el-radio-button :label="2" v-if="havePerm('124')">注销</el-radio-button>
              </el-radio-group>
            </FormItem>
          <FormItem class="ivu-form-item-required " label="用户状态" v-if="formValidate.id != ''?false:true" >
            <el-radio-group v-model="formValidate.status" size="small">
              <el-radio-button :label="0">正常</el-radio-button>
              <el-radio-button :label="1">停用</el-radio-button>
            </el-radio-group>
          </FormItem>
            <FormItem class="ivu-form-item-required " label="创建人" prop="createUser" v-show="formValidate.id == ''?false:true ">
              <Input v-model="formValidate.createUser" :disabled="true" ></Input>
            </FormItem>
          </Col>
        </row>
        <Row>
          <Col span="5" offset="1">配置角色</Col>
        </Row>
        <Row>
          <Col span="20" offset="1">
          <FormItem class="ivu-form-item-required " label="角色名称">
            <CheckboxGroup v-model="formValidate.roleId" class="morecheck">
              <Checkbox v-for="item in roleList" v-if="item.roleId != 1?true:false" :label="item.roleId"  :disabled="item.roleId == 2?true:false"   >{{item.roleName}}</Checkbox>
              <!--<Checkbox :label="item.id" check="checked"></Checkbox>-->
              <!--<Checkbox label="商务人员"></Checkbox>-->
              <!--<Checkbox label="商务主管"></Checkbox>-->
            </CheckboxGroup>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="10" offset="1" v-if="formValidate.id == ''?true:false">设置密码(可不填，默认为ucpaas123)</Col>
          <Col span="10" offset="1" v-if="formValidate.id != ''?true:false">修改密码</Col>
        </Row>
        <Row>
          <Col span="20" offset="3">
          <FormItem :label="formValidate.id == ''?'登录密码':'新密码'" >
            <Input v-model="formValidate.password" type="password" placeholder="请输入登录密码"></Input>
          </FormItem>
          <FormItem :label="formValidate.id == ''?'确认密码':'确认新密码'">
            <Input v-model="checkPassword" type="password" placeholder="请再次输入登录密码"></Input>
          </FormItem>
          <FormItem label="操作" v-model="formValidate.id" v-show="false"></FormItem>
          </Col>
        </Row>
      </Form>
      <!--<div slot="footer">-->
        <!--<Row>-->
          <!--<Col span="22" offset="1">-->
          <!--<div class="footer">-->
            <!--<Button type="ghost" class="tab_del_btn" @click="handleReset('formValidate')">取消</Button>-->
            <!--<Button type="primary" class="tab_del_btn" @click="handleSubmit('formValidate')">保存</Button>-->
          <!--</div>-->
          <!--</Col>-->
        <!--</Row>-->
      <!--</div>-->
      <Row>
        <Col span="20" offset="3">
        <div class="footer_modal">
          <Button type="ghost" class="sub_btn_size" @click="handleReset('formValidate')">取消</Button>
          <Button type="primary" class="sub_btn_size" @click="handleSubmit('formValidate')" :disabled="disable">保存</Button>
        </div>
        </Col>
      </Row>
    </Modal>
  </div>
</template>



<script>
import { mapGetters } from "vuex";
import {
  fetchUserList,
  fetchRoleAll,
  fetchAddUser,
  fetchUpdateUser,
  fetchUserDepartmentList,
  DownLoadFile
} from '@/api/api';
import * as util from '@/common/js/util.js';

export default {
  data() {
    return {
        disable: false,
        tabHeight:500,
        totalCount : 0,
        pageNo : 1,
        pageNum : util.pageSize,
        condition:'',
        pageOpt: util.pageOpt,
        scrollable:true,
        modal1: false,
        checkPassword:'',
        formValidate: {
          userName: '',
          email: '',
          status: '',
          departmentId: '',
          mobile:'',
          roleId:[2],
          password:'',
          id:"",
          createUser:localStorage.getItem('USER')
        },
        titleName:"",
        departmentName: "",
        roleName:"",
        position: "",
        createTime:"",
        params:'',
        listData: [],
        roleList: [],
        departmentList: []
    };
  },
  created(){
    this.tabHeight = (document.documentElement.clientHeight - 160 - 40);
    this.getUserList();
    this.getRoleAll();
    this.getUserDepartmentList();
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
//      this.$Message.info("点击了确定");
    },
    cancel() {
//      this.$Message.info("点击了取消");
    },
    exportData(type) {
      if(this.totalCount == 0){
        this.$Message.error("数据为空，不能导出");
        return
      }
      DownLoadFile({
        url: '/vcloud/sysManage/user/exportUserList', data: {
          condition: this.condition
        }
      });
    },

    modify(item){
      if(item){
        this.titleName="修改用户";
        this.formValidate.email=item.email;
        this.formValidate.userName=item.userName;
        this.formValidate.mobile=item.mobile;
        this.formValidate.departmentId=item.departmentId;
        this.formValidate.status=item.status;
        this.formValidate.roleId =[];
        var roleIdArray=item.roleId.split(',');
        for(var i=0; i<roleIdArray.length;i++){
          roleIdArray[i] = parseInt( roleIdArray[i]);
        }
        this.formValidate.roleId = roleIdArray;
        this.formValidate.createUser=item.createUser;
        this.formValidate.id=item.id;
        this.formValidate.password='';
        this.checkPassword='';
      }else{
        this.titleName="新增用户";
        this.checkPassword='',
        this.formValidate.email="";
        this.formValidate.password='';
        this.formValidate.userName="";
        this.formValidate.mobile="";
        this.formValidate.departmentId="";
        this.formValidate.status="0";
        this.formValidate.roleId = [2];
        this.formValidate.id = '';
      }
      this.modal1=true;
    },


    //用户添加验证
    addValidate(){
      if(this.formValidate.email == ""){
        this.$Message.info("登录账号不为空");
        return false;
      }else if(!util.isEmail(this.formValidate.email)){
        this.$Message.info("登录账号格式不对");
        return false;
      };
      if(this.formValidate.userName == ""){
        this.$Message.info("用户姓名不为空");
        return false;
      }else if(!util.isName(this.formValidate.userName)){
        this.$Message.info("用户姓名格式不对");
        return false;
      };
      if(this.formValidate.mobile == ""){
        this.$Message.info("联系手机不为空");
        return false;
      }else if(!util.isPhone(this.formValidate.mobile)){
        this.$Message.info("联系手机格式不对");
        return false;
      };
      if(this.formValidate.departmentId == ""){
        this.$Message.info("所属部门不为空");
        return false;
      };

      if(this.formValidate.password != '' && !util.checkPassWord(this.formValidate.password)){
        this.$Message.error("必须输入数字加字母，且长度大于6小于16的新密码");
        return;
      }

      if(this.formValidate.password != this.checkPassword){
        this.$Message.info("密码和确认密码不一致");
        return false;
      };
      return true;
    },


    // 表单验证
    handleSubmit (name) {
      this.disable = true;
      let data = Object.assign({},this.formValidate);
      data.roleId = data.roleId.join(',');

      if(data.id == ""){
          //添加表单提交
          if(this.addValidate()){
            fetchAddUser(
              data
            ).then((res)=>{
              if(res.data.respCode == '0'){
                this.$Message.success(res.data.msg);
                this.modal1 = false;
                this.getUserList();
              }else if(res.data.respCode == '1'){
                this.$Message.error(res.data.msg);
              }
              this.disable = false;
            }).catch((err)=>{
              this.disable = false;
              console.log(err)
            })
          }else{
            this.disable = false;
          }

        }else {
        if (this.addValidate()) {
          //编辑表单提交
          fetchUpdateUser(
            data
          ).then((res) => {
            if (res.data.respCode == '0') {
              this.$Message.success(res.data.msg);
              this.modal1 = false;
              this.getUserList();
            } else if (res.data.respCode == '1') {
              this.$Message.error(res.data.msg);
            }
            this.disable = false;
          }).catch((err) => {
            this.disable = false;
          })
        }else{
          this.disable = false;
        }
      }



       /* this.$refs[name].validate((valid) => {
          if (valid) {
            this.modal1 = false;
            this.$Message.success('Success!');
            if(this.params){
              //TO DO 修改号码段
            }else{
              //TO DO 新增号码段
            }
          } else {

            this.$Message.error('Fail!');
          }
        })*/
      },
    handleReset (name) {
      this.modal1 = false;
      // this.$refs[name].resetFields();
    },
    // 获取用户列表
    getUserList(){
      fetchUserList(
        {
          condition:this.condition,
          pageNo:this.pageNo,
          pageNum:this.pageNum
        }
      ).then((res)=>{
        if(res.data.respCode == '0'){
          var newlist = [];
          for(var i=0; i< res.data.list.length; i++){
            if(res.data.list[i].id != '1'){
              newlist.push(res.data.list[i]);
            }
          }
          this.listData = newlist;

          this.totalCount =this.listData.length;
        }
      }).catch((err)=>{
        console.log(err)
      })
    },
    // 获取用户部门列表
    getUserDepartmentList(){
      fetchUserDepartmentList(
        {
        }
      ).then((res)=>{
        if(res.data.respCode == '0'){
          this.departmentList = res.data.list;
        }
      }).catch((err)=>{
        console.log(err)
      })
    },

    getPageChange(page) {
      this.pageNo = page
      this.getUserList()
    },
    // 获取所有角色
    getRoleAll(){
      fetchRoleAll(
        {
        }
      ).then((res)=>{
        if(res.data.respCode == '0'){
          let roleAll = res.data.list;
          this.roleList = roleAll.reverse();
        }
      }).catch((err)=>{
        console.log(err)
      })
    },

    getPageChange(page) {
      this.pageNo = page
      this.getUserList()
    },

    getPageSizeChange(pageNum) {
      this.pageNum = pageNum
      this.getUserList()
    },

    search(){
      this.pageNo = 1;
      this.getUserList();
    }

  }
};
</script>


<style lang="less">
@import "../../common/less/user.less";
</style>
<style>

.main .single-page-con .single-page {
  margin: 20px 11px 0 24px;
  min-height: 774px;
}
.new_tab_wrap .new_table{
  border-top: 1px solid #e9eaec;
}

.box {
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: white;
}


.ivu-table-wrapper {
  border: 0;
}
.changestatus.ivu-form-item{
  margin-bottom: 0;
}
.morecheck {
  margin-bottom: 12px;
}
.ivu-row > .ivu-col {
  margin-bottom: 12px;
}
.ivu-modal-footer {
  display: none;
}

.morecheck{
  margin-bottom:-20px ;
}
.role.ivu-col{
  margin-bottom: 0;
}
</style>
