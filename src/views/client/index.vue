<template>
  <div class="app-container">
    <list-t :searchPlace="searchPlace" :searchInput="searchInput" :dataList="dataList" :tableHead="tableHead"
            :itemDisplay="itemDisplay" :itemTitle="itemTitle" :loading="loading" :dataInfo="dataInfo"
            :dataDict="dataDict"
            :pageTotal="pageTotal" :pageNo="pageNo" :pageNumOpts="pageNumOpts" :pageNumSelect="pageNumSelect"
            @closeDialog="closeDialog" :reset="true" @resetItem="resetItem"
            @createItem="createItem" @searchInputChange="searchInputChange" @modifyItem="modifyItem"
            @deleteItem="deleteItem" @pageSizeChange="pageSizeChange" @pageChange="pageChange">
      <template slot-scope="scope" slot="item">
        <el-form ref="itemForm" :model="dataInfo" :rules="formRules" :label-width="scope.itemLabelWidth">
          <el-form-item label="名称" prop="userName">
            <el-input v-model="dataInfo.userName"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="dataInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="dataInfo.mobile"></el-input>
          </el-form-item>
          <el-form-item label="状态" v-if="itemTitle == '修改客户'">
            <el-radio-group v-model="dataInfo.status" size="mini">
              <el-radio :label="1">{{dataDict["status"]["1"]}}</el-radio>
              <el-radio :label="0">{{dataDict["status"]["0"]}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </template>
      <template slot="button">
        <el-button size="small" @click="formReset('itemForm')">取消</el-button>
        <el-button size="small" type="primary" @click="formSubmit('itemForm')">确定</el-button>
      </template>
    </list-t>
  </div>
</template>
<script>
  import {mapGetters} from "vuex"
  import ListT from '@/components/ListT'
  import {validateEmail, validateMobile} from "../../utils/validate"

  export default {
    name: 'client',
    components: {
      ListT
    },
    data() {
      return {
        loading: false,
        itemDisplay: false,
        itemTitle: "新增客户",
        searchPlace: "ID/名称/邮箱/手机号",
        searchInput: "",
        formRules: {
          userName: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ],
          email: [
            {required: true, trigger: 'blur', validator: validateEmail},
          ],
          mobile: [
            {required: true, trigger: 'blur', validator: validateMobile},
          ]
        },
        dataDict: {
          "status": {
            "0": "禁用",
            "1": "正常"
          }
        },
        tableHead: [
          {
            label: 'ID',
            prop: 'userId',
          },
          {
            label: '名称',
            prop: 'userName'
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
            label: '状态',
            prop: 'status'
          },
          {
            label: '余额',
            prop: 'balance'
          },
          {
            label: '透支额度',
            prop: 'overdraftLimit'
          },
          {
            label: '开户人',
            prop: 'aoName'
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
    computed: mapGetters('client', {
      pageNumOpts: "pageNumOpts",
      pageNumSelect: "pageNumSelect",
      pageNo: "pageNo",
      pageTotal: "pageTotal",
      dataList: "dataList",
      dataInfo: "dataInfo"
    }),
    methods: {
      addSearchInput(data) {
        if (this.searchInput) {
          data['like'] = {
            userId: this.searchInput,
            userName: this.searchInput,
            email: this.searchInput,
            mobile: this.searchInput
          }
        }
      },

      searchInputChange(searchInput) {
        this.searchInput = searchInput
        let data = {
          page: 1,
          limit: this.pageNumSelect,
        }
        this.addSearchInput(data)
        this.$store.dispatch(this.$options.name + '/getList', data)
      },

      pageChange(page) {
        let data = {
          page: page,
          limit: this.pageNumSelect,
        }
        this.addSearchInput(data)
        this.$store.dispatch(this.$options.name + '/getList', data)
      },

      pageSizeChange(page_size) {
        let data = {
          page: this.pageNo,
          limit: page_size,
        }
        this.addSearchInput(data)
        this.$store.dispatch(this.$options.name + '/getList', data)
      },

      createItem() {
        this.$store.dispatch(this.$options.name + '/clearInfo').then(() => {
          this.itemTitle = "新增客户"
          this.itemDisplay = true
        })
      },

      formSubmit(name) {
        let data = {
          page: this.pageNo,
          limit: this.pageNumSelect,
        }
        this.addSearchInput(data)

        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.itemTitle === '修改客户') {
              this.$store.dispatch(this.$options.name + '/mdfInfo').then((response) => {
                if (response.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  this.$store.dispatch(this.$options.name + '/getList', data)
                  this.itemDisplay = false
                } else {
                  this.$Message.error(response.msg)
                }
              })
            } else {
              this.$store.dispatch(this.$options.name + '/addInfo').then((response) => {
                if (response.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  })
                  this.$store.dispatch(this.$options.name + '/getList', data)
                  this.itemDisplay = false
                } else {
                  this.$Message.error(response.msg)
                }
              })
            }
          }
        })
      },

      formReset(name) {
        this.$refs[name].clearValidate()
        this.itemDisplay = false
      },

      modifyItem(row) {
        this.$store.dispatch(this.$options.name + '/getInfo', row).then((response) => {
          this.itemTitle = "修改客户"
          this.itemDisplay = true
        })
      },

      deleteItem(row) {
        this.$confirm('确定删除客户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch(this.$options.name + '/delInfo', row).then((response) => {
            if (response.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })

              let data = {
                page: this.pageNo,
                limit: this.pageNumSelect,
              }
              this.addSearchInput(data)
              this.$store.dispatch(this.$options.name + '/getList', data)
            } else {
              this.$Message.error(response.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除!'
          })
        })
      },

      resetItem(row) {
        this.$confirm('确定重置密码?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch(this.$options.name + '/resetInfo', row).then((response) => {
            if (response.code === 0) {
              this.$message({
                type: 'success',
                message: '重置成功!'
              })

              let data = {
                page: this.pageNo,
                limit: this.pageNumSelect,
              }
              this.addSearchInput(data)
              this.$store.dispatch(this.$options.name + '/getList', data)
            } else {
              this.$Message.error(response.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消重置!'
          })
        })
      },

      closeDialog() {
        this.itemDisplay = false
      }
    },

    created() {
      let data = {
        page: this.pageNo,
        limit: this.pageNumSelect
      }
      this.addSearchInput(data)
      this.$store.dispatch(this.$options.name + '/getList', data)
      this.$store.dispatch(this.$options.name + '/clearInfo')
    }
  }
</script>

<style lang="scss">
</style>
