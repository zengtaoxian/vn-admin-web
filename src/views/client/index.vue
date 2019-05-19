<template>
  <div class="box">
    <div class="main_header clear">
      <div class="header_btn">
        <i-button type="primary" @click="create">
          <Icon type="plus-round"></Icon>添加
        </i-button>
      </div>
      <div class="input_wrap">
        <i-input placeholder="ID/名称/邮箱/手机号" style: @on-enter="searchInputChange" v-model.trim="searchInput"></i-input>
        <span class="search_btn" @click="searchInputChange"><Icon type="ios-search-strong"></Icon></span>
      </div>
    </div>

    <div class="tab_wrap">
      <Table :columns="tableHead" :data="dataList" :height="tabHeight" :loading="loading">
      </Table>
    </div>

    <Modal
      v-model="modalDisplay" :title="modalTitle"
      scrollable
      width="800px"
      loading="loading"
      :mask-closable="false"
      class="">
      <Form ref="roleForm" :model="dataInfo" :rules="formRules">
        <Row>
          <Col span="20" offset="1">
            <div class="data_title">客户信息</div>
          </Col>
        </Row>

        <Row>
          <Col span="3" offset="3">
            <FormItem class="ivu-form-item-required" label="ID">
            </FormItem>
          </Col>
          <Col span="16">
            <FormItem>
              {{dataInfo.id}}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="3" offset="3">
            <FormItem class="ivu-form-item-required" label="名称">
            </FormItem>
          </Col>
          <Col span="16" v-if="modalTitle === '新增客户'">
            <FormItem prop="name">
              <div style="position: relative;">
                <Input v-model="dataInfo.name" placeholder="2-10字以内"></Input>
              </div>
            </FormItem>
          </Col>
          <Col span="16" v-if="modalTitle === '修改客户'">
            <FormItem>
              {{dataInfo.name}}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="3" offset="3">
            <FormItem class="ivu-form-item-required" label="邮箱">
            </FormItem>
          </Col>
          <Col span="16">
            <FormItem prop="email">
              <Input v-model="dataInfo.email"
                     type="textarea">
              </Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="3" offset="3">
            <FormItem class="ivu-form-item-required" label="手机号">
            </FormItem>
          </Col>
          <Col span="16">
            <FormItem prop="mobile">
              <Input v-model="dataInfo.mobile"
                     type="textarea">
              </Input>
            </FormItem>
          </Col>
        </Row>
      </Form>

      <Row>
        <Col span="3" offset="3">
          <FormItem class="ivu-form-item-required" label="余额">
          </FormItem>
        </Col>
        <Col span="16">
          <FormItem prop="balance">
            <Input v-model="dataInfo.balance"
                   type="textarea">
            </Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="3" offset="3">
          <FormItem class="ivu-form-item-required" label="透支额度">
          </FormItem>
        </Col>
        <Col span="16">
          <FormItem prop="overdraft">
            <Input v-model="dataInfo.overdraft"
                   type="textarea">
            </Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="3" offset="3">
          <FormItem class="ivu-form-item-required" label="开户人">
          </FormItem>
        </Col>
        <Col span="16">
          <FormItem prop="createUser">
            <Input v-model="dataInfo.createUser"
                   type="textarea">
            </Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="3" offset="3">
          <FormItem class="ivu-form-item-required" label="创建时间">
          </FormItem>
        </Col>
        <Col span="16">
          <FormItem>
            {{dataInfo.createTime}}
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="3" offset="3">
          <FormItem class="ivu-form-item-required" label="更新时间">
          </FormItem>
        </Col>
        <Col span="16">
          <FormItem>
            {{dataInfo.updateTime}}
          </FormItem>
        </Col>
      </Row>
      </Form>

      <Row>
        <Col span="20" offset="3">
          <div class="footer_modal">
            <Button type="ghost" class="sub_btn_size" @click="formReset('roleForm')">取消</Button>
            <Button type="primary" class="sub_btn_size" @click="formSubmit('roleForm')">保存</Button>
          </div>
        </Col>
      </Row>
    </Modal>

    <div class="page_btm_div" v-if="pageTotal">
      <Page class="page_iview_right" :total="pageTotal" :current="pageNo" :page-size="pageNumOpts[pageNumSelect]"
            size="small"
            :page-size-opts="pageNumOpts"
            show-elevator show-sizer show-total placement="top"
            @on-page-size-change="pageSizeChage"
            @on-change="pageChange"></Page>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        tabHeight: 500,
        loading: false,
        modalDisplay: false,
        modalTitle: "新增客户",
        searchInput: "",
        formRules: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ]
        },
        tableHead: [
          {
            title: '序号',
            key: 'no',
            width: 80,
            render: (h, params) => {
              return h('div', params.index + 1);
            }
          },
          {
            title: 'ID',
            key: 'id'
          },
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '邮箱',
            key: 'email'
          },
          {
            title: '手机号',
            key: 'mobile'
          },
          {
            title: '余额',
            key: 'balance'
          },
          {
            title: '透支额度',
            key: 'overdraft'
          },
          {
            title: '开户人',
            key: 'createUser'
          },
          {
            title: '创建时间',
            key: 'createTime'
          },
          {
            title: '更新时间',
            key: 'updateTime'
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              let arr = [];
              arr.push(
                h('span', {
                  props: {
                    type: 'text',
                    class: "tab_childer_btn"
                  },
                  class: "tab_childer_btn",
                  on: {
                    click: () => {
                      this.modify(params.row);
                    }
                  }
                }, '修改')
              );

              arr.push(
                h('Poptip', {
                  props: {
                    title: "确定要删除所选客户吗?",
                    confirm: true,
                    placement: "top-end",
                    transfer: true,
                  },
                  class: 'tab_childer_btn',
                  on: {
                    "on-ok": () => {
                      this.delete(params.row);
                    },
                    "on-cancel": () => {
                    }
                  }
                }, '删除')
              );

              return h('div', arr);
            }
          }
        ]
      };
    },
    computed: mapGetters({
      pageNumOpts: "client/pageNumOpts",
      pageNumSelect: "client/pageNumSelect",
      pageNo: "client/pageNo",
      pageTotal: "client/pageTotal",
      dataList: "client/dataList",
      dataInfo: "client/dataInfo"
    }),
    methods: {
      searchInputChange(event) {
        let data = {
          pageNo: this.pageNo,
          pageNum: this.pageNumOpts[this.pageNumSelect],
          condition: this.searchInput
        };
        this.$store.dispatch('client/getList', data);
      },

      pageChange(page) {
        let data = {
          pageNo: page,
          pageNum: this.pageNumOpts[this.pageNumSelect],
        };
        this.$store.dispatch('client/getList', data);
      },

      pageSizeChage(page_size) {
        let data = {
          pageNo: this.pageNo,
          pageNum: page_size,
        };
        this.$store.dispatch('client/getList', data);
      },

      create() {
        this.$store.dispatch('client/resetInfo').then(() => {
          this.modalTitle = "新增客户";
          this.modalDisplay = true;
        })
      },

      formSubmit(name) {
        let data = {
          pageNo: this.pageNo,
          pageNum: this.pageNumOpts[this.pageNumSelect],
        };

        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.modalTitle === '修改客户') {
              this.$store.dispatch('client/mdfInfo').then((response) => {
                if (response.data.respCode === '0') {
                  this.$store.dispatch('client/getList', data);
                  this.modalDisplay = false;
                }else if (response.data.respCode == '1') {
                  this.$Message.error(response.data.msg);
                }
              });
            } else {
                this.$store.dispatch('client/addInfo').then((response) => {
                  if (response.data.respCode === '0') {
                    this.$store.dispatch('client/getList', data);
                    this.modalDisplay = false;
                  }else if (response.data.respCode == '1') {
                    this.$Message.error(response.data.msg);
                  }
                });
            }
          }
        });
      },

      formReset(name) {
        this.modalDisplay = false;
      },

      modify(row) {
        this.$store.dispatch('client/getInfo').then((response) => {
          this.modalTitle = "修改客户";
          this.modalDisplay = true;
        });
      },

      delete(row) {
        this.$store.dispatch('client/getInfo').then((response) => {
          this.$store.dispatch('client/delInfo').then((response) => {
            if (response.data.respCode === '0') {
              this.$Message.success(response.data.msg);
              let data = {
                pageNo: this.pageNo,
                pageNum: this.pageNumOpts[this.pageNumSelect],
              };
              this.$store.dispatch('client/getList', data);
            }else if(response.data.respCode === '1'){
              this.$Message.error(response.data.msg);
            }
          });
        });
      },
    },
    created() {
      this.tabHeight = (document.documentElement.clientHeight - 160 - 40);
      let data = {
        pageNo: this.pageNo,
        pageNum: this.pageNumOpts[this.pageNumSelect],
      };
      this.$store.dispatch('client/getList', data);
      this.$store.dispatch('client/resetInfo');
    }
  };
</script>

<style lang="less">
  .data_title {
    color: #939da4;
  }

  .ivu-table-wrapper {
    border: none !important;
  }

  .ivu-modal-footer {
    display: none;
  }
  .ivu-tree ul li{
    margin: 0 !important;
  }
</style>
