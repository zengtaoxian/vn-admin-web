<template>
  <el-table
    border
    :data="tableData3"
    style="width: 100%"
    @sort-change="sortChange"
    :default-sort="{prop:'date',order:'descending'}"
    height="250">
    <el-table-column
    fixed
    sortable
    prop="date"
    label="日期"
    min-width="120">
  </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      min-width="500">
    </el-table-column>
    <el-table-column
      prop="age"
      label="年龄"
      sortable="custom"
      min-width="100">
    </el-table-column>
    <el-table-column
      :filters="[{text:'上海',value:'上海'},{text:'南京',value:'南京'},{text:'赣州',value:'赣州'},{text:'广州',value:'广州'},{text:'南昌',value:'南昌'},{text:'深圳',value:'深圳'},{text:'江西',value:'江西'}]"
      :filtered-value="filteredValue"
      :filter-method="filterTag"
      filter-placement="bottom-end"
      prop="province"
      label="省份"
      min-width="300">
      <template slot-scope="scope">
        <p v-if="scope.row.province == '上海'">11111</p>
        <p v-else>{{scope.row.province}}</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="city"
      label="市区"
      :render-header="renderHeader"
      min-width="300">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址"
      min-width="300"
      show-overflow-tooltip
    >
    </el-table-column>
    <el-table-column
      prop="zip"
      label="邮编"
      min-width="400">
    </el-table-column>
    <el-table-column
      prop="zip"
      label="操作"
      min-width="400">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="deleteRow(scope.$index, tableData3)"
          type="text"
          size="small">
          移除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    data() {
      return {
        filteredValue:[],
        tableData3: [{
          date: '2018-05-03',
          name: '王小虎',
          age: 12,
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: '王小虎',
          age: 12,
          province: '南京',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          age: 12,
          province: '赣州',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          age: 12,
          province: '广州',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-08',
          name: '王小虎',
          age: 12,
          province: '南昌',
          city: '普陀区',
          address: '上海市普陀区金沙江路1518弄',
          zip: 200333
        }, {
          date: '2016-05-06',
          name: '王小虎',
          age: 12,
          province: '深圳',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-07',
          name: '王小虎',
          age: 12,
          province: '江西',
          city: '上海市普陀区金沙江路 1518 弄',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }]
      }
    },
    methods: {
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      sortChange(name, index) {
        //排序回回调事件
        // name 表示当前列数据
        //index排序顺序
        console.log(name)
        console.log(index)
      },
      filterTag(value, row) {
        console.log(this.filteredValue)
        console.log('-------------bbbbbbbbbb')
        console.log(row)
        return row.province == value
      },
      renderHeader(h, {column}) {
        console.log('----------aaaaaaaaaaaa')
        console.log(column)
//        console.log(item)
        return h(
          'p',
          [
            h('span', [column.label + '渲染函数'], {
            })
          ]
        );

//        renderHeader(createElement, { column }) {
//          return createElement(
//            'div',
//            [
//              createElement('a', ['==' + column.label + '=='], {
//                attrs: {
//                  href: '#test'
//                }
//              })
//            ]
//          );
//        }


      }
    },
  }
</script>
<style>
  .el-table .cell {
    white-space: nowrap !important;
  }
</style>
