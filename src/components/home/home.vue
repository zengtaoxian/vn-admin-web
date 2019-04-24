<style lang="less">
  @import "../../common/less/home.less";

  .copy_btn {
    color: #00b4ff;
    cursor: pointer;
  }

  .message_btn {
    cursor: pointer;
  }

  .home_right {
    .ivu-tabs-nav-prev, .ivu-tabs-nav-next {
      line-height: 46px;
    }
    &.home_right_mod {
      position: relative;
      .ivu-tabs {
        height: 100%;
        .small_more {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
        }
        .home_small_ul {
          height: 100%;
        }
      }
    }
  }
</style>
<template>
  <div class="home_main">
    <Row :gutter="20">
      <Col span="18">
      <Row :gutter="20">
        <Col span="12">
        <div class="user_mode">
          <div class="user_mode_top">欢迎，尊敬的用户</div>
          <div class="content_user clear">
            <div class="img_phont">
              <img src="../../assets/img_phont.png" alt="">
            </div>
            <div class="model_user">
              <h2 class="name">{{userName}}</h2>
              <p class="text">{{departmentName}}</p>
              <div class="desc">
                <Row>
                  <Col span="12">
                  <div class="email">{{email}}</div>
                  </Col>
                  <Col span="12">
                  <div class="phone" v-if="mobile" v-html="mobile"></div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
        </Col>
        <Col span="12">
        <router-link class="user_mode message_btn" tag="div" to="/news">
          <div class="user_mode_top">消息中心</div>
          <Row>
            <Col span="12">
            <div class="model_msg clear">
              <div class="icon_home"><img src="../../assets/email_on.png" height="21" width="26" alt=""></div>
              <div class="model_msg_r">
                <div class="numb">{{notRead}}</div>
                <p class="mse_text">未读消息</p>
              </div>
            </div>
            </Col>
            <Col span="12">
            <div class="model_msg clear">
              <div class="icon_home"><img src="../../assets/icon_msg_out.png" height="22" width="26" alt=""></div>
              <div class="model_msg_r">
                <div class="numb">{{readed}}</div>
                <p class="mse_text">已读消息</p>
              </div>
            </div>
            </Col>
          </Row>
        </router-link>
        </Col>
      </Row>
      <div class="home_con">
        <Tabs v-model="value" :name="value" type="card" :animated="animated" @on-click="tabClick">
          <TabPane v-if="check_perm(31)" name="a" label="待办事项">
            <div class="home_tab_scroll" :style="{height:HomeHeight+'px'}">
              <Row v-for="(item, index) in todoList" class="home_con_line">
                <Col span="1">
                <span style="padding-left: 10px">{{index + 1}}</span>
                </Col>
                <Col span="11" class="home_li" :title="item.target">
                {{item.target}}
                </Col>
                <Col span="4" class="home_li" v-html="item.operatorUser?item.operatorUser:'-'"></Col>
                <Col span="5" class="home_li" v-html="item.createTimeStr"></Col>
                <Col span="3">
                <span v-if="item.operatorStatus == '0'" class="btn color_red" style="cursor: pointer"
                      @click="executeTodo(item.id)">立即认领</span>
                <span v-if="item.operatorStatus == '2'" class=" color_yellow">处理中</span>
                <span v-if="item.operatorStatus == '1'" class="">已完成</span>
                </Col>
              </Row>
            </div>
          </TabPane>
          <TabPane name="b" label="操作记录">
            <div class="home_tab_scroll" :style="{height:HomeHeight+'px'}">
              <Row v-for="(item, index) in sysLogList" class="home_con_line" id="'copy_data_li'+index">
                <Col span="1">
                <span style="padding-left: 10px">{{index + 1}}</span></Col>
                <Col span="2" class="home_li" :title="item.operatorType">
                {{item.operatorType}}</Col>
                <Col span="4" class="home_li" v-html="item.operatorModel?item.operatorModel:'-'"
                     :title="item.operatorModel"></Col>
                <Col span="10" class="home_li " v-html="item.operatorObject?item.operatorObject:'-'"
                     :title="item.operatorObject"></Col>
                <Col span="5" class="home_li" v-html="item.createTime?item.createTime:''"
                     :title="item.createTime"></Col>
                <Col span="2" class="home_li">
                <span v-if="item.operatorObject !=''" class="copy_btn" :class="'copy_data'+index"
                      :data-clipboard-text="item.operatorObject" @click="copData('copy_data'+index)">复制</span></Col>
              </Row>
            </div>
          </TabPane>
        </Tabs>
        <div class="home_com_page">
          <Page :total="totalCount" :page-size="pageNum" :current="pageNo" :page-size-opts="pageOpt" size="small"
                show-elevator show-sizer show-total placement="top" @on-change="getPageChange"
                @on-page-size-change="getPageSizeChange"></Page>
        </div>
      </div>
      </Col>
      <Col span="6">
      <div v-if="check_perm(32) || check_perm(33) || check_perm(34)" class="home_right home_right_mod"
           :style="{height:HomeHeightRight+'px'}">
        <Tabs v-model="valueSmall" :name="valueSmall" type="card" :animated="animated" @on-click="tabClickSmall">
          <TabPane v-if="check_perm(32)" name="client" label="　最新客户　">
            <div class="home_right_scroll" :style="{height:HomeHeightTab+'px'}">

              <ul class="home_small_ul">
                <li v-for="item in customList">
                  <h2 class="name">{{item.customName}}<span class="phone">{{item.mobile}}</span></h2>
                  <p class="desc">需求资源：{{item.serviceTypeList | filterResources}}</p>
                  <p class="desc">完成订单：{{item.orderFinCount}}</p>
                  <p class="desc">客户编号：{{item.customNo}}</p>
                </li>
              </ul>
            </div>
            <!-- <div class="small_more">查看更多</div> -->
            <router-link tag="div" class="small_more" to="/client/index">查看更多</router-link>
          </TabPane>
          <TabPane v-if="check_perm(33)" name="order" label="　最新订单　">
            <div class="home_right_scroll" :style="{height:HomeHeightTab+'px'}">
              <ul class="home_small_ul" style="min-height: 200px">
                <li v-for="item in orderList">
                  <h2 class="name">{{item.orderId}}
                    <span v-if="item.status == '0'" class="phone">确认中</span>
                    <span v-if="item.status == '1'" class="phone">已确认</span>
                    <span v-if="item.status == '2'" class="phone">已取消</span>
                    <span v-if="item.status == '3'" class="phone">已终止</span>
                    <span v-if="item.status == '4'" class="phone">执行中</span>
                    <span v-if="item.status == '5'" class="phone">已暂停</span>
                  </h2>
                  <p class="desc">需求资源：{{item.orderRequestType}}</p>
                  <p class="desc">执行时间：{{item.firstPlayTime}}</p>
                </li>
              </ul>
            </div>
            <router-link tag="div" class="small_more" to="/merchandise/index">查看更多</router-link>
          </TabPane>
          <TabPane v-if="check_perm(34)" name="supplier" label="　最新供应商　">
            <div class="home_right_scroll" :style="{height:HomeHeightTab+'px'}">
              <ul class="home_small_ul">
                <li v-for="item in supplierList">
                  <h2 class="name">{{item.supplierName}}<span class="phone">{{item.phone}}</span></h2>
                  <p class="desc">拥有资源：{{item.typeName}}</p>
                  <p class="desc">完成订单：{{item.orderTotal}}</p>
                  <p class="desc">供应商编号：{{item.supplierNo}}</p>
                </li>
              </ul>
            </div>
            <router-link tag="div" class="small_more" to="/supplier/index">查看更多</router-link>
          </TabPane>

        </Tabs>

      </div>
      </Col>
    </Row>
  </div>
</template>
<script>
  import {mapGetters} from "vuex";
  import * as api from "@/api/api"
  import Clipboard from 'clipboard';
  import * as util from "@/common/js/util"

  export default {
    data() {
      return {
        HomeHeight: 400,
        HomeHeightRight: 690,
        HomeHeightTab: 500,
        animated: false,
        value: 'a',
        valueSmall: 'client',
        userName: '',
        departmentName: '',
        email: '',
        mobile: '',
        notRead: 0,
        readed: 0,
        todoList: [],
        sysLogList: [],
        customList: [],
        supplierList: [],
        orderList: [],
        totalCount: 0,
        pageNo: 1,
        pageNum: util.pageSize,
        condition: '',
        pageOpt: util.pageOpt
      }
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
    created: function () {
      this.getUserInfomation();
      this.getTodoList();
      this.getCustomList();
      this.setPermList();

      this.HomeHeight = (document.documentElement.clientHeight - 380);
      this.HomeHeightRight = (document.documentElement.clientHeight - 89);
      this.HomeHeightTab = (document.documentElement.clientHeight - 210);
//      console.log(document.documentElement.clientHeight-210)
    },

    computed: mapGetters(
      {
        check_perm: "main/check_perm",
        perm_info: "main/perm_info"
      }),
    watch: {
      perm_info(a, b) {
        this.setPermList()
      }
    },
    methods: {
      setPermList() {
        let valueSmall = 'client';

        if (!this.check_perm(32)) {
          if (!this.check_perm(33)) {
            valueSmall = 'supplier';
            this.getSupplierList();
          } else {
            valueSmall = 'order'
            this.getOrderList();
          }
        }
        this.value = 'a';
        if (!this.check_perm('31')) {
          this.value = 'b';
          this.getSyslogList();
        }

        this.valueSmall = valueSmall;
      },
      copData(obj) {


        var clipboard = new Clipboard('.' + obj);

        var This = this;
        clipboard.on('success', function (e) {
//          console.info('Action:', e.action);
//          console.info('Text:', e.text);
//          console.info('Trigger:', e.trigger);
          This.$Message.success("复制成功");
          e.clearSelection();
        });

        clipboard.on('error', function (e) {
//          console.error('Action:', e.action);
//          console.error('Trigger:', e.trigger);
          This.$Message.error("复制失败");
        });

//        clipboard.destroy();


      },

      tabClick() {
        if (this.value == 'a') {
          this.resetPage();
          this.getTodoList();
        } else {
          this.resetPage();
          this.getSyslogList();
        }
      },
      tabClickSmall() {
        if (this.valueSmall == 'client') {
          this.getCustomList();
        } else if (this.valueSmall == 'order') {
          this.getOrderList();
        } else if (this.valueSmall == 'supplier') {
          this.getSupplierList();
        }
      },
      getUserInfomation() {
        api.fetchGetMainPageUserInfomation({}).then((res) => {
          this.userName = res.data.map.userInfo.userName
          this.departmentName = res.data.map.userInfo.departmentName
          this.email = res.data.map.userInfo.email
          this.mobile = res.data.map.userInfo.mobile
          this.notRead = res.data.map.notRead
          this.readed = res.data.map.readed
        }).catch((err) => {
          console.log(err)
        })
      },
      executeTodo(logId) {
        api.fetchExecuteTodo({logId: logId}).then((res) => {
          if (res.data.respCode == '0') {
            this.getUserInfomation();
            this.getTodoList();
            this.$Message.success("认领成功");
          } else {
            this.$Message.error("认领失败");
          }

        }).catch((err) => {
          console.log(err)
          this.$Message.error("认领失败");
        })
      },
      getTodoList() {
        api.fetchGetTodoList({
          pageNo: this.pageNo,
          pageNum: this.pageNum
        }).then((res) => {
          this.todoList = res.data.list
          this.totalCount = res.data.totalCount
        }).catch((err) => {
          console.log(err)
        })
      },
      getSyslogList() {
        api.fetch_syslog_page_info({
          pageNo: this.pageNo,
          pageNum: this.pageNum
        }).then((response) => {
          this.totalCount = response.data.totalCount;
          this.sysLogList = response.data.list;
        }).catch((err) => {
          console.log(err)
        })
      },
      getCustomList() {
        api.fetchqueryCustomerList({
          pageNo: 1,
          pageNum: 5,
          source: "1"
        }).then(res => {
          if (res.data.respCode == '0') {
            this.customList = res.data.list;
          } else {
            this.$Message.error(res.data.msg);
          }
        }).catch(err => {
          console.log(err);
        });
      },
      getOrderList() {
        api.fetchOrderList(
          {
            pageNo: 1,
            pageNum: 5
          }
        ).then((res) => {
          if (res.data.respCode == '0') {
            this.orderList = res.data.list;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      getSupplierList() {
        api.fetchSupplierList(
          {
            pageNo: 1,
            pageNum: 5
          }
        ).then((res) => {
          if (res.data.respCode == '0') {
            this.supplierList = res.data.list;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      getPageChange(page) {
        this.pageNo = page
        if (this.value == 'a') {
          this.getTodoList()
        } else {
          this.getSyslogList()
        }
      },

      getPageSizeChange(pageNum) {
        this.pageNo = 1
        this.pageNum = pageNum
        if (this.value == 'a') {
          this.getTodoList()
        } else {
          this.getSyslogList()
        }
      },

      resetPage() {
        this.pageNo = 1;
        this.pageNum = 30;
      }
    }
  }
</script>
