<template>
  <div class="app-container">
    <el-row>
      <el-col :offset="1" :span="2">
        <el-button type="primary" icon="el-icon-plus" @click="create">添加
        </el-button>
      </el-col>
      <el-col :offset="13" :span="6">
        <el-input placeholder="ID/名称/邮箱/手机号" @on-enter="searchInputChange" v-model.trim="searchInput">
          <el-button slot="append" icon="el-icon-search" @click="searchInputChange"></el-button>
        </el-input>
      </el-col>
    </el-row>

    <Table :columns="tableHead" :data="dataList" :height="tabHeight" :loading="loading">
    </Table>

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
            <div>客户信息</div>
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
            <FormItem label="名称">
            </FormItem>
          </Col>
          <Col span="16" v-if="modalTitle === '新增客户'">
            <FormItem prop="name">
              <div>
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
            <FormItem label="邮箱">
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
            <FormItem label="手机号">
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

        <Row>
        <Col span="3" offset="3">
          <FormItem label="余额">
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
          <FormItem label="透支额度">
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
          <FormItem label="开户人">
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
          <FormItem label="创建时间">
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
          <FormItem label="更新时间">
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
            <Button type="ghost" @click="formReset('roleForm')">取消</Button>
            <Button type="primary" @click="formSubmit('roleForm')">保存</Button>
        </Col>
      </Row>
    </Modal>

    <div v-if="pageTotal">
      <Page :total="pageTotal" :current="pageNo" :page-size="pageNumOpts[pageNumSelect]"
            size="small"
            :page-size-opts="pageNumOpts"
            show-elevator show-sizer show-total placement="top"
            @on-page-size-change="pageSizeChage"
            @on-change="pageChange">
      </Page>
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
                    class: ""
                  },
                  class: "",
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
                  class: '',
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
        this.$message.error("searchInputChange");
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
        this.$message.error("create");
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
                if (response.data.code === 0) {
                  this.$store.dispatch('client/getList', data);
                  this.modalDisplay = false;
                }else if (response.data.code === 1) {
                  this.$Message.error(response.data.desc);
                }
              });
            } else {
                this.$store.dispatch('client/addInfo').then((response) => {
                  if (response.data.code === 0) {
                    this.$store.dispatch('client/getList', data);
                    this.modalDisplay = false;
                  }else if (response.data.code === 1) {
                    this.$Message.error(response.data.desc);
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
            if (response.data.code === 0) {
              this.$Message.success(response.data.desc);
              let data = {
                pageNo: this.pageNo,
                pageNum: this.pageNumOpts[this.pageNumSelect],
              };
              this.$store.dispatch('client/getList', data);
            }else if(response.data.code === 1){
              this.$Message.error(response.data.desc);
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
</style>
