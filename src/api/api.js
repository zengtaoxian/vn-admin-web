import axios from './axios';
import stores from '../store';

// let Authorization = '';
// if(localStorage.getItem('TOKEN')){
//   Authorization = JSON.parse(localStorage.getItem('TOKEN')).token;
// }

//登录
export function signin(data) {
  return axios.post('/vcloud/loginManage/login/login', data);
}

//登出
export function signout() {
  return axios.post('/vcloud/loginManage/login/logOut');
}

//获取菜单信息
export function fetch_menu_info(data) {
  return axios.post('/vcloud/loginManage/authorityService/menutTreeList', data);
}

//获取权限信息
export function fetch_perm_info(data) {
  return axios.post('/vcloud/loginManage/authorityService/menuList', data);
}

//同步获取权限信息
export function sync_perm_info(data) {
  let response = '';
  let Authorization = "";
  if (stores.state.login.token) {
    Authorization = stores.state.login.token;
  }

  $.ajax({
    type: "post",
    url: "/vcloud/loginManage/authorityService/menuList",
    async: false,
    headers: {
      'Authorization': Authorization,
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: JSON.stringify(data),
    success: function (data) {
      response = data;
    },
    error: function (data) {
      response = data;
    }
  });

  return response;
}

//获取价格包列表
export function fetchPriceList(data) {
  return axios.post('/vcloud/priceManage/price/queryPriceList', data);
}

//添加价格包
export function fetchAddPrice(data) {
  return axios.post('/vcloud/priceManage/price/add', data);
}

//更新价格包
export function fetchUpdatePrice(data) {
  return axios.post('/vcloud/priceManage/price/update', data);
}

//查询价格包基本资料
export function fetchPriceBasic(data) {
  return axios.post('/vcloud/priceManage/price/queryPriceBasic', data);
}

//查询价格包价格配置
export function fetchPriceDetail(data) {
  return axios.post('/vcloud/priceManage/price/queryPriceDetail', data);
}

//查询价格包关联商品
export function fetchPriceLinkGood(data) {
  return axios.post('/vcloud/priceManage/price/queryLinkProduct', data);
}

//查询价格包关联订单
export function fetchPriceLinkOrder(data) {
  return axios.post('/vcloud/priceManage/price/queryLinkOrder', data);
}

//价格包的上架
export function fetchPriceUpdateStatusOn(data){
  return axios.post('/vcloud/priceManage/price/updateStatusOn',data);
}

//价格包的下架
export function fetchPriceUpdateStatusOff(data){
  return axios.post('/vcloud/priceManage/price/updateStatusOff',data);
}

//删除价格包
export function fetchDelPrice(data){
  return axios.post('/vcloud/priceManage/price/delPrice',data);
}

//获取商品列表
export function fetchGoodList(data) {
  return axios.post('/vcloud/goodManage/good/queryGoodList', data);
}

//获取商品类型
export function fetchGoodType() {
  return axios.post('/vcloud/cusManage/customer/queryGoodType');
}

//获取商品类型
export function fetchUserList(data) {
  return axios.post('/vcloud/sysManage/user/query', data);
}

// 商品的上架
export function fetchGoodUpdateStatusOn(data){
	return axios.post('/vcloud/goodManage/good/updateStatusOn',data);
}

// 商品的下架
export function fetchGoodupdateStatusOff(data){
	return axios.post('/vcloud/goodManage/good/updateStatusOff',data);
}

//商品的添加
export function fetchAddGood(data){
  return axios.post('/vcloud/goodManage/good/add',data);
}

//商品详情查看
export function fetchGoodDetail(data){
  return axios.post('/vcloud/goodManage/good/queryGoodBasic',data);
}

//商品关联订单
export function fetchQueryLinkOrder(data){
  return axios.post('/vcloud/goodManage/good/queryLinkOrder',data);
}

//删除商品
export function fetchDeleteGood(data){
  return axios.post('/vcloud/goodManage/good/delGood',data);
}

//获取落地网关列表
export function fetchGetLandGateWay(){
  return axios.post('/vcloud/goodManage/good/queryLandGateWay');
}

//获取对接网关列表
export function fetchGetJoinGateWay(){
  return axios.post('/vcloud/goodManage/good/queryJoinGateWay');
}

//商品：更新挂牌包
export function fetchUpdateGp(data){
  return axios.post('/vcloud/goodManage/good/updateGp',data);
}

//商品：更新成本包
export function fetchUpdateCb(data){
  return axios.post('/vcloud/goodManage/good/updateCb',data);
}

//商品：更新网关配置
export function fetchUpdateWg(data){
  return axios.post('/vcloud/goodManage/good/updateWg',data);
}

export function fetchUpdataGood(data){
  return axios.post('/vcloud/goodManage/good/updateGood',data);
}

// 获取号段列表
export function fetch_number_info(data) {
  return axios.post('/vcloud/sysManage/numInfo/query', data);
}

// 新增号码段
export function add_number_info(data) {
  return axios.post('/vcloud/sysManage/numInfo/add', data);
}

// 删除号码段
export function del_number_info(data) {
  return axios.post('/vcloud/sysManage/numInfo/del', data);
}

// 修改号码段
export function update_number_info(data) {
  return axios.post('/vcloud/sysManage/numInfo/update', data);
}

//获取计费周期列表
export function fetchBillingList(data) {
  return axios.post('/vcloud/priceManage/cycle/query',data);
}

//删除计费周期
export function fetchBillingDel(data) {
  return axios.post('/vcloud/priceManage/cycle/del',data);
}

//添加计费周期
export function fetchBillingAdd(data) {
  return axios.post('/vcloud/priceManage/cycle/add',data);
}

// 获取国际费率列表
export function fetch_international_info(data) {
  return axios.post('/vcloud/sysManage/nationFee/query', data);
}

// 新增国际费率
export function add_international_info(data) {
  return axios.post('/vcloud/sysManage/nationFee/add', data);
}

// 删除国际费率
export function del_international_info(data) {
  return axios.post('/vcloud/sysManage/nationFee/del', data);
}

// 修改国际费率
export function update_international_info(data) {
  return axios.post('/vcloud/sysManage/nationFee/update', data);
}

// 获取系统日志分页列表
export function fetch_syslog_page_info(data) {
  return axios.post('/vcloud/sysManage/sysLog/query', data);
}

// 获取系统日志列表
export function fetch_syslog_list_info(data) {
  return axios.post('/vcloud/sysManage/sysLog/queryList', data);
}

//获取网关地址
export function fetch_gateway_info(data) {
  return axios.post('/vcloud/sysManage/gateWay/query', data);
}

//添加网关地址
export function add_gateway_info(data) {
  return axios.post('/vcloud/sysManage/gateWay/add', data);
}

//编辑网关地址
export function update_gateway_info(data) {
  return axios.post('/vcloud/sysManage/gateWay/update', data);
}

// 获取客户列表
export function fetchqueryCustomerList(data){
  return axios.post('/vcloud/cusManage/customer/queryCustomerList', data);
}

// 添加客户
export function fetchCustomerAdd(data){
  return axios.post('/vcloud/cusManage/customer/add', data);
}

// 修改客户
export function fetchCustomerUpdate(data){
  return axios.post('/vcloud/cusManage/customer/update', data);
}

//管理客户
export function fetchquerySaleMan(data){
  return axios.post('/vcloud/cusManage/customer/querySaleMan', data);
}

// 显示客户详细
export function fetchCustomerDetail(data){
  return axios.post('/vcloud/cusManage/customer/queryCustomerDetail', data);
}


//获取供应商列表(不分页)
export function fetch_getSupplierList(data) {
  return axios.post('/vcloud/supplierManage/supplier/querySupplierAll',data);
}

//********************报表模块 START********************************

// 获取客户报表
export function fetch_cust_report_info(data) {
  return axios.post('/vcloud/settlementCenter/saleDeptReport/custReport', data);
}

// 导出客户报表Excel
export function fetch_cust_excel_info(data) {
  return axios.post('/vcloud/settlementCenter/saleDeptReport/custExcel', data);
}

// 获取客户报表详单
export function fetch_custDetail_report_info(data) {
  return axios.post('/vcloud/settlementCenter/saleDeptReport/custDetailReport', data);
}

// 导出客户报表详单Excel
export function fetch_custDetail_excel_info(data) {
  return axios.post('/vcloud/settlementCenter/saleDeptReport/custDetailExcel', data);
}

// 获取销售报表
export function fetch_sales_report_info(data) {
  return axios.post('/vcloud/settlementCenter/saleDeptReport/saleReport', data);
}

// 导出销售报表Excel
export function fetch_sales_excel_info(data) {
  return axios.post('/vcloud/settlementCenter/saleDeptReport/saleExcel', data);
}

// 获取销售报表详单
export function fetch_salesDetail_report_info(data) {
  return axios.post('/vcloud/settlementCenter/saleDeptReport/saleDetailReport', data);
}

// 导出销售报表详单Excel
export function fetch_salesDetail_excel_info(data) {
  return axios.post('/vcloud/settlementCenter/saleDeptReport/saleDetailExcel', data);
}

// 获取商务报表
export function fetch_commerce_report_info(data) {
  return axios.post('/vcloud/settlementCenter/commDeptReport/commReport', data);
}

// 导出商务报表Excel
export function fetch_commerce_excel_info(data) {
  return axios.post('/vcloud/settlementCenter/commDeptReport/commExcel', data);
}

// 获取商务报表详单
export function fetch_commerceDetail_report_info(data) {
  return axios.post('/vcloud/settlementCenter/commDeptReport/commDetailReport', data);
}

// 导出商务报表详单Excel
export function fetch_commerceDetail_excel_info(data) {
  return axios.post('/vcloud/settlementCenter/commDeptReport/commDetailExcel', data);
}

// 获取商务VP报表
export function fetch_commerce_vp_report_info(data) {
  return axios.post('/vcloud/settlementCenter/commDeptReport/commVPReport', data);
}

// 导出商务VP报表Excel
export function fetch_commerce_vp_excel_info(data) {
  return axios.post('/vcloud/settlementCenter/commDeptReport/commVPExcel', data);
}

// 获取商务VP报表详单
export function fetch_commerceDetail_vp_report_info(data) {
  return axios.post('/vcloud/settlementCenter/commDeptReport/commDetailVPReport', data);
}

// 导出商务VP报表详单Excel
export function fetch_commerceDetail_vp_excel_info(data) {
  return axios.post('/vcloud/settlementCenter/commDeptReport/commDetailVPExcel', data);
}

// 获取财务报表
export function fetch_business_report_info(data) {
  return axios.post('/vcloud/settlementCenter/finaDeptReport/finaReport', data);
}

// 导出财务报表Excel
export function fetch_business_excel_info(data) {
  return axios.post('/vcloud/settlementCenter/finaDeptReport/finaExcel', data);
}

// 获取财务报表详单
export function fetch_businessDetail_report_info(data) {
  return axios.post('/vcloud/settlementCenter/finaDeptReport/finaDetailReport', data);
}

// 导出财务报表详单Excel
export function fetch_businessDetail_excel_info(data) {
  return axios.post('/vcloud/settlementCenter/finaDeptReport/finaDetailExcel', data);
}

//********************报表模块 END********************************

// 获取定时任务列表
export function fetch_taskDispatch_info(data) {
  return axios.post('/vcloud/schedulerManager/scheduler/query', data);
}

//更新定时任务列表
export function update_taskDispatch_info(data) {
  return axios.post('/vcloud/schedulerManager/scheduler/update', data);
}

//增加定时任务列表
export function add_taskDispatch_info(data) {
  return axios.post('/vcloud/schedulerManager/scheduler/add', data);
}

//修改定时任务调度状态
export function update_taskDispatch_status_info(data) {
  return axios.post('/vcloud/schedulerManager/scheduler/updateSchedulerStatus', data);
}

//获取任务运行信息
export function fetch_taskRun_info(data) {
  return axios.post('/vcloud/schedulerManager/batchTran/query', data);
}

//获取任务运行日志信息
export function fetch_taskRun_log_info(data) {
  return axios.post('/vcloud/schedulerManager/taskExecute/query', data);
}


//获取批量任务信息
export function fetch_batch_task_info(data) {
  return axios.post('/vcloud/schedulerManager/batchTask/query', data);
}

//获取重跑批量任务信息
export function update_batch_task_info(data) {
  return axios.post('/vcloud/schedulerManager/batchTask/updateBatchTaskStatus', data);
}

//用于导出Excel表格 headers: {'Content-Type': 'multipart/form-data'}
export function DownLoadFile(options) {
    let Authorization = stores.state.login.token;
    options.data.Authorization = Authorization;
    var config = $.extend(true, { method: 'post' }, options);

    var $iframe = $('<iframe id="down-file-iframe" />');
    var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
    $form.attr('action', config.url);
    for (var key in config.data) {
        $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
    }
    $iframe.append($form);
    $(document.body).append($iframe);
    $form[0].submit();
    $iframe.remove();
}


/***************用户模块***********/
//获取所用户分页信息
/*export function fetchUserList(data) {
  return axios.post('/vcloud/sysManage/user/query', data);
}*/
//获取所有角色信息
export function fetchRoleAll(data) {
  return axios.post('/vcloud/sysManage/role/queryList', data);
}
//添加用户
export function fetchAddUser(data) {
  return axios.post('/vcloud/sysManage/user/add', data);
}
//修改用户
export function fetchUpdateUser(data) {
  return axios.post('/vcloud/sysManage/user/update', data);
}
//获取用户所有部门
export function fetchUserDepartmentList(data) {
  return axios.post('/vcloud/sysManage/user/queryDepartment', data);
}

/***************供应商模块***********/

//获取供应商列表
export function fetchSupplierList(data) {
  return axios.post('/vcloud/supplierManage/supplier/querySupplier', data);
}

//添加供应商
export function fetchAddSupplier(data) {
  return axios.post('/vcloud/supplierManage/supplier/add', data);
}
//修改供应商
export function fetchUpdateSupplier(data) {
  return axios.post('/vcloud/supplierManage/supplier/update', data);
}

//删除供应商
export function fetchDeleteSupplier(data) {
  return axios.post('/vcloud/sysManage/', data);
}

//获取首页用户信息
export function fetchGetMainPageUserInfomation(data) {
  return axios.post('/vcloud/mainPageManager/manPage/queryMainInfomation', data);
}
//获取待办事项
export function fetchGetTodoList(data) {
  return axios.post('/vcloud/mainPageManager/manPage/queryTodoList', data);
}
export function fetchGetNoticeList(data) {
  return axios.post('/vcloud/mainPageManager/manPage/queryNoticeList', data);
}
export function fetchUpdateNoticeStatus(data) {
  return axios.post('/vcloud/mainPageManager/manPage/updateNoticeStatus', data);
}
export function fetchUpdateUserInfomation(data) {
  return axios.post('/vcloud/mainPageManager/manPage/updateUserInfomation', data);
}
export function fetchExecuteTodo(data) {
  return axios.post('/vcloud/mainPageManager/manPage/executeTodo', data);
}

/***************订单模块***********/

//获取订单列表
export function fetchOrderList(data) {
  return axios.post('/vcloud/tradeManage/order/queryOrder', data);
}


//修改订单
export function fetchUpdateOrder(data) {
  return axios.post('/vcloud/tradeManage/order/update', data);
}
//添加订单
export function fetchAddOrder(data) {
  return axios.post('/vcloud/tradeManage/order/add', data);
}

//获取所有订单场景
export function fetchGetIndustryList(data) {
  return axios.post('/vcloud/tradeManage/order/queryIndustryList', data);
}

//获取修改订单状态
export function fetchUpdateStatusOrder(data) {
  return axios.post('/vcloud/tradeManage/order/updateStatus', data);
}


//获取订单关联商品列表
export function fetchgetAllGoodListOrder(data) {
  return axios.post('/vcloud/goodManage/good/queryAllGoodList', data);
}

//获取价格列表
export function fetchgetAllPricePackageOrder(data) {
  return axios.post('/vcloud/priceManage/price/querySelectPrice', data);
}

//获取订单详情
export function fetchgetGetOrderDetail(data) {
  return axios.post('/vcloud/tradeManage/order/queryOrderDetail', data);
}

//获取定时任务
export function fetchgetGetTimedTaskDetail(data) {
  return axios.post('/vcloud/common/getTimedTask', data);
}

//获取所有客户
export function fetchgetGetOrderCustomer(data) {
  return axios.post('/vcloud/tradeManage/order/queryOrderCustomList', data);
}

//获取订单所有关联号码
export function fetchgetOrderNumber(data) {
  return axios.post('/vcloud/tradeManage/order/getOrderNumber', data);
}

//校验号码是否用
export function fetchcheckNumbers(data) {
  return axios.post('/vcloud/tradeManage/order/checkNumbers', data);
}

//调度号码
export function fetchUpdateOrderNumber(data) {
  return axios.post('/vcloud/tradeManage/order/updateOrderNumber', data);
}

//分页查询号码列表
export function fetchQueryALLNumberList(data) {
  return axios.post('/vcloud/goodManage/number/queryAllNumberList', data);
}


/***************角色管理***********/
//创建角色信息
export function create_role_info(data) {
  return axios.post('/vcloud/sysManage/role/add',data);
}

//删除角色信息
export function delete_role_info(data) {
  return axios.post('/vcloud/sysManage/role/del', data);
}

//更新角色信息
export function update_role_info(data) {
  return axios.post('/vcloud/sysManage/role/update', data);
}

//获取角色信息
export function select_role_info(data) {
  return axios.post('/vcloud/sysManage/role/queryOne', data);
}

//获取角色列表
export function select_role_list(data) {
  return axios.post('/vcloud/sysManage/role/query', data);
}

//获取无资源订单列表
export function fetch_no_resource_list(data){
  return axios.post('/vcloud/statisticsManage/customer/queryLessResource', data);
}

//获取供应商订单统计信息
export function fetch_supplier_stats_info(data){
  return axios.post('/vcloud/statisticsManage/supplier/queryOrderNumb', data);
}

//订单消耗柱状图
export function fetchGetConsume(data) {
  return axios.post('/vcloud/statisticsManage/customer/queryConsume',data)
}

//销售额，销售毛利曲线图
export function fetchCountSaleMoney(data) {
  return axios.post('/vcloud/statisticsManage/customer/querySaleMoney',data)
}

//客户销售分析饼图数据
export function fetchCustomerPie(data) {
  return axios.post('/vcloud/statisticsManage/customer/querySaleAnalyseCake',data)
}
//获取客户消耗分析列表
export function fetchCustomerList(data) {
  return axios.post('/vcloud/statisticsManage/customer/querySaleAnalyseList',data)
}

//获取供应商消耗分析top数据
export function fetch_supplier_top_info(data) {
  return axios.post('/vcloud/statisticsManage/supplier/queryConsumeGPTop',data)
}

//获取供应商消耗分布表格数据
export function fetch_supplier_consumer_table_info(data) {
  return axios.post('/vcloud/statisticsManage/supplier/queryConsumeGPList',data)
}

//获取供应商资源分布表格数据
export function fetch_supplier_resource_table_info(data) {
  return axios.post('/vcloud/statisticsManage/supplier/queryResourceList',data)
}

//获取具体供应商的饼状统计信息
export function fetch_supplier_pie_info(data) {
  return axios.post('/vcloud/statisticsManage/supplier/queryResourceConsume',data)
}

//获取具体供应商的线状统计信息
export function fetch_supplier_line_info(data) {
  return axios.post('/vcloud/statisticsManage/supplier/queryConsumeGP',data)
}

//获取地域信息
export function fetch_city_list_info(data) {
  return axios.post('/vcloud/common/getcityList',data)
}

//获取城市信息
export function fetchCityAll(data){
  return axios.post('/vcloud/common/getcityarea',data)
}

// 获取号码列表
export function fetchNumberList(data){
  return axios.post('/vcloud/goodManage/number/queryNumberList',data)
}

//商品号码上架
export function fetchNumberUpdateStatusOn(data){
  return axios.post('/vcloud/goodManage/number/updateStatusOn',data)
}

//商品号码下架
export function fetchNumberUpdateStatusOff(data){
  return axios.post('/vcloud/goodManage/number/updateStatusOff',data)
}

//商品号码详情
export function fetchNumberDetail(data){
  return axios.post('/vcloud/goodManage/number/queryNumberBasic',data)
}

//商品号码调整挂牌价
export function fetchUpdateNumbGp(data){
  return axios.post('/vcloud/goodManage/number/updateGp',data)
}

//商品号码调整成本价
export function fetchUpdateNumbCB(data){
  return axios.post('/vcloud/goodManage/number/updateCb',data)
}

//商品号码删除
export function fetchDeleteNumbGood(data){
  return axios.post('/vcloud/goodManage/number/delNumber',data)
}

//商品号码添加
export function fetchNumbGoodAdd(data){
  return axios.post('/vcloud/goodManage/number/add',data)
}

//商品号码修改
export function fetchUpdataNumbGood(data){
  return axios.post('/vcloud/goodManage/number/updateNumber',data)
}









