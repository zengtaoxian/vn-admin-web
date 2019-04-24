<style lang="less">
  @import "../../common/less/client.less";
  @import "../../common/less/main.less";

  .set_user {
    .title {
      line-height: 60px;
      border-bottom: #dbdee2 solid 1px;
      font-size: 16px;
      color: #3b5260;
      padding-left: 38px;
    }
    .set_user_content {
      .msg_title {
        padding-left: 70px;
        line-height: 60px;
        font-size: 16px;
        .ivu-checkbox-wrapper {
          font-size: 16px;
        }
      }
      .line_div {
        font-size: 14px;
        margin-bottom: 10px;
        .left_title {
          line-height: 34px;
          width: 190px;
          text-align: right;
          float: left;
          padding-right: 20px;
          position: relative;
        }
        .right_text {
          overflow: hidden;
          p {

            line-height: 34px;
            .perm_icon_span{
              display: inline-block;
              span{
                display: block;
                background: url("../../assets/images/ucer_checked_icon.png") center center no-repeat;
                float: left;
                width: 12px;
                height: 34px;
                margin-right: 6px;
              }
              padding-right: 16px;
            }
          }
          .input_text {
            line-height: 32px;
            /*border:#c1c5cd solid 1px;*/
            width: 320px;
            border-radius: 3px;
            text-indent: 10px;
          }
        }

      }
    }
    .set_user_btm {
      padding: 10px 0;
      font-size: 14px;
      padding-left: 190px;
      .btn_sub {
        display: inline-block;
        padding: 0 30px;
        color: #fff;
        line-height: 32px;
        background: #00b4ff;
        border: #00b4ff solid 1px;
        cursor: pointer;
        text-align: center;
        border-radius: 3px;
        margin-right: 20px;
      }
      .btn_qux {
        background: #ffffff;
        color: #506470;
        display: inline-block;
        padding: 0 30px;
        line-height: 32px;
        border: #a5a5a5 solid 1px;
        cursor: pointer;
        text-align: center;
        border-radius: 3px;
      }
    }
  }

  .checkbox_user {
    line-height: 34px;
  }

  .user_normal_icon {
    height: 34px;
    width: 12px;
    background: url("../../assets/images/user_normal_icon.png") center center no-repeat;
    display: block;
    float: left;
    margin-right: 6px;
  }
  .user_disable_icon{
    height: 34px;
    width: 12px;
    background: url("../../assets/images/user_disabled_icon.png") center center no-repeat;
    display: block;
    float: left;
    margin-right: 6px;
  }
  .perm_icon{

  }
</style>
<template>
  <div class="box">
    <div class="set_user">
      <div class="title">账号信息修改</div>
      <div class="set_user_content">
        <!--         <div class="msg_title">角色信息</div> -->
        <div class="line_div">
          <div class="left_title">登录账号</div>
          <div class="right_text"><p>{{formValidate.email}}</p></div>
        </div>
        <div class="line_div">
          <div class="left_title">用户姓名</div>
          <div class="right_text"><p>{{formValidate.userName}}</p></div>
        </div>
        <div class="line_div">
          <div class="left_title ivu-form-item-required"><label class="ivu-form-item-label">手机号</label></div>
          <div class="right_text">
            <!--<input  type="text" :disabled="isEdit?'true':'false'" placeholder="请输入手机号">-->
            <Input class="input_text" v-model="formValidate.mobile" placeholder="请输入手机号"></Input>
          </div>
        </div>
        <div class="line_div">
          <div class="left_title">所属部门</div>
          <div class="right_text"><p>{{formValidate.departmentName}}</p></div>
        </div>
        <div class="line_div">
          <div class="left_title">用户状态</div>
          <div class="right_text">
            <p v-if="formValidate.status == '0'"><span class="user_normal_icon"></span>正常</p>
            <p v-if="formValidate.status == '1'"><span class="user_disable_icon"></span>停用</p>
            <p v-if="formValidate.status == '2'">注销</p>
          </div>
        </div>
        <div class="line_div">
          <div class="left_title">角色权限</div>
          <!--<CheckboxGroup class="checkbox_user" v-model="roleId">-->
            <!--<Checkbox v-for="item in roleList" v-if="checkExist(item.roleId)" :label="item.roleId" disabled>-->
              <!--{{item.roleName}}-->
            <!--</Checkbox>-->
          <!--</CheckboxGroup>-->
          <div class="right_text">
            <p>
              <span class="perm_icon_span" v-for="item in roleList" v-if="checkExist(item.roleId)"><span class="icon_check"></span>{{item.roleName}}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="set_user_content">
        <div class="msg_title">
          <Checkbox  v-model="single">修改密码</Checkbox>
        </div>
        <div class="line_div">
          <div class="left_title ivu-form-item-required"><label class="ivu-form-item-label">原密码</label></div>
          <div class="right_text">
            <Input class="input_text" type="password" v-model="formValidate.oldpassword" :disabled="!single"
                   placeholder="请输入原密码"></Input>
          </div>
        </div>
        <div class="line_div">
          <div class="left_title ivu-form-item-required"><label class="ivu-form-item-label">新密码</label></div>
          <div class="right_text">

            <Input class="input_text" type="password" v-model="formValidate.password" :disabled="!single"
                   placeholder="请输入新密码"></Input>
          </div>
        </div>
        <div class="line_div">
          <div class="left_title ivu-form-item-required"><label class="ivu-form-item-label">确认密码</label></div>
          <div class="right_text">
            <Input class="input_text" type="password" v-model="formValidate.repassword" :disabled="!single"
                   placeholder="请输入新确认密码"></Input>
          </div>
        </div>
      </div>
      <div class="set_user_btm">
        <!--<span class="btn_sub" v-if="isEdit" @click="showEdit">编辑</span>-->
        <span class="btn_sub" @click="updateUserInfomation">保存</span>
        <span class="btn_qux" @click="cancel">返回</span>
      </div>
    </div>
  </div>
</template>
<script>
  import * as api from "@/api/api"
  import * as util from 'common/js/util'

  export default {
    data() {
      return {
        roleId: [],
        roleList: [],
        isEdit: true,
        single: false,
        formValidate: {
          email: '',
          userName: '',
          mobile: '',
          departmentName: '',
          status: '',
          password: '',
          repassword: '',
          oldpassword: '',
        }
      }
    },
    created: function () {
      this.getUserInfomation()
      this.getRoleAll()
    },
    methods: {
      showEdit() {
        this.isEdit = false;
      },
      cancel() {
//        this.isEdit = true;
        this.single = false;
        this.$router.push({path: '/index'});
      },
      click() {

      },
      getUserInfomation() {
        api.fetchGetMainPageUserInfomation({}).then((res) => {

          this.formValidate.userName = res.data.map.userInfo.userName
          this.formValidate.departmentName = res.data.map.userInfo.departmentName
          this.formValidate.email = res.data.map.userInfo.email
          this.formValidate.mobile = res.data.map.userInfo.mobile
          this.formValidate.status = res.data.map.userInfo.status
          this.roleId = res.data.map.userInfo.roleId.split(",")
          for (var i = 0; i < this.roleId.length; i++) {
            this.roleId[i] = parseInt(this.roleId[i])
          }

        }).catch((err) => {
          console.log(err)
        })
      },
      checkExist(role) {
        return !(this.roleId.indexOf(role) == -1)
      },
      // 获取所有角色
      getRoleAll() {
        api.fetchRoleAll(
          {}
        ).then((res) => {

          if (res.data.respCode == '0') {
            let roleAll = res.data.list;
            this.roleList = roleAll.reverse();
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      updateUserInfomation() {

        if(!util.isPhone(this.formValidate.mobile)){
          this.$Message.error("请输入正确的手机号");
          return;
        }


        if (!this.single) {
          this.formValidate.password = ''
          this.formValidate.repassword = ''
          this.formValidate.oldpassword = ''
        } else {
          if (this.formValidate.oldpassword == '') {
            this.$Message.error("旧密码不能为空");
            return;
          }
          if (this.formValidate.password == '') {
            this.$Message.error("新密码不能为空");
            return;
          }


          if(!util.checkPassWord(this.formValidate.password)){
            this.$Message.error("必须输入数字加字母，且长度大于6小于16的新密码");
            return;
          }

          if (this.formValidate.repassword == '') {
            this.$Message.error("确认密码不能为空");
            return;
          }
          if (this.formValidate.password != this.formValidate.repassword) {
            this.$Message.error("两次密码输入不一致");
            return;
          }
        }
        api.fetchUpdateUserInfomation({
          mobile: this.formValidate.mobile,
          password: this.formValidate.password,
          oldPassword: this.formValidate.oldpassword
        }).then((res) => {

          if (res.data.respCode == '0') {
//            this.isEdit = true
            this.single = false
            this.$Message.success(res.data.msg);
          } else {
            this.$Message.error(res.data.msg);
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  }

</script>
