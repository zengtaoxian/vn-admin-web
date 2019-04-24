<style lang="less">
@import "../../common/less/gateway.less";
</style>
<template>
  <div class="box">
    <div>
      <Tabs v-model="value" :name="value" @on-click="change()" Col="100px" width="100px" :animated="animated">
        <TabPane v-if="check_perm(136)" label="内部网关IP" name="innerGateway" >
          <div cos="30" offset="500">
            <textarea v-if="writeable1" v-model="content1" class="textarea" readonly="readonly">{{content1}}
            </textarea>
            <textarea v-else="writeable1" v-model="content1" class="textarea">{{content1}}
            </textarea>
          </div>
          <div><label class="label">每一行一个IP地址</label></div>
          <div>
            <i-button  v-model="select1" :value="btnName" v-if="select1" class="gatewy_btn" type="primary" @click="modify('innerGateway')">{{btnName}}</i-button>
            <i-ButtonGroup  v-model="innerbutton" prop="innerbutton" v-else="select1" class="gatewy_btn" type="primary">
            <i-button v-model="innerSave" class="left-btn" type="primary" @click="save('innerGateway')">保存</i-button>
            <i-button v-model="innerCancel" class="right-btn" type="primary" @click="cancel('innerGateway')">取消</i-button>
            </i-ButtonGroup>
          </div>
        </TabPane>


        <TabPane v-if="check_perm(138)" label="CAAS网关地址" name="CASSGateway">
          <div cos="30">
            <textarea v-if="writeable2" v-model="content2"  class="textarea" readonly="readonly">{{content2}}
            </textarea>
            <textarea v-else="writeable2" v-model="content2" class="textarea">{{content2}}
            </textarea>
          </div>
          <div><label class="label">每一行一个IP地址</label></div>
          <div>
            <i-button  v-model="select2" :value="btnName" v-if="select2" class="gatewy_btn" type="primary" @click="modify('CASSGateway')">{{btnName}}</i-button>
            <i-ButtonGroup  v-model="CAASBtn" prop="CAASBtn" v-else="select2" class="gatewy_btn" type="primary">
            <i-button v-model="CAASSave" class="left-btn" type="primary" @click="save('CASSGateway')">保存</i-button>
            <i-button v-model="CAASCanel" class="right-btn" type="primary" @click="cancel('CASSGateway')">取消</i-button>
            </i-ButtonGroup>
          </div>
        </TabPane>


        <TabPane v-if="check_perm(140)" label="IPCC网关地址" name="IPCCGateway">
          <div cos="30">
            <textarea v-if="writeable3" v-model="content3"  class="textarea" readonly="readonly">{{content3}}
            </textarea>
            <textarea v-else="writeable3" v-model="content3"  class="textarea">{{content3}}
            </textarea>
          </div>
          <div><label class="label">每一行一个IP地址</label></div>
          <div>
            <i-button  v-model="select3" :value="btnName" v-if="select3" class="gatewy_btn" type="primary" @click="modify('IPCCGateway')">{{btnName}}</i-button>
            <i-ButtonGroup v-model="IPCCBtn" prop="IPCCBtn" v-else="select3" class="gatewy_btn" type="primary">
            <i-button v-model="IPCCSave" class="left-btn" type="primary" @click="save('IPCCGateway')">保存</i-button>
            <i-button V-model="IPCCCancel" class="right-btn" type="primary" @click="cancel('IPCCGateway')">取消</i-button>
            </i-ButtonGroup>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>
<script>

import {mapGetters} from "vuex";
import {isValidIP} from "@/common/js/util.js";
import {
  fetch_gateway_info,
  add_gateway_info,
  update_gateway_info
} from '@/api/api';

export default {
  data(){
    return{
      animated: false,
      select1:true,
      select2:true,
      select3:true,
      value: '',
      gatewayType: "0",
      content1: '',
      content2: '',
      content3: '',
      writeable1:true,
      writeable2:true,
      writeable3:true,
      innerbutton: "",
      innerSave: "",
      innerCancel: "",
      CAASBtn: "",
      CAASSave: "",
      CAASCanel: "",
      IPCCBtn: "",
      IPCCSave: "",
      IPCCCancel: "",
      gatewayStr: "",
      id: "",
      id1: "",
      id2: "",
      id3: "",
      btnName: "编辑",
      flag: false,
    };
  },

  computed: {
    ...mapGetters({
      check_perm: "main/check_perm",
    })
  },

  created:function(){
    if(this.check_perm(136)){
      this.gatewayType="0";
    }else if(this.check_perm(138)){
      this.gatewayType="1";
    }else if(this.check_perm(140)){
      this.gatewayType="2";
    }

    this.getList();
  },

  methods:{
    // 获取网关地址
    getList(){
      fetch_gateway_info(
        {
          gatewayType: this.gatewayType
        }).then((res)=>{
        if(res.data.respCode == '0'){
          var result;
          if(res.data.map.gatewayStr && res.data.map.gatewayStr != ""){
            result = res.data.map.gatewayStr;
            result = result.replace(/\ +/g, "").replace(/[\r\n]/g, "").replace(/[;；]/g,"$&\r\n");
          }else{
            result = "";
          }
          if(this.gatewayType == "0"){
            this.id1=res.data.map.id;
            this.content1=result;
          }else if(this.gatewayType=="1"){
            this.id2=res.data.map.id;
            this.content2=result;
          }else{
            this.id3=res.data.map.id;
            this.content3=result;
          }
          if(!res.data.totalCount){
            this.flag=true;
          }else{
            this.flag=false;
          }
        }else{
          this.$Message.error(res.data.msg);
          return ;
        }
      }).catch((err)=>{
        console.log(err);
        this.$Message.error("获取网关地址失败");
      })
    },

    // 新增网关地址
    setList(){
      add_gateway_info(
        {
          createUser: localStorage.getItem('USER'),
          gatewayType: this.gatewayType,
          gatewayStr: this.gatewayStr
        }).then((res)=>{
        if(res.data.respCode == '0'){
          this.$Message.info(res.data.msg)
          this.getList();
        }else{
          this.$Message.error(res.data.msg);
          return ;
        }
      }).catch((err)=>{
        console.log(err)
        this.$Message.error("新增网关地址失败");
      })
    },

    // 修改网关地址
    updateList(){
      // TO DO check IP
      var ipList=this.gatewayStr;
      ipList = ipList.replace(/\ +/g, "").replace(/[\r\n]/g, "").split(";");
      for(var i = ipList.length - 1; i >=0; i--){
        if(!isValidIP(ipList[i]) && ipList[i] != ""){
          var errMsg = "IP地址: " + ipList[i] + " 输入不合法，请重新输入！"
          this.$Message.error(errMsg);
          return ;
        }
      }
      update_gateway_info(
        {
          id: this.id,
          gatewayStr: this.gatewayStr,
        }).then((res)=>{

        if(res.data.respCode == '0'){
          this.$Message.info(res.data.msg);
          this.getList();
        }else{
          this.$Message.error(res.data.msg);
          return;
        }
      }).catch((err)=>{
        console.log(err);
        this.$Message.error("修改网关地址失败");
      })
    },

    modify(params){
      if(params=="innerGateway"){
        this.select1=false;     // 出现保存，取消按钮
        this.writeable1=false;  // 文本框可编辑
      }else if(params=="CASSGateway"){
        this.select2=false;
        this.writeable2=false;
      }else{
        this.select3=false;
        this.writeable3=false;
      }

    },

    change(params){
      if(this.value=="innerGateway"){
        this.gatewayType="0";
        this.writeable2=true;
        this.writeable3=true;
        this.select2=true;
        this.select3=true;
      }else if(this.value=="CASSGateway"){
        this.gatewayType="1";
        this.writeable1=true;
        this.writeable3=true;
        this.select1=true;
        this.select3=true;
      }else{
        this.gatewayType="2"
        this.writeable1=true;
        this.writeable2=true;
        this.select1=true;
        this.select2=true;
      }
      this.getList();
    },

    save(params){
      if(params=="innerGateway"){
        this.gatewayType="0";
        this.gatewayStr=this.content1;
        this.id=this.id1;
        this.select1=true;
        this.writeable1=true;

      }else if(params=="CASSGateway"){
        this.gatewayType="1";
        this.gatewayStr=this.content2;
        this.id=this.id2;
        this.select2=true;
        this.writeable2=true;
      }else{
        this.gatewayType="2";
        this.gatewayStr=this.content3;
        this.id=this.id3;
        this.select3=true;
        this.writeable3=true;
      }
      if(this.flag){
        this.setList();
      }else{
        this.updateList("");
      }
    },

    cancel(params){
      if(params=="innerGateway"){
        this.gatewayType="0";
        this.writeable1=true;
        this.select1=true;
      }else if(params=="CASSGateway"){
        this.gatewayType="1";
        this.writeable2=true;
        this.select2=true;
      }else{
        this.gatewayType="2";
        this.writeable3=true;
        this.select3=true;
      }
      this.getList();

    }
  }

};
</script>
