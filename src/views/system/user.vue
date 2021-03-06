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
          <el-form-item label="名称" prop="username">
            <el-input v-model="dataInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="dataInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="dataInfo.mobile"></el-input>
          </el-form-item>
          <el-form-item label="状态" v-if="itemTitle.slice(0,2) === '修改'">
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

  let moduleName = 'user'
  let moduleTitle = "用户"
  export default {
    name: moduleName,
    components: {
      ListT
    },
    data() {
      return {
        loading: false,
        itemDisplay: false,
        itemTitle: "新增" + moduleTitle,
        searchPlace: "UID/名称/邮箱/手机号",
        searchInput: "",
        dataInfo: "",
        formRules: {
          username: [
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
            "1": "启用"
          }
        },
        tableHead: [
          {
            label: 'UID',
            prop: 'uid',
          },
          {
            label: '名称',
            prop: 'username'
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
            label: '开户人',
            prop: 'create_user'
          },
          {
            label: '创建时间',
            prop: 'create_time'
          },
          {
            label: '更新时间',
            prop: 'update_time'
          },
        ]
      }
    },
    computed: {
      ...mapGetters(moduleName, {
        pageNumOpts: "pageNumOpts",
        pageNumSelect: "pageNumSelect",
        pageNo: "pageNo",
        pageTotal: "pageTotal",
        dataList: "dataList"
      }),
      ...mapGetters('login', {
        loginUid: "uid"
      })
    },
    methods: {
      clearInfo() {
        this.dataInfo = {
          uid: '',
          username: '',
          email: '',
          mobile: '',
          balance: '',
          overdraft: '',
          create_user: '',
          create_time: '',
          update_time: ''
        };
      },

      addSearchInput(data) {
        if (this.searchInput) {
          data['search'] = this.searchInput
        }
      },

      searchInputChange(searchInput) {
        this.searchInput = searchInput;
        let data = {
          page: 1,
          limit: this.pageNumSelect,
        };
        this.addSearchInput(data);
        this.$store.dispatch(this.$options.name + '/getList', data)
      },

      pageChange(page) {
        let data = {
          page: page,
          limit: this.pageNumSelect,
        };
        this.addSearchInput(data);
        this.$store.dispatch(this.$options.name + '/getList', data)
      },

      pageSizeChange(pageSize) {
        let data = {
          page: this.pageNo,
          limit: pageSize,
        };
        this.addSearchInput(data);
        this.$store.dispatch(this.$options.name + '/getList', data)
      },

      createItem() {
        this.clearInfo();
        this.itemTitle = "新增" + moduleTitle;
        this.itemDisplay = true
      },

      formSubmit(name) {
        let data = {
          page: this.pageNo,
          limit: this.pageNumSelect,
        };
        this.addSearchInput(data);

        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.itemTitle === '修改' + moduleTitle) {
              this.$store.dispatch(this.$options.name + '/mdfInfo', this.dataInfo).then((response) => {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
                this.$store.dispatch(this.$options.name + '/getList', data);
                this.itemDisplay = false
              }).catch((error) => {
                this.$message({
                  type: 'error',
                  message: error.data,
                  duration: 2 * 1000
                })
              })
            } else {
              this.dataInfo['create_user'] = this.loginUid;
              this.$store.dispatch(this.$options.name + '/addInfo', this.dataInfo).then((response) => {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                });
                this.$store.dispatch(this.$options.name + '/getList', data);
                this.itemDisplay = false
              }).catch((error) => {
                this.$message({
                  type: 'error',
                  message: error.data,
                  duration: 2 * 1000
                })
              })
            }
          }
        })
      },

      formReset(name) {
        this.$refs[name].clearValidate();
        this.itemDisplay = false
      },

      modifyItem(row) {
        this.$store.dispatch(this.$options.name + '/getInfo', row).then((response) => {
          this.dataInfo = response;
          this.itemTitle = "修改" + moduleTitle;
          this.itemDisplay = true
        })
      },

      deleteItem(row) {
        this.$confirm('确定删除' + moduleTitle + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch(this.$options.name + '/delInfo', row).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });

            let data = {
              page: this.pageNo,
              limit: this.pageNumSelect,
            };
            this.addSearchInput(data);
            this.$store.dispatch(this.$options.name + '/getList', data)
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
            this.$message({
              type: 'success',
              message: '重置成功!'
            });

            let data = {
              page: this.pageNo,
              limit: this.pageNumSelect,
            };
            this.addSearchInput(data);
            this.$store.dispatch(this.$options.name + '/getList', data)
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
      };
      this.addSearchInput(data);
      this.clearInfo();
      this.$store.dispatch(this.$options.name + '/getList', data);
    }
  }
</script>

<style lang="scss">
</style>
