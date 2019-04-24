<style lang="less">
  @import "../../common/less/client.less";
  @import "../../common/less/main.less";

  .ivu-row > .ivu-col {
    margin-bottom: 0
  }

  .news_tab_title {
    line-height: 30px;
    font-weight: bold;
    border-bottom: #e3e6ec solid 1px;
    border-top: #e3e6ec solid 1px;
    background: #f5f5f7;
    .ivu-row {
      .ivu-col {
        margin-bottom: 0;
      }
    }
  }

  .padding_left {
    padding-left: 10px;
  }

  .news_title {
    /*font-weight:bold;*/
    color: #506470;
  }

  .news_content {
    line-height: 40px;
    color: #506470;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 10px;
  }

  .btn {
    cursor: pointer;
    color: #00b4ff;
  }

  .news_content_title {
    padding-left: 40px;
  }

  .news_detail {
    border-bottom: #e3e6ec solid 1px;
    .news_detail_con {
      padding: 6px 10px;
    }
    .user_name {
      padding: 20px 10px 10px;
    }
  }

  .news_li {
    border-bottom: #e3e6ec solid 1px;
  }

  .news_li.active_on {
    background: #fff6e5;
  }

  .news_msg {
    color: #506470;
    cursor: pointer;
    &.node_status {
      /*.notRead{*/
      font-weight: bold;
      /*}*/
      .news_content, .news_title {
        font-weight: bold;
      }
    }
  }

  .news_content_title {
    position: relative;
    .check_box {
      width: 16px;
      height: 16px;
      position: absolute;
      top: 17px;
      left: 10px;
      border: #96a5ae solid 1px;
      display: block;
      cursor: pointer;
      span {
        position: absolute;
        left: 0;
        top: 0;
        display: block;
        width: 100%;
        height: 100%;
        input {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          cursor: pointer;
        }
      }
      &.active {
        border: none;
        span {
          background: url(../../assets/images/active_chebox.png) no-repeat;
        }
      }
    }

  }

  .news_content_title .check_box.active {
    border: none;
  }

  .news_li:hover {
    background: #fff6e5;
  }

  .news_list_wrap {
    overflow: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar-track-piece {
      background: #fff;
    }

    &::-webkit-scrollbar {
      width: 2px;
    }
    &::-webkit-scrollbar-thumb {
      background: #cccccc;
      border-radius: 20px;
      height: 4px;
    }
  }

  // .news_content_title .check_box.active span{background:url(../../assets/active_chebox.png) no-repeat;}
</style>
<template>
  <div class="box">
    <!--<div class="top">-->
    <!--<div class="inp">-->
    <!--<i-input placeholder="请输入消息内容"  style:   v-model="condition" @on-change="search"></i-input>-->
    <!--</div>-->
    <!--</div>-->

    <div class="main_header clear">
      <div class="input_wrap">
        <i-input placeholder="请输入需要搜索的消息内容" style: v-model.trim="condition"></i-input>
        <span class="search_btn" @click="search"><Icon type="ios-search-strong"></Icon></span>
      </div>
    </div>


    <div>
      <Row class="news_tab_title">
        <Col span="1" class="padding_left">
        <p class="news_title">序号</p></Col>
        <Col span="13" class="padding_left">
        <p class="news_title">消息内容</p></Col>
        <Col span="4">
        <span class="news_title">通知时间</span></Col>
        <Col span="3">
        <span class="news_title">操作人</span></Col>
        <Col span="2">
        <span class="news_title">状态</span></Col>
      </Row>
      <div class="news_list_wrap" :style="{height:tabHeight+'px'}">
        <div v-for="(item, index) in noticeList" class="news_li">
          <Row v-if="item.operatorStatus == '0'" class="news_msg node_status">
            <Col span="1" class="padding_left">
            <p class="news_title" style="line-height: 40px;">{{index + 1}}</p></Col>
            <Col span="13" class="padding_left">
            <p class="news_content  " :title="item.target">
              <!-- <span class="check_box"><span><input type="checkbox"></span></span> -->{{item.target}}
            </p>
            </Col>
            <Col span="4">
            <span class="news_content ">{{item.createTimeStr}}</span></Col>
            <Col span="3">
            <span class="news_content ">{{item.operatorUser}}</span></Col>
            <Col span="2">
            <span v-if="item.operatorStatus == '0'" class="news_content  btn"
                  @click="updateNoticeStatus(item.id)">标记为已读</span>
            <span v-if="item.operatorStatus == '1'" class="news_content">已读</span>
            </Col>
          </Row>
          <Row v-if="item.operatorStatus == '1'" class="news_msg">
            <Col span="1" class="padding_left">
            <p class="news_title" style="line-height: 40px;">{{index + 1}}</p></Col>
            <Col span="13" class="padding_left">
            <p class="news_content ">
              <!-- <span class="check_box"><span><input type="checkbox"></span></span> -->{{item.target}}
            </p>
            </Col>
            <Col span="4">
            <span class="news_content">{{item.createTime}}</span></Col>
            <Col span="3">
            <span class="news_content">{{item.operatorUser}}</span></Col>
            <Col span="2">
            <span v-if="item.operatorStatus == '0'" class="news_content btn">未读</span>
            <span v-if="item.operatorStatus == '1'" class="news_content">已读</span>
            </Col>
          </Row>
        </div>
      </div>
    </div>

    <div class="page_btm_div">
      <Page class="page_iview_right" :total="totalCount" :page-size="pageNum" :current="pageNo"
            :page-size-opts="pageOpt" size="small"
            show-elevator show-sizer show-total placement="top" @on-change="getPageChange"
            @on-page-size-change="getPageSizeChange"></Page>
    </div>


  </div>
</template>
<script>
  import * as api from "@/api/api"
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        tabHeight: 500,
        noticeList: [],
        totalCount: 0,
        pageNo: 1,
        pageNum: 10,
        pageOpt: [10, 20, 50, 100],
        condition: ''
      }
    },
    created: function () {
      this.tabHeight = (document.documentElement.clientHeight - 229);
      this.getNoticeList();
    },
    methods: {
      click() {

      },
      handleChange() {

      },
      getNoticeList() {
        api.fetchGetNoticeList(
          {
            condition: this.condition,
            pageNo: this.pageNo,
            pageNum: this.pageNum
          }
        ).then((res) => {
          if (res.data.respCode == '0') {
            this.noticeList = res.data.list;
            this.totalCount = res.data.totalCount;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      updateNoticeStatus(id) {
        api.fetchUpdateNoticeStatus(
          {
            id: id
          }
        ).then((res) => {
          if (res.data.respCode == '0') {
            this.$store.state.main.msg_numb = res.data.map.notReadMessage;
            this.getNoticeList()
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      getPageChange(page) {
        this.pageNo = page
        this.getNoticeList()
      },

      getPageSizeChange(pageNum) {
        this.pageNo = 1
        this.pageNum = pageNum
        this.getNoticeList()
      },

      search() {
        this.getNoticeList()
      },

      resetPage() {
        this.pageNo = 1;
        this.pageNum = 10;
      }
    }
  }

</script>
