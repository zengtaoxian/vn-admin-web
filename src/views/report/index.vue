<template>
  <div class="app-container">
    <list-t :searchPlace="searchPlace" :searchInput="searchInput" :dataList="dataList" :tableHead="tableHead"
            :itemDisplay="itemDisplay" :itemTitle="itemTitle" :loading="loading" :dataInfo="dataInfo"
            :pageTotal="pageTotal" :pageNo="pageNo" :pageNumOpts="pageNumOpts" :pageNumSelect="pageNumSelect"
            @closeDialog="closeDialog"
            @createItem="createItem" @searchInputChange="searchInputChange" @modifyItem="modifyItem"
            @deleteItem="deleteItem" @pageSizeChange="pageSizeChange" @pageChange="pageChange">
      <template slot-scope="scope" slot="item">
        <el-form ref="itemForm" :model="dataInfo" :rules="formRules" :label-width="scope.itemLabelWidth">
          <el-form-item label="号码" prop="mobile">
            <el-input v-model="dataInfo.mobile"></el-input>
          </el-form-item>
          <el-form-item label="归属" prop="attribution">
            <el-input v-model="dataInfo.attribution"></el-input>
          </el-form-item>
          <el-form-item label="状态" v-if="itemTitle == '修改号码'">
            <el-radio-group v-model="dataInfo.status" size="mini">
              <el-radio label="专用"></el-radio>
              <el-radio label="通用"></el-radio>
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
  import {validateMobile} from "../../utils/validate"

  export default {
    name: 'report',
    components: {
      ListT,
    },
    data() {
      return {
        loading: false,
        itemDisplay: false,
        itemTitle: "新增号码",
        searchPlace: "号码/归属",
        searchInput: "",
        formRules: {
          mobile: [
            {required: true, trigger: 'blur', validator:validateMobile},
          ],
          attribution: [
            {required: true, message: '归属不能为空', trigger: 'blur'},
          ],
        },
        tableHead: [
          {
            label: '号码',
            prop: 'mobile'
          },
          {
            label: '状态',
            prop: 'status'
          },
          {
            label: '归属',
            prop: 'attribution'
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
    computed: mapGetters('report', {
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
            attribution: this.searchInput,
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
          this.itemTitle = "新增号码"
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
            if (this.itemTitle === '修改号码') {
              this.$store.dispatch(this.$options.name + '/mdfInfo').then((response) => {
                if (response.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
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
                  });
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
          this.itemTitle = "修改号码"
          this.itemDisplay = true
        })
      },

      deleteItem(row) {
        this.$confirm('确定删除号码?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch(this.$options.name + '/delInfo', row).then((response) => {
            if (response.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });

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
          });
        });
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
