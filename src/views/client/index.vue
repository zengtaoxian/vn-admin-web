<template>
  <div class="app-container">
    <el-row>
      <el-col :offset="1" :span="2">
        <el-button size="small" type="primary" icon="el-icon-plus" @click="createItem">添加
        </el-button>
      </el-col>
      <el-col :offset="13" :span="6">
        <el-input size="small" placeholder="ID/名称/邮箱/手机号" @on-enter="searchInputChange" v-model.trim="searchInput">
          <el-button slot="append" icon="el-icon-search" @click="searchInputChange"></el-button>
        </el-input>
      </el-col>
    </el-row>

    <el-table :data="dataList" :v-loading="loading">
      <el-table-column
        type="index"
        label="序号"
        :index="headIndex">
      </el-table-column>

      <el-table-column
        v-for="col in tableHead"
        :prop="col.prop" :label="col.label" :key="col.prop">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="12">
              <i
                class="el-icon-edit"
                @click="modifyItem(scope.row)">
                修改
              </i>
            </el-col>
            <el-col :span="12">
              <i
                class="el-icon-delete"
                @click="deleteItem(scope.row)">
                删除
              </i>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="itemDisplay" :title="itemTitle" v-loading="loading" width="35%">
      <el-form ref="itemForm" :model="dataInfo" :rules="formRules" label-width="15%">
        <el-form-item label="名称">
          <el-input v-model="dataInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="dataInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="dataInfo.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="formReset('itemForm')">取 消</el-button>
          <el-button size="small" type="primary" @click="formSubmit('itemForm')">确 定</el-button>
        </span>
    </el-dialog>

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
  import {mapGetters} from "vuex"

  export default {
    data() {
      return {
        loading: false,
        itemDisplay: false,
        itemTitle: "新增客户",
        searchInput: "",
        formRules: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ]
        },
        tableHead: [
          {
            label: '名称',
            prop: 'name'
          },
          {
            label: '邮箱',
            prop: 'email'
          },
          {
            label: '手机号',
            prop: 'mobile'
          },
          {
            label: '余额',
            prop: 'balance'
          },
          {
            label: '透支额度',
            prop: 'overdraft'
          },
          {
            label: '开户人',
            prop: 'createUser'
          },
          {
            label: '创建时间',
            prop: 'createTime'
          },
          {
            label: '更新时间',
            prop: 'updateTime'
          },
        ]
      }
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
      headIndex(index) {
        return index + 1
      },

      searchInputChange(event) {
        this.$message.error("searchInputChange")
        let data = {
          pageNo: this.pageNo,
          pageNum: this.pageNumOpts[this.pageNumSelect],
          condition: this.searchInput
        }
        this.$store.dispatch('client/getList', data)
      },

      pageChange(page) {
        let data = {
          pageNo: page,
          pageNum: this.pageNumOpts[this.pageNumSelect],
        }
        this.$store.dispatch('client/getList', data)
      },

      pageSizeChage(page_size) {
        let data = {
          pageNo: this.pageNo,
          pageNum: page_size,
        }
        this.$store.dispatch('client/getList', data)
      },
      createItem() {
        this.$message.error("create")
        this.$store.dispatch('client/resetInfo').then(() => {
          this.itemTitle = "新增客户"
          this.itemDisplay = true
        })
      },

      formSubmit(name) {
        let data = {
          pageNo: this.pageNo,
          pageNum: this.pageNumOpts[this.pageNumSelect],
        }

        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.itemTitle === '修改客户') {
              this.$store.dispatch('client/mdfInfo').then((response) => {
                if (response.code === 0) {
                  this.$store.dispatch('client/getList', data)
                  this.itemDisplay = false
                } else {
                  this.$Message.error(response.desc)
                }
              })
            } else {
              this.$store.dispatch('client/addInfo').then((response) => {
                if (response.code === 0) {
                  this.$store.dispatch('client/getList', data)
                  this.itemDisplay = false
                } else {
                  this.$Message.error(response.desc)
                }
              })
            }
          }
        })
      },

      formReset(name) {
        this.itemDisplay = false
      },

      modifyItem(row) {
        this.$store.dispatch('client/getInfo').then((response) => {
          this.itemTitle = "修改客户"
          this.itemDisplay = true
        })
      },

      deleteItem(row) {
        this.$store.dispatch('client/getInfo').then((response) => {
          this.$store.dispatch('client/delInfo').then((response) => {
            if (response.code === 0) {
              this.$Message.success(response.desc)
              let data = {
                pageNo: this.pageNo,
                pageNum: this.pageNumOpts[this.pageNumSelect],
              }
              this.$store.dispatch('client/getList', data)
            } else {
              this.$Message.error(response.desc)
            }
          })
        })
      },
    },
    created() {
      let data = {
        pageNo: this.pageNo,
        pageNum: this.pageNumOpts[this.pageNumSelect],
      }
      this.$store.dispatch('client/getList', data)
      this.$store.dispatch('client/resetInfo')
    }
  }
</script>

<style lang="scss">
</style>
