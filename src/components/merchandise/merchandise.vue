<style lang="less">
  @import "../../common/less/priceList.less";

  .detail_top_right {
    padding-left: 20px;
  }

  .tab_content .tab_line .tab_line_left.wid160 {
    width: 160px;
  }

  .tab_list_href {
    color: #00b4ff;
  }

  .merchandise_msg {
    padding-bottom: 14px;
    .merchandise_li {
      .title {
        border-left: 4px solid #00b4ff;
        height: 20px;
        padding-left: 4px;
        margin-bottom: 10px;
      }
    }
  }

  .merchandise_con {
    border: #dde1e4 solid 1px;
    padding: 4px 0;
    border-radius: 3px;
    .merchandise_line {
      .left_title {
        line-height: 40px;
        float: left;
        width: 90px;
        padding-right: 20px;
        text-align: right;
      }
      .right_text {
        overflow: hidden;
        line-height: 20px;
        padding: 10px 0;
        .mod_span {
          padding: 0 6px;
          border: #d4d7de solid 1px;
          background: #f0f2f4;
          line-height: 20px;
          height: 20px;
          display: inline-block;
          margin-right: 10px;
        }
      }
    }
    &.merchandise_con_big {
      .merchandise_line {
        .left_title {
          width: 120px;
        }
      }
    }
  }

  .line_text {
    line-height: 20px;
    padding-bottom: 10px;
  }

  .select_list_div {
    .ivu-tag-checked {
      .ivu-icon-ios-close-empty {
        display: none;
      }
    }
  }

  .numb_lin_wrap {
    padding-top: 10px;
    .numb_line_mode {
      line-height: 30px;
      font-size: 14px;
      .success {
        color: #00b4ff;
        padding: 0 4px;
      }
      .error {
        color: red;
        padding: 0 4px;
      }
      .link_href {
        color: #00b4ff;
        cursor: pointer;
      }
    }
  }

  .error_numb_mod {
    border: #cdcdcd solid 1px;
    padding: 10px;
    box-sizing: border-box;
    line-height: 24px;
    word-wrap: break-word;
  }

  .numb_checked {
    border: #dddee1 solid 1px;
    height: 200px;
    overflow: hidden;
    overflow-y: auto;
    font-size: 0;
    padding: 10px;
    box-sizing: border-box;
    span.numb_line {
      line-height: 24px;
      padding: 0 24px 0 6px;
      border: #dddee1 solid 1px;
      position: relative;
      display: inline-block;
      font-size: 14px;
      margin-right: 10px;
      margin-bottom: 10px;
      color: #495060;
      span.close_del {
        font-size: 24px;
        display: inline-block;
        line-height: 24px;
        position: absolute;
        top: 0;
        right: 4px;
        cursor: pointer;
        padding: 0 4px;
        color: #999;
      }
    }
  }

  .numb_check_box {
    margin-right: 20px;
    margin-left: 0 !important;
    line-height: 20px;
  }

  .input_numb_seach {
    position: relative;
    width: 60%;
    margin-bottom: 20px;
    .input_seach_nod {

    }
    .search_btn {
      display: block;
      width: 50px;
      height: 32px;
      position: absolute;
      right: 0;
      top: 2px;
      color: #fff;
      background: #00b4ff;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
      text-align: center;
      line-height: 32px;
    }
  }

  .text_numb_desc {
    text-align: right;
    line-height: 24px;
    padding-top: 4px;
    font-size: 14px;
    color: #999;
    span {
      padding: 0 0 0 10px;
      color: #00b4ff;
      cursor: pointer;
    }
  }

</style>
<template>
  <div class="box">
    <div class="main_header clear">
      <div class="input_wrap" v-if="havePerm('58')">
        <i-input placeholder="订单编号/客户名称/销售" style: @on-enter="search" v-model.trim="condition"></i-input>
        <span class="search_btn" @click="search"><Icon type="ios-search-strong"></Icon></span>
      </div>

      <Tag class="tag_header_mod" v-for="item in filter_item" :key="item.key" :name="item.key" closable
           @on-close="tag_close">
        {{item.title}}:{{item.where}}
      </Tag>

      <div class="header_btn" v-if="havePerm('57')">
        <i-button type="primary" @click="modify()">
          <Icon type="plus-round"></Icon>&nbsp;&nbsp;新增订单
        </i-button>
      </div>
      <div class="export_btn" @click="exportData" v-if="havePerm('59')"></div>
    </div>

    <div class="tab_wrap" :class="listData.length == 0?'tab_none_data':''">
      <Table :columns="all_columns" :data="listData" :height="tabHeight" :loading="orderListLoad"
             :no-data-text="noDataText"
             @on-filter-change="table_filter_change"></Table>
    </div>
    <div class="page_btm_div" v-if="totalCount">
      <Page class="page_iview_right" :total="totalCount" :page-size="pageNum" :current="pageNo"
            :page-size-opts="pageOpt" size="small" show-elevator show-sizer show-total placement="top"
            @on-change="getPageChange" @on-page-size-change="getPageSizeChange"></Page>
    </div>

    <Modal class="vertical-center-modal" :mask-closable="false" v-model="modal2" :title="titleName"
           width="760" @on-cancel="hideOrder">
      <div v-if="titleName === '新增订单' || titleName === '修改需求'">
        <Steps :current="current" style="padding:20px 40px;">
          <Step title="基本信息"></Step>
          <Step title="订单需求"></Step>
          <Step title="调度资源"></Step>
          <Step title="调度号码"></Step>
          <Step title="修改销售包"></Step>
        </Steps>
        <div v-if="current == 0">
          <Form ref="step1Form" :label-width="100">
            <Row>
              <Col span="22" offset="1" class="role">
              <FormItem class="ivu-form-item-required" label="订单编号" v-if="formValidate.orderId==''?false:true">
                <Input v-model="formValidate.orderId" :disabled="true"></Input>
              </FormItem>
              <FormItem class="ivu-form-item-required" label="客户名称">
                <Select v-model="formValidate.customId" filterable placeholder='请搜索' @on-change="customerChange();">
                  <Option v-for="item in customList" :value="item.id" :key="item.id">{{ item.customName }}</Option>
                </Select>
              </FormItem>
              <FormItem class="ivu-form-item-required" label="关联销售">
                <Select v-model="formValidate.salemanId" filterable placeholder='请搜索'>
                  <Option v-for="saleitem in saleManList" :value="saleitem.id" :key="saleitem.id">{{ saleitem.userName
                    }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="订单说明">
                <Input v-model="formValidate.orderExplain" placeholder="详细街道信息(1-500个字)" :maxlength="500"
                       type="textarea"
                       :autosize="{minRows: 2,maxRows: 5}"></Input>
              </FormItem>
              <FormItem label="创建人" v-if="formValidate.id == ''?false:true">
                <Input v-model="formValidate.createUser" :disabled="true"></Input>
              </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div v-if="current == 1">
          <Form ref="step2Form" :label-width="120">
            <Row>
              <Col span="22" offset="1" class="role">
              <div class="merchandise_msg">
                <div class="merchandise_li">
                  <div class="title">基本信息</div>
                  <div class="merchandise_con">
                    <div class="merchandise_line" v-if="formValidate.orderId">
                      <div class="left_title">订单编号</div>
                      <div class="right_text">{{formValidate.orderId}}</div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">客户名称</div>
                      <div class="right_text" v-for="item in customList " v-if="item.id == formValidate.customId ">
                        {{item.customName}}
                      </div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">关联销售</div>
                      <div class="right_text" v-for="item in saleManList " v-if="item.id == formValidate.salemanId ">
                        {{item.userName}}
                      </div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">订单说明</div>
                      <div class="right_text" v-html=" formValidate.orderExplain" :title=" formValidate.orderExplain "></div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">创建人</div>
                      <div class="right_text" v-html=" formValidate.createUser"></div>
                    </div>
                    <div class="merchandise_line" v-if="formValidate.createTime">
                      <div class="left_title">创建时间</div>
                      <div class="right_text" v-html=" formValidate.createTime"></div>
                    </div>
                  </div>
                </div>
              </div>
              </Col>
              <Col span="22" offset="1" class="role">
              <FormItem class="ivu-form-item-required " label="商品类别">
                <el-radio-group v-model="formValidate.orderRequestTypeId">
                  <el-radio class="pricel_check" v-for="item in resourcesList" :label="item.id">{{item.typeName}}
                  </el-radio>
                </el-radio-group>
              </FormItem>
              <FormItem class="ivu-form-item-required" label="计费类型">
                <el-radio-group v-model="formValidate.requestChargeType" size="small" @change="changeTypeChange()">
                  <el-radio-button :label="0">流量</el-radio-button>
                  <el-radio-button :label="1">包月</el-radio-button>
                </el-radio-group>
              </FormItem>
              <FormItem class="ivu-form-item-required" label="归属运营商">
                <el-radio-group v-model="formValidate.operatorType" size="small">
                  <el-radio-button :label="0">全网</el-radio-button>
                  <el-radio-button :label="1">移动</el-radio-button>
                  <el-radio-button :label="2">联通</el-radio-button>
                  <el-radio-button :label="3">电信</el-radio-button>
                </el-radio-group>
              </FormItem>
              <FormItem class="ivu-form-item-required" label="归属城市">
                <Cascader v-model="requestCityList" :data="cityData" filterable></Cascader>
              </FormItem>
              <FormItem label="需求量(E1条数)" class="ivu-form-item-required"
                        v-if="formValidate.requestChargeType == 0 ? false:true">
                <Input v-model="formValidate.requirementAmount" placeholder="E1条数 0~999999" :maxlength="6"></Input>
              </FormItem>
              <FormItem class="ivu-form-item-required" label="使用场景">
                <Select v-model="formValidate.usePlace" filterable>
                  <OptionGroup v-for="group in industryList" :key="group.name" :label="group.name">
                    <Option v-for="item in group.options" :key="item.name" :label="item.name" :value="item.name">
                      {{ item.name }}
                    </Option>
                  </OptionGroup>
                </Select>
              </FormItem>
              <FormItem class="ivu-form-item-required" label="线路类型">
                <el-radio-group v-model="formValidate.requestRouteType" size="small"
                                @change="routeTypeChange()">
                  <el-radio-button :label="0">呼入</el-radio-button>
                  <el-radio-button :label="1">呼出</el-radio-button>
                  <el-radio-button :label="2">呼入+呼出</el-radio-button>
                </el-radio-group>
              </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div v-if="current == 2">
          <Form ref="step3Form" :label-width="120">
            <Row>
              <Col span="10" offset="1" class="role">
              <div class="merchandise_msg">
                <div class="merchandise_li">
                  <div class="title">基础信息</div>
                  <div class="merchandise_con">
                    <div class="merchandise_line" v-if="formValidate.orderId">
                      <div class="left_title">订单编号</div>
                      <div class="right_text">{{formValidate.orderId}}</div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">客户名称</div>
                      <div class="right_text" v-for="item in customList " v-if="item.id == formValidate.customId "
                           v-html="item.customName"></div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">关联销售</div>
                      <div class="right_text" v-for="item in saleManList " v-if="item.id == formValidate.salemanId "
                           v-html="item.userName"></div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">订单说明</div>
                      <div class="right_text" v-html=" formValidate.orderExplain"  :title=" formValidate.orderExplain "></div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">创建人</div>
                      <div class="right_text" v-html=" formValidate.createUser"></div>
                    </div>
                    <div class="merchandise_line" v-if="formValidate.createTime">
                      <div class="left_title">创建时间</div>
                      <div class="right_text" v-html=" formValidate.createTime"></div>
                    </div>
                  </div>
                </div>
              </div>
              </Col>
              <Col span="11" offset="1" class="role">
              <div class="merchandise_msg">
                <div class="merchandise_li">
                  <div class="title">订单需求</div>
                  <div class="merchandise_con merchandise_con_big">
                    <div class="merchandise_line">
                      <div class="left_title">商品类别</div>
                      <div class="right_text" v-for="item in resourcesList "
                           v-if="item.id == formValidate.orderRequestTypeId " v-html="item.typeName"></div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">计费类型</div>
                      <div class="right_text" v-if="formValidate.requestChargeType == '0'">流量</div>
                      <div class="right_text" v-if="formValidate.requestChargeType == '1'">包月</div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">归属运营商</div>
                      <div class="right_text" v-if="formValidate.operatorType == '0'">全网</div>
                      <div class="right_text" v-if="formValidate.operatorType == '1'">移动</div>
                      <div class="right_text" v-if="formValidate.operatorType == '2'">联通</div>
                      <div class="right_text" v-if="formValidate.operatorType == '3'">电信</div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">归属城市</div>
                      <div class="right_text">
                        <span v-if="requestCityList[1] == '市辖区'">{{requestCityList[0]}}</span>
                        <span v-else>{{requestCityList[1]}}</span>
                      </div>
                    </div>
                    <div class="merchandise_line" v-if="formValidate.requestChargeType == 0 ? false:true">
                      <div class="left_title">需求量(E1条数)</div>
                      <div class="right_text" v-html="formValidate.requirementAmount"></div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">使用场景</div>
                      <div class="right_text" v-html="formValidate.usePlace"></div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">需求线路</div>
                      <div class="right_text" v-if="formValidate.requestRouteType == '0'">呼入</div>
                      <div class="right_text" v-if="formValidate.requestRouteType == '1'">呼出</div>
                      <div class="right_text" v-if="formValidate.requestRouteType == '2'">呼入加呼出</div>

                    </div>
                  </div>
                </div>
              </div>
              </Col>
            </Row>

          </Form>
          <Form :label-width="100">
            <Row>
              <Col span="22" offset="1" class="role">
              <FormItem class="ivu-form-item-required" label="对接网关"
                        v-if="formValidate.requestRouteType == 1 || formValidate.requestRouteType == 2">
                <Select v-model="dockGatewayArry" filterable multiple placeholder='请选择'>
                  <Option :value="'待匹配'" :key="'待匹配'" v-if="formValidate.status == '0'">
                    待匹配
                  </Option>
                  <Option v-for="item in oldDockGatewayArry" :value="item" :key="item"
                          :disabled="formValidate.status > 1?true:false">{{ item }}
                  </Option>
                  <Option v-for="item in dockGatewayList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                </Select>
              </FormItem>
              <FormItem class="ivu-form-item-required" label="落地网关"
                        v-if="formValidate.requestRouteType == 0 || formValidate.requestRouteType == 2">
                <Select v-model="this.outGatewayArry" filterable multiple placeholder='请选择'>
                  <Option :value="'待匹配'" :key="'待匹配'" v-if="formValidate.status == '0' ">
                    待匹配
                  </Option>
                  <Option v-for="item in oldOutGatewayArry" :value="item" :key="item"
                          :disabled="formValidate.status > 1?true:false">{{ item }}
                  </Option>
                  <Option v-for="item in outGatewayList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                </Select>
              </FormItem>
              <FormItem class="ivu-form-item-required" label="关联商品">
                <Row v-for="(good,index) in datailGoods" style="margin-bottom: 10px;">
                  <Col span="16">
                  <div v-if="index === 0">
                    <Select v-model="good.type" transfer filterable placeholder='请选择'
                            @on-change="goodChang(good,index)">
                      <Option v-for="item in goodDateList" :value="item.id" :key="item.id">{{ item.id > 0 ?
                        item.goodName +
                        "（当前库存：" + item.store + "）" : item.goodName }}
                      </Option>
                    </Select>
                  </div>
                  <div v-else>
                    {{ good.id > 0 ? good.goodName +
                    "（当前库存：" + good.store + "）" : good.goodName }}
                  </div>
                  </Col>
                  <Col span="5" offset="1">
                  <Input v-model="good.thisNumb" placeholder="数量(E1条数)"
                         @on-change="changeInput(good,index)"></Input></Col>
                  <Col span="2">
                  <span v-if="index !== 0" class="del_type_btn del_icon_img" @click="delGood(index)"></span>
                  <span class="del_type_btn add_icon_img" v-else @click="addGood(good)"></span></Col>
                </Row>
              </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div v-if="current == 3">
          <Form ref="step1Form" :label-width="100">
            <Row>
              <Col span="10" offset="1" class="role">
              <div class="merchandise_msg">
                <div class="merchandise_li">
                  <div class="title">基础信息</div>
                  <div class="merchandise_con">
                    <div class="merchandise_line" v-if="formValidate.orderId">
                      <div class="left_title">订单编号</div>
                      <div class="right_text">{{formValidate.orderId}}</div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">客户名称</div>
                      <div class="right_text" v-for="item in customList " v-if="item.id == formValidate.customId "
                           v-html="item.customName"></div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">关联销售</div>
                      <div class="right_text" v-for="item in saleManList " v-if="item.id == formValidate.salemanId "
                           v-html="item.userName"></div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">订单说明</div>
                      <div class="right_text" v-html=" formValidate.orderExplain"  :title=" formValidate.orderExplain "></div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">创建人</div>
                      <div class="right_text" v-html=" formValidate.createUser"></div>
                    </div>
                    <div class="merchandise_line" v-if="formValidate.createTime">
                      <div class="left_title">创建时间</div>
                      <div class="right_text" v-html=" formValidate.createTime"></div>
                    </div>
                  </div>
                </div>
              </div>
              </Col>
              <Col span="11" offset="1" class="role">
              <div class="merchandise_msg">
                <div class="merchandise_li">
                  <div class="title">订单需求</div>
                  <div class="merchandise_con merchandise_con_big">
                    <div class="merchandise_line">
                      <div class="left_title">商品类别</div>
                      <div class="right_text" v-for="item in resourcesList "
                           v-if="item.id == formValidate.orderRequestTypeId " v-html="item.typeName"></div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">计费类型</div>
                      <div class="right_text" v-if="formValidate.requestChargeType == '0'">流量</div>
                      <div class="right_text" v-if="formValidate.requestChargeType == '1'">包月</div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">归属运营商</div>
                      <div class="right_text" v-if="formValidate.operatorType == '0'">全网</div>
                      <div class="right_text" v-if="formValidate.operatorType == '1'">移动</div>
                      <div class="right_text" v-if="formValidate.operatorType == '2'">联通</div>
                      <div class="right_text" v-if="formValidate.operatorType == '3'">电信</div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">归属城市</div>
                      <div class="right_text">
                        <span v-if="requestCityList[1] == '市辖区'">{{requestCityList[0]}}</span>
                        <span v-else>{{requestCityList[1]}}</span>
                      </div>
                    </div>
                    <div class="merchandise_line" v-if="formValidate.requestChargeType == 0 ? false:true">
                      <div class="left_title">需求量(E1条数)</div>
                      <div class="right_text" v-html="formValidate.requirementAmount"></div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">需求线路</div>
                      <div class="right_text" v-if="formValidate.requestRouteType == '0'">呼入</div>
                      <div class="right_text" v-if="formValidate.requestRouteType == '1'">呼出</div>
                      <div class="right_text" v-if="formValidate.requestRouteType == '2'">呼入加呼出</div>

                    </div>
                  </div>
                </div>
              </div>
              </Col>
            </Row>
            <Row>
              <Col span="22" offset="1" class="role">
              <div class="merchandise_msg">
                <div class="merchandise_li">
                  <div class="merchandise_con">
                    <div class="merchandise_line"
                         v-if="formValidate.requestRouteType == 1 || formValidate.requestRouteType == 2">
                      <div class="left_title">对接网关</div>
                      <div class="right_text"><span class="mod_span" v-for="item in dockGatewayArry">{{item}}</span>
                      </div>
                    </div>
                    <div class="merchandise_line"
                         v-if="formValidate.requestRouteType == 0 || formValidate.requestRouteType == 2">
                      <div class="left_title">落地网关</div>
                      <div class="right_text"><span class="mod_span" v-for="item in outGatewayArry">{{item}}</span>
                      </div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">关联商品</div>
                      <div class="right_text">
                        <Row v-for="(item,index) in datailGoods">
                          <Col span="16">
                          <span>
                        商品：{{item.goodName}}
                        数量(E1条数)：{{item.thisNumb}}
                        </span>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </Col>
            </Row>
            <Row>
              <Col span="22" offset="1" class="role">
              <FormItem class="ivu-form-item-required" label="已关联号码" style="margin-bottom: 10px;">
                <div class="numb_checked">
                  <span v-for="(numb,index) in numbchecked" class="numb_line">{{numb}} <span class="close_del"
                                                                                             @click="delCheckNumb(numb,index)"><Icon
                    type="ios-close-empty"></Icon></span> </span>
                </div>
                <div class="text_numb_desc">无需号码则清空<span @click="clearNumb">清空已关联号码</span></div>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22" offset="1" class="role">
              <FormItem class="ivu-form-item-required" label="号码资源">
                <el-radio-group v-model="formValidate.numberType" size="small">
                  <el-radio-button :label="0">无需号码</el-radio-button>
                  <el-radio-button :label="1">勾选号码</el-radio-button>
                  <el-radio-button :label="2">导入号码</el-radio-button>
                </el-radio-group>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22" offset="1" class="role">
              <FormItem class="ivu-form-item-required" label="" v-if="formValidate.numberType == '1'">
                <div class="input_numb_seach">
                  <i-input class="input_seach_nod" placeholder="请输入要搜索的号码" v-model.trim="numberCondition" style:></i-input>
                  <span class="search_btn"><Icon type="ios-search-strong"></Icon></span>
                </div>

                <div v-if="numbArr.length>0">
                  <el-checkbox-group v-model="numbchecked" @change="numberChange">
                    <el-checkbox class="numb_check_box" v-for="numb in numbArr" :label="numb" :key="numb">{{numb}}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
                <div v-else  style="line-height: 60px;text-align: center;color:#999;">暂无数据</div>

                <div style="text-align: right;">
                  <Page :total="numbTotal" :page-size="numbPageSize" :current="iNowPage" @on-change="numbPageChange"
                        size="small" show-total></Page>
                </div>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22" offset="1" class="role">
              <FormItem class="ivu-form-item-required" label="" v-if="formValidate.numberType == '2'">
                <Input v-model="formValidate.importNumber" placeholder="输入号码用英文';'区分多个号码" :maxlength="500"
                       type="textarea"
                       :autosize="{minRows: 4,maxRows: 5}"></Input>
                <div style="padding-top: 16px;">
                  <Button type="primary" class="sub_btn_size" @click="ipmortNumb">提交号码</Button>
                </div>
                <div class="numb_lin_wrap" >
                  <div class="numb_line_mode">成功<em class="success">{{this.rigthAmount}}</em>个，失败<em class="error">{{this.errorAmount}}</em>个（<span
                    class="link_href" @click="showErrNumModal">查看错误号码</span>）
                  </div>
                  <div class="numb_line_mode">失败原因：可能没有号码或者号码没有上架，请到号码商品管理菜单确认</div>
                </div>
              </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div v-if="current == 4">
          <Form ref="step4Form" :label-width="100">
              <Row>
              <Col span="10" offset="1" class="role">
              <div class="merchandise_msg">
                <div class="merchandise_li">
                  <div class="title">基础信息</div>
                  <div class="merchandise_con">
                    <div class="merchandise_line" v-if="formValidate.orderId">
                      <div class="left_title">订单编号</div>
                      <div class="right_text">{{formValidate.orderId}}</div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">客户名称</div>
                      <div class="right_text" v-for="item in customList " v-if="item.id == formValidate.customId "
                           v-html="item.customName"></div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">关联销售</div>
                      <div class="right_text" v-for="item in saleManList " v-if="item.id == formValidate.salemanId "
                           v-html="item.userName"></div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">订单说明</div>
                      <div class="right_text" v-html=" formValidate.orderExplain"  :title=" formValidate.orderExplain "></div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">创建人</div>
                      <div class="right_text" v-html=" formValidate.createUser"></div>
                    </div>
                    <div class="merchandise_line" v-if="formValidate.createTime">
                      <div class="left_title">创建时间</div>
                      <div class="right_text" v-html=" formValidate.createTime"></div>
                    </div>
                  </div>
                </div>
              </div>
              </Col>
              <Col span="11" offset="1" class="role">
              <div class="merchandise_msg">
                <div class="merchandise_li">
                  <div class="title">订单需求</div>
                  <div class="merchandise_con merchandise_con_big">
                    <div class="merchandise_line">
                      <div class="left_title">商品类别</div>
                      <div class="right_text" v-for="item in resourcesList "
                           v-if="item.id == formValidate.orderRequestTypeId " v-html="item.typeName"></div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">计费类型</div>
                      <div class="right_text" v-if="formValidate.requestChargeType == '0'">流量</div>
                      <div class="right_text" v-if="formValidate.requestChargeType == '1'">包月</div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">归属运营商</div>
                      <div class="right_text" v-if="formValidate.operatorType == '0'">全网</div>
                      <div class="right_text" v-if="formValidate.operatorType == '1'">移动</div>
                      <div class="right_text" v-if="formValidate.operatorType == '2'">联通</div>
                      <div class="right_text" v-if="formValidate.operatorType == '3'">电信</div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">归属城市</div>
                      <div class="right_text">
                        <span v-if="requestCityList[1] == '市辖区'">{{requestCityList[0]}}</span>
                        <span v-else>{{requestCityList[1]}}</span>
                      </div>
                    </div>
                    <div class="merchandise_line" v-if="formValidate.requestChargeType == 0 ? false:true">
                      <div class="left_title">需求量(E1条数)</div>
                      <div class="right_text" v-html="formValidate.requirementAmount"></div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">需求线路</div>
                      <div class="right_text" v-if="formValidate.requestRouteType == '0'">呼入</div>
                      <div class="right_text" v-if="formValidate.requestRouteType == '1'">呼出</div>
                      <div class="right_text" v-if="formValidate.requestRouteType == '2'">呼入加呼出</div>

                    </div>
                  </div>
                </div>
              </div>
              </Col>
            </Row>
            <Row>
              <Col span="22" offset="1" class="role">
              <div class="merchandise_msg">
                <div class="merchandise_li">
                  <div class="merchandise_con">
                    <div class="merchandise_line"
                         v-if="formValidate.requestRouteType == 1 || formValidate.requestRouteType == 2">
                      <div class="left_title">对接网关</div>
                      <div class="right_text"><span class="mod_span" v-for="item in dockGatewayArry">{{item}}</span>
                      </div>
                    </div>
                    <div class="merchandise_line"
                         v-if="formValidate.requestRouteType == 0 || formValidate.requestRouteType == 2">
                      <div class="left_title">落地网关</div>
                      <div class="right_text"><span class="mod_span" v-for="item in outGatewayArry">{{item}}</span>
                      </div>
                    </div>
                    <div class="merchandise_line">
                      <div class="left_title">关联商品</div>
                      <div class="right_text">
                        <Row v-for="(item,index) in datailGoods">
                          <Col span="16">
                          <span>
                        商品：{{item.goodName}}
                        数量(E1条数)：{{item.thisNumb}}
                        </span>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </Col>
            </Row>
            <Row>
              <Col span="22" offset="1" class="role">
              <div class="merchandise_msg">
                <div class="merchandise_li">
                  <div class="merchandise_con">
                    <div class="merchandise_line"
                         v-if="formValidate.requestRouteType == 1 || formValidate.requestRouteType == 2">
                      <div class="left_title">关联号码</div>
                      <div class="right_text"><span class="mod_span" v-for="item in numbchecked">{{item}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </Col>
            </Row>
            <Row>
              <Col span="22" offset="1" class="role">
              <FormItem class="ivu-form-item-required" label="销售价格包">
                <Select v-model="formValidate.pricePackage" filterable placeholder='请选择'>
                  <Option v-for="item in pricePackageList" :value="item.id" :key="item.id">{{ item.packageName }}
                  </Option>
                </Select>
              </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <Row>
          <Col span="22" offset="1">
          <div class="footer_modal">
            <Button v-show="current != 0" type="ghost" class="sub_btn_size" @click="prev">上一步</Button>
            <Button v-show="current != 4" type="primary" class="sub_btn_size" @click="next">下一步</Button>
            <Button v-show="current == 4" type="primary" class="sub_btn_size"
                    @click="handleSubmit(1)" :disabled="disable"><span v-if="isAddMerchandise">保存</span><span
              v-else>生成订单</span></Button>
          </div>
          </Col>
        </Row>
      </div>
    </Modal>


    <!-- 详情 开始 -->
    <Modal v-model="isDatailShow" class="detail_modal" width="700"
           @on-cancel="hideDetail">
      <div v-if="titleName === '订单详单'">
        <div slot="header">
          <div class="detail_top clear">

            <div class="detail_top_right">
              <p class="title">{{this.titleName}}</p>
              <p class="code">{{this.formValidate.orderId}}</p>
            </div>
          </div>
        </div>
        <div>
          <Tabs value="detailTap"  v-model="detailTap" class="tabs_check" type="card" :animated="animated">
            <TabPane label="基本资料" name="name1">
              <div class="tabs_detail_content_top">
                <ul class="tabs_detail_top_ul">
                  <li class="tabs_detail_top_li">
                    <h4 class="tabs_detail_top_title">商品类别</h4>
                    <div class="tabs_detail_top_text" :title="formValidate.orderRequestTypeId"
                         v-html="formValidate.orderRequestTypeId?formValidate.orderRequestTypeId:'-'"></div>
                  </li>
                  <li class="tabs_detail_top_li">
                    <h4 class="tabs_detail_top_title">客户名称</h4>
                    <div class="tabs_detail_top_text" :title="formValidate.customName"
                         v-html="formValidate.customName?formValidate.customName:'-'"></div>
                  </li>
                  <li class="tabs_detail_top_li">
                    <h4 class="tabs_detail_top_title">关联销售</h4>
                    <div class="tabs_detail_top_text" :title="saleman" v-html="saleman?saleman:'-'"></div>
                  </li>
                  <li class="tabs_detail_top_li">
                    <h4 class="tabs_detail_top_title">销售价格包</h4>
                    <div class="tabs_detail_top_text" :title="pricePackageName"
                         v-html="pricePackageName?pricePackageName:'-'"></div>
                  </li>
                </ul>
              </div>

              <div class="tabs_detail_con">
                <ul class="tabs_detail_con_ul">
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/money_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg">
                        <span v-if="formValidate.requestChargeType == '0'">流量</span>
                        <span v-if="formValidate.requestChargeType == '1'">包月</span>
                      </p>
                      <p class="tdetail_msg_text">计费类型</p>
                    </div>
                  </li>
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/operator_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg">
                        <span v-if="formValidate.operatorType == '0'">全网</span>
                        <span v-if="formValidate.operatorType == '1'">移动</span>
                        <span v-if="formValidate.operatorType == '2'">联通</span>
                        <span v-if="formValidate.operatorType == '3'">电信</span>
                      </p>
                      <p class="tdetail_msg_text">归属运营商</p>
                    </div>
                  </li>
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/address_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg">{{formValidate.requestCity}}市</p>
                      <p class="tdetail_msg_text">归属城市</p>
                    </div>
                  </li>
                  <li class="tabs_detail_con_li" v-if="formValidate.requestChargeType == 0 ? false:true">
                    <img class="tabs_detail_icon" src="../../assets/images/numb_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg">{{formValidate.requirementAmount}}</p>
                      <p class="tdetail_msg_text">需求量(E1条数)</p>
                    </div>
                  </li>
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/scenes_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg">
                      <span>
                        {{formValidate.usePlace}}
                      </span>
                      </p>
                      <p class="tdetail_msg_text">使用场景</p>
                    </div>
                  </li>
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/desc_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg" v-html="formValidate.orderExplain?formValidate.orderExplain:'-'"  :title=" formValidate.orderExplain "></p>
                      <p class="tdetail_msg_text">订单说明</p>
                    </div>
                  </li>
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/people_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg" v-html="formValidate.createUser"></p>
                      <p class="tdetail_msg_text">创建人</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="tab_content" style="border-top:#d9d9d9 solid 1px;margin:0 30px;">
                <div class="tab_line clear">
                  <div class="tab_line_left" style="width: 90px">线路类型</div>
                  <div class="tab_line_right">
                    <span v-if="formValidate.requestRouteType == '0'">呼入</span>
                    <span v-if="formValidate.requestRouteType == '1'">呼出</span>
                    <span v-if="formValidate.requestRouteType == '2'">呼入和呼出</span>
                  </div>
                </div>
                <div class="tab_line clear"
                     v-if="formValidate.requestRouteType == 1 || formValidate.requestRouteType == 2">
                  <div class="tab_line_left" style="width: 90px">对接网关</div>
                  <span class="span_text" v-for="item in dockGatewayArry"> {{item}}</span>
                </div>
                <div class="tab_line clear"
                     v-if="formValidate.requestRouteType == 0 || formValidate.requestRouteType == 2">
                  <div class="tab_line_left" style="width: 90px">落地网关</div>
                  <div style="overflow: hidden;padding-top:8px;">
                    <span class="span_text" v-for="item in outGatewayArry">{{item}}</span>
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane label="关联商品" name="name2">
              <ul class="home_small_ul">
                <li>
                  <div v-for="item in datailGoods">
                    <h2 class="name">
                      <span class="goodNo">商品编号：{{item.goodNo ? item.goodNo : '-'}}</span>
                      <span class="phone">{{ item.status ? item.status : '-' }}</span>
                    </h2>
                    <p class="desc">
                      <span class="status">商品名称：{{item.goodName ? item.goodName : '-'}}</span>
                    </p>
                    <!--<p class="desc">
                      <span class="supplierName">供应商：{{item.supplierName ? item.supplierName : '-'}}</span>
                    </p>-->
                    <p class="desc">
                      <span class="thisNumb">数量(E1条数)：{{item.thisNumb ? item.thisNumb : '-'}}</span>
                    </p>
                  </div>
                </li>
                <li v-if="datailGoods.length == 0" class="default_li">关联商品数量为空</li>
              </ul>
            </TabPane>
            <TabPane label="关联号码商品" name="name3" >
              <ul class="home_small_ul"  v-if=" detailNumberList.length > 0">
                <li>
                  <div v-for="item in detailNumberList">
                    <h2 class="name">
                      <span class="goodNo">号码编号：{{item.numberNo ? item.numberNo : '-'}}</span>
                    </h2>
                    <p class="desc">
                      <span class="status">号码：{{item.number ? item.number : '-'}}</span>
                    </p>
                   <!-- <p class="desc">
                      <span class="supplierName">供应商：{{item.supplierName ? item.supplierName : '-'}}</span>
                    </p>-->
                  </div>
                </li>
              </ul>
              <ul class="home_small_ul" v-if=" detailNumberList.length == 0">
                <li>
                  <div>
                    <h2 class="name">
                      暂无数据
                    </h2>
                  </div>
                </li>
              </ul>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Modal>

    <!-- 详情 结束 -->

    <!-- 调度资源 开始 -->
    <Modal v-model="isDispatch" :mask-closable="false" :title="titleName"
           @on-ok="hideDispatch" @on-cancel="hideDispatch" width="640">
      <Form ref="gateForm" v-if="titleName === '调度资源'" :label-width="120">
        <Row>
          <Col span="22" offset="1" class="role">
          <FormItem label="需求量(E1条数)" class="ivu-form-item-required"
                    v-if="formValidate.requestChargeType == 0 ? false:true">
            <Input v-model="formValidate.requirementAmount" placeholder="E1条数 0~999999" :maxlength="6"></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required " label="对接网关"
                    v-if="formValidate.requestRouteType == 1 || formValidate.requestRouteType == 2">
            <Select class="select_list_div" v-model="dockGatewayArry" filterable multiple placeholder='请选择'>
              <Option :value="'待匹配'" :key="'待匹配'" v-if="formValidate.status == '0' ">待匹配
              </Option>
              <Option v-for="item in oldDockGatewayArry" :value="item" :key="item"
                      :disabled="formValidate.status|filterDiseable">{{ item }}
              </Option>
              <Option v-for="item in dockGatewayList" :value="item.name" :key="item.name">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem class="ivu-form-item-required " label="落地网关"
                    v-if="formValidate.requestRouteType == 0 || formValidate.requestRouteType == 2">
            <Select class="select_list_div" v-model="outGatewayArry" filterable multiple placeholder='请选择'>
              <Option :value="'待匹配'" :key="'待匹配'" v-if="formValidate.status == '0'">待匹配
              </Option>
              <Option v-for="item in oldOutGatewayArry" :value="item" :key="item"
                      :disabled="formValidate.status|filterDiseable">{{ item }}
              </Option>
              <Option v-for="item in outGatewayList" :value="item.name" :key="item.name">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem class="ivu-form-item-required " label="关联商品">
            <Row v-for="(good,index) in datailGoods" style="margin-bottom: 10px;">
              <Col span="16">
              <div v-if="index === 0">
                <Select v-model="good.type" transfer filterable placeholder='请选择' @on-change="goodChang(good,index)">
                  <Option v-for="item in goodDateList" :value="item.id" :key="item.id">{{ item.id > 0 ?
                    item.goodName +
                    "（当前库存：" + item.store + "）" : item.goodName }}
                  </Option>
                </Select>
              </div>
              <div v-else>
                {{ good.id > 0 ? good.goodName +
                "（当前库存：" + good.store + "）" : good.goodName }}
              </div>
              </Col>
              <Col span="5" offset="1">
              <Input v-model="good.thisNumb" placeholder="数量(E1条数)"
                     @on-change="changeInput(good,index)"></Input></Col>
              <Col span="2">
              <span v-if="index !== 0" class="del_type_btn del_icon_img" @click="delGood(index)"></span>
              <span class="del_type_btn add_icon_img" v-else @click="addGood(good)"></span></Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22" offset="1">
          <div class="footer_modal">
            <Button type="ghost" class="sub_btn_size" @click="hideDispatch">取消</Button>
            <Button type="primary" class="sub_btn_size" @click="handleSubmit(2)" :disabled="disable">保存</Button>
          </div>
          </Col>
        </Row>
      </Form>
    </Modal>
    <!-- 调度资源 结束 -->


    <!-- 调整售价 开始 -->
    <Modal v-model="isPrice" :mask-closable="false" :title="titleName"
           @on-ok="hidePrice" @on-cancel="hidePrice" width="640">
      <Form ref="priceForm" v-if="titleName === '调整售价'" :label-width="100">

        <Row>
          <Col span="20" offset="1" class="role">
          <FormItem class="" style="margin-bottom: 10px;" label="原销售价">{{ pricePackageName }}
            <span style="display: inline-block;color:#00b4ff;cursor: pointer;line-height: 32px;padding-left: 24px;"
                  @click="showPriceDetail(formValidate.pricePackage,'2')"
                  v-if="formValidate.pricePackage!='' && formValidate.pricePackage!='-1'">详情</span>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20" offset="1" class="role">
          <FormItem class="ivu-form-item-required" style="margin-bottom: 10px;" label="销售价格包">
            <Select v-model="timedPriceId" filterable placeholder='请选择'>
              <Option v-for="item in pricePackageList" :value="item.id" :key="item.id">{{ item.packageName }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="2">
          <span style="float: right;color:#00b4ff;cursor: pointer;line-height: 32px;"
                @click="showPriceDetail(timedPriceId,'2')" v-if="timedPriceId!='' && timedPriceId!='-1'">详情</span></Col>
        </Row>
        <Row>
          <Col span="20" offset="1" class="role">
          <FormItem class="" style="margin-bottom: 10px;" label=" ">
            <Checkbox v-model="singleTime" @on-change="timeTaskShowChange">定时生效<em style="color: #999">(不勾选立即生效)</em>
            </Checkbox>
          </FormItem>
          </Col>
        </Row>
        <Row v-if="singleTime">
          <Col span="20" offset="1" class="role">
          <FormItem label=" ">
            <DatePicker :value="timeValue" type="datetime" format="yyyy-MM-dd HH:mm:ss" @on-change="timeChange"
                        placeholder="请选择生效时间" style="width: 100%;"></DatePicker>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="22" offset="1">
          <div class="footer_modal">
            <Button type="ghost" class="sub_btn_size" @click="hidePrice">取消</Button>
            <Button type="primary" class="sub_btn_size" @click="handleSubmit(3)" :disabled="disable">保存</Button>
          </div>
          </Col>
        </Row>
      </Form>
    </Modal>
    <!-- 调整售价 结束 -->

    <!-- ===========================================查看价格包的详情 ================================================ -->
    <Modal v-model="priceShow" class="detail_modal" width="680">
      <div>
        <div slot="header">
          <div class="detail_top clear">
            <div class="detail_top_right pad_left">
              <p class="title" v-html="priceMap.packageName"></p>
              <p class="code" v-html="priceMap.packageNo"></p>
            </div>
          </div>
        </div>
        <div>
          <Tabs :value="priceTab" v-model="priceTab" @on-click="tabClick">
            <TabPane label="基本资料" name="priceTab1">
              <div class="tab_content">
                <div class="tab_line clear">
                  <div class="tab_line_left">价格包类型</div>
                  <div class="tab_line_right" v-html="priceMap.packageTypeName"></div>
                </div>
                <div class="tab_line clear">
                  <div class="tab_line_left">状态</div>
                  <div class="tab_line_right" v-html="priceMap.status"></div>
                </div>
                <div class="tab_line clear">
                  <div class="tab_line_left">使用数量</div>
                  <div class="tab_line_right" v-html="priceMap.linkCount"></div>
                </div>
                <div class="tab_line clear">
                  <div class="tab_line_left">价格包说明</div>
                  <div class="tab_line_right" v-html="priceMap.remark"></div>
                </div>
                <div class="tab_line clear">
                  <div class="tab_line_left">创建日期</div>
                  <div class="tab_line_right" v-html="priceMap.createTime"></div>
                </div>
                <div class="tab_line clear">
                  <div class="tab_line_left">创建人</div>
                  <div class="tab_line_right" v-html="priceMap.createUser"></div>
                </div>
              </div>
            </TabPane>
            <TabPane label="价格配置" name="priceTab2">
              <div class="">
                <table class="new_table" border="1" style="border: #e9eaec solid 1px;">
                  <tr>
                    <th class="text_left pad_lt" width="60">资费项</th>
                    <th class="text_left pad_lt" width="210">类型选择</th>
                    <th colspan="2" class="text_left pad_lt" width="310">成本价(元)</th>
                  </tr>
                  <tr class="tab_content" v-if="priceMap.chargeType == '1' ">
                    <th class="text_left pad_lt" width="60">月租</th>
                    <th class="text_left pad_lt" width="210">按天折算，单条E1月租(不含号码月租)</th>
                    <th colspan="2" class="text_left pad_lt" width="310" v-html="priceMap.monthFee+'元/月'"></th>
                  </tr>
                  <tr class="tab_content" v-if="priceMap.chargeType == '1' ">
                    <th class="text_left pad_lt" width="60">低消</th>
                    <th class="text_left pad_lt" width="210">按天折算，单条E1低消(不含号码低消)</th>
                    <th colspan="2" class="text_left pad_lt" width="310" v-html="priceMap.minFee+'元/月'"></th>
                  </tr>
                  <tr class="tab_content" v-if="priceMap.eType == '0' || priceMap.eType == '2'">
                    <th class="text_left pad_lt" width="60">呼入</th>
                    <th class="text_left pad_lt" width="210">
                      <span class="detail_disable" v-html="priceMap.callInFeeName"></span>
                    </th>
                    <th colspan="2" class="text_left pad_lt" width="310" v-html="priceMap.callInFeeName"></th>
                  </tr>

                  <tr v-if="(priceMap.eType == '1' || priceMap.eType == '2') && (priceMap.callOutInNetFeeType == '0' )"
                      class="tab_content">
                    <th rowspan="2" class="text_left pad_lt" width="60">呼出</th>
                    <th rowspan="2" class="text_left pad_lt" width="160">
                      分网计费
                    </th>
                    <th rowspan="1" class="text_left pad_lt" width="60">网内</th>
                    <th class="text_left pad_lt" width="310">
                      <div v-if="priceMap.callOutInNetBillType == '1'">
                        <p>长市合一</p>
                        <div>
                          <span class="detail_disable" v-html="priceMap.callOutFeeName5"></span>
                        </div>
                      </div>

                      <div v-if="priceMap.callOutInNetBillType == '0'">
                        <p>长市区分</p>
                        <div>
                          本地固话
                          <span class="detail_disable" v-html="priceMap.callOutFeeName6"></span>
                        </div>
                        <div>
                          长途固话
                          <span class="detail_disable" v-html="priceMap.callOutFeeName7"></span>
                        </div>
                        <div>
                          本地手机
                          <span class="detail_disable" v-html="priceMap.callOutFeeName8"></span>
                        </div>
                        <div>
                          长途手机
                          <span class="detail_disable" v-html="priceMap.callOutFeeName9"></span>
                        </div>
                      </div>

                    </th>
                  </tr>

                  <tr v-if="(priceMap.eType == '1' || priceMap.eType == '2') && (priceMap.callOutOutNetFeeType == '0' )"
                      class="tab_content">
                    <th rowspan="1" class="text_left pad_lt" width="60">网间</th>
                    <th class="text_left pad_lt" width="310">
                      <div v-if="priceMap.callOutOutNetBillType == '1'">
                        <p>长市合一</p>
                        <div>
                          <span class="detail_disable" v-html="priceMap.callOutFeeName10"></span>
                        </div>
                      </div>

                      <div v-if="priceMap.callOutOutNetBillType == '0'">
                        <p>长市区分</p>
                        <div>
                          本地固话
                          <span class="detail_disable" v-html="priceMap.callOutFeeName11"></span>
                        </div>
                        <div>
                          长途固话
                          <span class="detail_disable" v-html="priceMap.callOutFeeName12"></span>
                        </div>
                        <div>
                          本地手机
                          <span class="detail_disable" v-html="priceMap.callOutFeeName13"></span>
                        </div>
                        <div>
                          长途手机
                          <span class="detail_disable" v-html="priceMap.callOutFeeName14"></span>
                        </div>
                      </div>

                    </th>
                  </tr>

                  <tr v-if="(priceMap.eType == '1' || priceMap.eType == '2') &&priceMap.callOutFeeTypeAll == '1'"
                      class="tab_content">
                    <th rowspan="1" class="text_left pad_lt" width="60">呼出</th>
                    <th rowspan="1" class="text_left pad_lt" width="210">
                      全网计费
                    </th>
                    <th colspan="2" class="text_left pad_lt" width="310">
                      <div>
                        本地固话
                        <span class="detail_disable" v-html="priceMap.callOutFeeName1"></span>
                      </div>
                      <div>
                        长途固话
                        <span class="detail_disable" v-html="priceMap.callOutFeeName2"></span>
                      </div>
                      <div>
                        本地手机
                        <span class="detail_disable" v-html="priceMap.callOutFeeName3"></span>
                      </div>
                      <div>
                        长途手机
                        <span class="detail_disable" v-html="priceMap.callOutFeeName4"></span>
                      </div>
                    </th>
                  </tr>

                  <tr>
                    <th class="text_left pad_lt" width="60">国际费率倍数</th>
                    <th colspan="3" class="text_left pad_lt" v-html="priceMap.nationalFee"></th>
                  </tr>
                </table>
              </div>
            </TabPane>

            <TabPane v-if="cu_packageType == '0' || cu_packageType == '1' " label="关联商品" name="priceTab3">
              <div class="detail_tab_w">
                <ul class="home_small_ul">
                  <li v-if="priceDetailList.length>0" v-for="item in priceDetailList">
                    <h2 class="name">{{item.supplierName}}<span class="phone">{{item.phone}}</span></h2>
                    <p class="desc">拥有资源：{{item.typeName}}</p>
                    <p class="desc">完成订单：{{item.orderTotal}}</p>
                    <p class="desc">商品编号：{{item.supplierNo}}</p>
                  </li>
                  <li v-if="priceDetailList.length == 0" class="default_li">关联商品数量为空</li>
                </ul>
              </div>
            </TabPane>

            <TabPane v-if="cu_packageType == '2'" label="关联订单" name="priceTab4">
              <ul class="home_small_ul">
                <li v-if="priceDetailList.length>0" v-for="item in priceDetailList">
                  <h2 class="name">{{item.orderId}}
                    <span v-if="item.status == '0'" class="phone">确认中</span>
                    <span v-if="item.status == '1'" class="phone">已确认</span>
                    <span v-if="item.status == '2'" class="phone">已取消</span>
                    <span v-if="item.status == '3'" class="phone">已终止</span>
                    <span v-if="item.status == '4'" class="phone">执行中</span>
                    <span v-if="item.status == '5'" class="phone">已暂停</span>
                  </h2>
                  <p class="desc">需求资源：{{item.orderRequestType}}</p>
                  <p class="desc">执行时间：{{item.createTime}}</p>
                </li>
                <li v-if="linkGoodlistData.length == 0" class="default_li">关联商品数量为空</li>
              </ul>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Modal>

    <!-- ===========================================查看价格包详情结束 ============================================== -->


    <!-- 号码调度 开始 -->
    <Modal v-model="isNumbDisplay" :mask-closable="false" width="760" @on-cancel="errNumbCancel" title="调度号码">
      <Form ref="step1Form" :label-width="100">
        <Row>
          <Col span="22" offset="1" class="role">
          <FormItem class="ivu-form-item-required" label="已关联号码" style="margin-bottom: 10px;">
            <div class="numb_checked">
                  <span v-for="(numb,index) in numbchecked" class="numb_line">{{numb}} <span class="close_del"
                                                                                             @click="delCheckNumb(numb,index)"><Icon
                    type="ios-close-empty"></Icon></span> </span>
            </div>
            <div class="text_numb_desc">无需号码则清空<span @click="clearNumb">清空已关联号码</span></div>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22" offset="1" class="role">
          <FormItem class="ivu-form-item-required" label="号码资源">
            <el-radio-group v-model="formValidate.numberType" size="small">
              <el-radio-button :label="0">无需号码</el-radio-button>
              <el-radio-button :label="1">勾选号码</el-radio-button>
              <el-radio-button :label="2">导入号码</el-radio-button>
            </el-radio-group>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22" offset="1" class="role">
          <FormItem class="ivu-form-item-required" label="" v-if="formValidate.numberType == '1'">
            <div class="input_numb_seach">
              <i-input class="input_seach_nod" placeholder="请输入要搜索的号码" v-model.trim="numberCondition" style:></i-input>
              <span class="search_btn"><Icon type="ios-search-strong"></Icon></span>
            </div>

            <div v-if="numbArr.length>0">
              <el-checkbox-group v-model="numbchecked" @change="numberChange">
                <el-checkbox class="numb_check_box" v-for="numb in numbArr" :label="numb" :key="numb">{{numb}}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-else  style="line-height: 60px;text-align: center;color:#999;">暂无数据</div>

            <div style="text-align: right;">
              <Page :total="numbTotal" :page-size="numbPageSize" :current="iNowPage" @on-change="numbPageChange"
                    size="small" show-total></Page>
            </div>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22" offset="1" class="role">
          <FormItem class="ivu-form-item-required" label="" v-if="formValidate.numberType == '2'">
            <Input v-model="formValidate.importNumber" placeholder="输入号码用英文';'区分多个号码" :maxlength="500"
                   type="textarea"
                   :autosize="{minRows: 4,maxRows: 5}"></Input>
            <div style="padding-top: 16px;">
              <Button type="primary" class="sub_btn_size" @click="ipmortNumb">提交号码</Button>
            </div>
            <div class="numb_lin_wrap" >
              <div class="numb_line_mode">成功<em class="success">{{this.rigthAmount}}</em>个，失败<em class="error">{{this.errorAmount}}</em>个（<span
                class="link_href" @click="showErrNumModal">查看错误号码</span>）
              </div>
              <div class="numb_line_mode">失败原因：可能没有号码或者号码没有上架，请到号码商品管理菜单确认</div>
            </div>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22" offset="1">
          <div class="footer_modal">
            <Button  type="ghost" class="sub_btn_size" @click="closeDispatchNumb">取消</Button>
            <Button  type="primary" class="sub_btn_size" @click="submitNumber" >保存</Button>
          </div>
          </Col>
        </Row>
      </Form>
    </Modal>
    <!-- 号码调度 结束 -->

    <!-- 查看错误号码列表 -->
    <Modal v-model="isErrNumb" :mask-closable="false" width:="450" @on-cancel="errNumbCancel" title="错误号码列表">
      <Row>
        <Col span="22" offset="1" class="role">
        <div class="error_numb_mod" >
          <span v-for="item in errorNumbText">  {{item}} ;</span>
        </div>

        </Col>
      </Row>
      <Row>
        <Col span="22" offset="1">
        <div class="footer_modal" style="text-align: center;">
          <Button type="primary" class="sub_btn_size" @click="errNumbCancel">知道了</Button>
        </div>
        </Col>
      </Row>
    </Modal>
    <!-- 查看错误号码列表 -->


  </div>
</template>
<script>
  import {mapGetters} from "vuex";
  import dateFilter from '../settlement/dateFilter';
  import {
    fetchOrderList,
    fetchAddOrder,
    fetchUpdateOrder,
    fetchUpdateStatusOrder,
    fetchquerySaleMan,
    fetchGetLandGateWay,
    fetchGetJoinGateWay,
    fetchGoodList,
    fetchPriceList,
    fetchqueryCustomerList,
    fetchGoodType,
    fetchgetAllGoodListOrder,
    fetchgetAllPricePackageOrder,
    fetchGetIndustryList,
    fetchPriceBasic,
    fetchPriceDetail,
    fetchPriceLinkGood,
    fetchPriceLinkOrder,
    fetchgetGetOrderCustomer,
    fetchgetGetTimedTaskDetail,
    fetchcheckNumbers,
    fetchgetOrderNumber,
    fetchUpdateOrderNumber,
    fetchQueryALLNumberList,
    DownLoadFile
  } from '@/api/api';
  import * as util from '@/common/js/util.js';
  import {cityData} from "../../common/js/cityData.js"

  export default {
    data() {
      return {
        isNumbDisplay: false,

        iNowPage: 1,
        numbTotal: 0,
        numbPageSize: 20,
        numbArr: [],
        numbchecked: [],
        errorNumbText: "",
        isErrNumb: false,
        errorAmount:0,
        rigthAmount:0,
        detailNumberList:[],

        detailTap:'name1',
        singleTime: true,
        cityData: cityData,
        disable: false,
        isAddMerchandise: false,
        animated: false,
        priceShow: false,
        priceDetailList: [],
        linkGoodlistData: [],
        filter_item: [],
        filter_where: {},
        priceMap: {},
        timeValue: "",
        beginTime: "",
        endTime: "",
        noDataText: "加载中...",
        all_columns: [
          {
            title: "序号",
            key: "id",
            fixed: 'left',
            type: "index",
            width: 70
          },
          {
            title: "订单编号",
            key: "orderId",
            width: 280
          },
          {
            title: "客户名称",
            key: "customName",
            width: 200
          },
          {
            title: "关联销售",
            key: "saleman",
            width: 200
          },
          {
            title: "首次执行时间",
            key: "firstPlayTime",
            width: 160,
            renderHeader: (h, params) => {
              return h(dateFilter, {
                props: {
                  title: params.column.title,
                  timeType: "datetime",
                  fn: (startDate, endDate) => {
                    if (!startDate || !endDate || startDate.length == 0 || endDate.length == 0) {
                      startDate = "";
                      endDate = "";
                    }
                    if (endDate && endDate.length != 0 && endDate.slice(11) == "00:00:00") {
                      endDate = endDate.slice(0, 10) + " " + "23:59:59";
                    }
                    this.beginTime = startDate;
                    this.endTime = endDate;
                    this.currentPage = 1;
                    this.getOrderList();
                  }
                }
              });
            },
          },
          {
            title: "归属城市",
            key: "requestCity",
            width: 100
          },
          {
            title: "归属运营商",
            key: "operatorType",
            width: 100,
            render: (h, params) => {
              let str = '';
              let status = params.row.operatorType;
              if (status == '1') {
                str = '移动';
              } else if (status == '2') {
                str = '联通'
              } else if (status == '3') {
                str = '电信';
              } else if (status == '0') {
                str = '全网';
              }
              let arr = [
                h('span', {}, str)
              ];
              return h('div', arr);
            },
            where: "",
            filters: [
              {
                label: "全网",
                value: "0"
              },
              {
                label: "移动",
                value: "1"
              },
              {
                label: "联通",
                value: "2"
              },
              {
                label: "电信",
                value: "3"
              }
            ],
            filterMultiple: true,
            filterRemote: function (value, key, column) {
              column.where = value.join(',');
            }
          },
          {
            title: "需求资源",
            key: "orderRequestType",
            width: 200
          },
          {
            title: "创建时间",
            key: "createTime",
            width: 160
          },
          {
            title: "创建人",
            key: "createUser",
            width: 220
          },
          {
            title: "状态",
            key: "status",
            width: 200,
            where: "",
            filters: [
              {
                label: "确认中",
                value: "0"
              },
              {
                label: "已确认",
                value: "1"
              },
              {
                label: "已取消",
                value: "2"
              },
              {
                label: "已终止",
                value: "3"
              },
              {
                label: "执行中",
                value: "4"
              },
              {
                label: "已暂停",
                value: "5"
              },
              {
                label: "待执行",
                value: "6"
              },
              {
                label: "待暂停",
                value: "7"
              },
              {
                label: "待终止",
                value: "8"
              }
            ],
            filterMultiple: true,
            filterRemote: function (value, key, column) {
              column.where = value.join(',');
            },
            render: (h, params) => {
              let str = '';
              let status = params.row.status;
              if (status == '0') {
                str = '确认中';
              } else if (status == '1') {
                str = '已确认';
              } else if (status == '2') {
                str = '已取消';
              } else if (status == '3') {
                str = '已终止';
              } else if (status == '4') {
                str = '执行中';
              } else if (status == '5') {
                str = '已暂停';
              } else if (status == '6') {
                str = '待执行 (VBOSS同步中)';
              } else if (status == '7') {
                str = '待暂停 (VBOSS同步中)';
              } else if (status == '8') {
                str = '待终止 (VBOSS同步中)';
              }
              let arr = [
                h('span', {}, str)
              ];
              return h('div', arr);
            },

          },
          {
            title: "操作",
            key: "111",
            width: 430,
            rowId: '61,62,63,64,65,66,67,68,69',
            render: (h, params) => {
              let arr = [];
              if (this.havePerm('61')) {
                arr.push(h('span', {
                  props: {},
                  class: 'tab_childer_btn',
                  on: {
                    click: () => {
                      this.showDetail(params.row)
                    }
                  }
                }, '详情'))
              }

              if (params.row.status == '0') {
                if (this.havePerm('62')) {
                  arr.push(
                    h('span', {
                      props: {},
                      class: 'tab_childer_btn',
                      on: {
                        click: () => {
                          this.modify(params.row)
                        }
                      }
                    }, '修改需求')
                  )
                }
                if (this.havePerm('68')) {
                  arr.push(
                    h('span', {
                      props: {},
                      class: 'tab_childer_btn',
                      on: {
                        click: () => {
                          this.showPrice(params.row)
                        }
                      }
                    }, '调整售价')
                  )
                }
                if (this.havePerm('69')) {
                  arr.push(
                    h('span', {
                      props: {},
                      class: 'tab_childer_btn',
                      on: {
                        click: () => {
                          this.showDispatch(params.row)
                        }
                      }
                    }, '调度资源')
                  )
                }
                if (this.havePerm('64')) {
                  arr.push(
                    h('Poptip', {
                      props: {
                        type: 'text',
                        title: "您确认取消这个订单吗？",
                        confirm: true,
                        placement: "top-end",
                        transfer: true,
                      },
                      class: 'tab_childer_btn',
                      on: {
                        "on-ok": () => {
                          this.updataStatus('2', params.row)
                        }
                      }
                    }, '取消')
                  )
                }
                if (this.havePerm('63')) {
                  arr.push(
                    h('Poptip', {
                      props: {
                        type: 'text',
                        title: "您将要确认这个订单？",
                        confirm: true,
                        placement: "top-end",
                        transfer: true,
                      },
                      class: 'tab_childer_btn',
                      on: {
                        "on-ok": () => {
                          this.updataStatus('1', params.row)
                        }
                      }
                    }, '确认')
                  )
                }
              }
              if (params.row.status == '1' || params.row.status == '4' || params.row.status == '5') {
                if (this.havePerm('68')) {
                  arr.push(h('span', {
                    props: {},
                    class: 'tab_childer_btn',
                    on: {
                      click: () => {
                        this.showPrice(params.row)
                      }
                    }
                  }, '调整售价'))
                }

                if (this.havePerm('69')) {
                  arr.push(
                    h('span', {
                      props: {},
                      class: 'tab_childer_btn',
                      on: {
                        click: () => {
                          this.showDispatch(params.row)
                        }
                      }
                    }, '调度资源')
                  )
                  if (this.havePerm('290')) {
                    arr.push(
                      h('span', {
                        props: {},
                        class: 'tab_childer_btn',
                        on: {
                          click: () => {
                            this.showDispatchNumb(params.row)
                          }
                        }
                      }, '调度号码')
                    )
                  }
                }

                if (params.row.status == '4') {
                  if (this.havePerm('67')) {
                    arr.push(h('Poptip', {
                      props: {
                        type: 'text',
                        title: "您将要暂停这个订单？",
                        confirm: true,
                        placement: "top-end",
                        transfer: true,
                      },
                      class: 'tab_childer_btn',
                      on: {
                        "on-ok": () => {
                          this.updataStatus('5', params.row)
                        }
                      }
                    }, '暂停'));
                  }
                }
                if (params.row.status == '1' || params.row.status == '5') {
                  if (this.havePerm('66')) {
                    arr.push(
                      h('Poptip', {
                        props: {
                          type: 'text',
                          title: "您将要执行这个订单？",
                          confirm: true,
                          placement: "top-end",
                          transfer: true,
                        },
                        class: 'tab_childer_btn',
                        on: {
                          "on-ok": () => {
                            this.updataStatus('4', params.row)
                          }
                        }
                      }, '执行')
                    )
                  }
                  if (this.havePerm('65')) {
                    arr.push(
                      h('Poptip', {
                        props: {
                          type: 'text',
                          title: "您将要终止这个订单？",
                          confirm: true,
                          placement: "top-end",
                          transfer: true,
                        },
                        class: 'tab_childer_btn',
                        on: {
                          "on-ok": () => {
                            this.updataStatus('3', params.row)
                          }
                        }
                      }, '终止')
                    )
                  }

                }
              }
              return h('div', arr);
            }

          }
        ],
        loading: false,
        tabHeight: '500',
        totalCount: 0,
        pageNo: 1,
        pageNum: util.pageSize,
        condition: '',
        numberCondition: '',
        pageOpt: util.pageOpt,
        scrollable: true,
        modal1: false,
        modal2: false,
        isDispatch: false,
        priceTab: "priceTab1",
        cu_packageType: "",
        current: 0,
        isPrice: false,
        listData: [],
        customList: [],
        resourcesList: [],
        dockGatewayList: [],
        outGatewayList: [],
        goodsList: [],
        industryList: [],
        saleManList: [],
        pricePackageList: [],
        goodDateList: [],
        goodDetailMap: [],
        outGatewayArry: [],
        oldOutGatewayArry: [],
        oldDockGatewayArry: [],
        dockGatewayArry: [],
        titleName: "",
        pricePackageName: "",
        orderRequestType: "",
        customName: "",
        saleman: "",
        isDatailShow: false,
        goods: null,
        datailGoods: [],
        orderListLoad: true,
        oldDatailGoods: [],
        usePlaceArray: [],
        requestCityList: [],
        timedPriceId: "",
        formValidate: {
          id: "",
          orderId: "",
          pricePackage: "",
          orderExplain: "",
          orderRequestTypeId: 1,
          customId: "",
          customName: "",
          salemanId: "",
          goods: "",
          operatorType: "1",
          usePlace: '',
          dockGateway: '',
          outGateway: '',
          status: "",
          requirementAmount: "",
          requestRouteType: "",
          requestChargeType: "",
          requestCity: "",
          isTimedTask: "0",
          taskTime: "",
          requestCityList: [],
          createUser: localStorage.getItem('USER'),
          createTime: '',
          numberType: "0",
          importNumber: "",
          numbers: "",
          numberArr: []
        }

      };
    },
    filters: {
      filterDiseable(status) {
        return status > 1 ? true : false
      }
    },
    created() {
      this.tabHeight = (document.documentElement.clientHeight - 160 - 40);
      //加载订单场景
      this.getAllIndustryList();
      //商品类型
      this.getGoodAllTypeList();
      //加载客户列表
      this.getClientList();
      this.getOrderList();
      if (!this.havePerm('61') && !this.havePerm('62') && !this.havePerm('63')
        && !this.havePerm('64') && !this.havePerm('65') && !this.havePerm('66')
        && !this.havePerm('67') && !this.havePerm('68') && !this.havePerm('69')) {
        this.all_columns.splice(this.all_columns.length - 1, this.all_columns.length);
      }
    },

    computed: mapGetters(
      {
        perm_info: "main/perm_info"
      }
    ),

    components: {
      dateFilter: dateFilter
    },
    methods: {
      havePerm(id) {
        return this.perm_info.indexOf(id) != -1;
      },

      fn() {
      },
      delGood(index) {
        this.datailGoods.splice(index, 1);
      },
      addGood(item) {
        if (!item.type && !item.thisNumb) {
          return
        }

        //解决新增订单、修改需求时新添加的商品名称显示异常
        let detail = this.goodDetailMap.get(item.type);
        if (detail) {
          item.goodName = detail.goodName;
          item.id = detail.id;
          item.store = detail.store;
        }

        this.datailGoods.unshift({
          type: '',
          thisNumb: null,
        });
      },
      ok() {
      },
      hideOrder() {
        this.titleName = '';
        this.modal2 = false;
      },
      hideDetail() {
        this.titleName = '';
        this.isDatailShow = false;
      },
      exportData(type) {
        if(this.totalCount == 0){
          this.$Message.error("数据为空，不能导出");
          return
        }
        DownLoadFile({
          url: '/vcloud/tradeManage/order/exportOrderList', data: {
            condition: this.condition
          }
        });
      },
      getPageChange(page) {

        this.pageNo = page
        this.getOrderList();
      },

      getPageSizeChange(pageNum) {

        this.pageNum = pageNum
        this.getOrderList();
      },

      search() {
        this.pageNo = 1;
        this.getOrderList();
      },

      next() {
        if (this.addValidate()) {
          if (this.current === 2) {
            //解决新增订单、修改需求时新添加的商品名称显示异常
            if (this.datailGoods.length > 0) {
              let detail = this.goodDetailMap.get(this.datailGoods[0].type);
              if (detail) {
                this.datailGoods[0].goodName = detail.goodName;
              }
            }
          }

          if (this.current == 4) {
            this.current = 0;
          } else {
            this.current += 1;
          }
        }
      },
      prev() {
        if (this.current > 0) {
          this.current--;
        }
      },
      showDispatch(item) {
        var detail = JSON.parse(JSON.stringify(item));
        //网关窗口显示
        this.titleName = "调度资源";
        this.current = 2;
        this.getLandWayList();
        this.getJoinWayList();
        this.formValidate.orderId = detail.orderId;
        this.formValidate.status = detail.status;
        this.formValidate.requestRouteType = detail.requestRouteType;
        this.formValidate.requestChargeType = detail.requestChargeType;
        this.dockGatewayArry = [];
        var dockGate = [];
        if (detail.dockGateway) {
          dockGate = detail.dockGateway.split(",");
          this.dockGatewayArry = JSON.parse(JSON.stringify(dockGate));
          this.oldDockGatewayArry = JSON.parse(JSON.stringify(dockGate));
          var index = this.oldDockGatewayArry.indexOf('待匹配');
          if (index != -1) {
            this.oldDockGatewayArry.splice(index, 1);
          }
        }
        this.outGatewayArry = [];
        var outGate = [];
        if (detail.outGateway) {
          outGate = detail.outGateway.split(",");
          this.outGatewayArry = JSON.parse(JSON.stringify(outGate));
          this.oldOutGatewayArry = JSON.parse(JSON.stringify(outGate));
          var index = this.oldOutGatewayArry.indexOf('待匹配');
          if (index != -1) {
            this.oldOutGatewayArry.splice(index, 1);
          }
        }
        this.formValidate.createTime = detail.createTime;
        this.formValidate.requirementAmount = detail.requirementAmount;
        this.formValidate.id = detail.id;
        this.formValidate.createUser = detail.createUser;
        this.formValidate.salemanId = detail.salemanId;

        //加载商品列表
        if (this.formValidate.requestChargeType == '0') {
          this.getGoodAllList(detail, this.formValidate.requestRouteType, this.formValidate.requestChargeType);
        } else {
          this.getGoodAllList(detail, this.formValidate.requestRouteType);
        }

        this.isDispatch = true;
      },
      hideDispatch() {
        this.isDispatch = false;
        this.titleName = '';
      },
      hidePrice() {
        this.isPrice = false;
        this.titleName = '';
      },
      showPrice(item) {
        var detail = JSON.parse(JSON.stringify(item));
        this.titleName = "调整售价";
        this.current = 3;
        this.formValidate.orderId = detail.orderId;
        this.formValidate.status = detail.status;
        this.formValidate.id = detail.id;
        this.formValidate.createUser = detail.createUser;
        this.formValidate.pricePackage = '';
        this.pricePackageName = detail.pricePackageName;
        this.getPricePackageList(detail, detail.requestRouteType, detail.requestChargeType);
        this.singleTime = false;
        this.formValidate.taskTime = "";
        this.timeValue = "";
        this.formValidate.isTimedTask = '0';
        this.timedPriceId = "";
        this.getTimedTask(detail);
        this.isPrice = true;
      },
      ok() {
        this.$Message.success('订单取消成功！');
      },
      //添加或者修改订单
      modify(item) {
        if (item) {

          var detail = JSON.parse(JSON.stringify(item));

          this.titleName = "修改需求";
          this.getLandWayList();
          this.getJoinWayList();
          this.current = 0;
          this.formValidate.orderId = detail.orderId;
          this.formValidate.orderExplain = detail.orderExplain;
          this.formValidate.orderRequestTypeId = parseInt(detail.orderRequestTypeId);
          this.formValidate.orderRequestType = detail.orderRequestType;
          this.formValidate.customId = parseInt(detail.customId);
          this.formValidate.customName = detail.customName;
          this.formValidate.operatorType = detail.operatorType;
          this.formValidate.usePlace = detail.usePlace;
          this.formValidate.status = detail.status;
          this.formValidate.requirementAmount = detail.requirementAmount;
          this.formValidate.requestRouteType = detail.requestRouteType;
          this.formValidate.requestChargeType = detail.requestChargeType;
          var cityList = [];
          if (detail.requestCityList) {
            cityList = detail.requestCityList.split(',');
          }
          this.requestCityList = JSON.parse(JSON.stringify(cityList));
          this.dockGatewayArry = [];
          var dockGate = [];
          if (detail.dockGateway) {
            dockGate = detail.dockGateway.split(",");
            this.dockGatewayArry = JSON.parse(JSON.stringify(dockGate));
            this.oldDockGatewayArry = JSON.parse(JSON.stringify(dockGate));
            var index = this.oldDockGatewayArry.indexOf('待匹配');
            if (index != -1) {
              this.oldDockGatewayArry.splice(index, 1);
            }
          }
          this.outGatewayArry = [];
          var outGate = [];
          if (detail.outGateway) {
            outGate = detail.outGateway.split(",");
            this.outGatewayArry = JSON.parse(JSON.stringify(outGate));
            this.oldOutGatewayArry = JSON.parse(JSON.stringify(outGate));
            var index = this.oldOutGatewayArry.indexOf('待匹配');
            if (index != -1) {
              this.oldOutGatewayArry.splice(index, 1);
            }
          }
          this.formValidate.createTime = detail.createTime;
          this.formValidate.id = detail.id;
          this.formValidate.createUser = detail.createUser;
          this.getPricePackageList(detail, this.formValidate.requestRouteType, this.formValidate.requestChargeType);
          //加载商品列表

          if (this.formValidate.requestChargeType == '0') {
            this.getGoodAllList(detail, this.formValidate.requestRouteType, this.formValidate.requestChargeType);
          } else {
            this.getGoodAllList(detail, this.formValidate.requestRouteType);
          }

          //加载关联销售列表
          this.getAllSalerList(detail);

          //提交错误号码个数
          this.errorAmount = 0;
          //提交正确号码个数
          this.rigthAmount = 0;
          //获取订单已关联号码
          this.getOrderNumber(detail);
          //获取可用号码
          this.numbArr = [];
          this.getALLNumberList();
          this.formValidate.importNumber = '';

          this.isAddMerchandise = true;
        } else {

          this.getLandWayList();
          this.getJoinWayList();
          this.titleName = "新增订单";
          this.current = 0;
          this.formValidate.orderId = "";
          this.formValidate.pricePackage = "";
          this.formValidate.orderExplain = "";
          this.formValidate.orderRequestTypeId = 1;
          this.formValidate.createTime = "";
          this.formValidate.customId = "";
          this.formValidate.usePlace = "";
          this.formValidate.salemanId = "";
          this.formValidate.operatorType = "1";
          this.formValidate.status = "0";
          this.formValidate.requirementAmount = "";
          this.formValidate.requestRouteType = "1";
          this.formValidate.requestChargeType = "0";
          this.formValidate.requestCity = "";
          this.requestCityList = [];
          this.dockGatewayArry = [];
          this.outGatewayArry = [];
          this.formValidate.id = '';
          this.formValidate.createUser = localStorage.getItem('USER');
          //加载商品列表
          this.getGoodAllList(null, this.formValidate.requestRouteType, this.formValidate.requestChargeType);
          //加载价格包
          this.getPricePackageList(null, this.formValidate.requestRouteType, this.formValidate.requestChargeType);
          //加载关联销售列表
          this.getAllSalerList();
          //提交错误号码个数
          this.errorAmount = 0;
          //提交正确号码个数
          this.rigthAmount = 0;
          //获取订单已关联号码
          this.getOrderNumber();
          //获取可用号码
          this.numbArr = [];
          this.getALLNumberList();
          this.formValidate.importNumber = '';
          this.isAddMerchandise = false;
        }
        this.modal2 = true;
      },

      //显示详情页面
      showDetail(item) {

        var detail = JSON.parse(JSON.stringify(item));
        this.titleName = "订单详单";
        this.current = 0;
        this.formValidate.orderId = detail.orderId;
        this.pricePackageName = detail.pricePackageName;
        this.formValidate.orderExplain = detail.orderExplain;
        this.formValidate.orderRequestTypeId = detail.orderRequestType;
        this.formValidate.customName = detail.customName;
        this.saleman = detail.saleman;
        this.formValidate.operatorType = detail.operatorType;
        this.formValidate.usePlace = detail.usePlace;
        this.formValidate.status = detail.status;
        this.formValidate.requirementAmount = detail.requirementAmount;
        this.formValidate.requestRouteType = detail.requestRouteType;
        this.formValidate.requestChargeType = detail.requestChargeType;
        this.formValidate.requestCity = detail.requestCity;
        this.dockGatewayArry = [];
        if (detail.dockGateway) {
          this.$nextTick(function () {
            //立刻更新DOM
            this.dockGatewayArry = detail.dockGateway.split(",");
          })
        }
        this.outGatewayArry = [];
        if (detail.outGateway) {
          this.$nextTick(function () {
            //立刻更新DOM
            this.outGatewayArry = detail.outGateway.split(",");
          })
        }
        this.formValidate.createTime = detail.createTime;
        this.formValidate.id = detail.id;
        this.formValidate.createUser = detail.createUser;
        if (this.formValidate.requestChargeType == '0') {
          this.getGoodAllList(detail, this.formValidate.requestRouteType, this.formValidate.requestChargeType);
        } else {
          this.getGoodAllList(detail, this.formValidate.requestRouteType);
        }

        //关联号码
        this.getOrderNumber(detail);
        this.detailTap = 'name1';
        this.isDatailShow = true;
      },

      // 获取订单列表
      getOrderList() {
        this.noDataText = "加载中...";
        this.orderListLoad = true;
        fetchOrderList(
          {
            condition: this.condition,
            pageNo: this.pageNo,
            pageNum: this.pageNum,
            where: JSON.stringify(this.filter_where),
            beginTime: this.beginTime,
            endTime: this.endTime,
          }
        ).then((res) => {
          if (res.data.respCode == '0') {
            this.listData = res.data.list;
            this.totalCount = res.data.totalCount;
          }

          if (this.totalCount == 0) {
            this.noDataText = "暂无数据";
          }
          this.orderListLoad = false;
        }).catch((err) => {
          console.log(err)
          this.orderListLoad = false;
          this.noDataText = "暂无数据";
        })
      },

      //获取所有资源
      getGoodAllTypeList() {
        fetchGoodType(
          {}
        ).then((res) => {
          if (res.data.respCode == '0') {
            this.resourcesList = res.data.list;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //获取所有商品列表
      getGoodAllList(item, eType, chargeType) {
        //清空显示选项, 防止冲突
        this.goodDateList = [];
        this.goodDetailMap = [];
        this.datailGoods = [{
          type: '',
          thisNumb: null,
        }];
        this.oldDatailGoods = [];
        fetchgetAllGoodListOrder(
          {
            eType: eType,
            chargeType: chargeType
          }
        ).then((res) => {
          if (res.data.respCode == '0') {
            let goodDetailMap = new Map();
            let goodDataList = [];
            if (this.formValidate.status === '0') {
              let dpp_good = {
                "id": -1,
                "goodName": "待匹配"
              };
              goodDetailMap.set(dpp_good['id'], dpp_good);
              goodDataList.push(dpp_good);
            }

            let wzy_good = {
              "id": -2,
              "goodName": "无资源"
            };
            goodDetailMap.set(wzy_good['id'], wzy_good);
            goodDataList.push(wzy_good);

            res.data.list.forEach(function (n) {
              goodDetailMap.set(n.id, n);
            });

            goodDataList = goodDataList.concat(res.data.list);
            this.goodDetailMap = goodDetailMap;
            this.goodDateList = goodDataList;

            if (item) {
              //商品初始化
              let datailGoods = [];
              let goodarry = item.goods.split(";");
              var obj = {};
              for (var i = 0; i < goodarry.length; i++) {
                let type = parseInt(goodarry[i].split(',')[0]);
                let thisNumb = parseInt(goodarry[i].split(',')[1]);
                obj = {
                  type: type,
                  thisNumb: thisNumb
                };

                let detail = goodDetailMap.get(type);
                let goods_obj = {};
                if (detail) {
                  goods_obj = Object.assign({}, obj, detail)
                } else {
                  goods_obj = obj;
                }

                datailGoods.push(goods_obj);
              }
              this.datailGoods = JSON.parse(JSON.stringify(datailGoods));
              this.oldDatailGoods = JSON.parse(JSON.stringify(datailGoods));
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //获取订单场景
      getAllIndustryList() {
        fetchGetIndustryList(
          {}
        ).then((res) => {
          if (res.data.respCode == '0') {
            this.industryList = res.data.list;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //获取所有关联商务
      getAllSalerList(item) {
        fetchquerySaleMan(
          {
            roleName: "销售"
          }
        ).then((res) => {
          if (res.data.respCode == '0') {

            this.saleManList = res.data.list;
            if (item) {
              this.formValidate.salemanId = parseInt(item.salemanId);
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      },

      //获取所有落地网关
      getLandWayList() {
        //清空显示选项, 防止冲突
        this.outGatewayList = [];
        fetchGetLandGateWay().then((res) => {
          if (res.data.respCode == '0') {
            let outGatewayList = [];
            let dataList = res.data.list;

            //过滤重复的网关, 防止冲突
            if (dataList) {
              dataList.forEach(function (n) {
                if (-1 === this.oldOutGatewayArry.indexOf(n.name)) {
                  outGatewayList.push(n);
                }
              }, this)
            }
            this.outGatewayList = outGatewayList;
          }
        }).catch((err) => {
          console.log(err)
        })
      },

      //获取所有对接网关
      getJoinWayList() {
        //清空显示选项, 防止冲突
        this.dockGatewayList = [];
        fetchGetJoinGateWay().then((res) => {
          if (res.data.respCode == '0') {
            let dockGatewayList = [];
            let dataList = res.data.list;

            //过滤重复的网关, 防止冲突
            if (dataList) {
              dataList.forEach(function (n) {
                if (-1 === this.oldDockGatewayArry.indexOf(n.name)) {
                  dockGatewayList.push(n);
                }
              }, this)
            }
            this.dockGatewayList = dockGatewayList;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //获取所有销售价格包
      getPricePackageList(item, eType, chargeType) {

        fetchgetAllPricePackageOrder(
          {
            packageType: '2',
//            eType: eType,
//            chargeType: chargeType
          }
        ).then((res) => {
          if (res.data.respCode == '0') {
            let pricePackageList = [];
            if (this.formValidate.status === '0') {
              pricePackageList.push({
                id: -1,
                packageName: "待匹配"
              })
            }
            pricePackageList = pricePackageList.concat(res.data.list);
            this.pricePackageList = pricePackageList;
            if (item) {
              this.formValidate.pricePackage = parseInt(item.pricePackage);
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      },

      //获取所有客户
      getClientList() {
        // 获取客户列表
        fetchgetGetOrderCustomer({}).then(res => {
          if (res.data.respCode == '0') {
            this.customList = res.data.list;
          } else {
            this.$Message.error(res.data.msg);
          }
        })
          .catch(err => {
            console.log(err);
          });
      },

      //客户改变事件
      customerChange() {
        for (var i = 0; i < this.customList.length; i++) {
          if (this.formValidate.customId == this.customList[i].id) {
            this.formValidate.salemanId = parseInt(this.customList[i].saleManId);
            break;
          }
        }

      },
      //消费模式改变事件
      changeTypeChange() {
        //关联商品，销售包置空
        this.formValidate.pricePackage = "";
        //需求量字段置空
        this.formValidate.requirementAmount = "";

        //当是流量的时候，商品只是是流量类型的，当是包月的时候,商品可以是流量，也可以试包月
        if (this.formValidate.requestChargeType == '0') {
          this.getGoodAllList(null, this.formValidate.requestRouteType, this.formValidate.requestChargeType);
        }
        this.getGoodAllList(null, this.formValidate.requestRouteType, '');
        this.getPricePackageList(null, this.formValidate.requestRouteType, this.formValidate.requestChargeType);
      },

      //呼入呼出方式改变事件
      routeTypeChange() {
        //关联商品，销售包置空
        this.formValidate.pricePackage = "";
        this.dockGatewayArry = [];
        this.outGatewayArry = [];
        //当是流量的时候，商品只是是流量类型的，当是包月的时候,商品可以是流量，也可以试包月
        if (this.formValidate.requestChargeType == '0') {
          this.getGoodAllList(null, this.formValidate.requestRouteType, this.formValidate.requestChargeType);
        }
        this.getGoodAllList(null, this.formValidate.requestRouteType, '');
        this.getPricePackageList(null, this.formValidate.requestRouteType, this.formValidate.requestChargeType);
      },


      //商品库存判断，只有当修改订单，商品没有变化，商品个数不超过商品原先个数加原先库存
      changeInput(item, num) {
        if ((item.thisNumb != '') && (item.type != '')) {
          for (var i = 0; i < this.goodDateList.length; i++) {
            if (parseInt(item.type) == parseInt(this.goodDateList[i].id)) {
              if (this.goodDateList[i].chargeType == '1' && num < (this.oldDatailGoods.length - 1) && this.oldDatailGoods[num].type == item.type) {

                //商品数量不能大于库存
                if (parseInt(item.thisNumb) > (parseInt(this.oldDatailGoods[num].thisNumb) + parseInt(this.goodDateList[i].store))) {
                  item.thisNumb = null;
                  this.$Message.error("商品名称：" + this.goodDateList[i].goodName + "的库存不足");

                }
              } else {
                //新增订单的时候，商品数量不能大于库存
                if (parseInt(item.thisNumb) > parseInt(this.goodDateList[i].store)) {
                  item.thisNumb = null;
                  this.$Message.error("商品名称：" + this.goodDateList[i].goodName + "的库存不足");
                }

              }
            }
          }
        }
      },
      //关联商品修改时需要同时清空关联商品的数量
      goodChang(item, num) {
        // item.thisNumb = null;
        if ((item.thisNumb != '') && (item.type != '')) {
          for (var i = 0; i < this.goodDateList.length; i++) {
            if (parseInt(item.type) == parseInt(this.goodDateList[i].id)) {
              if (this.goodDateList[i].chargeType == '1' && num < (this.oldDatailGoods.length - 1) && this.oldDatailGoods[num].type == item.type) {
                //商品数量不能大于库存
                if (parseInt(item.thisNumb) > (parseInt(this.oldDatailGoods[num].thisNumb) + parseInt(this.goodDateList[i].store))) {
                  item.thisNumb = null;
                }
              } else {
                //新增订单的时候，商品数量不能大于库存
                if (parseInt(item.thisNumb) > parseInt(this.goodDateList[i].store)) {
                  item.thisNumb = null;
                }
              }
            }
          }
        }
      },

      //打开价格包详情
      showPriceDetail(id, packageType) {
        this.typeDetail = packageType;

        fetchPriceBasic({
          id: id
        }).then((res) => {
          if (res.data.respCode == '0') {
            this.priceTab = "priceTab1";
            this.priceMap = res.data.map;
            this.priceShow = true;
            this.isPrice = false;
            this.cu_packageType = packageType;
            this.cu_id = id;
          }
        }).catch((err) => {
          console.log(err)
        })
      },

      //关闭价格包详情
      closePriceDetail() {
        this.priceShow = false;
        this.isPrice = true;
      },

      tabClick() {
        if (this.priceTab == "priceTab1") {
          this.$Message.success("查询基本资料");
          fetchPriceBasic({
            id: this.cu_id
          }).then((res) => {
            if (res.data.respCode == '0') {
              this.priceMap = res.data.map;
            }
          }).catch((err) => {
            console.log(err)
          })
        } else if (this.priceTab == "priceTab2") {
          this.$Message.success("查询价格配置");
          fetchPriceDetail({
            id: this.cu_id
          }).then((res) => {
            if (res.data.respCode == '0') {
              this.priceMap = res.data.map;
            }
          }).catch((err) => {
            console.log(err)
          })
        } else if (this.priceTab == "priceTab3") {
          this.$Message.success("查询关联商品");
          fetchPriceLinkGood({
            id: this.cu_id
          }).then((res) => {
            if (res.data.respCode == '0') {
              this.priceDetailList = res.data.list;
            }
          }).catch((err) => {
            console.log(err)
          })
        } else if (this.priceTab == "priceTab4") {
          this.$Message.success("查询关联订单");
          fetchPriceLinkOrder({
            id: this.cu_id
          }).then((res) => {
            if (res.data.respCode == '0') {
              this.priceDetailList = res.data.list;
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      updataStatus(status, item) {
        fetchUpdateStatusOrder(
          {
            status: status,
            id: item.id
          }
        ).then((res) => {
          if (res.data.respCode == '0') {
            this.$Message.success(res.data.msg);
            this.modal2 = false;
            this.getOrderList();
          } else if (res.data.respCode == '1') {
            this.$Message.error(res.data.msg);
          }
        }).catch((err) => {
          console.log(err)
        })
      },

      //添加表单验证
      addValidate() {
        if (this.current == 0) {
          if (this.formValidate.customId == "") {
            this.$Message.info("客户名称不为空");
            return false;
          }
          ;
          if (this.formValidate.salemanId == "") {
            this.$Message.info("关联销售不为空");
            return false;
          }
        }
        if (this.current == 1) {
          if (this.formValidate.orderRequestTypeId == "") {
            this.$Message.info("商品类别不为空");
            return false;
          }
          if (this.formValidate.requestChargeType == "1" && this.formValidate.requirementAmount == '') {
            this.$Message.info("需求量不为空");
            return false;
          } else if (this.formValidate.requestChargeType == "1" && this.formValidate.requirementAmount != '') {
            if (!util.isInt(this.formValidate.requirementAmount)) {
              this.$Message.info("请填写正确的需求量");
              return false;
            }
          }
          if (this.requestCityList.length == 0) {
            this.$Message.info("城市不为空");
            return false;
          }

          if (this.formValidate.usePlace == '') {
            this.$Message.info("使用场景不为空");
            return false;
          }
        }
        if (this.current == 2) {

          if (this.formValidate.requestRouteType == '1' || this.formValidate.requestRouteType == '2') {
            if (this.dockGatewayArry.length == 0) {
              this.$Message.info("对接网关不为空");
              return false;
            } else {
              for (var i = 0; i < this.dockGatewayArry.length; i++) {
                if (this.dockGatewayArry[i] == '待匹配' && this.dockGatewayArry.length > 1) {
                  this.$Message.info("对接网关选择 【待匹配】，就不能再勾选其他网关");
                  return false;
                }
              }
            }
          }
          if (this.formValidate.requestRouteType == '0' || this.formValidate.requestRouteType == '2') {
            if (this.outGatewayArry.length == 0) {
              this.$Message.info("落地网关不为空");
              return false;
            } else {
              for (var i = 0; i < this.outGatewayArry.length; i++) {
                if (this.outGatewayArry[i] == '待匹配' && this.outGatewayArry.length > 1) {
                  this.$Message.info("落地网关选择 【待匹配】，就不能再勾选其他网关");
                  return false;
                }
              }
            }
          }
          if (this.datailGoods.length == 0) {
            this.$Message.info("关联商品不为空");
            return false;
          } else {
            for (var i = 0; i < this.datailGoods.length; i++) {
              if (this.datailGoods[i].type == '-1' && this.datailGoods.length > 1) {
                this.$Message.info("关联商品选择 【待匹配】，就不能再关联其他商品");
                return false;
              }
              if (this.datailGoods[i].type == '-2' && this.datailGoods.length > 1) {
                this.$Message.info("关联商品选择 【无资源】，就不能再关联其他商品");
                return false;
              }
              var count = 0;
              if (!util.isInt(this.datailGoods[i].thisNumb)) {
                this.$Message.info("请输入正确的商品个数");
                return false;
              }
              for (var j = 0; j < this.datailGoods.length; j++) {
                if (this.datailGoods[i].type == this.datailGoods[j].type) {
                  count++;
                  if (count == 2) {
                    this.$Message.info("同一商品不能重复添加");
                    return false;
                  }
                }
              }

            }
          }
        }
        if (this.current == 4 && this.formValidate.pricePackage == '') {
          this.$Message.info("价格包不为空");
          return false;
        }
        return true;
      },

      //获取定时任务
      getTimedTask(item) {
        fetchgetGetTimedTaskDetail({
          taskId: item.id,
          taskType: '0'
        }).then((res) => {
          if (res.data.respCode == '0') {
            if (res.data.map != null) {
              this.singleTime = true;
              this.timedPriceId = parseInt(res.data.map.priceId);
              this.timeValue = res.data.map.taskTime;
              this.formValidate.taskTime = res.data.map.taskTime;
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      },

      //定时时间变化函数
      timeChange(date) {
        this.formValidate.taskTime = JSON.parse(JSON.stringify(date));
      },

      //是否显示定时函数
      timeTaskShowChange() {
        this.timeValue = "";
        this.formValidate.taskTime = "";
      },

      // 表单验证
      handleSubmit(stutasType) {
        console.log(this.formValidate);
        console.log(this.numbchecked);
        console.log("_______________");
        if (stutasType == 3 && this.singleTime && this.formValidate.taskTime == '') {
          this.$Message.info("勾选定时生效，定时时间不能为空");
          return
        }

        if (stutasType == 3) {
          var stime = Date.parse(new Date());
          var etime = Date.parse(new Date(this.formValidate.taskTime));
          var usedTime = etime - stime;  //两个时间戳相差的毫秒数
          var minutes = Math.floor(usedTime / (60 * 1000));
          if (minutes < 30) {
            this.$Message.info("定时时间至少比现在多30分钟");
            return
          }
        }

        this.disable = true;
        if (stutasType == 1 || stutasType == 2 ) {
          let goodName = '';
          for (var i = 0; i < this.datailGoods.length; i++) {
            goodName = goodName + this.datailGoods[i].type + ',' + this.datailGoods[i].thisNumb + ';'
          }
          goodName = goodName.substring(0, goodName.length - 1);
          this.formValidate.goods = goodName;
          if (stutasType == 2 && this.formValidate.requestChargeType == '1' && this.formValidate.requirementAmount == '') {
            {
              this.$Message.info("需求量不为空");
              this.disable = false;
              return
            }
          }
          if (stutasType == 1 || stutasType == 4 ) {
              this.formValidate.numbers = '';
              if(this.numbchecked.length == 1){
                this.formValidate.numbers = "'" + this.numbchecked[0] + "'" ;
              }else if(this.numbchecked.length > 1){
                var arr = "";
                for(var i=0; i<this.numbchecked.length; i++){
                    arr += "'"+this.numbchecked[i] + "',";
                }
                this.formValidate.numbers = arr.substring(0,arr.length-1);
              }
          }

          if (stutasType != 2) {
            //城市字段处理
            if (this.requestCityList.length > 0) {
              if ("市辖区" == this.requestCityList[1]) {
                this.formValidate.requestCity = this.requestCityList[0];
              } else {
                this.formValidate.requestCity = this.requestCityList[1];
              }
              this.formValidate.requestCityList = this.requestCityList[0] + "," + this.requestCityList[1];
            }
          }

          //落地网关处理
          let out = '';
          for (var i = 0; i < this.outGatewayArry.length; i++) {
            out = out + this.outGatewayArry[i] + ',';
          }
          out = out.substring(0, out.length - 1);
          this.formValidate.outGateway = out;
          //对接网关处理
          let dockGate = '';
          for (var i = 0; i < this.dockGatewayArry.length; i++) {
            dockGate = dockGate + this.dockGatewayArry[i] + ',';
          }
          dockGate = dockGate.substring(0, dockGate.length - 1);
          this.formValidate.dockGateway = dockGate;
        }

        //调整售价判断有无定时任务
        if (stutasType == 3) {

          this.formValidate.pricePackage = this.timedPriceId;
          if (this.singleTime) {
            this.formValidate.isTimedTask = '1';
          }
        }


        //stutasType：1.修改需求， 2.调度资源 3.调整售价
        this.formValidate.stutasType = stutasType;
        if (this.formValidate.id == "") {
          if (this.addValidate()) {
            //添加表单提交
            fetchAddOrder(
              this.formValidate
            ).then((res) => {
              this.titleName = '';
              if (res.data.respCode == '0') {
                this.$Message.success(res.data.msg);
                this.modal2 = false;
                this.isDispatch = false;
                this.isPrice = false;
                this.getOrderList();
                this.disable = false;
              } else if (res.data.respCode == '1') {
                this.$Message.error(res.data.msg);
                this.disable = false;
              }

            }).catch((err) => {
              console.log(err)
              this.disable = false;
            })
          } else {
            this.disable = false;
          }
        } else {
          if (this.addValidate()) {
            //编辑表单提交
            fetchUpdateOrder(
              this.formValidate
            ).then((res) => {
              this.titleName = '';
              if (res.data.respCode == '0') {
                this.$Message.success(res.data.msg);
                this.modal2 = false;
                this.isDispatch = false;
                this.isPrice = false;
                this.getOrderList();
              } else if (res.data.respCode == '1') {
                this.$Message.error(res.data.msg);
              }
              this.disable = false;
            }).catch((err) => {
              console.log(err)
              this.disable = false;
            })
          } else {
            this.disable = false;
          }
        }
      },

      table_filter_change(col) {
        //重置操作
        if (col._filterChecked.length == 0) {
          this.filter_item.forEach(function (value, index) {
            if (value.key == col.key) {
              this.filter_item.splice(index, 1);
            }
          }, this);

          delete this.filter_where[col.key];
          this.pageNo = 1;
          this.getOrderList();
          return;
        }

        this.filter_where[col.key] = col.where;

        if (col.where) {
          let flag = false;
          let tmpcol = col;
          if (col.key == "status") {
            tmpcol.where = tmpcol.where.replace(/0/, "确认中").replace(/1/, "已确认").replace(/2/, "已取消").replace(/3/, "已终止").replace(/4/, "执行中").replace(/5/, "已暂停")
          } else if (col.key == "operatorType") {
            tmpcol.where = tmpcol.where.replace(/0/, "全网").replace(/1/, "移动").replace(/2/, "联通").replace(/3/, "电信")
          }
          this.filter_item.forEach(function (value, index) {
            if (col.key == value.key) {
              this.filter_item.splice(index, 1, tmpcol);
              flag = true;
            }
          }, this);

          if (!flag) {
            this.filter_item.push(tmpcol);
          }
        }
        this.pageNo = 1;
        this.getOrderList();
      },

      tag_close(event, name) {
        this.filter_item.forEach(function (value, index) {
          if (value.key == name) {
            value._filterChecked = [];
            value._isFiltered = false;
            this.filter_item.splice(index, 1);
            delete this.filter_where[value.key];
          }
        }, this);

        this.pageNo = 1;
        this.getOrderList();
      },
      errNumbCancel() {
        this.isErrNumb = false;
      },
      showErrNumModal() {
        this.isErrNumb = true;
      },
      delCheckNumb(item, index) {
        console.log('点击删除已选中的号码')
        this.numbchecked.splice(index, 1);
      },
      numberChange() {

      },
      ipmortNumb() {
        /*if (!util.numbers(this.formValidate.importNumber)) {
          this.$Message.info("导入号码请输入正确格式");
          return false;
        }*/
        var importNumbers = this.formValidate.importNumber.split(';');
        var inport = "";
        if(importNumbers.length == 1){
          inport = "'" + importNumbers[0] + "'" ;
        }else if(importNumbers.length > 1) {
          var arr = "";
          for (var i = 0; i < importNumbers.length; i++) {
            arr += "'" + importNumbers[i] + "';";
          }
          inport = arr.substring(0, arr.length - 1);
        }

        //导入号码提交按钮
        fetchcheckNumbers(
          {numbers : inport}
        ).then((res) => {
          if (res.data.respCode == '0') {
            let arr = res.data.map.rightList; //返回成功的数组
            this.rigthAmount = arr.length; //成功个数
            this.numbchecked = Array.from(new Set(this.numbchecked.concat(arr))); //合并数组并去重
            this.errorNumbText =  res.data.map.errorList; //返回的错误号码
            this.errorAmount = this.errorNumbText.length; //失败个数

          } else if (res.data.respCode == '1') {
            this.$Message.error(res.data.msg);
          }
          this.disable = false;
        }).catch((err) => {
          console.log(err)
        })
      },
      numbPageChange(page) {
//        点击分页页码
        this.iNowPage = page;
        this.getALLNumberList();
      },
      clearNumb() {
        this.numbchecked = [];
      },
      showDispatchNumb(item){
        var detail = JSON.parse(JSON.stringify(item));
        this.titleName = "调度号码";
        this.formValidate.id = detail.id;
        this.errorAmount = 0;
        this.rigthAmount = 0;
        //获取订单已关联号码
        this.getOrderNumber(item);
        //获取可用号码
        this.numbArr = [];
        this.getALLNumberList();
        this.formValidate.importNumber = '';
        this.isNumbDisplay = true;
      },
      closeDispatchNumb(){
        this.isNumbDisplay = false;
      },

      //获取订单关联号码
      getOrderNumber(item){
        //清空关联号码
        this.numbchecked = [];
        this.detailNumberList = [];
        if(item == null){
          return ;
        }
        //接口调用订单关联号码
        fetchgetOrderNumber(
          {id : item.id}
        ).then((res) => {
          if (res.data.respCode == '0') {
            //返回订单关联号码
            this.numbchecked =  res.data.map.list;
            this.detailNumberList = res.data.map.detailList;
          } else if (res.data.respCode == '1') {
            this.$Message.error(res.data.msg);
          }
        }).catch((err) => {
          console.log(err)
        })
      },

      //获取所有可用号码
      getALLNumberList(){
        fetchQueryALLNumberList(
          {
            condition : this.numberCondition,
            pageNo : this.iNowPage,
            pageNum : this.numbPageSize
          }
        ).then((res) => {
          if (res.data.respCode == '0') {
            this.numbArr =  res.data.map.list;
            this.numbTotal = res.data.totalCount;
            console.log(this.numbArr)
          } else if (res.data.respCode == '1') {
            this.$Message.error(res.data.msg);
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //调度号码
      submitNumber(){
        this.formValidate.numbers = '';
        if(this.numbchecked.length == 1){
          this.formValidate.numbers = "'" + this.numbchecked[0] + "'" ;
        }else if(this.numbchecked.length > 1){
          var arr = "";
          for(var i=0; i<this.numbchecked.length; i++){
            arr += "'"+this.numbchecked[i] + "',";
          }
          this.formValidate.numbers = arr.substring(0,arr.length-1);
        }

        fetchUpdateOrderNumber(
          {
            id:this.formValidate.id,
            numbers:this.formValidate.numbers
          }
        ).then((res) => {
          this.titleName = '';
          if (res.data.respCode == '0') {
            this.$Message.success(res.data.msg);
            this.isNumbDisplay = false;
            this.getOrderList();
          } else if (res.data.respCode == '1') {
            this.$Message.error(res.data.msg);
          }
        }).catch((err) => {
          console.log(err)
        })
      }

    }
  };
</script>
<style lang="less">

</style>
