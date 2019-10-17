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
          <el-form-item label="标题" prop="title">
            <el-input v-model="dataInfo.title"></el-input>
          </el-form-item>
          <el-form-item label="路径" prop="path">
            <el-input v-model="dataInfo.path"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-input v-model="dataInfo.icon"></el-input>
          </el-form-item>
          <el-form-item label="父菜单" prop="menu">
            <el-select v-model="dataInfo.parent" clearable placeholder="请选择" style="width: 100%">
              <el-option
                v-for="menuItem in dataList"
                :key="menuItem.id"
                :label="menuItem.title"
                :value="menuItem.id">
              </el-option>
            </el-select>
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

  let moduleName = 'menu'
  let moduleTitle = "菜单"
  export default {
    name: moduleName,
    components: {
      ListT
    },
    data() {
      return {
        loading: false,
        itemDisplay: false,
        itemTitle: "新增“" + moduleTitle,
        searchPlace: "标题",
        searchInput: "",
        dataInfo: "",
        formRules: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ]
        },
        tableHead: [
          {
            label: '标题',
            prop: 'title'
          },
          {
            label: '路径',
            prop: 'path'
          },
          {
            label: '图标',
            prop: 'icon'
          },
          {
            label: '父菜单',
            prop: 'parent'
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
      })
    },
    methods: {
      clearInfo() {
        this.dataInfo = {
          title: '',
          path: '',
          icon: '',
          parent: '',
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
