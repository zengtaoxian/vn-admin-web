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
            <el-autocomplete value-key="userName" v-model="clientValue"
                             :fetch-suggestions="querySearch"></el-autocomplete>
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
        name: 'number',
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
                clientValue: "",
                dataInfo: "",
                formRules: {
                    mobile: [
                        {required: true, trigger: 'blur', validator: validateMobile},
                    ]
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
                        prop: 'user_id'
                    },
                    {
                        label: '归属',
                        prop: 'user_id'
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
            ...mapGetters('number', {
                pageNumOpts: "pageNumOpts",
                pageNumSelect: "pageNumSelect",
                pageNo: "pageNo",
                pageTotal: "pageTotal",
                dataList: "dataList"
            }),
            ...mapGetters('client', {
                clientList: "dataList"
            })
        },
        methods: {
            clearInfo() {
                this.dataInfo = {
                    id: '',
                    mobile: '',
                    status: '',
                    consumerId: '',
                    createTime: '',
                    updateTime: ''
                };
            },
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

            pageSizeChange(pageSize) {
                let data = {
                    page: this.pageNo,
                    limit: pageSize,
                }
                this.addSearchInput(data)
                this.$store.dispatch(this.$options.name + '/getList', data)
            },

            createItem() {
                this.clearInfo()
                this.itemTitle = "新增号码"
                this.itemDisplay = true
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
                            this.$store.dispatch(this.$options.name + '/mdfInfo', this.dataInfo).then((response) => {
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
                            this.dataInfo["consumerId"] = this.getQueryItem(this.clientValue)[0].userId
                            this.$store.dispatch(this.$options.name + '/addInfo', this.dataInfo).then((response) => {
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
                    this.dataInfo = response
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
            },

            querySearch(query, cb) {
                var results = query ? this.clientList.filter(this.createFilter(query)) : this.clientList;
                cb(results);
            },

            getQueryItem(query) {
                return query ? this.clientList.filter(this.createFilter(query)) : "";
            },

            createFilter(query) {
                return (item) => {
                    return (item.userName.toLowerCase().indexOf(query.toLowerCase()) === 0);
                };
            },
        },

        created() {
            let data = {
                page: this.pageNo,
                limit: this.pageNumSelect
            }
            this.addSearchInput(data)
            this.clearInfo()
            this.$store.dispatch(this.$options.name + '/getList', data)
            this.$store.dispatch('client/getList', {})
        }
    }
</script>

<style lang="scss">
</style>
