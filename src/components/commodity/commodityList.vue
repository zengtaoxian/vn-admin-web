<style lang="less">
  @import "../../common/less/priceList.less";

  .select_list_div .ivu-tag-checked .ivu-icon-ios-close-empty {
    display: none;
  }

  .upload_div {
    width: 120px;
    display: inline-block;
    overflow: hidden;
    .ivu-upload-list {
      display: none;
    }
  }

  .ucload_modal {
    .ivu-modal-footer {
      display: block;
    }

  }

  .modal_link {
    color: #00b4ff;
    font-size: 14px;
    cursor: pointer;
  }

  .updata_now_tip {
    line-height: 30px;
    color: #666;
    padding-bottom: 12px;
  }
  .select_usage{
    .ivu-select-group-title{
      height: auto;
    }
  }
</style>
<template>
  <div class="box">
    <!--<div class="top">-->
    <!--<div class="inp">-->
    <!--<i-input placeholder="商品名称/资源类型/归属城市" icon="search" style: @on-change="search" v-model="condition"></i-input>-->
    <!--</div>-->
    <!--<div class="export"><img src="../../assets/export.jpg" alt="" @click="exportData(1)"></div>-->
    <!--<div id="btn">-->
    <!--<i-button type="primary" @click="showGoodAdd" class="btn">-->
    <!--<Icon type="plus-round"></Icon>&nbsp;&nbsp;新增商品-->
    <!--</i-button>-->
    <!--</div>-->
    <!--</div>-->

    <div class="main_header clear">
      <div class="input_wrap" v-if="havePerm('27')">
        <i-input placeholder="商品名称/商品编码/资源类型/归属城市" style: @on-enter="search" v-model.trim="condition"></i-input>
        <span class="search_btn" @click="search"><Icon type="ios-search-strong"></Icon></span>
      </div>

      <!--<div style="width:200px;display: inline-block">-->
      <!--<Cascader  v-model="cityDataVal" :data="cityData" filterable></Cascader>-->
      <!--</div>-->
      <!--{{cityDataVal}}-->
      <div class="header_btn" v-if="havePerm('40')">
        <i-button type="primary" @click="showGoodAdd">
          <Icon type="plus-round"></Icon>&nbsp;&nbsp;新增商品
        </i-button>
      </div>
      <!--<div class="upload_div" v-if="havePerm('40')">-->
      <!--<Upload :action="actionUrl" :on-success="uploadFileSuccess" :on-error="uploadFileError">-->
      <!--<Button type="ghost" icon="ios-cloud-upload-outline">导入商品</Button>-->
      <!--</Upload>-->
      <!--</div>-->
      <Button v-if="havePerm('40')" type="primary" style="margin-right: 20px;float: right;" @click="showUcload">导入商品
      </Button>

      <div class="export_btn" @click="exportData" v-if="havePerm('28')"></div>
    </div>


    <div class="new_tab_wrap" ref="new_tab_wrap" :style="{height:tabHeight+'px'}" style="position: relative">
      <div>
        <table class="new_table">
          <thead>
          <tr class="tab_th">
            <!--<th class="text_left pad_lf" width='40'>-->
            <!--<span class="chebox_btn" :class="checkAll?'active':''">-->
            <!--<span></span>-->
            <!--<input class="check_box_btn" type="checkbox" v-model="checkAll" @click="selectAllCheckBox">-->
            <!--</span>-->
            <!--</th>-->
            <th class="text_left pad_lf" width="70">序号</th>
            <th class="text_left pad_lf">商品编号</th>
            <th class="text_left pad_lf">商品名称</th>
            <!--<th class="text_left pad_lf">挂牌价</th>-->
            <!--<th class="text_left pad_lf">成本价</th>-->
            <!--<th class="text_left pad_lf">供应商</th>-->
            <th class="text_left pad_lf">归属城市</th>
            <th class="text_left pad_lf">归属运营商</th>
            <th class="text_left pad_lf">资源类型</th>
            <th class="text_left pad_lf">创建时间</th>
            <th class="text_left pad_lf">创建人</th>
            <th class="text_left pad_lf">最后上架时间</th>
            <th class="text_left pad_lf">最后下架时间</th>
            <th class="text_left pad_lf">状态</th>
            <th class="text_left pad_lf">库存</th>
            <th class="text_left pad_lf">关联订单</th>
            <th class="text_left pad_lf">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr class="tba_content" v-for="(item,index) in listData">
            <!--<td class="text_left pad_lf" width='40'>-->
            <!--<span class="chebox_btn" :class="item.checked?'active':''">-->
            <!--<span></span>-->
            <!--<input class="check_box_btn" v-model="item.checked" type="checkbox" @click="selectCheckBox(item)">-->
            <!--</span>-->
            <!--</td>-->
            <td class="pad_lf" v-html="index+1"></td>
            <td class="pad_lf" v-html="item.goodNo"></td>
            <td class="pad_lf" v-html="item.goodName"></td>
            <!--<td class="pad_lf" v-html="item.gp_packageName?item.gp_packageName:'-'"></td>-->
            <!--<td class="pad_lf" v-html="item.cb_packageName?item.cb_packageName:'-'"></td>-->
            <!--<td class="pad_lf" v-html="item.supplierName"></td>-->
            <td class="pad_lf" v-html="item.cityName"></td>
            <td class="pad_lf" v-html="item.supplyType"></td>
            <td class="pad_lf" v-html="item.typeName"></td>
            <td class="pad_lf" v-html="item.createTime"></td>
            <td class="pad_lf" v-html="item.createUser"></td>
            <td class="pad_lf" v-html="item.onTime?item.onTime:'-'"></td>
            <td class="pad_lf" v-html="item.offTime?item.offTime:'-'"></td>
            <td class="pad_lf" v-html="item.status"></td>
            <td class="pad_lf" v-html="item.store"></td>
            <td class="pad_lf" v-html="item.linkOrderCount"></td>
            <td class="pad_lf">
              <span class="tab_del_btn" @click="clickShowModal(item)"
                    v-if="havePerm('25') && item.status == '下架'">上架</span>
              <span class="tab_del_btn" @click="clickShowModal(item)"
                    v-if="havePerm('26') && item.status == '上架'">下架</span>
              <span class="tab_del_btn" @click="showDetail(item.id)" v-if="havePerm('192')">查看详情</span>
              <span class="tab_del_btn" @click="showGateway(item.id,item.store,item.gateJoin,item.gateLand,item.eType)"
                    v-if="havePerm('37')">调整网关</span>
              <span class="tab_del_btn"
                    @click="showGpPrice(item.id,item.guapaiId,item.chargeType,item.eType,item.gp_packageName,item.supplierName)"
                    v-if="havePerm('38')">调整挂牌价</span>
              <span class="tab_del_btn"
                    @click="showCbPrice(item.id,item.chengbenId,item.chargeType,item.eType,item.cb_packageName,item.supplierName)"
                    v-if="havePerm('39')">调整成本价</span>
              <span style="position: relative;" v-if="item.onTime == ''&& havePerm('285')">
                <Poptip
                  transfer
                  placement="top-end"
                  confirm
                  title="您确认删除这条内容吗？"
                  @on-ok="deleteGoods(item.id)"
                  @on-cancel="cancel">
                  <span class="tab_del_btn">删除</span>
                </Poptip>
              </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="page_btm_div" v-if="totalCount">
      <!--<div class="left_btn" v-show="checkBoxArr.length>0">-->
      <!--<span class="text">已选择<em v-html="checkBoxArr.length"></em>&nbsp;条</span>-->
      <!--<span class="span_btn" @click="updateOn()" v-if="havePerm('25')">上架</span>-->
      <!--<span class="span_btn" @click="updateOff()" v-if="havePerm('26')">下架</span>-->
      <!--</div>-->
      <Page class="page_iview_right" :total="totalCount" :page-size="pageNum" :current="pageNo"
            :page-size-opts="pageOpt" size="small"
            show-elevator show-sizer show-total placement="top" @on-change="getPageChange"
            @on-page-size-change="getPageSizeChange"></Page>
    </div>

    <Modal class="vertical-center-modal" v-model="modal2" :title="addGoodTitle" @on-ok="handleSubmit()"
           :scrollable="scrollable" :mask-closable="false"
           @on-cancel="handleReset()" width="700">
      <Steps :current="current" style="width: 60%;margin: 0 auto;padding:20px 40px;">
        <Step title="基本信息"></Step>
        <Step title="商品配置"></Step>
      </Steps>
      <div v-show="current == 0">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
          <Row>
            <Col span="22" offset="1" class="role">
            <FormItem class="ivu-form-item-required" label="商品名称">
              <Input v-model="formValidate.goodName" placeholder="2~50个字"></Input>
            </FormItem>

            <FormItem class="ivu-form-item-required" label="商品类别">
              <el-radio-group v-model="formValidate.goodType">
                <el-radio class="pricel_check" v-for="item in goodType" :label="item.id">{{item.typeName}}</el-radio>
              </el-radio-group>
            </FormItem>

            <FormItem class="ivu-form-item-required" label="计费类型">
              <el-radio-group v-model="formValidate.chargeType" size="small"
                              @change="getPriceListByType(formValidate.chargeType,formValidate.eType)">
                <el-radio-button label="0">流量</el-radio-button>
                <el-radio-button label="1">包月</el-radio-button>
              </el-radio-group>
            </FormItem>
            <FormItem class="ivu-form-item-required" label="归属运营商">
              <el-radio-group v-model="formValidate.supplyType" size="small">
                <el-radio-button label="0">移动</el-radio-button>
                <el-radio-button label="1">联通</el-radio-button>
                <el-radio-button label="2">电信</el-radio-button>
              </el-radio-group>
            </FormItem>
            <FormItem class="ivu-form-item-required" label="归属城市">
              <Cascader v-model='formValidate.city' :data="cityData" filterable></Cascader>
            </FormItem>

            <FormItem class="ivu-form-item-required" label="供应商">
              <Select v-model="formValidate.supplyerId" filterable transfer placeholder="请选择">
                <Option v-for="item in supplyerId" :value="item.id" :key="item.id">{{ item.supplierName }}</Option>
              </Select>
            </FormItem>
            <FormItem class="ivu-form-item-required" label="库存">
              <Input v-model="formValidate.store" placeholder="(E1条数)0~999999" :maxlength="6"></Input>
            </FormItem>
            <FormItem class="ivu-form-item-required" label="使用场景" style="margin-bottom:10px;">
              <Select multiple v-model="formValidate.usageArr" filterable placeholder='请选择'>
                <OptionGroup v-for="group in usageList" :key="group.name" :label="group.name" class="select_usage">
                  <Option v-for="item in group.options" :key="item.name" :label="item.name" :value="item.name">
                    {{ item.name }}
                  </Option>
                </OptionGroup>
              </Select>
            </FormItem>
            <FormItem class="margin_b" label="创建人">
              <div v-html="formValidate.createUser"></div>
            </FormItem>
            <FormItem class="ivu-form-item-required" label="初始状态">
              <div>下架中</div>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="22" offset="1">
            <div class="footer_modal">

              <Button type="ghost" class="sub_btn_size"
                      @click="handleReset('formValidate')">取消
              </Button>
              <Button type="primary" class="sub_btn_size"
                      @click="next('formValidate')">下一步
              </Button>
            </div>
            </Col>
          </Row>
        </Form>
      </div>
      <div v-show="current == 1">
        <Form ref="formValidate" :label-width="100">
          <Row>
            <Col span="22" offset="1" class="role">
            <FormItem class="ivu-form-item-required" label="线路类型">
              <el-radio-group v-model="formValidate.eType" size="small"
                              @change="getPriceListByType(formValidate.chargeType,formValidate.eType)">
                <el-radio-button label="0">呼入</el-radio-button>
                <el-radio-button label="1">呼出</el-radio-button>
                <el-radio-button label="2">呼出+呼入</el-radio-button>
              </el-radio-group>
            </FormItem>
            <FormItem v-if="formValidate.eType == 0 || formValidate.eType == 2" class="ivu-form-item-required "
                      label="对接网关">
              <Select multiple v-model="formValidate.joinGateArr" filterable transfer placeholder="请选择"
                      @on-change="gatewayChange">
                <Option v-for="item in joinGateList" :value="item.name" :key="item.name"
                        v-show="addGoodTitle === '新增商品' || (addGoodTitle === '编辑商品' && item.name !== '待匹配')">{{
                  item.name }}
                </Option>
              </Select>
            </FormItem>
            <FormItem v-if="formValidate.eType == 1 || formValidate.eType == 2" class="ivu-form-item-required "
                      label="落地网关">
              <Select multiple v-model="formValidate.landGateArr" filterable transfer placeholder="请选择"
                      @on-change="gatewayChange">
                <Option v-for="item in landGateList" :value="item.name" :key="item.name"
                        v-show="addGoodTitle === '新增商品' || (addGoodTitle === '编辑商品' && item.name !== '待匹配')">{{
                  item.name }}
                </Option>
              </Select>
            </FormItem>
            <FormItem class="ivu-form-item-required" label="挂牌价格包">
              <Select v-model="formValidate.guapaiId" filterable transfer placeholder="请选择">
                <Option v-for="item in packageTypeGp" :value="item.id" :key="item.id">{{ item.packageName }}</Option>
              </Select>
            </FormItem>

            <FormItem class="ivu-form-item-required" label="成本价格包">
              <Select v-model="formValidate.chengbenId" filterable transfer placeholder="请选择">
                <Option v-for="item in packageTypeCb" :value="item.id" :key="item.id">{{ item.packageName }}</Option>
              </Select>
            </FormItem>

            <FormItem label="商品说明">
              <!--<textarea class="commod_desc" v-model="formValidate.remark" placeholder="0~500个字"></textarea>-->
              <Input v-model="formValidate.remark" :maxlength="255" placeholder="0~255个字" type="textarea"
                     :autosize="{minRows: 2,maxRows: 5}"></Input>
            </FormItem>

            </Col>
          </Row>

          <Row>
            <Col span="22" offset="1">
            <div class="footer_modal">
              <Button type="ghost" class="sub_btn_size" @click="before">上一步</Button>
              <Button type="primary" class="sub_btn_size" @click="handleSubmit('formValidate')" v-html="(formValidate.id && formValidate.id != '')?'保存商品':'生成商品'"></Button>
            </div>
            </Col>
          </Row>
        </Form>
      </div>

    </Modal>


    <!-- 详情 开始 -->
    <Modal v-model="isDatailShow" class="detail_modal" width="680">
      <div>
        <div slot="header">
          <div class="detail_top clear">
            <img class="top_img" src="../../assets/images/client_img.png" alt="">
            <div class="detail_top_right">
              <p class="title" v-html="goodDetail.goodName"></p>
              <p class="code" v-html="goodDetail.status"></p>
            </div>
            <span @click="editShowGood(goodDetail.id)" class="top_btn" v-if="goodDetail.onTime == '' && havePerm('286')">
              <span class="btn">编辑</span>
            </span>
          </div>
        </div>
        <div>
          <Tabs :value="GoodTab" v-model="GoodTab" class="tabs_check" type="card" :animated="animated"
                @on-click="tabGoodClick">
            <TabPane label="基本资料" name="GoodTab1">
              <div class="tabs_detail_content_top">
                <ul class="tabs_detail_top_ul">
                  <li class="tabs_detail_top_li">
                    <h4 class="tabs_detail_top_title">商品类别</h4>
                    <div class="tabs_detail_top_text" v-html="goodDetail.typeName"></div>
                  </li>
                  <li class="tabs_detail_top_li">
                    <h4 class="tabs_detail_top_title">供应商</h4>
                    <div class="tabs_detail_top_text" v-html="goodDetail.supplierName"></div>
                  </li>
                  <li class="tabs_detail_top_li">
                    <h4 class="tabs_detail_top_title">状态</h4>
                    <div class="tabs_detail_top_text" v-html="goodDetail.status"></div>
                  </li>
                  <li class="tabs_detail_top_li">
                    <h4 class="tabs_detail_top_title">库存(E1条数)</h4>
                    <div class="tabs_detail_top_text" v-html="goodDetail.store"></div>
                  </li>
                </ul>
              </div>
              <div class="tabs_detail_con">
                <ul class="tabs_detail_con_ul">
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/money_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg" v-html="goodDetail.chargeType"></p>
                      <p class="tdetail_msg_text">计费类型</p>
                    </div>
                  </li>
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/operator_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg" v-html="goodDetail.supplyType"></p>
                      <p class="tdetail_msg_text">归属运营商</p>
                    </div>
                  </li>
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/address_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg" v-html="goodDetail.cityName"></p>
                      <p class="tdetail_msg_text">归属城市</p>
                    </div>
                  </li>
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/scenes_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg" v-html="goodDetail.usage"></p>
                      <p class="tdetail_msg_text">使用场景</p>
                    </div>
                  </li>
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/desc_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg" v-html="goodDetail.remark?goodDetail.remark:'-'"></p>
                      <p class="tdetail_msg_text">商品说明</p>
                    </div>
                  </li>
                  <li class="tabs_detail_con_li">
                    <img class="tabs_detail_icon" src="../../assets/images/people_icon.png" alt="">
                    <div class="tabs_detail_right">
                      <p class="tabs_msg" v-html="goodDetail.createUser"></p>
                      <p class="tdetail_msg_text">创建人</p>
                    </div>
                  </li>
                </ul>
              </div>
            </TabPane>

            <TabPane label="商品配置" name="GoodTab2">
              <div class="tab_content">
                <div class="tab_line clear">
                  <div class="tab_line_left">挂牌价格包</div>
                  <div class="tab_line_right" v-html="goodDetail.gp_packageName?goodDetail.gp_packageName:'待匹配'"></div>
                </div>
                <div class="tab_line clear">
                  <div class="tab_line_left">成本价格包</div>
                  <div class="tab_line_right" v-html="goodDetail.cb_packageName?goodDetail.cb_packageName:'待匹配'"></div>
                </div>
                <div class="tab_line clear">
                  <div class="tab_line_left">线路类型</div>
                  <div class="tab_line_right" v-html="goodDetail.eTypeName"></div>
                </div>
                <div class="tab_line clear" v-if="goodDetail.eType == 1 || goodDetail.eType == 2">
                  <div class="tab_line_left">落地网关</div>
                  <div class="tab_line_right" v-html="goodDetail.gateLand?goodDetail.gateLand:'待匹配'"></div>
                </div>
                <div class="tab_line clear" v-if="goodDetail.eType == 0 || goodDetail.eType == 2">
                  <div class="tab_line_left">对接网关</div>
                  <div class="tab_line_right" v-html="goodDetail.gateJoin?goodDetail.gateJoin:'待匹配'"></div>
                </div>
              </div>
            </TabPane>
            <TabPane label="关联订单" name="GoodTab3">
              <ul class="home_small_ul">
                <li v-if="linkOrderList.length>0" v-for="item in linkOrderList">
                  <h2 class="name">{{item.orderId}}<span class="phone">{{item.createTime}}</span></h2>
                  <p class="desc">需求资源：{{item.orderRequestType}}</p>
                  <p class="desc">商品数量：{{item.count}}</p>
                </li>
                <li v-if="linkOrderList.length == 0" class="default_li">关联订单数量为空</li>
              </ul>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Modal>

    <!-- 详情 结束 -->

    <!-- 编辑网关 开始 -->
    <Modal v-model="isGateway" title="编辑网关" @on-ok="hideGateway" :mask-closable="false" @on-cancel="hideGateway" width="640">
      <Form ref="formValidate" :label-width="150">
        <Row>
          <Col span="22" offset="1" class="role">
          <FormItem class="ivu-form-item-required" label="库存(E1条数)" >
            <Input v-model="formValidate.store" placeholder="E1条数 0~999999" :maxlength="6"></Input>
          </FormItem>
          <FormItem v-if="formValidate.eType == 0 || formValidate.eType == 2" class="ivu-form-item-required "
                    label="对接网关">
            <Select class="select_list_div" multiple v-model="formValidate.joinGateArr" filterable transfer
                    placeholder="请选择" @on-change="gatewayChange">
              <Option v-for="item in joinGateList" :value="item.name" :key="item.name" :disabled="item.disabled"
                      v-show="item.name !== '待匹配'">
                {{ item.name }}
              </Option>
            </Select>
          </FormItem>

          <FormItem v-if="formValidate.eType == 1 || formValidate.eType == 2" class="ivu-form-item-required"
                    label="落地网关">
            <Select class="select_list_div" multiple v-model="formValidate.landGateArr" filterable transfer
                    placeholder="请选择" @on-change="gatewayChange">
              <Option v-for="item in landGateList"
                      :value="item.name"
                      :key="item.name"
                      :disabled="item.disabled"
                      v-show="item.name !== '待匹配'">
                {{ item.name }}
              </Option>
            </Select>
          </FormItem>

          </Col>
        </Row>
        <Row>
          <Col span="22" offset="1">
          <div class="footer_modal">
            <Button type="ghost" class="sub_btn_size" @click="hideGateway">取消</Button>
            <Button type="primary" class="sub_btn_size" @click="updateWg">保存</Button>
          </div>
          </Col>
        </Row>
      </Form>
    </Modal>
    <!-- 编辑网关 结束 -->

    <!-- 调整挂牌价 开始 -->
    <Modal v-model="isGpPrice" :title="priceTitle" :mask-closable="false" @on-ok="hideGpPrice" @on-cancel="hideGpPrice" width="640">
      <Form ref="formValidate" :label-width="100">
        <Row>
          <Col span="20" offset="1" class="role">
          <FormItem class="" style="margin-bottom: 0px;" label="供应商">{{supplierName}}</FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20" offset="1" class="role">
          <FormItem class="" style="margin-bottom: 10px;" label="原挂牌价">{{gp_packageName}}
            <span style="display: inline-block;color:#00b4ff;cursor: pointer;line-height: 32px;padding-left: 24px;"
                  @click="showPriceDetail(formValidate.guapaiId,'1')"
                  v-if="formValidate.guapaiId!='' && formValidate.guapaiId!='0'">详情</span>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20" offset="1" class="role">
          <FormItem class="ivu-form-item-required" style="margin-bottom: 10px;" label="挂牌价格包">
            <Select v-model="timedPriceId" filterable transfer placeholder="请选择">
              <Option v-for="item in packageTypeGp" :value="item.id" :key="item.id" v-if="item.id != 0">{{ item.packageName }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="2">
          <span style="float: right;color:#00b4ff;cursor: pointer;line-height: 32px;"
                @click="showPriceDetail(timedPriceId,'1')" v-if="timedPriceId!='' && timedPriceId!='0'">详情</span>
          </Col>
        </Row>
        <Row>
          <Col span="20" offset="1" class="role">
          <FormItem class="" style="margin-bottom: 10px;" label=" ">
            <Checkbox v-model="listedTime" @on-change="timeTaskShowChange">定时生效<em style="color: #999">(不勾选立即生效)</em>
            </Checkbox>
          </FormItem>
          </Col>
        </Row>
        <Row v-if="listedTime">
          <Col span="20" offset="1" class="role">
          <FormItem label=" ">
            <DatePicker :value="timeValue" format="yyyy-MM-dd HH:mm:ss" @on-change="timeChange" type="datetime"
                        placeholder="请选择生效时间" style="width: 100%;"></DatePicker>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22" offset="1">
          <div class="footer_modal">
            <Button type="ghost" class="sub_btn_size" @click="hideGpPrice">取消</Button>
            <Button type="primary" class="sub_btn_size" @click="updateGp">保存</Button>
          </div>
          </Col>
        </Row>
      </Form>
    </Modal>

    <!-- 调整成本价 -->
    <Modal v-model="isCbPrice" :title="priceTitle" :mask-closable="false" @on-ok="hideCbPrice()" @on-cancel="hideCbPrice" width="640">
      <Form ref="formValidate" :label-width="100">
        <Row>
          <Col span="20" offset="1" class="role">
          <FormItem class="" style="margin-bottom: 0px;" label="供应商">{{supplierName}}</FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20" offset="1" class="role">
          <FormItem class="" style="margin-bottom: 10px;" label="原成本价">{{cb_packageName}}
            <span style="display: inline-block;color:#00b4ff;cursor: pointer;line-height: 32px;padding-left: 24px;"
                  @click="showPriceDetail(formValidate.chengbenId,'0')"
                  v-if="formValidate.chengbenId!='' && formValidate.chengbenId!='0'">详情</span>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20" offset="1" class="role">
          <FormItem class="ivu-form-item-required" style="margin-bottom: 10px;" label="成本价格包">
            <Select v-model="timedPriceId" filterable transfer placeholder="请选择">
              <Option v-for="item in packageTypeCb" :value="item.id" :key="item.id" v-if="item.id != 0">{{ item.packageName }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="2">
          <span style="float: right;color:#00b4ff;cursor: pointer;line-height: 32px;"
                @click="showPriceDetail(timedPriceId,'0')" v-if="timedPriceId!='' && timedPriceId!='0'">详情</span>
          </Col>
        </Row>
        <Row>
          <Col span="20" offset="1" class="role">
          <FormItem class="" style="margin-bottom: 10px;" label=" ">
            <Checkbox v-model="listedTime" @on-change="timeTaskShowChange">定时生效<em style="color: #999">(不勾选立即生效)</em>
            </Checkbox>
          </FormItem>
          </Col>
        </Row>
        <Row v-if="listedTime">
          <Col span="20" offset="1" class="role">
          <FormItem label=" ">
            <DatePicker :value="timeValue" format="yyyy-MM-dd HH:mm:ss" @on-change="timeChange" type="datetime"
                        placeholder="请选择生效时间" style="width: 100%;"></DatePicker>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="22" offset="1">
          <div class="footer_modal">
            <Button type="ghost" class="sub_btn_size" @click="hideCbPrice">取消</Button>
            <Button type="primary" class="sub_btn_size" @click="updateCb">保存</Button>
          </div>
          </Col>
        </Row>
      </Form>
    </Modal>
    <!-- 调整挂牌价/调整成本价 结束 -->

    <!-- ===========================================查看价格包的详情 ================================================ -->
    <Modal v-model="priceShow" class="detail_modal" width="740">
      <!--<div :style="{display:priceShow?'block':'none'}" class="detail_alert" style="display:none">-->
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
                <table class="new_table" border="1" style="border:#e9eaec solid 1px;">
                  <tr>
                    <th class="text_left pad_lt" width="60">资费项</th>
                    <th class="text_left pad_lt" width="210">类型选择</th>
                    <th colspan="2" class="text_left pad_lt" width="310">价格项(元)配置金额包含6%税点</th>
                  </tr>
                  <tr class="tab_content" v-if="priceMap.chargeType == '1' ">
                    <th class="text_left pad_lt" width="60">月租(不含低消)</th>
                    <th class="text_left pad_lt" width="210">按天折算,单条E1月租(不含号码月租)</th>
                    <th colspan="2" class="text_left pad_lt" width="310" v-html="priceMap.monthFee+'元/月'"></th>
                  </tr>
                  <tr class="tab_content" v-if="priceMap.chargeType == '1' ">
                    <th class="text_left pad_lt" width="60">低消</th>
                    <th class="text_left pad_lt" width="210">按天折算,单条E1低消(不含号码低消)</th>
                    <th colspan="2" class="text_left pad_lt" width="310" v-html="priceMap.minFee+'元/月'"></th>
                  </tr>
                  <tr class="tab_content" v-if="priceMap.eType == '0' || priceMap.eType == '2'">
                    <th class="text_left pad_lt" width="60">呼入</th>
                    <th class="text_left pad_lt" width="210">
                      <span class="detail_disable" v-html="priceMap.callInFeeName"></span>
                    </th>
                    <th colspan="2" class="text_left pad_lt" width="310" v-html="priceMap.callInFeeNameDetail"></th>
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
                    <h2 class="name">{{item.goodNo}}<span class="phone">{{item.status}}</span></h2>
                    <p class="desc">供应商：{{item.supplierName}}</p>
                    <p class="desc">资源类型：{{item.typeName}}</p>
                  </li>
                  <li v-if="priceDetailList.length == 0" class="default_li">关联商品数量为空</li>
                </ul>
              </div>
            </TabPane>

            <TabPane v-if="cu_packageType == '2'" label="关联订单" name="priceTab4">
              <ul class="home_small_ul">
                <li v-if="priceDetailList.length>0" v-for="item in priceDetailList">
                  <h2 class="name">{{item.orderId}}<span class="phone"
                                                         v-html="item.status?item.status:'-'">{{item.status}}</span>
                  </h2>
                  <p class="desc" v-html="'需求资源：'+item.orderRequestType?item.orderRequestType:'-'"></p>
                  <p class="desc" v-html="'执行时间：'+item.createTime?item.createTime:''"></p>
                </li>
                <li v-if="linkGoodlistData.length == 0" class="default_li">关联订单数量为空</li>
              </ul>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Modal>

    <!-- ===========================================查看价格包详情结束 ============================================== -->

    <Modal v-model="ucploadModal2" :mask-closable="false" width="360">
      <p slot="header" style="color:#00b4ff;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>商品导入</span>
      </p>
      <div style="text-align:center">
        <div style="padding:10px 0 20px;">
          <div style="display: inline-block;overflow: hidden" @click="exportExcallDown">
            <Button>下载模板</Button>
          </div>
          <div class="upload_div" v-if="havePerm('40')">
            <Upload :action="actionUrl" :on-success="uploadFileSuccess" :on-error="uploadFileError" accept=".xlsx,.xls">
              <Button type="primary" icon="ios-cloud-upload-outline">导入商品</Button>
            </Upload>
          </div>
        </div>
      </div>
    </Modal>

    <Modal v-model="ucploadModal" :mask-closable="false" width="360" class="ucload_modal">
      <p slot="header" style="color:#00b4ff;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>商品导入</span>
      </p>
      <div style="text-align:center">
        <p>{{ucploadMsg}}<span class="modal_link" @click="goToexport">导出失败数据</span></p>
        <p></p>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="oKModal">确定</Button>
      </div>
    </Modal>

    <Modal
      v-model="updateNow"
      title="通知"
      :mask-closable="false"
      @on-cancel="cancel">
      <Row>
        <Col>
        <p class="updata_now_tip">输入需要提醒人的邮箱，通过英文分号';'区分多个邮箱，不输入则不提醒</p>
        </Col>
      </Row>
      <Row style="margin-bottom: 10px;">
        <Col>
        <Input v-model="remindEmail" placeholder="请输入要提醒人的邮箱"></Input>
        </Col>
      </Row>
      <div class="footer_modal">
        <Button type="ghost" class="sub_btn_size">取消</Button>
        <Button type="primary" class="sub_btn_size" @click="subUpdata()">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {mapGetters} from "vuex";
  import * as api from "@/api/api"
  import * as util from "../../common/js/util.js"
  import {cityData} from "../../common/js/cityData.js"

  export default {
    data() {
      return {
        addGoodTitle: '新增商品',
        updateObj: {
          status: '',
          id: ''
        },
        /*定时任务*/
        gp_packageName: '',
        cb_packageName: '',
        timeValue: '',
        supplierName: '',
        timedPriceId: '',
        remindEmail: '',
        updateNow: false,
        listedTime: true,
        costTime: true,
        cityData: cityData,
        cityDataVal: ["山西", "长治"],
        operation: '',
        ucploadModal: false,
        ucploadModal2: false,
        ucploadMsg: '',
        actionUrl: '/vcloud/goodManage/good/uploadGoodExcel',
        disabled: true,
        animated: false,
        clearable: true,
        tabHeight: 500,
        typeDetail: '',
        isDatailShow: false,
        isPrice: false,
        priceTitle: '',
        listData: [],
        totalCount: 0,
        pageNo: 1,
        pageNum: util.pageSize,
        pageOpt: util.pageOpt,
        condition: '',
        isGateway: false,
        isGpPrice: false,
        isCbPrice: false,
        stockNumb: null,
        checkAll: false,
        checkBoxArr: [],
        goodType: [],
        supplyerId: [],
        packageTypeCb: [],
        packageTypeGp: [],
        landGateList: [],
        joinGateList: [],
        goodDetail: {},
        res1: [],
        model121: [],
        modal2: false,
        current: 0,
        scrollable: false,
        modal1: false,
        cu_guapaiId: '',
        cu_chengbenId: '',
        initFormValidate: {},
        canOff: "0",
        canOn: "0",
        priceShow: false,
        priceTab: "priceTab1",
        GoodTab: "GoodTab1",
        priceDetailList: [],
        priceMap: {},
        cu_packageType: "",
        cu_id: "",
        cu_goodId: "",
        linkOrderList: [],
        oldJoinWay: [],
        oldLandWay: [],
        usageList: [],

        formValidate: {
          id: '',
          goodNo: '',
          goodName: '',
          cityName: '',
          cityId: '',
          name: '',
          serviceTypeId: [],
          typeBtn: 1,
          chargeType: '0',
          supplyType: '0',
          createUser: '',
          packageType: '',
          goodType: '',
          supplyerId: '',
          store: '',
          usage: '',
          eType: '1',
          guapaiId: '',
          chengbenId: '',
          gateJoin: '',
          gateLand: '',
          remark: '',
          status: '',
          usageArr: [],
          landGateArr: [],
          joinGateArr: [],
          city: [],
          /*定时任务*/
          taskTime: '',
          isTimedTask: '0'
        },
        inboundList: [
          {
            value: 'New York',
            label: 'New York'
          },
          {
            value: 'London',
            label: 'London'
          },
          {
            value: 'Sydney',
            label: 'Sydney'
          }
        ],
        options3: [
          {
            label: '生活服务',
            options: [{
              value: '婚恋交友',
              label: '婚恋交友'
            }, {
              value: 'O2O营销',
              label: 'O2O营销'
            }]
          },
          {
            label: '教育',
            options: [{
              value: '学前教育',
              label: '学前教育'
            }, {
              value: '成人教育',
              label: '成人教育'
            }, {
              value: '技术培训',
              label: '技术培训'
            }, {
              value: '英语培训',
              label: '英语培训'
            }]
          }
        ],
        value7: [],
        ruleValidate: {
          // goodName: [
          //   { required: true, message: 'not emapty', trigger: 'blur' }
          // ],
          // city: [
          //   { required: true, message: '不能为空', trigger: 'blur' }
          // ]
          // supplyerId: [
          //   { required: true, message: '不能为空', trigger: 'blur' }
          // ],
          // store: [
          //   { required: true, message: '不能为空', trigger: 'blur' }
          // ],
          // usageArr: [
          //   { required: true, message: '不能为空', trigger: 'blur' }
          // ]
        },
        columns1: [
          {
            title: 'Name',
            key: 'index',
            type: 'index'
          },
          {
            title: '订单编号',
            key: 'name'
          },
          {
            title: '订单名称',
            key: 'age'
          }
        ],
        data1: [
          {
            name: 'John Brown',
            age: 18,
            address: 'New York No. 1 Lake Park',
            date: '2016-10-03'
          },
          {
            name: 'Jim Green',
            age: 24,
            address: 'London No. 1 Lake Park',
            date: '2016-10-01'
          }
        ]
      };
    },
    computed: mapGetters(
      {
        perm_info: "main/perm_info",
        Authorization: "login/token",
        createUser: "login/userName"
      }
    ),
    created() {
      this.tabHeight = (document.documentElement.clientHeight - 160 - 40);
      this.getGoodList();
      this.initFormValidate = JSON.parse(JSON.stringify(this.formValidate));
      this.actionUrl = '/vcloud/goodManage/good/uploadGoodExcel?Authorization=' + this.Authorization + '&createUser=' + this.createUser;
      this.getcity();
    },
    methods: {
      gatewayChange(item) {
        if (item && item.length > 1) {
          let idx = item.indexOf("待匹配");
          if (idx !== -1) {
            item.splice(idx, 1);
          }
        }
      },
      havePerm(id) {
        return this.perm_info.indexOf(id) != -1;
      },
      handleReset(name) {
        this.modal2 = false;
        this.formValidate = JSON.parse(JSON.stringify(this.initFormValidate));
      },
      cancel() {
//        this.$Message.info("点击了取消");
      },
      exportData(type) {
        if(this.totalCount == 0){
          this.$Message.error("数据为空，不能导出");
          return
        }
        api.DownLoadFile({
          url: '/vcloud/goodManage/good/exportGoodList', data: {
            condition: this.condition
          }
        });
      },
      closeDetail() {
        this.isDatailShow = false;
      },
      showDetail(id) {
        api.fetchGoodDetail({
          id: id
        }).then((res) => {

          if (res.data.respCode == '0') {
            this.goodDetail = res.data.map;
            this.isDatailShow = true;
            this.GoodTab = "GoodTab1";
            this.cu_goodId = id;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //修改挂牌价格包
      showGpPrice(id, guapaiId, chargeType, eType, gp_packageName, supplierName) {
        this.getGpPriceList(chargeType, eType);
        this.priceTitle = '调整挂牌价';
        this.cu_guapaiId = id;
        this.formValidate.guapaiId = parseInt(guapaiId) ? parseInt(guapaiId) : '';
        if(gp_packageName == ''|| gp_packageName == null){
          this.gp_packageName = '待匹配';
        }else{
          this.gp_packageName = gp_packageName;
        }
        this.listedTime = false;
        this.formValidate.taskTime = "";
        this.timeValue = "";
        this.formValidate.isTimedTask = '0';
        this.supplierName = supplierName;
        this.timedPriceId = '';
        this.getTimedTask(id, '1');
        this.isGpPrice = true;
      },
      //修改成本价格包
      showCbPrice(id, chengbenId, chargeType, eType, cb_packageName, supplierName) {
        this.getCbPriceList(chargeType, eType);
        this.priceTitle = '调整成本价';
        this.isCbPrice = true;
        this.cu_chengbenId = id;
        if(cb_packageName == '' || cb_packageName == null){
          this.cb_packageName = '待匹配';
        }else{
          this.cb_packageName = cb_packageName;
        }
        this.listedTime = false;
        this.formValidate.taskTime = "";
        this.timeValue = "";
        this.formValidate.isTimedTask = '0';
        this.supplierName = supplierName;
        this.timedPriceId = '';
        this.getTimedTask(id, '2');
        this.formValidate.chengbenId = parseInt(chengbenId) ? parseInt(chengbenId) : '';
      },
      before() {
        if (this.current == 1) {
          this.current = 0;
        } else {
          this.current -= 1;
        }
      },
      next(name) {
        if (this.current == 1) {
          this.current = 0;
        } else {

          var flag = this.addGoodValidateData1();
          if (!flag) {
            return false;
          } else {
            this.current += 1;
          }

        }
      },
      showGateway(id, store, gateJoin, gateLand, etype) {
        this.getLandWayList(gateLand);
        this.getJoinWayList(gateJoin);
        this.isGateway = true;
        //网关窗口显示
        this.formValidate.eType = etype;
        this.formValidate.id = id;

        this.formValidate.store = store;
      },
      hideGateway() {
        this.isGateway = false;
      },
      hideGpPrice() {
        this.isGpPrice = false;
      },
      hideCbPrice() {
        this.isCbPrice = false;
      },
      getGoodList() {
        api.fetchGoodList(
          {
            condition: this.condition,
            pageNo: this.pageNo,
            pageNum: this.pageNum
          }
        ).then((res) => {
          if (res.data.respCode == '0') {
            this.listData = res.data.list;
            this.totalCount = res.data.totalCount;
            this.checkAll = false;
            this.checkBoxArr = [];
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      search() {
        this.pageNo = 1;
        this.getGoodList();
      },
      subUpdata() {
        // 上下架保存操作
        console.log("提交数据");
        let email = this.remindEmail;
        if (email != '') {
          let emailArr = email.split(";");
          for (var i = 0; i < emailArr.length; i++) {
            if (!util.isEmail(emailArr[i])) {
              this.$Message.info("您输入的邮箱格式有误，请重新输入");
              return;
            }
          }
        }
        if (this.updateObj.status == '上架') {
          this.clickUpdateOff(this.updateObj)
        } else if (this.updateObj.status == '下架') {
          this.clickUpdateOn(this.updateObj);
        }
      },
      clickShowModal(item) {
        //点击上下架按钮显示弹窗框
        this.updateObj.status = item.status;
        this.updateObj.id = item.id;
        this.remindEmail = '';
        if (item.status == '上架') {
          //当前状态==上架，就是要下架

          if (item.linkOrderCount > 0) {
            this.$Message.info("上架中的商品关联了订单无法下架");
            return
          }
        } else if (item.status == '下架') {
          //当前状态==下架，就是要上架

          if (item.guapaiId == '0' || item.chengbenId == '0') {
            this.$Message.info("商品存在待配置项,不可上架");
            return
          }
        }
        this.updateNow = true;
      },
      clickUpdateOn(item) {
        //上架

        this.formValidate.createUser = localStorage.getItem('USER');
        api.fetchGoodUpdateStatusOn({
          id: item.id,
          email: this.remindEmail,
          createUser: this.formValidate.createUser
        }).then((res) => {
          if (res.data.respCode == '0') {
            this.$Message.success(res.data.msg);
            this.getGoodList();
          } else {
            this.$Message.info(res.data.msg);
          }
          this.updateNow = false;
        }).catch((err) => {
          console.log(ere)
        })
      },
      clickUpdateOff(item) {
        //下架

        if (item.linkOrderCount > 0) {
          this.$Message.info("上架中的商品关联了订单无法下架");
          return
        }

        this.formValidate.createUser = localStorage.getItem('USER');
        api.fetchGoodupdateStatusOff({
          id: item.id,
          email: this.remindEmail,
          createUser: this.formValidate.createUser
        }).then((res) => {
          if (res.data.respCode == '0') {
            this.$Message.success(res.data.msg);
            this.getGoodList();
          } else {
            this.$Message.info(res.data.msg);
          }
          this.updateNow = false;
        }).catch((err) => {
          console.log(ere)
        })
      },
      updateOn() {
        if (!this.checkBoxArr.length) {
          this.$Message.info("请先选择");
          return
        }
        for (let i = 0; i < this.listData.length; i++) {
          if (this.listData[i].checked && (this.listData[i].guapaiId == '0' || this.listData[i].chengbenId == '0')) {
            this.canOn = "1";//代表不可上架
            break
          }
        }

        if (this.canOn == "1") {
          this.canOn = "0";
          this.$Message.info("商品存在待配置项,不可上架");
          return
        }

        var id = this.checkBoxArr.join(',');
        this.formValidate.createUser = localStorage.getItem('USER');
        api.fetchGoodUpdateStatusOn({
          id: id,
          createUser: this.formValidate.createUser
        }).then((res) => {
          if (res.data.respCode == '0') {
            this.$Message.success(res.data.msg);
            this.getGoodList();
          } else {
            this.$Message.info(res.data.msg);
          }
        }).catch((err) => {
          console.log(ere)
        })
      },
      updateOff(id) {

        if (!this.checkBoxArr.length) {
          this.$Message.info("请先选择");
          return
        }

        for (let i = 0; i < this.listData.length; i++) {
          if (this.listData[i].checked && this.listData[i].linkOrderCount > 0) {
            this.canOff = "1";//代表不可下架
            break
          }
        }

        if (this.canOff == "1") {
          this.canOff = "0";
          this.$Message.info("上架中的商品关联了订单无法下架");
          return
        }


        var id = this.checkBoxArr.join(',');
        this.formValidate.createUser = localStorage.getItem('USER');
        api.fetchGoodupdateStatusOff({
          id: id,
          createUser: this.formValidate.createUser
        }).then((res) => {
          if (res.data.respCode == '0') {
            this.$Message.success(res.data.msg);
            this.getGoodList();
          } else {
            this.$Message.info(res.data.msg);
          }
        }).catch((err) => {
          console.log(ere)
        })
      },
      selectAllCheckBox() {
        //全选
        if (this.checkAll) {
          this.checkAll = false;
          this.checkBoxArr = [];
          for (let i = 0; i < this.listData.length; i++) {
            this.listData[i].checked = false;
          }
        } else {
          this.checkAll = true;
          for (let i = 0; i < this.listData.length; i++) {
            this.listData[i].checked = true;
            this.checkBoxArr.push(this.listData[i].id);
          }
        }
      },
      selectCheckBox(item) {
        if (item.checked) {
          item.checked = false;
          var index = this.checkBoxArr.indexOf(item.id);
          if (index != -1) {
            this.checkBoxArr.splice(index, 1);
          }
          this.checkAll = false;
        } else {
          item.checked = true;
          this.checkBoxArr.push(item.id);
          for (let i = 0; i < this.listData.length; i++) {
            if (!this.listData[i].checked) {
              this.checkAll = false;
              break;
            } else {
              this.checkAll = true;
            }
          }

        }
      },
      showGoodAdd() {
        this.formValidate = JSON.parse(JSON.stringify(this.initFormValidate));
        this.current = 0;
        this.addGoodTitle = '新增商品';
        this.formValidate.chargeType = '0';
        this.formValidate.supplyType = '0';
        this.formValidate.id = '';
        this.formValidate.goodNo = '';

        this.formValidate.city.length = [];

        this.getGoodType();
        this.getSypplyType();
        this.getCbPriceList("0", "1");
        this.getGpPriceList("0", "1");
        this.getLandWayList();
        this.getJoinWayList();
        this.getUsage();
        this.modal2 = true;
        this.formValidate.createUser = localStorage.getItem('USER');
      },
      editShowGood(id) {
        this.addGoodTitle = '编辑商品';
        this.current = 0;
        this.getGoodType();
        this.getSypplyType();
        this.getCbPriceList(this.goodDetail.chargeTypeId, this.goodDetail.eType);
        this.getGpPriceList(this.goodDetail.chargeTypeId, this.goodDetail.eType);
        this.getLandWayList(this.goodDetail.gateLand);
        this.getJoinWayList(this.goodDetail.gateJoin);
        this.getUsage();
        this.isDatailShow = false;
        this.modal2 = true;
        let city = [];
        for (let i = 0; i < this.cityData.length; i++) {
          for (let j = 0; j < this.cityData[i].children.length; j++) {
            if (this.goodDetail.cityName == this.cityData[i].children[j].value || this.goodDetail.cityName == (this.cityData[i].children[j].value + '市')) {
              city.push(this.cityData[i].value);
              city.push(this.cityData[i].children[j].value);
              break
            }
          }
        }

        let usageArr = [];
        if (this.goodDetail.usage != '') {
          usageArr = this.goodDetail.usage.split(',');
        }


        this.formValidate.id = this.goodDetail.id;
        this.formValidate.goodNo = this.goodDetail.goodNo;
        this.formValidate.createUser = this.goodDetail.createUser;
        this.formValidate.goodName = this.goodDetail.goodName;
        this.formValidate.goodType = parseInt(this.goodDetail.goodType);
        this.formValidate.chargeType = this.goodDetail.chargeTypeId;
        this.formValidate.supplyType = this.goodDetail.supplyTypeId;
        this.formValidate.city = city;
        this.formValidate.supplyerId = parseInt(this.goodDetail.supplyerId);
        this.formValidate.store = this.goodDetail.store;
        this.formValidate.usageArr = usageArr;
        this.formValidate.eType = this.goodDetail.eType;
        this.formValidate.guapaiId = parseInt(this.goodDetail.guapaiId);
        this.formValidate.chengbenId = parseInt(this.goodDetail.chengbenId);
        this.formValidate.remark = this.goodDetail.remark;


      },
      getGoodType() {
        //资源类型
        api.fetchGoodType().then((res) => {
          if (res.data.respCode == '0') {
            this.goodType = res.data.list;
            if (this.formValidate.id != '') {

            } else {
              this.formValidate.goodType = this.goodType[0].id;
            }

          }
        }).catch((err) => {
          console.log(err)
        })
      },
      getUsage() {
        //使用场景
        api.fetchGetIndustryList({}).then((res) => {
          if (res.data.respCode == '0') {
            let usageList = res.data.list;
//            for (let i = 0; i < usageList.length; i++) {
//              if (usageList[i].name == '其他行业') {
//                usageList[i].options.push({parent: "40", name: "无限制"});
//              }
//            }
            usageList.unshift({
              "parent": "a0",
              "name": "",
              "options": [{
                "parent": "40",
                "name": "无限制",
              }]});


            this.usageList = usageList;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      getSypplyType() {
        //供应商类型
        api.fetch_getSupplierList({}).then((res) => {
          if (res.data.respCode == '0') {
            this.supplyerId = res.data.list;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      getGpPriceList(chargeType, eType) {
        api.fetchgetAllPricePackageOrder(
          {
            packageType: '1',
//            chargeType: chargeType,
//            eType: eType
          }
        ).then((res) => {
          if (res.data.respCode == '0') {
            this.packageTypeGp = res.data.list;
            this.packageTypeGp.unshift({
              id: 0,
              packageName: "待匹配"
            })
            //this.totalCount = res.data.totalCount;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      getCbPriceList(chargeType, eType) {
        api.fetchgetAllPricePackageOrder(
          {
            packageType: '0',
//            chargeType: chargeType,
//            eType: eType
          }
        ).then((res) => {
          if (res.data.respCode == '0') {

            this.packageTypeCb = res.data.list;
            this.packageTypeCb.unshift({
              id: 0,
              packageName: "待匹配"
            })
            //this.totalCount = res.data.totalCount;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      getLandWayList(item) {
        api.fetchGetLandGateWay().then((res) => {
          if (res.data.respCode == '0') {
            let displayList = [];
            if (item && item.length) {
              item.split(",").forEach(function (gw_name) {
                displayList.push({
                  name: gw_name,
                  disabled: true
                });
              });
              this.formValidate.landGateArr = item.split(",");
            } else {
              let dpp_info = {
                name: "待匹配",
                disabled: false
              };
              displayList.push(dpp_info);
              this.formValidate.landGateArr = (item === undefined) ? [] : [dpp_info.name];
            }

            if (res.data.list) {
              res.data.list.forEach(function (gw_info) {
                displayList.push({
                  name: gw_info.name,
                  disabled: false
                });
              });
            }

            this.landGateList = displayList;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      getJoinWayList(item) {
        api.fetchGetJoinGateWay().then((res) => {
          if (res.data.respCode == '0') {
            let displayList = [];
            if (item && item.length) {
              item.split(",").forEach(function (gw_name) {
                displayList.push({
                  name: gw_name,
                  disabled: true
                });
              });
              this.formValidate.joinGateArr = item.split(",");
            } else {
              let dpp_info = {
                name: "待匹配",
                disabled: false
              };
              displayList.push(dpp_info);
              this.formValidate.joinGateArr = (item === undefined) ? [] : [dpp_info.name];
            }

            if (res.data.list) {
              res.data.list.forEach(function (gw_info) {
                displayList.push({
                  name: gw_info.name,
                  disabled: false
                });
              });
            }

            this.joinGateList = displayList;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      handleSubmit: function (name) {

        var flag = this.addGoodValidateData2();
        if (!flag) {
          return false;
        } else {
          if ("市辖区" == this.formValidate.city[1]) {
            this.formValidate.cityName = this.formValidate.city[0];
          } else {
            this.formValidate.cityName = this.formValidate.city[1];
          }

          if (-1 !== this.formValidate.joinGateArr.indexOf("待匹配")) {
            //待匹配仅支持单选
            this.formValidate.gateJoin = "0";
          } else {
            this.formValidate.gateJoin = this.formValidate.joinGateArr.join(',');
          }

          if (-1 !== this.formValidate.landGateArr.indexOf("待匹配")) {
            //待匹配仅支持单选
            this.formValidate.gateLand = "0";
          } else {
            this.formValidate.gateLand = this.formValidate.landGateArr.join(',');
          }

          this.formValidate.usage = this.formValidate.usageArr.join(',');

          if (this.formValidate.id == '') {
            //  新增
            api.fetchAddGood(
              this.formValidate
            ).then((res) => {

              if (res.data.respCode == '0') {
                this.$Message.info("商品添加成功");
                this.modal2 = false;
                this.formValidate = JSON.parse(JSON.stringify(this.initFormValidate));
                this.getGoodList();
              } else {
                this.$Message.info(res.data.msg);
              }
            }).catch((err) => {
              console.log(err)
            })
          } else {
            // 更新
            api.fetchUpdataGood(this.formValidate).then((res) => {
              if (res.data.respCode == '0') {
                this.$Message.info("编辑商品成功");
                this.modal2 = false;
                this.formValidate = JSON.parse(JSON.stringify(this.initFormValidate));
                this.getGoodList();
              } else {
                this.$Message.info(res.data.msg);
              }

            }).catch((err) => {
              console.log(err)
            })
          }


        }
      },
      //修改挂牌价
      updateGp() {

        this.formValidate.createUser = localStorage.getItem('USER');
        if (this.listedTime && this.formValidate.taskTime == '') {
          this.$Message.info("勾选定时生效，定时时间不能为空");
          return
        }
        var stime = Date.parse(new Date());
        var etime = Date.parse(new Date(this.formValidate.taskTime));
        var usedTime = etime - stime;  //两个时间戳相差的毫秒数
        var minutes=Math.floor(usedTime/(60*1000));
        if(minutes < 30){
          this.$Message.info("定时时间至少比现在多30分钟");
          return
        }
        this.formValidate.guapaiId = this.timedPriceId;
        if (this.listedTime) {
          this.formValidate.isTimedTask = '1';
        }
        var flag = this.addGoodValidateData4();
        if (!flag) {
          return false;
        } else {
          api.fetchUpdateGp(
            {
              id: this.cu_guapaiId,
              guapaiId: this.formValidate.guapaiId,
              taskTime: this.formValidate.taskTime,
              isTimedTask: this.formValidate.isTimedTask,
              createUser: this.formValidate.createUser
            }
          ).then((res) => {
            if (res.data.respCode == '0') {
              this.$Message.info("挂牌包更新成功");
              this.isGpPrice = false;
              this.formValidate = JSON.parse(JSON.stringify(this.initFormValidate));
              this.getGoodList();
            } else {
              this.$Message.info(res.data.msg);
            }
          }).catch((err) => {
            console.log(err)
          })
        }

      },

      updateCb() {
        if (this.listedTime && this.formValidate.taskTime == '') {
          this.$Message.info("勾选定时生效，定时时间不能为空");
          return
        }
        var stime = Date.parse(new Date());
        var etime = Date.parse(new Date(this.formValidate.taskTime));
        var usedTime = etime - stime;  //两个时间戳相差的毫秒数
        var minutes=Math.floor(usedTime/(60*1000));
        if(minutes < 30){
          this.$Message.info("定时时间至少比现在多30分钟");
          return
        }
        this.formValidate.chengbenId = this.timedPriceId;
        if (this.listedTime) {
          this.formValidate.isTimedTask = '1';
        }
        this.formValidate.createUser = localStorage.getItem('USER');
        var flag = this.addGoodValidateData5();
        if (!flag) {
          return false;
        } else {
          api.fetchUpdateCb(
            {
              id: this.cu_chengbenId,
              chengbenId: this.timedPriceId,
              taskTime: this.formValidate.taskTime,
              isTimedTask: this.formValidate.isTimedTask,
              createUser: this.formValidate.createUser
            }
          ).then((res) => {
            if (res.data.respCode == '0') {
              this.$Message.info("成本包更新成功");
              this.isCbPrice = false;
              this.formValidate = JSON.parse(JSON.stringify(this.initFormValidate));
              this.getGoodList();
            } else {
              this.$Message.info(res.data.msg);
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      },

      updateWg() {
        var flag = this.addGoodValidateData3();
        if (!flag) {
          return false;
        } else {
          this.formValidate.gateJoin = this.formValidate.joinGateArr.join(',');
          this.formValidate.gateLand = this.formValidate.landGateArr.join(',');
          this.formValidate.createUser = localStorage.getItem('USER');

          api.fetchUpdateWg(
            {
              id: this.formValidate.id,
              store: this.formValidate.store,
              gateJoin: this.formValidate.gateJoin,
              gateLand: this.formValidate.gateLand,
              createUser: this.formValidate.createUser
            }
          ).then((res) => {
            if (res.data.respCode == '0') {
              this.$Message.info("网关更新成功");
              this.isGateway = false;
              this.formValidate = JSON.parse(JSON.stringify(this.initFormValidate));
              this.getGoodList();
            } else {
              this.$Message.info(res.data.msg);
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      },

      // 商品添加(下一步)正则判断
      addGoodValidateData1() {

        var reg = new RegExp("^\\d+(\\.\\d+)?$"); //非负浮点数（正浮点数 + 0）
        var reg2 = new RegExp("^[0-9]*$"); //数字

        if (this.formValidate.goodName == "") {
          this.$Message.info("商品名称不为空");
          return false;
        }

        if (this.formValidate.goodName.length < 2 || this.formValidate.goodName.length > 50) {
          this.$Message.info("商品名称长度在2-50之间");
          return false;
        }

        if (this.formValidate.goodType == "") {
          this.$Message.info("商品类别不为空");
          return false;
        }

        if (this.formValidate.chargeType == "") {
          this.$Message.info("计费模式不为空");
          return false;
        }

        if (this.formValidate.supplyType == "") {
          this.$Message.info("归属运营商不为空");
          return false;
        }

        if (this.formValidate.city.length == 0) {
          this.$Message.info("城市不为空");
          return false;
        }

        if (this.formValidate.supplyerId == "") {
          this.$Message.info("供应商不为空");
          return false;
        }

        if (this.formValidate.store == "") {
          this.$Message.info("库存不为空");
          return false;
        }

        if (!reg2.test(this.formValidate.store)) {
          this.$Message.info("库存数值有误");
          return false;
        }

        if (this.formValidate.usageArr == "" || this.formValidate.usageArr.length == 0) {
          this.$Message.info("应用场景不为空");
          return false;
        }
        return true;
      },
      // 商品添加(保存)正则判断
      addGoodValidateData2() {

        var reg = new RegExp("^\\d+(\\.\\d+)?$"); //非负浮点数（正浮点数 + 0）
        var reg2 = new RegExp("^[0-9]*$"); //数字

        if (this.formValidate.eType == "") {
          this.$Message.info("线路类型不为空");
          return false;
        }

        if (this.formValidate.guapaiId === "") {
          this.$Message.info("挂牌包不为空");
          return false;
        }

        if (this.formValidate.chengbenId === "") {
          this.$Message.info("成本包不为空");
          return false;
        }

        if (this.formValidate.eType == "0") {//呼入(落地)
          if (this.formValidate.joinGateArr == "") {
            this.$Message.info("对接网关不为空");
            return false;
          }
        } else if (this.formValidate.eType == "1") {//呼出(对接)
          if (this.formValidate.landGateArr == "") {
            this.$Message.info("落地网关不为空");
            return false;
          }
        } else if (this.formValidate.eType == "2") {
          if (this.formValidate.landGateArr == "") {
            this.$Message.info("落地网关不为空");
            return false;
          }
          if (this.formValidate.joinGateArr == "") {
            this.$Message.info("对接网关不为空");
            return false;
          }
        }
        return true;
      },
      // 商品修改网关正则判断
      addGoodValidateData3() {

        var reg2 = new RegExp("^[0-9]*$"); //数字
        if (this.formValidate.store == "") {
          this.$Message.info("库存量不为空");
          return false;
        }

        if (!reg2.test(this.formValidate.store)) {
          this.$Message.info("库存数值有误");
          return false;
        }

        if (this.formValidate.eType == "0") {//呼入(落地)
          if (this.formValidate.joinGateArr.length == 0) {
            this.$Message.info("对接网关不为空");
            return false;
          }
        } else if (this.formValidate.eType == "1") {//呼出(对接)
          if (this.formValidate.landGateArr == "") {
            this.$Message.info("落地网关不为空");
            return false;
          }
        } else if (this.formValidate.eType == "2") {
          if (this.formValidate.landGateArr == "") {
            this.$Message.info("落地网关不为空");
            return false;
          }
          if (this.formValidate.joinGateArr == "") {
            this.$Message.info("对接网关不为空");
            return false;
          }
        }
        return true;
      },
      // 商品修改挂牌包正则判断
      addGoodValidateData4() {
        if (this.formValidate.guapaiId === "") {
          this.$Message.info("挂牌包不为空");
          return false;
        }
        return true;
      },
      // 商品修改成本包正则判断
      addGoodValidateData5() {
        if (this.formValidate.chengbenId === "") {
          this.$Message.info("成本包不为空");
          return false;
        }
        return true;
      },
      //动态获取价格包列表
      getPriceListByType(chargeType, eType) {
        //清空网关
        this.formValidate.joinGateArr = [];
        this.formValidate.landGateArr = [];
        this.getCbPriceList(chargeType, eType);
        this.getGpPriceList(chargeType, eType);
      },
      getPageChange(index) {
        this.pageNo = index;
        this.getGoodList();
        this.checkAll = false;
        this.checkBoxArr = [];
      },

      getPageSizeChange(pageNum) {
        this.pageNum = pageNum
        this.getGoodList();
        this.checkAll = false;
        this.checkBoxArr = [];
      },

      closePriceDetail() {
        if (this.typeDetail == '0') {
          this.priceShow = false;
          this.isCbPrice = true;
        } else if (this.typeDetail == '1') {
          this.priceShow = false;
          this.isGpPrice = true;
        }
      },

      showPriceDetail(id, packageType) {
        this.typeDetail = packageType;
        api.fetchPriceBasic({
          id: id
        }).then((res) => {
          if (res.data.respCode == '0') {
            this.priceTab = "priceTab1";
            this.priceMap = res.data.map;
            if (packageType == '0') {
              this.isCbPrice = false;
            } else if (packageType == '1') {
              this.isGpPrice = false;
            }

            this.priceShow = true;

            this.cu_packageType = packageType;
            this.cu_id = id;
          }
        }).catch((err) => {
          console.log(err)
        })
      },

      tabClick() {
        if (this.priceTab == "priceTab1") {
          api.fetchPriceBasic({
            id: this.cu_id
          }).then((res) => {
            if (res.data.respCode == '0') {
              this.priceMap = res.data.map;
            }
          }).catch((err) => {
            console.log(err)
          })
        } else if (this.priceTab == "priceTab2") {
          api.fetchPriceDetail({
            id: this.cu_id
          }).then((res) => {
            if (res.data.respCode == '0') {
              this.priceMap = res.data.map;
            }
          }).catch((err) => {
            console.log(err)
          })
        } else if (this.priceTab == "priceTab3") {
          api.fetchPriceLinkGood({
            id: this.cu_id
          }).then((res) => {
            if (res.data.respCode == '0') {
              this.priceDetailList = res.data.list;
            }
          }).catch((err) => {
            console.log(err)
          })
        } else if (this.priceTab == "priceTab4") {
          api.fetchPriceLinkOrder({
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

      tabGoodClick() {
        if (this.GoodTab == "GoodTab1") {
          api.fetchGoodDetail({
            id: this.cu_goodId
          }).then((res) => {
            if (res.data.respCode == '0') {
              this.goodDetail = res.data.map;
            }
          }).catch((err) => {
            console.log(err)
          })
        } else if (this.GoodTab == "GoodTab3") {
          api.fetchQueryLinkOrder({
            id: this.cu_goodId
          }).then((res) => {
            if (res.data.respCode == '0') {
              this.linkOrderList = res.data.list;
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      showUcload() {
        this.ucploadModal2 = true;
        //显示导出框
      },

      //获取定时任务
      getTimedTask(item, id) {
        api.fetchgetGetTimedTaskDetail({
          taskId: item,
          taskType: id
        }).then((res) => {
          if (res.data.respCode == '0') {
            if (res.data.map != null) {
              this.listedTime = true;
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
      uploadFileSuccess(response, file, fileList) {
        this.ucploadModal2 = false;


        if (response.respCode == 0) {
          if (response.map.operation) {
            this.operation = response.map.operation;

            this.ucploadModal = true;
            this.ucploadMsg = response.msg;
          }
        } else {
          this.$Message.info({content: response.msg, duration: 2.5});
        }

        console.log(response)


      },
      uploadFileError(err, file, fileList) {

      },
      goToexport() {

        api.DownLoadFile({
          url: '/vcloud/goodManage/good/exportErrExcel', data: {
            operation: this.operation
          }
        });
        this.ucploadModal = false;
        this.operation = '';
      },
      oKModal() {
        this.ucploadModal = false;
        this.operation = '';
        this.getGoodList();
      },
      exportExcallDown() {
        api.DownLoadFile({
          url: '/vcloud/goodManage/good/exportDefExcel', data: {}
        });
      },
      getcity() {
        api.fetchCityAll({}).then((res) => {

        }).catch((err) => {
          console.log(err)
        })
      },
      deleteGoods(id) {
        //删除商品
        api.fetchDeleteGood({
          id: id
        }).then((res) => {
          if (res.data.respCode == '0') {
            this.$Message.success(res.data.msg);
            this.getGoodList();
          } else {
            this.$Message.error(res.data.msg);
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    components: {}
  };
</script>
<style lang="less">
  .common_form_line {
    .ivu-form-item-content {
      display: inline-block;
      width: 480px;
    }
  }

  .commod_desc {
    display: block;
    width: 100%;
    height: 70px;
    box-sizing: border-box;
    border: 1px solid #dddee1;
    border-radius: 3px;
    padding: 4px;
    line-height: 20px;
  }

  .el-select-dropdown__item.selected {
    font-weight: normal;
  }


</style>
