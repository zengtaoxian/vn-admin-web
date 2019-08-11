<template>
  <div class="app-container">
    <list-template :searchPlace="searchPlace" :searchInput="searchInput" :dataList="dataList" :tableHead="tableHead"
                   :itemDisplay="itemDisplay" :itemTitle="itemTitle" :loading="loading" :dataInfo="dataInfo"
                   :pageTotal="pageTotal" :pageNo="pageNo" :pageNumOpts="pageNumOpts" :pageNumSelect="pageNumSelect"
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
        </el-form>
      </template>
      <template slot="button">
        <el-button size="small" @click="formReset('itemForm')">取消</el-button>
        <el-button size="small" type="primary" @click="formSubmit('itemForm')">确定</el-button>
      </template>
    </list-template>
  </div>
</template>
<script>
  import {mapGetters} from "vuex"
  import ListTemplate from "../../components/ListTemplate"
  import {validateEmail, validateMobile} from "../../utils/validate"

  export default {
    name: 'client',
    components: {
      ListTemplate
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
            {required: true, trigger: 'blur', validator:validateEmail},
          ],
          mobile: [
            {required: true, trigger: 'blur', validator:validateMobile},
          ]
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
    computed: mapGetters({
      pageNumOpts: "client/pageNumOpts",
      pageNumSelect: "client/pageNumSelect",
      pageNo: "client/pageNo",
      pageTotal: "client/pageTotal",
      dataList: "client/dataList",
      dataInfo: "client/dataInfo"
    }),
    methods: {
      searchInputChange(searchInput) {
        this.searchInput = searchInput
        let data = {
          page: this.pageNo,
          limit: this.pageNumOpts[this.pageNumSelect],
        }
        if (searchInput) {
          data['like'] = {
            userId: searchInput,
            userName: searchInput,
            email: searchInput,
            mobile: searchInput
          }
        }
        this.$store.dispatch('client/getList', data)
      },

      pageChange(page) {
        let data = {
          page: page,
          limit: this.pageNumOpts[this.pageNumSelect],
        }
        this.$store.dispatch('client/getList', data)
      },

      pageSizeChange(page_size) {
        let data = {
          page: this.pageNo,
          limit: page_size,
        }
        this.$store.dispatch('client/getList', data)
      },

      createItem() {
        this.$store.dispatch('client/resetInfo').then(() => {
          this.itemTitle = "新增客户"
          this.itemDisplay = true
        })
      },

      formSubmit(name) {
        let data = {
          page: this.pageNo,
          limit: this.pageNumOpts[this.pageNumSelect],
        }

        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.itemTitle === '修改客户') {
              this.$store.dispatch('client/mdfInfo').then((response) => {
                if (response.code === 0) {
                  this.$store.dispatch('client/getList', data)
                  this.itemDisplay = false
                } else {
                  this.$Message.error(response.msg)
                }
              })
            } else {
              this.$store.dispatch('client/addInfo').then((response) => {
                console.log(response)
                if (response.code === 0) {
                  this.$store.dispatch('client/getList', data)
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
        this.$store.dispatch('client/getInfo', row).then((response) => {
          this.itemTitle = "修改客户"
          this.itemDisplay = true
        })
      },

      deleteItem(row) {
        this.$store.dispatch('client/delInfo', row).then((response) => {
          if (response.code === 0) {
            this.$Message.success(response.msg)
            let data = {
              page: this.pageNo,
              limit: this.pageNumOpts[this.pageNumSelect],
            }
            this.$store.dispatch('client/getList', data)
          } else {
            this.$Message.error(response.msg)
          }
        })
      },
    },
    created() {
      let data = {
        page: this.pageNo,
        limit: this.pageNumOpts[this.pageNumSelect],
      }
      this.$store.dispatch('client/getList', data)
      this.$store.dispatch('client/resetInfo')
    }
  }
</script>

<style lang="scss">
</style>
