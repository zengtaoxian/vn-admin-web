<template>
  <div class="login" >
    <div class="login_head">
      <img class="login_img" src="../../assets/login/login.png" alt=""><span class="title">供应链 · 管理平台</span>
    </div>
    <div class="login_bg" >
      <video controls="controls" class="video"  autoplay="autoplay" loop="loop" >
      <source src="./login.mp4" type="video/mp4" />
      Your browser does not support the video tag.
      </video>
    </div>
    <div class="login_opct"></div>

      <div class="login_content" >
        <form>
          <div class="login_form" @keyup.enter="keyLogin()">
            <h1 class="login_t">欢迎登录</h1>
            <div class="login_line user_top">
              <input class="input_big" type="text" name="userName" v-model="userName" placeholder="邮箱/手机号"  >
            </div>
            <div class="login_err"></div>
            <div class="login_line">
              <input class="input_big" type="password" name="passwordVal" v-model="password" placeholder="密码">
            </div>
            <div class="login_err"></div>
            <div class="login_line clear">
              <input class="input_big login_small_input" type="text" name="verCode" v-model="imgCode" placeholder="验证码">
              <img class="ver_code_img" :src="imgCodeUrl" alt="" @click="refreshCode">
            </div>
            <div class="login_err">{{errMsg}}</div>

            <div class="login_btn" @click="login">登录</div>
            <template>
              <Checkbox class="checkbox" v-model="single" size="large">记住我</Checkbox>
            </template>
          </div>
        </form>

      </div>
      <div class="copy">© 2018 深圳市云之讯网络技术有限公司</div>
    </div>

</template>

<script type="text/ecmascript-6">
  import md5 from 'js-md5';
  import {
    passwordRule,
    isEmail,
    isPhone
  } from "@/common/js/util.js";

  export default {
    data() {
      return {
        randomId:'',
        single: true,
        userName: '',
        password: '',
        imgCodeUrl: '',
        imgCode: '',
        errMsg: ''
      }
    },
    created: function () {
      this.getImgCode();
      this.getInfo();
    },
    mounted() {
    },
    methods: {
     uuid(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
          var r=Math.random()*16|0,
            v=c=='x'?r:(r&0x3|0x8);
          return v.toString(16)
        }).toUpperCase()
      },
      getImgCode() {
        this.randomId = this.uuid();
        this.imgCodeUrl = '/vcloud/loginManage/login/checkCode?randomId=' + this.randomId;
      },
      login() {
        if (this.userName == '') {
          this.errMsg = '用户名不能为空!';
          return
        }

        if (!isEmail(this.userName) && !isPhone(this.userName)){
          this.errMsg = '用户名不正确，请重新输入邮箱或手机号!';
          return
        }

        if (this.password == '') {
          this.errMsg = '密码不能为空!';
          return
        }

        if (this.imgCode == '') {
          this.errMsg = '验证码不能为空!';
          return
        }
        this.errMsg = '';
        this.$store.dispatch('login/login', {
          email: this.userName,
          password: md5(this.password),
          checkCode: this.imgCode,
          randomId: this.randomId
        }).then(response => {
          if (response.data.respCode == '0') {
            if(this.single){
              window.localStorage.setItem('USER', response.data.map.email);
            }

            this.$router.push({path: '/index'});
          } else {
            this.getImgCode();
            this.errMsg = response.data.msg;
          }

        }).catch(err => {
          console.error(err);
          this.errMsg = err;
        })
      },
      refreshCode() {
        this.getImgCode()
      },
      getInfo() {
        var user = window.localStorage.getItem('USER');
        console.log(user)
        if (user != undefined || user != 'undefined') {
          this.userName = user;
        }else{
          this.userName = '';

        }
      },
      keyLogin(){
        this.login();
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  .ivu-checkbox-checked{
    .ivu-checkbox-inner{
      background: #00b4ff !important;
      border: #00b4ff solid 1px !important;
    }
  }
</style>
<style lang="less" rel="stylesheet/less" scoped>

  .app-main{
    min-width: initial;
    overflow: hidden;
  }
  .video {
    position: fixed;
    left: 0;
    top: 60px;
    bottom: 0;
    right: 0;
    width: 100%;

  }

  .login {
    .login_head {
      background: #fff;
      height: 60px;
      /*box-shadow: 0 4px 1px 1px hsla(0, 0%, 39%, .1);*/
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      z-index: 1;
      .login_img {
        width: 115px;
        height: 35px;
        float: left;
        margin: 14px 20px 0 24px;
      }
      .title {
        color: #1f3148;
        font-size: 24px;
        margin: 19px 0 0 0;
        padding-left: 20px;
        display: inline-block;
        border-left: #9da7b5 solid 1px;
        line-height: 24px;
      }
    }
    .login_bg {
      position: absolute;
      left: 0;
      top: 60px;
      bottom: 0;
      right: 0;
      background: url("../../assets/login/login_bg.png") no-repeat;
      background-size: cover;
    }
    .login_opct{
      position: absolute;
      left: 0;
      top: 60px;
      bottom: 0;
      right: 0;
      background: rgba(0,0,0,.4);
    }
    .copy{
      text-align: center;
      font-size: 16px;
      color: rgba(255,255,255,.4);
      position: absolute;
      bottom: 30px;
      left: 0;
      width: 100%;
    }
    .login_content {
      width: 490px;
      height: 460px;
      padding: 0 40px;
      border-radius: 5px;
      position: absolute;
      z-index: 4;
      left: 50%;
      top: 50%;
      margin: -230px 0 0 -245px;
      background: rgba(255,255,255,.8);
      .login_form {
        .login_t {
          font-size: 34px;
          line-height: 34px;
          padding: 40px 28px;
          font-weight: normal;
          text-align: center;
        }
        .login_err {
          height: 20px;
          line-height: 20px;
          color: red;
        }
        .login_line {
          .input_big {
            width: 100%;
            height: 54px;
            border: #b8c1cc solid 1px;
            text-indent: 10px;
            border-radius: 5px;
            font-size: 18px;
            &:focus{
              border: #26b9f6 solid 1px;
            }
          }
          .login_small_input {
            width: 270px;
            float: left;
          }

        }
        .ver_code_img {
          height: 54px;
          float: right;
          width: 126px;
          border-radius: 5px;
          border: #b8c1cc solid 1px;
        }
        .login_btn {
          height: 58px;
          line-height: 58px;
          color: #fff;
          font-size: 22px;
          text-align: center;
          background: #0eb2f6;
          cursor: pointer;
          border-radius: 5px;
          margin-bottom: 18px;
          &:hover{
            background: #00a3e6;
          }
        }
      }
    }
  }


</style>
