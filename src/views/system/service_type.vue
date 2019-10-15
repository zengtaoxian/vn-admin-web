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
          <el-form-item label="名称" prop="name">
            <el-input v-model="dataInfo.name"></el-input>
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

    export default {
        name: 'service_type',
        components: {
            ListT
        },
        data() {
            return {
                loading: false,
                itemDisplay: false,
                itemTitle: "新增类型",
                searchPlace: "名称",
                searchInput: "",
                dataInfo: "",
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
            ...mapGetters('service_type', {
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
                    name: '',
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
                this.itemTitle = "新增类型";
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
                        if (this.itemTitle === '修改类型') {
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
                    this.itemTitle = "修改类型";
                    this.itemDisplay = true
                })
            },

            deleteItem(row) {
                this.$confirm('确定删除类型?', '提示', {
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
