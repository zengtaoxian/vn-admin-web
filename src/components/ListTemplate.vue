<template>
  <div>
    <el-row>
      <el-col :offset="1" :span="2">
        <el-button size="small" type="primary" icon="el-icon-plus" @click="$emit('createItem')">添加
        </el-button>
      </el-col>
      <el-col :offset="13" :span="6">
        <el-input size="small" :placeholder="searchPlace" @on-enter="$emit('searchInputChange')"
                  v-model.trim="searchInput">
          <el-button slot="append" icon="el-icon-search" @click="$emit('searchInputChange')"></el-button>
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
                @click="$emit('modifyItem', scope.row)">
                修改
              </i>
            </el-col>
            <el-col :span="12">
              <i
                class="el-icon-delete"
                @click="$emit('deleteItem', scope.row)">
                删除
              </i>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="itemDisplay" :title="itemTitle" v-loading="loading" width="35%">
      <el-form ref="itemForm" :model="dataInfo" :rules="formRules" label-width="15%">
        <slot name="addDataInfo"></slot>
        <slot></slot>
      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="$emit('formReset')">取消</el-button>
          <el-button size="small" type="primary" @click="$emit('formSubmit', 'itemForm')">确定</el-button>
        </span>
    </el-dialog>

    <div v-if="pageTotal">
      <el-pagination layout="prev, pager, next" :total="pageTotal"
                     :current-page="pageNo" :page-size="pageNumOpts[pageNumSelect]"
                     size="small"
                     :page-sizes="pageNumOpts"
                     @size-change="$emit('pageSizeChange')"
                     @current-change="$emit('pageChange')">
      </el-pagination>
    </div>
  </div>
</template>

<script>
    export default {
        name: "listTemplate",
        props: {
            searchPlace: {
                type: String,
                required: true
            },
            searchInput: {
                type: String,
                required: true
            },
            dataList: {
                type: Array,
                required: true
            },
            tableHead: {
                type: Array,
                required: true
            },
            itemDisplay: {
                type: Boolean,
                required: true
            },
            itemTitle: {
                type: String,
                required: true
            },
            loading: {
                type: Boolean,
                required: true
            },
            dataInfo: {
                type: Object,
                required: true
            },
            formRules: {
                type: Object,
                required: true
            },
            pageTotal: {
                type: Number,
                required: true
            },
            pageNo: {
                type: Number,
                required: true
            },
            pageNumOpts: {
                type: Array,
                required: true
            },
            pageNumSelect: {
                type: Number,
                required: true
            }
        },
        methods: {
            headIndex(index) {
                return index + 1
            },
        }
    }
</script>

<style scoped>

</style>
