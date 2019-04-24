<template>
  <scroll-bar>
    <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse" background-color="#00b4ff" text-color="#fff" active-text-color="#409EFF">
      <sidebar-item :routes="routers"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import {fetch_menu_info} from '../../api/api'

//const routers  = [
//  { path: '/login', hidden: true },
//  { path: '/404', hidden: true },
//  {
//    path: '/',
//    redirect: '/dashboard',
//    name: 'Dashboard',
//    hidden: true,
//    children: [{
//      path: 'dashboard'
//    }]
//  },
//  {
//    path: '/example',
//    redirect: '/example/table',
//    name: 'Example',
//    meta: { title: 'Example', icon: 'example' },
//    children: [
//      {
//        path: 'table',
//        name: 'Table',
//
//        meta: { title: 'Table', icon: 'table' }
//      },
//      {
//        path: 'tree',
//        name: 'Tree',
//        meta: { title: 'Tree', icon: 'tree' }
//      }
//    ]
//  },
//  {
//    path: '/form',
//    children: [
//      {
//        path: 'index',
//        name: 'Form',
//        meta: { title: 'Form', icon: 'form' }
//      }
//    ]
//  },
//  {
//    path: '/example',
//    redirect: '/example/table/complex-table',
//    name: 'example',
//    meta: {
//      title: 'example',
//      icon: 'example'
//    },
//    children: [
//      {
//        path: '/example/table',
//        redirect: '/example/table/complex-table',
//        name: 'Table',
//        meta: {
//          title: 'Table',
//          icon: 'table'
//        },
//        children: [
//          { path: 'dynamic-table', name: 'dynamicTable', meta: { title: 'dynamicTable' }},
//          { path: 'drag-table', name: 'dragTable', meta: { title: 'dragTable' }},
//          { path: 'inline-edit-table',  name: 'inlineEditTable', meta: { title: 'inlineEditTable' }},
//          { path: 'complex-table',  name: 'complexTable', meta: { title: 'complexTable' }}
//        ]
//      },
//      { path: 'tab/index', icon: 'tab',  name: 'tab', meta: { title: 'tab' }}
//    ]
//  }
//];

export default {
  data(){
    return{
      routers:[],
      isCollapse:true
    }
  },
  components: { SidebarItem, ScrollBar },
  computed: {

  },
  created(){
    this.getMenuFn();
  },
  methods:{
    getMenuFn(){
      var roleId = JSON.parse(localStorage.getItem('TOKEN')).roleId;
      fetch_menu_info({
        roleId:roleId,
        menuType:'1'
      }).then((res)=>{
        if(res.data.respCode == '0'){
          let menuList = res.data.map.dataList;
          let menuData = [{
            path: '',
            icon: 'ios-paper',
            title: '首页',
            name: 'home',
            children: [{ path: 'index', title: '首页', name: 'home' }]
          }];
          var obj = {};

          for(var i = 0;i<menuList.length;i++){
            obj = {};
            if(!menuList[i].childMenus){ //子菜单对象不存在时，直接添加父菜单
              if(menuList[i].menuName == '首页'){
                continue;
//                obj = {
//                  path: menuList[i].menuUrl,
//                  icon: menuList[i].menuClass,
//                  title: menuList[i].menuName,
//                  name: 'home',
//                  children: [{ path: 'index', title: '首页', name: 'home' }]
//                }
              }else{

                obj = {
                  path: menuList[i].menuUrl,
                  icon: menuList[i].menuClass,
                  title: menuList[i].menuName,
                  name: (menuList[i].menuUrl).substring(1),
                  children: [{ path: 'index', title: menuList[i].menuName, name: (menuList[i].menuUrl).substring(1) }]
                }
              }
            }else{

              if(menuList[i].childMenus.length == 1 && menuList[i].menuName == "交易管理"){ //子菜单长度为1，把当前菜单添加进去
                obj = {
                  path: menuList[i].menuUrl,
                  icon: menuList[i].menuClass,
                  title: menuList[i].menuName,
                  name: (menuList[i].menuUrl).substring(1),
                  children: [{ path: 'index', title: menuList[i].menuName, name: (menuList[i].menuUrl).substring(1) }]
                }
              }else{
                if(menuList[i].menuName == '首页'){
                  continue;
//                  obj = {
//                    path: '',
//                    icon: menuList[i].menuClass,
//                    title: menuList[i].menuName,
//                    name: 'home',
//                    children: [{ path: 'index', title: '首页', name: 'home' }]
//                  }
                }else{

                  var childrenArr = [];
                  var childArr = menuList[i].childMenus;
                  var childObj = {};
                  for(var j=0;j<childArr.length;j++){
                    childObj = { path: childArr[j].menuUrl, title: childArr[j].menuName, name: childArr[j].menuUrl };
                    childrenArr.push(childObj);
                  }
                  obj = {
                    path: menuList[i].menuUrl,
                    icon: menuList[i].menuClass,
                    title: menuList[i].menuName,
                    name: (menuList[i].menuUrl).substring(1),
                    children: childrenArr
                  }


                }

              }
            }

            menuData.push(obj);
          }
          this.routers = menuData;
        }
      }).catch((err)=>{
        console.log(err)
      })
    }
  }
}
</script>
<style lang="less">
  @import "./sidebar.less";
</style>
