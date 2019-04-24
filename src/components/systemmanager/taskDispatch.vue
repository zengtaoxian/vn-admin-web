<style>

</style>
<template>
  <div class="box">
    <div class="main_header clear">
      <div v-if="check_perm(265)" class="input_wrap">
        <i-input placeholder="调度名称/任务标识" style: @on-enter="search" v-model.trim="condition"></i-input>
        <span class="search_btn" @click="search"><Icon type="ios-search-strong"></Icon></span>
      </div>
      <div v-if="check_perm(149)" class="header_btn">
        <i-button type="primary" @click="modify()">
          <Icon type="plus-round"></Icon>&nbsp;&nbsp;定时任务调度
        </i-button>
      </div>
    </div>

    <div class="tab_wrap">
      <i-table :columns="columns1" :data="data1" class="table" ref="table" :height="tabHeight" :loading="loading"
               :no-data-text="noDataText"></i-table>
    </div>
    <div class="page_btm_div" v-if="totalCount">
      <Page class="page_iview_right" :current="currentPage" :total="totalCount" :page-size="pageSize"
            :page-size-opts="pageOpt" size="small" show-elevator show-sizer show-total placement="top"
            @on-change="getTaskDispatchPageChange" @on-page-size-change="getTaskDispatchPageSizeChange"></Page>
    </div>

    <Modal v-model="modal1" :mask-closable="false" :title="titleName" @on-ok="ok" @on-cancel="cancel" :scrollable="scrollable" width="670">
      <Form :model="formValidate" :label-width="100">
        <row>
          <Col span="23" offset="0">
          <FormItem class="ivu-form-item-required" label="调度名称" prop="diaodumc">
            <Input v-model="formValidate.diaodumc" v-if="isEdit" placeholder="定时调度名称"></Input>
            <Input v-model="formValidate.diaodumc" v-else disabled placeholder="定时调度名称"></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="批量任务" prop="dispatchTask">
            <Select v-model="formValidate.piljybss">
              <Option v-for="item in  batchTranList" :value="item.pljioyma" :key="item.pljioyma">{{ item.pljyzwmc }}
              </Option>
            </Select>
          </FormItem>
          <FormItem class="ivu-form-item-required" style="position: relative;" label="调度年" prop="dduniann">
            <Input v-model="formValidate.dduniann" placeholder="调度年" style="width: 490px;"></Input>
            <Poptip style="display: inline-block;" placement="left" width="400" transfer trigger="hover">
              <Icon type="help-circled"></Icon>
              <div class="api" slot="content">
                <div>
                  <caption>填写说明</caption>
                </div>
                <table width="300">
                  <thead>
                  <tr>
                    <th>字段名</th>
                    <th>允许的值</th>
                    <th>允许的特殊字符串</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>年</td>
                    <td>empty,1970-2099</td>
                    <td>, - * /</td>
                  </tr>
                  <tr>
                    <td>月</td>
                    <td>1-12 or JAN-DEC</td>
                    <td>, - * /</td>
                  </tr>
                  <tr>
                    <td>星期</td>
                    <td>1-7 or SUN-SAT</td>
                    <td>, - * / ? L C#</td>
                  </tr>
                  <tr>
                    <td>天</td>
                    <td>1-31</td>
                    <td>, - * / ? L W C</td>
                  </tr>
                  <tr>
                    <td>小时</td>
                    <td>0-23</td>
                    <td>, - * /</td>
                  </tr>
                  <tr>
                    <td>分</td>
                    <td>0-59</td>
                    <td>, - * /</td>
                  </tr>
                  <tr>
                    <td>秒</td>
                    <td>0-59</td>
                    <td>, - * /</td>
                  </tr>
                  </tbody>
                </table>
                <h5>字符说明：</h5>
                <p> "*" 字符: 代表整个时间段 </p>
                <p> "?" 字符：表示不确定的值 </p>
                <p> "," 字符：制定数个值 </p>
                <p> "-" 字符：制定一个值得范围 </p>
                <p> "/" 字符：指定一个值得增加幅度,n/m表示从n开始,每次增加m </p>
                <p> "L" 字符：用在日表示一个月中的最后一天，用在周表示该月的最后一个星期X </p>
                <p> "W" 字符：指定离给定日期最近的工作日（周一到周五）</p>
                <p> "#" 字符：表示该月第几周X，6#3表示该月第3个周五 </p>
              </div>
            </Poptip>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="调度星期" prop="diaodxqi">
            <Input v-model="formValidate.diaodxqi" placeholder="调度星期"></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="调度月" prop="diaodyue">
            <Input v-model="formValidate.diaodyue" placeholder="调度月"></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="调度天" prop="dijitian">
            <Input v-model="formValidate.dijitian" placeholder="调度天"></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="调度小时" prop="xiaoshii">
            <Input v-model="formValidate.xiaoshii" placeholder="调度小时"></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="调度分钟" prop="fenzhong">
            <Input v-model="formValidate.fenzhong" placeholder="调度分钟"></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="调度秒" prop="miaooooo">
            <Input v-model="formValidate.miaooooo" placeholder="调度秒"></Input>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="并行方式">
            <el-radio-group v-model="formValidate.shifoubf" size="small">
              <el-radio-button label="0">串行</el-radio-button>
              <el-radio-button label="1">并行</el-radio-button>
            </el-radio-group>
          </FormItem>
          <FormItem class="ivu-form-item-required" label="调度状态" prop="dispatchStatus">
            <Select v-model="formValidate.diaoduzt" placement="top">
              <Option v-for="item in  dispatchStatus" :value="item.value" :key="item.key">{{ item.key }}</Option>
            </Select>
          </FormItem>
          </Col>
        </row>
      </Form>
      <Row>
        <Col span="23" offset="0">
        <!--<div class="footer">-->
        <!--<Button type="primary" class="subbtn" @click="handleSubmit('save')" style="margin-left: 20px;float: right;">保存</Button>-->
        <!--<Button type="ghost" class="subbtn" @click="handleReset('formValidate')" style="float: right;">取消</Button>-->
        <!--</div>-->
        <div class="footer_modal">
          <Button type="ghost" class="sub_btn_size" @click="handleReset('formValidate')">取消</Button>
          <Button type="primary" class="sub_btn_size" @click="handleSubmit('save')">保存</Button>
        </div>
        </Col>
      </Row>

    </Modal>
  </div>
</template>
<script>

  import {mapGetters} from "vuex";
  import * as api from '@/api/api';
  import * as util from "@/common/js/util";

  export default {
    data() {
      return {
        noDataText: "加载中...",
        tabHeight: '500',
        loading: false,
        totalCount: 0,
        currentPage: 1,
        pageSize: util.pageSize,
        pageOpt: util.pageOpt,
        scrollable: true,
        modal1: false,
        condition: "",
        operateId: "0", //0: 新增 1：修改 2：停用　３：删除
        titleName: "",
        tipOptions: "提示说明",
        batchTranList: [],
        isEdit: true,
        dispatchStatusParam: "",
        dispatchStatus: [
          {
            key: "待调度",
            value: "START"
          },
          {
            key: "正在调度",
            value: "SCHEDULING"
          },
          {
            key: "待停止",
            value: "STOPPING"
          },
          {
            key: "已停止",
            value: "STOPPED"
          },
          {
            key: "待删除",
            value: "DELETE"
          }
        ],
        formValidate: {
          diaodumc: "",
          dduniann: "",
          diaodxqi: "",
          diaodyue: "",
          dijitian: "",
          xiaoshii: "",
          fenzhong: "",
          miaooooo: "",
          shifoubf: 0,
          diaoduzt: [],
          piljybss: ""

        },

        columns1: [
          {
            title: "序号",
            key: "number",
            type: "index",
            width: 70
          },
          {
            title: "调度名称",
            key: "diaodumc",
            width: 240
          },
          {
            title: "任务标识",
            key: "piljybss",
            width: 140
          },
          {
            title: "任务中文名称",
            key: "pljyzwmc",
            width: 200
          },
          {
            title: "调度年",
            key: "dduniann",
            width: 90
          },
          {
            title: "调度星期",
            key: "diaodxqi",
            width: 100
          },
          {
            title: "调度月",
            key: "diaodyue",
            width: 90
          },
          {
            title: "调度天",
            key: "dijitian",
            width: 90
          },
          {
            title: "调度小时",
            key: "xiaoshii",
            width: 100
          },
          {
            title: "调度分钟",
            key: "fenzhong",
            width: 100
          },
          {
            title: "调度秒",
            key: "miaooooo",
            width: 90
          },
          {
            title: "调度方式",
            key: "shifoubf",
            width: 90,
            render: (h, params) => {
              let str = '';
              let arr = '';
              let status = params.row.shifoubf;
              if (status == '0') {
                str = '串行';
              } else {
                str = '并行';
              }
              arr = [h('span', {}, str)];
              return h('div', arr);
            }
          },
          {
            title: "调度状态",
            key: "diaoduzt",
            width: 100,
            filters: [
              {
                label: '待调度',
                value: 1
              },
              {
                label: '正在调度',
                value: 2
              },
              {
                label: '待停止',
                value: 3
              },
              {
                label: '已停止',
                value: 4
              },
              {
                label: '待删除',
                value: 5
              }
            ],
            filterMultiple: false,
            filterRemote(value, row) {
              if (value == 1) {
                this.dispatchStatusParam = "START";
              } else if (value == 2) {
                this.dispatchStatusParam = "SCHEDULING";
              } else if (value == 3) {
                this.dispatchStatusParam = "STOPPING";
              } else if (value == 4) {
                this.dispatchStatusParam = "STOPPED";
              } else if (value == 5) {
                this.dispatchStatusParam = "DELETE";
              } else {
                this.dispatchStatusParam = "";
              }
              this.currentPage = 1;
              this.getTaskDispatchList();
            },
            render: (h, params) => {
              let str = '';
              let arr = '';
              let status = params.row.diaoduzt;
              if (status == 'START') {
                str = '待调度';
              } else if (status == 'SCHEDULING') {
                str = '正在调度';
              } else if (status == 'STOPPING') {
                str = '待停止';
              } else if (status == 'STOPPED') {
                str = '已停止';
              } else {
                str = '待删除';
              }

              if (status == 'START') {
                arr = [
                  h('span', {
                    style: {
                      // marginRight: '5px',
                      border: "none",
                      class: "tab_del_btn",
                      color: "#CD0000",
                      cursor: "pointer"
                    }
                  }, str)
                ];
              } else {
                arr = [
                  h('span', {}, str)
                ];
              }
              return h('div', arr);
            }
          },
          {
            title: "最后调度批次",
            key: "pljypich",
            width: 300
          },
          {
            title: "操作",
            key: "operate",
            width: 160,
            render: (h, params) => {
              if (this.data1[params.index].diaoduzt == "STOPPED") {
                if (this.check_perm(151)) {
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
                          this.data1[params.index].params = 0;
                          this.operateId = 1;
                          this.modify(params.index)

                        }
                      }
                    }, '修改')
                  ]);
                }
              } else {
                if (this.check_perm(150) && this.check_perm(151)) {
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
                          this.data1[params.index].params = 1;
                          this.stop(params.index)
                        }
                      }
                    }, '停用'),
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
                          this.data1[params.index].params = 0;
                          this.operateId = 1;
                          this.modify(params.index)

                        }
                      }
                    }, '修改')
                  ]);
                }

                if (this.check_perm(151)) {
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
                          this.data1[params.index].params = 0;
                          this.operateId = 1;
                          this.modify(params.index)

                        }
                      }
                    }, '修改')
                  ]);
                }

                if (this.check_perm(150)) {
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
                          this.data1[params.index].params = 1;
                          this.stop(params.index)
                        }
                      }
                    }, '停用')
                  ]);
                }
              }
            }
          },
        ],
        data1: []
      };
    },
    created() {
      this.tabHeight = (document.documentElement.clientHeight - 160 - 40);
      this.dispatchStatusParam = "";
      this.getTaskDispatchList();
    },
    computed: {
      ...mapGetters({
        check_perm: "main/check_perm",
      })
    },
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

      stop(indexId) {
        this.formValidate.diaodumc = this.data1[indexId].diaodumc;
        this.formValidate.diaoduzt = "STOPPED";
        this.updateTaskDispatchStatus();

      },

      modify(indexId) {
        if (!indexId && indexId != 0) {
          this.isEdit = true;
          this.titleName = "新增定时任务调度";
          this.formValidate.diaodumc = "";
          this.formValidate.dduniann = "";
          this.formValidate.diaodxqi = "";
          this.formValidate.diaodyue = "";
          this.formValidate.dijitian = "";
          this.formValidate.xiaoshii = "";
          this.formValidate.fenzhong = "";
          this.formValidate.miaooooo = "";
          this.formValidate.shifoubf = 0;
          this.formValidate.diaoduzt = "";
          this.operateId = 0;
        } else {
          this.isEdit = false;
          this.titleName = "修改定时任务调度";
          this.formValidate.diaodumc = this.data1[indexId].diaodumc;
          this.formValidate.dduniann = this.data1[indexId].dduniann;
          this.formValidate.diaodxqi = this.data1[indexId].diaodxqi;
          this.formValidate.diaodyue = this.data1[indexId].diaodyue;
          this.formValidate.dijitian = this.data1[indexId].dijitian;
          this.formValidate.xiaoshii = this.data1[indexId].xiaoshii;
          this.formValidate.fenzhong = this.data1[indexId].fenzhong;
          this.formValidate.miaooooo = this.data1[indexId].miaooooo;
          this.formValidate.shifoubf = this.data1[indexId].shifoubf;
          this.formValidate.piljybss = this.data1[indexId].piljybss;
          this.formValidate.diaoduzt = this.data1[indexId].diaoduzt;
          this.operateId = 1;
        }
        this.modal1 = true;

      },

      // 表单验证
      handleSubmit(name) {
        if (this.formValidate.diaodumc == "" || this.formValidate.dduniann == "" || this.formValidate.diaodxqi == "" || this.formValidate.diaodyue == "" ||
          this.formValidate.dijitian == "" || this.formValidate.xiaoshii == "" || this.formValidate.fenzhong == "" || this.formValidate.miaooooo == "" ||
          this.formValidate.piljybss == "" || this.formValidate.diaoduzt == "") {
          this.$Message.error("必填项不能为空！");
          return;
        }
        if (this.operateId == 0) {
          this.addTaskDispatchList();
        } else {
          this.updateTaskDispatchList();
        }
        this.modal1 = false;
        // this.$Message.info('success!');
      },
      handleReset(name) {
        this.modal1 = false;
        // this.$refs[name].resetFields();
      },
      // 获取定时任务列表
      getTaskDispatchList() {
        this.noDataText = "加载中...";
        this.loading = true;
        api.fetch_taskDispatch_info({
          condition: this.condition,
          pageNo: this.currentPage,
          pageNum: this.pageSize,
          diaoduzt: this.dispatchStatusParam
        }).then(response => {
          if (response.data.respCode == 0) {
            this.data1 = response.data.list;
            this.batchTranList = response.data.map.batchTranList;
            this.totalCount = response.data.totalCount;
          } else {
            this.$Message.error(this.data.msg);
          }
          this.noDataText = '暂无数据';
          this.loading = false;
        })
          .catch(err => {
            console.log(err);
            this.$Message.error("获取列表信息失败");
            this.noDataText = '暂无数据';
            this.loading = false;
          });
      },

      addTaskDispatchList() {
        api.add_taskDispatch_info({
          condition: this.condition,
          pageNo: this.pageNo,
          pageNum: this.pageNum,
          diaodumc: this.formValidate.diaodumc,
          piljybss: this.formValidate.piljybss,
          dduniann: this.formValidate.dduniann,
          diaodxqi: this.formValidate.diaodxqi,
          diaodyue: this.formValidate.diaodyue,
          dijitian: this.formValidate.dijitian,
          xiaoshii: this.formValidate.xiaoshii,
          fenzhong: this.formValidate.fenzhong,
          miaooooo: this.formValidate.miaooooo,
          pljypich: this.formValidate.pljypich,
          diaoduzt: this.formValidate.diaoduzt,
          shifoubf: this.formValidate.shifoubf
        }).then(response => {
          if (response.data.respCode == 0) {
            this.$Message.success(response.data.msg);
            this.getTaskDispatchList();
          } else {
            this.$Message.error(response.data.msg);
          }
        }).catch(err => {
          console.log(err);
          this.$Message.error("新增定时任务调度失败");
        })
      },

      updateTaskDispatchList() {
        api.update_taskDispatch_info({
          condition: this.condition,
          pageNo: this.pageNo,
          pageNum: this.pageNum,
          diaodumc: this.formValidate.diaodumc,
          piljybss: this.formValidate.piljybss,
          dduniann: this.formValidate.dduniann,
          diaodxqi: this.formValidate.diaodxqi,
          diaodyue: this.formValidate.diaodyue,
          dijitian: this.formValidate.dijitian,
          xiaoshii: this.formValidate.xiaoshii,
          fenzhong: this.formValidate.fenzhong,
          miaooooo: this.formValidate.miaooooo,
          pljypich: this.formValidate.pljypich,
          diaoduzt: this.formValidate.diaoduzt,
          shifoubf: this.formValidate.shifoubf
        }).then(response => {
          if (response.data.respCode == 0) {
            this.$Message.success(response.data.msg);
            this.getTaskDispatchList();
          } else {
            this.$Message.error(response.data.msg);
          }
        }).catch(err => {
          console.log(err);
          this.$Message.error("更新定时任务调度失败");
        })
      },

      updateTaskDispatchStatus() {
        api.update_taskDispatch_status_info({
          condition: this.condition,
          pageNo: this.pageNo,
          pageNum: this.pageNum,
          diaodumc: this.formValidate.diaodumc,
          diaoduzt: this.formValidate.diaoduzt
        }).then(response => {
          if (response.data.respCode == 0) {
            this.$Message.success(response.data.msg);
            this.getTaskDispatchList();
          } else {
            this.$Message.error(response.data.msg);
          }
        }).catch(err => {
          console.log(err);
          this.$Message.error("更新定时任务调度状态失败")
        })
      },

      getTaskDispatchPageChange(page) {
        this.currentPage = page
        this.getTaskDispatchList()
      },

      getTaskDispatchPageSizeChange(pageSize) {
        this.pageSize = pageSize
        this.getTaskDispatchList()
      },
      search() {
        this.pageNo = 1;
        this.getTaskDispatchList();
      }
    }
  };
</script>
<style lang="less">
  .ivu-modal-footer {
    display: none !important;
  }

  .ivu-form-item {
    margin-bottom: 14px;
  }
</style>
