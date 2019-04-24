<style lang="less">
  @import "../common/less/main.less";

  .navicon-con {
    position: absolute;
    bottom: 0;
    z-index: 1002;
    left: 50%;
    margin-left: -26px;
    .ivu-btn-text {
      color: #fff;
      &:hover {
        color: #fff;
      }
    }
  }

  .main-header {
    line-height: 48px;
    font-size: 16px;
    color: #3b5260;
    padding-left: 24px;
  }

  .main-header-con {
    border-bottom: #d0d4d8 solid 1px;
    box-shadow: none;
    .main-header {
      box-shadow: none;
    }
  }

  .mesg_numb {
    position: absolute;
    right: 90px;
    cursor: pointer;
    .numb {
      position: absolute;
      left: 22px;
      top: 9px;
      border-radius: 16px;
      height: 16px;
      font-size: 12px;
      background: #d93d41;
      padding: 0 6px;
      line-height: 16px;
      color: #fff;
      cursor: pointer;
    }
    .ivu-badge-count {
      right: 4px;
      height: 16px;
      line-height: 12px;
      padding: 0 4px;
    }
  }
</style>
<template>
  <div class="main" :class="{'hideSidebar': shrink}">
    <div class="sidebar-menu-con" :style="{width: shrink?'60px':'180px', overflow: shrink ? 'visible' : 'auto'}">
      <!--<shrinkable-menu-->
      <!--:shrink="shrink"-->
      <!--:menu-list="menuList">-->
      <!--<div slot="top" class="logo-con">-->
      <!--<img v-show="!shrink" src="../assets/logo.png" key="max-logo" style="float: left;margin-left: 12px;" />-->
      <!--<img v-show="shrink" src="../assets/logo-min.png" key="min-logo" />-->
      <!--</div>-->
      <!--</shrinkable-menu>-->
      <sidebar class="sidebar-container"></sidebar>
      <div class="navicon-con">
        <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text"
                @click="toggleClick">
          <Icon type="navicon" size="32"></Icon>
        </Button>
      </div>
    </div>
    <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'180px'}">
      <div class="main-header">
        <span class="main_header_title" v-html="title"></span>
        <span style="float: right;padding-right: 150px;font-size: 12px;">版本号：v2.2.1.3</span>
        <!--<div class="header-avator-con" style="right:20px;">-->
        <!--<div class="user-dropdown-menu-con" style="right:50px;" >-->
        <!--<Row type="flex" justify="end" align="middle" class="user-dropdown-innercon" style="padding-right:0;">-->
        <!--<router-link tag="a" to="/news">-->
        <!--<Badge count="1">-->
        <!--<Avatar icon="person" style="margin-left:10px;" class="message_name"></Avatar>-->
        <!--</Badge>-->
        <!--</router-link>-->
        <!--</Row>-->
        <!--</div>-->
        <!--</div>-->
        <router-link tag="span" to="/news" class="mesg_numb">

          <Badge :count="msgNumb">
            <Avatar icon="person" style="margin-left:10px;" class="message_name"></Avatar>
          </Badge>
          <!--<span class="numb" v-html="msgNumb>99?'99+':msgNumb"></span>-->
        </router-link>
        <div class="header-avator-con" style="right:20px;">
          <div class="user-dropdown-menu-con" style="width:60px">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon" style="padding-right:0;">
              <Dropdown transfer placement="bottom-end" trigger="click" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                  <!--<span class="main-user-name">{{ userName }}</span>-->
                  <Avatar icon="person" style="margin-left:10px;" class="person_name"></Avatar>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="setUser">账号信息</DropdownItem>
                  <DropdownItem name="loginout">退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <!--<Avatar icon="person" style="background: #619fe7;margin-left:10px;"></Avatar>-->
            </Row>
          </div>
        </div>
      </div>
    </div>
    <div class="single-page-con" :style="{left: shrink?'60px':'180px'}">
      <div class="single-page">
        <!--<transition name="fade" mode="out-in">-->
          <router-view></router-view>
        <!--</transition>-->
      </div>
    </div>
  </div>
</template>
<script>
  //  import shrinkableMenu from './shrinkable-menu/shrinkable-menu.vue';
  import sidebar from './sidebar/index.vue'
  import {mapGetters} from "vuex";
  import Vue from 'vue';
  import {
    sync_perm_info
  } from '@/api/api';

  export default {
    components: {
//      shrinkableMenu,
      sidebar
    },
    data() {
      return {
        shrink: true,
        userName: 'aaa',
        menuList: []
      };
    },
    created() {
      this.getMenuPermi();
    },
    computed: mapGetters(
      {
        roleId: "login/roleId",
        title: "main/header_title",
        msgNumb: "main/msg_numb"
      }
    ),
    methods: {

      toggleClick() {
        this.shrink = !this.shrink;
      },
      handleClickUserDropdown(name) {
        if (name == 'setUser') {
          this.$router.push({path: '/setUser'});
        } else {
          //退出
          this.$store.dispatch('login/logout').then(response => {
            if (response.data.respCode == '0') {
              this.$router.push({path: '/login'});
            } else {
              window.alert('退出失败!');
              this.$router.push({path: '/login'});
            }
          }).catch(err => {
            console.error(err);
          });
        }
      },
      getMenuPermi() {
        let data = {
          roleId: this.roleId
        };
        const response = sync_perm_info(data);
        this.$store.state.main.perm_info = response.map.data;
        this.$store.state.main.msg_numb = response.map.notReadMessage;

      }
    },
    mounted() {

    }
  };
</script>
