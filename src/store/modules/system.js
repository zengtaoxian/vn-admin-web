import {
  create_role_info,
  delete_role_info,
  update_role_info,
  select_role_info,
  select_role_list,
  fetch_menu_info,
  fetch_perm_info
} from '@/api/api';

import * as util from '@/common/js/util'

//consts
const PAGE_NUM_SELECT = 'PAGE_NUM_SELECT';
const PAGE_NO = 'PAGE_NO';
const PAGE_TOTAL = 'PAGE_TOTAL';
const ROLE_INFO = 'ROLE_INFO';
const ROLE_LIST = 'ROLE_LIST';
const INIT_PERM = 'INIT_PERM';

//states
const state = {
  page_num_opts: util.pageOpt,
  page_num_select: 0,
  page_no: 1,
  page_total: util.pageSize,
  role_list: [],
  role_info: {
    createTime: '',
    roleId: '',
    roleName: '',
    role_perm: [],
    remark: ''
  },
  init_perm: []
};

//getters
const getters = {
  page_num_opts: state => state.page_num_opts,
  page_num_select: state => state.page_num_select,
  page_no: state => state.page_no,
  page_total: state => state.page_total - 2,
  role_list: state => {
    let roleArr = state.role_list;
    let roleList = [];
    for(let i = 0; i<roleArr.length;i++){
      if(roleArr[i].roleId != 1 && roleArr[i].roleId != 2){
          roleList.push(roleArr[i])
      }
    }
    return roleList
  },
  role_info: state => state.role_info,
  init_perm: state => state.init_perm
};

//actions
const actions = {
  //添加角色信息
  add_role_info: ({commit}, data) => new Promise((reslove, reject) => {
    let menuIds = [];
    let f = function (r) {
      if (r.checked) {
        menuIds = menuIds.concat(r.menuId);
        if (this.pathId) {
          this.pathId.forEach(function (id) {
            if (-1 === menuIds.indexOf(id)) {
              menuIds = menuIds.concat(id);
            }
          });
        }
      }

      if (this && this.pathId) {
        r.pathId = this.pathId.concat(r.menuId);
      } else {
        r.pathId = [];
        if (r.menuId) {
          r.pathId = r.pathId.concat(r.menuId);
        }
      }

      if (Array.isArray(r) && r.length) {
        r.forEach(f, r);
      } else if (r) {
        if (Array.isArray(r.children) && r.children.length) {
          r.children.forEach(f, r);
        }
      }
    };
    f(state.role_info.role_perm);
    menuIds = menuIds.join(',');

    let role_info = {
      createUser: data,
      roleName: state.role_info.roleName,
      remark: state.role_info.remark,
      menuIds: menuIds
    };

    create_role_info(role_info).then(response => {
      reslove(response);
    }).catch(err => {
      reject(err);
    });
  }),

  //删除角色信息
  del_role_info: ({commit}) => new Promise((reslove, reject) => {
    let data = {
      roleId: state.role_info.roleId,
    };
    delete_role_info(data).then(response => {
      reslove(response);
    }).catch(err => {
      reject(err);
    });
  }),

  //修改角色信息
  mdf_role_info: ({commit}) => new Promise((reslove, reject) => {
    let menuIds = [];
    let f = function (r) {
      if (r.checked) {
        menuIds = menuIds.concat(r.menuId);
        if (this.pathId) {
          this.pathId.forEach(function (id) {
            if (-1 === menuIds.indexOf(id)) {
              menuIds = menuIds.concat(id);
            }
          });
        }
      }

      if (this && this.pathId) {
        r.pathId = this.pathId.concat(r.menuId);
      } else {
        r.pathId = [];
        if (r.menuId) {
          r.pathId = r.pathId.concat(r.menuId);
        }
      }

      if (Array.isArray(r) && r.length) {
        r.forEach(f, r);
      } else if (r) {
        if (Array.isArray(r.children) && r.children.length) {
          r.children.forEach(f, r);
        }
      }
    };
    f(state.role_info.role_perm);
    menuIds = menuIds.join(',');

    let role_info = {
      roleId: state.role_info.roleId,
      roleName: state.role_info.roleName,
      remark: state.role_info.remark,
      menuIds: menuIds
    };

    update_role_info(role_info).then(response => {
      reslove(response);
    }).catch(err => {
      reject(err);
    });
  }),

  //获取角色信息
  get_role_info: ({commit}, data) => new Promise((resolve, reject) => {
    select_role_info(data).then(response_role_info => {
      if (response_role_info.data.respCode === '0') {
        let role_info = response_role_info.data.map;
        fetch_perm_info(data).then(response_role_perm => {
          if (response_role_perm.data.respCode === '0') {
            let menuIds = response_role_perm.data.map.data;
            let role_perm = JSON.parse(JSON.stringify(state.init_perm));
            let f = function (r) {
              let idx = -1;
              let checked = false;
              if (r.menuId) {
                idx = menuIds.indexOf(r.menuId.toString());
                if (-1 !== idx) {
                  checked = true;
                }
              }

              if (Array.isArray(r) && r.length) {
                r.forEach(f, r);
              } else if (r) {
                if (Array.isArray(r.children) && r.children.length) {
                  r.children.forEach(f, r);
                  if (r.menuId) {
                    if (true === r.checked && checked) {
                      this.checked = true;
                    } else {
                      this.checked = false;
                    }
                  }
                } else {
                  if (r.menuId) {
                    r.checked = checked;
                  }
                }
              }
            };

            f(role_perm);
            role_info.role_perm = role_perm;
            commit(ROLE_INFO, JSON.parse(JSON.stringify(role_info)));
            resolve(role_info);
          } else {
            reject(role_info);
          }
        }).catch(err => {
          reject(err);
        });
      } else {
        reject(response_role_info);
      }
    }).catch(err => {
      reject(err);
    });
  }),

  //获取角色列表
  get_role_list: ({commit}, data) => new Promise((reslove, reject) => {
    select_role_list(data).then(response => {
      if (response.data.respCode === '0') {
        let idx = state.page_num_opts.indexOf(data.pageNum);
        if (-1 !== idx) {
          commit(PAGE_NO, data.pageNo);
          commit(PAGE_NUM_SELECT, idx);
          commit(ROLE_LIST, response.data.list);
          commit(PAGE_TOTAL, response.data.totalCount);
        }
      }
      reslove(response);
    }).catch(err => {
      reject(err);
    });
  }),

  //获取初始权限
  get_init_perm: ({commit}) => new Promise((reslove, reject) => {
    let data = {
      roleId: 1
    };
    fetch_menu_info(data).then(response => {
      if (response.data.respCode === '0') {
        let f = function (r) {
          r.title = r.menuName;
          r.expand = false;
          if (Array.isArray(r) && r.length) {
            r.forEach(f);
          } else if (r) {
            if (Array.isArray(r.childMenus) && r.childMenus.length) {
              r.children = r.childMenus;
              r.children.forEach(f);
            }
          }
        };

        f(response.data.map.dataList);

        //深拷贝
        commit(INIT_PERM, JSON.parse(JSON.stringify(response.data.map.dataList)));
      }
      reslove(response);
    }).catch(err => {
      reject(err);
    });
  }),

  //重置角色信息
  reset_role_info: ({commit}) => new Promise((reslove, reject) => {
    let role_info = {
      createTime: '',
      roleId: '',
      roleName: '',
      menuIds: [],
      role_perm: JSON.parse(JSON.stringify(state.init_perm)),
      remark: ''
    };
    commit(ROLE_INFO, role_info);
    reslove();
  }),
};

//mutations
const mutations = {
  [PAGE_NUM_SELECT](state, data_str) {
    state.page_num_select = data_str;
  },

  [PAGE_NO](state, data_str) {
    state.page_no = data_str;
  },

  [PAGE_TOTAL](state, data_str) {
    state.page_total = data_str;
  },

  [ROLE_INFO](state, data_str) {
    state.role_info = data_str;
  },

  [ROLE_LIST](state, data_str) {
    state.role_list = data_str;
  },

  [INIT_PERM](state, data_str) {
    state.init_perm = data_str;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
