<template>
  <div class="box">
    <div class="main_header clear">
      <div class="header_btn">
        <i-button type="primary" @click="create_role">
          <Icon type="plus-round"></Icon>&nbsp;添加
        </i-button>
      </div>
      <div class="input_wrap">
        <i-input placeholder="名称/ID/邮箱/手机号" style: @on-enter="search_input_change" v-model.trim="search_input"></i-input>
        <span class="search_btn" @click="search_input_change"><Icon type="ios-search-strong"></Icon></span>
      </div>
    </div>

    <div class="tab_wrap">
      <Table :columns="table_head" :data="data_list" :height="tabHeight" :loading="loading">
      </Table>
    </div>

    <Modal
      v-model="modal_display" :title="modal_title"
      scrollable
      width="800px"
      loading="loading"
      :mask-closable="false"
      class="">
      <Form ref="role_form" :model="data_info" :rules="form_rules">
        <Row>
          <Col span="20" offset="1">
            <div class="role_title">角色信息</div>
          </Col>
        </Row>
        <Row>
          <Col span="3" offset="3">
            <FormItem class="ivu-form-item-required" label="角色名称">
            </FormItem>
          </Col>
          <Col span="16" v-if="modal_title === '新增角色'">
            <FormItem prop="roleName">
              <div style="position: relative;">
                <Input v-model="data_info.roleName" placeholder="2-10字以内"></Input>
              </div>
            </FormItem>
          </Col>
          <Col span="16" v-if="modal_title === '修改角色'">
            <FormItem>
              {{data_info.roleName}}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="3" offset="3">
            <FormItem class="ivu-form-item-required" label="角色说明">
            </FormItem>
          </Col>
          <Col span="16">
            <FormItem prop="remark">
              <Input v-model="data_info.remark" placeholder="2-10字以内"
                     type="textarea" :autosize="{minRows: 2,maxRows: 5}">
              </Input>
            </FormItem>
          </Col>
        </Row>
      </Form>

      <Row>
        <Col span="20" offset="3">
          <div class="footer_modal">
            <Button type="ghost" class="sub_btn_size" @click="form_reset('role_form')">取消</Button>
            <Button type="primary" class="sub_btn_size" @click="form_submit('role_form')">保存</Button>
          </div>
        </Col>
      </Row>
    </Modal>

    <div class="page_btm_div" v-if="page_total">
      <Page class="page_iview_right" :total="page_total" :current="page_no" :page-size="page_num_opts[page_num_select]"
            size="small"
            :page-size-opts="page_num_opts"
            show-elevator show-sizer show-total placement="top"
            @on-page-size-change="page_size_chage"
            @on-change="page_change"></Page>
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
        modal_display: false,
        modal_title: "新增客户",
        search_input: "",
        form_rules: {
          roleName: [
            {required: true, message: '角色名称不能为空', trigger: 'blur'},
          ],
          remark: [
            {required: true, message: '角色说明不能为空', trigger: 'blur'},
            {type: 'string', min: 2, max: 10, message: '2-10字以内', trigger: 'blur'}
          ]
        },
        table_head: [
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
            title: '邮箱',
            key: 'email'
          },
          {
            title: '手机号',
            key: 'mobile'
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
                    title: "确定要删除所选角色吗?",
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
      page_num_opts: "system/page_num_opts",
      page_num_select: "system/page_num_select",
      page_no: "system/page_no",
      page_total: "system/page_total",
      data_list: "system/data_list",
      data_info: "system/data_info",
      user_name: "login/userName"
    }),
    methods: {
      search_input_change(event) {
        let data = {
          pageNo: this.pageNo,
          pageNum: this.page_num_opts[this.page_num_select],
          condition: this.search_input
        };
        this.$store.dispatch('system/get_list', data);
      },

      page_change(page) {
        let data = {
          pageNo: page,
          pageNum: this.page_num_opts[this.page_num_select],
        };
        this.$store.dispatch('system/get_list', data);
      },

      page_size_chage(page_size) {
        let data = {
          pageNo: this.pageNo,
          pageNum: page_size,
        };
        this.$store.dispatch('system/get_list', data);
      },

      create_role() {
        this.$store.dispatch('system/reset_info').then(() => {
          this.modal_title = "新增角色";
          this.modal_display = true;
        })
      },

      form_submit(name) {
        let data = {
          pageNo: this.pageNo,
          pageNum: this.page_num_opts[this.page_num_select],
        };

        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.modal_title === '修改角色') {
              this.$store.dispatch('system/mdf_info').then((response) => {
                if (response.data.respCode === '0') {
                  this.$store.dispatch('system/get_list', data);
                  this.modal_display = false;
                }else if (response.data.respCode == '1') {
                  this.$Message.error(response.data.msg);
                }
              });
            } else {
              if (this.data_info.role_perm && Array.isArray(this.data_info.role_perm)
                && this.data_info.role_perm.length) {
                this.$store.dispatch('system/add_info', this.user_name).then((response) => {
                  if (response.data.respCode === '0') {
                    this.$store.dispatch('system/get_list', data);
                    this.modal_display = false;
                  }else if (response.data.respCode == '1') {
                    this.$Message.error(response.data.msg);
                  }
                });
              }
            }
          }
        });
      },

      form_reset(name) {
        this.modal_display = false;
      },

      modify(row) {
        this.$store.dispatch('system/get_info', {roleId: row.roleId}).then((response) => {
          this.modal_title = "修改角色";
          this.modal_display = true;
        });
      },

      delete(row) {
        this.$store.dispatch('system/get_info', {roleId: row.roleId}).then((response) => {
          this.$store.dispatch('system/del_info').then((response) => {
            if (response.data.respCode === '0') {
              this.$Message.success(response.data.msg);
              let data = {
                pageNo: this.pageNo,
                pageNum: this.page_num_opts[this.page_num_select],
              };
              this.$store.dispatch('system/get_list', data);
            }else if(response.data.respCode === '1'){
              this.$Message.error(response.data.msg);
            }
          });
        });
      },

      render_role_tree(h, {root, node, data}) {
        return h('span', {}, [
          h('span', [
            h('span', data.title)
          ])
        ]);
      },

      role_check_change(r) {
      },
    },
    created() {
      this.tabHeight = (document.documentElement.clientHeight - 160 - 40);
      let data = {
        pageNo: this.pageNo,
        pageNum: this.page_num_opts[this.page_num_select],
      };
      this.$store.dispatch('system/get_list', data);
      this.$store.dispatch('system/get_init_perm').then((response) => {
        if (response.data.respCode === '0') {
          this.$store.dispatch('system/reset_info');
        }
      })
    }
  };
</script>

<style lang="less">
  .role_title {
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
