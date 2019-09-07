<template>
  <div>
    <el-row>
      <el-col :offset="1" :span="2">
        <el-button size="small" type="primary" icon="el-icon-plus" @click="$emit('createItem')">添加
        </el-button>
      </el-col>
      <el-col :offset="13" :span="6">
        <el-input size="small" :placeholder="searchPlace" @change="$emit('searchInputChange', curSearchInput)"
                  v-model.trim="curSearchInput">
          <el-button slot="append" icon="el-icon-search"
                     @click="$emit('searchInputChange', curSearchInput)"></el-button>
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
        <template slot-scope="scope">
          <div v-if="col.prop in dataDict">
            {{dataDict[col.prop][scope.row[col.prop]]}}
          </div>
          <div v-else>
            {{scope.row[col.prop]}}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="6">
              <i
                class="el-icon-edit"
                @click="$emit('modifyItem', scope.row)">
              </i>
            </el-col>
            <el-col :span="6">
              <i
                class="el-icon-delete"
                @click="$emit('deleteItem', scope.row)">
              </i>
            </el-col>
            <el-col :span="6" v-if="reset">
              <i
                class="el-icon-refresh"
                @click="$emit('resetItem', scope.row)">
              </i>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible="itemDisplay" :title="itemTitle" v-loading="loading" width="35%"
               :before-close="handleClose">
      <slot :itemLabelWidth="itemLabelWidth" name="item"></slot>
      <span slot="footer" class="dialog-footer">
        <slot name="button"></slot>
      </span>
    </el-dialog>

    <div v-if="pageTotal">
      <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="pageTotal"
                     :current-page.sync="curPageNo" :page-size.sync="curPageNumSelect"
                     size="small"
                     background
                     :page-sizes="pageNumOpts"
                     @size-change="$emit('pageSizeChange', curPageNumSelect)"
                     @current-change="$emit('pageChange', curPageNo)">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ListT",
    data() {
      return {
        itemLabelWidth: "18%",
        curSearchInput: this.searchInput,
        curPageNo: this.pageNo,
        curPageNumSelect: this.pageNumSelect,
      }
    },
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
      },
      reset: {
        type: Boolean
      },
      dataDict: {
        type: Object
      }
    },
    methods: {
      headIndex(index) {
        return index + 1
      },
      handleClose(done) {
        this.$emit('closeDialog')
        done()
      }
    }
  }
</script>

<style scoped>

</style>
