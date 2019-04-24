<template>
  <div class="menu-wrapper">

    <template v-for="item in routes" v-if="!item.hidden&&item.children">

      <router-link tag="div" class="none_childer" :title="item.children[0].title"  v-if="item.children.length===1 && !item.children[0].children" :to="item.path+'/'+item.children[0].path" :key="item.children[0].name">
          <em cl class="menu_icon" :class="item.icon"></em>
          <span class="hideSidebar_text" data="111" v-if="item.children[0].title">{{item.children[0].title}}</span>
      </router-link>

      <el-submenu class="childer_menu_div" v-else :index="item.name||item.path" :key="item.name">
        <template class="2a" slot="title">
          <router-link class="childern_title childer_menu_title" tag="div" :title="item.title"  v-if="item.title" :to="item.path">
            <em  class="menu_icon childer_menu_icon" :class="item.icon"></em>
            <span class="hideSidebar_text">{{item.title}}</span>
          </router-link>
        </template>

        <template data="aaaaaaaaa" v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item data="22" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>
          <router-link class="childer_menu" data="222"  v-else-if="child.path" :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item class="childer_menu_childer" :index="item.path+'/'+child.path">
              <div class="childer_menu_childer_title" v-if="child.title">{{child.title}}</div>
            </el-menu-item>
          </router-link>
          <!--<el-menu-item-group>-->

            <!--&lt;!&ndash;<span v-if="child.path == ''">{{child.path}}{{child.title}}</span>&ndash;&gt;-->
            <!--<span slot="title">分组一</span>-->
            <!--&lt;!&ndash;<el-menu-item v-else :index="item.path+'/'+child.path">{{child.path}}{{child.title}}</el-menu-item>&ndash;&gt;-->
            <!--<el-menu-item index="1-2">选项2</el-menu-item>-->
          <!--</el-menu-item-group>-->
        </template>


      </el-submenu>

    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    }
  },
  created(){
  }

}
</script>
