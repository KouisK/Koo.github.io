<template>
  <div class="box">
    <div class="top">
      <div>
        <h3>漏洞管理列表</h3>
      </div>
    </div>
    <div class="bottom">
      <div class="btn_box">
        <div @click="getBug" class="bug">
          <el-button
            @click="drawer = true"
            type="primary"
            style="margin-left: 16px;"
            class="bug_btn"
          >
            获取漏洞列表
          </el-button>
        </div>
        <el-drawer
          title="我是标题"
          :visible.sync="drawer"
          :with-header="false"
          :modal="false"
          size="70%"
        >
          <div class="search">
            <el-input
              type="text"
              size="small"
              class="search_input"
              v-model="searchKey"
            ></el-input>
            <span class="search_span" @click="search_list">搜索</span>
          </div>
          <template>
            <!--  :data="tableData.slice((currpage -1)*pagesize,currpage*pagesize)"-->
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="id" label="id" width="180">
              </el-table-column>
              <el-table-column prop="name" label="漏洞名称" width="180">
              </el-table-column>
              <el-table-column prop="create_time" label="时间" width="180">
              </el-table-column>
              <el-table-column prop="create_name" label="创建人" width="180">
              </el-table-column>
              <el-table-column
                prop="last_update_time"
                label="最后更新时间"
                width="180"
              >
              </el-table-column>
              <el-table-column
                prop="last_update_name"
                label="最后更新人"
                width="180"
              >
              </el-table-column>
              <el-table-column>
                <template scope="scope">
                  <el-button
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)"
                    >修改</el-button
                  >
                  <el-button size="small" @click="deleteBug(scope.row)"
                    >删除</el-button
                  >
                  <el-button
                    size="small"
                    @click="
                      get_edit_bug(scope.row);
                      handleGetEditVisble = true;
                    "
                    >变更日志</el-button
                  >
                  <!--                                scope.$index 获取到当前index,scope.row获取到当前一行的内容-->
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              layout="prev,pager,next,sizes,total,jumper"
              :page-size="pagesize"
              :page-sizes="[10]"
              :total="total"
              :current-page.sync="currpage"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            >
            </el-pagination>
          </template>
          <div style="text-align: center">
            <el-button @click="innerDrawer = true" type="primary"
              >添加漏洞信息</el-button
            >
            <el-drawer
              title="添加漏洞"
              :append-to-body="true"
              :visible.sync="innerDrawer"
            >
              <div class="bug_list">
                <div class="bug_list_item">
                  <label>漏洞名称</label>
                  <el-input
                    type="text"
                    placeholder="请输入漏洞名称"
                    v-model="bug.name"
                  ></el-input>
                </div>
                <div class="bug_list_item">
                  <label>漏洞描述</label>
                  <el-input
                    type="textarea"
                    placeholder="请输入漏洞描述"
                    v-model="bug.des"
                  ></el-input>
                </div>
                <div class="bug_list_item">
                  <label>漏洞修复方案</label>
                  <el-input
                    type="textarea"
                    placeholder="请输入漏洞修复方案"
                    v-model="bug.plan"
                  ></el-input>
                </div>
              </div>
              <div class="btn_bug" @click="addBug">
                <el-button type="primary">添加bug</el-button>
              </div>
            </el-drawer>
          </div>
        </el-drawer>
        <div @click="getUser" class="bug">
          <el-button
            @click="drawerUser = true"
            type="primary"
            style="margin-left: 16px;"
            class="bug_btn"
          >
            获取用户列表
          </el-button>
        </div>
        <el-drawer
          title="我是标题"
          :visible.sync="drawerUser"
          :with-header="false"
          :modal="false"
          size="80%"
        >
          <!--                    <div class="search" >-->
          <!--                        <el-input type="text" size="small" class="search_input" v-model="searchKey3"></el-input>-->
          <!--                        <span class="search_span" >搜索</span>-->
          <!--                    </div>-->
          <template>
            <!--  :data="tableData.slice((currpage -1)*pagesize,currpage*pagesize)"-->
            <el-table :data="tableDataUser" style="width: 100%">
              <el-table-column prop="uid" label="uid" width="90">
              </el-table-column>
              <el-table-column prop="username" label="用户名" width="90">
              </el-table-column>
              <el-table-column prop="email" label="邮箱" width="150">
              </el-table-column>
              <el-table-column prop="name" label="姓名" width="90">
              </el-table-column>
              <el-table-column prop="type" label="用户类别" width="90">
              </el-table-column>
              <el-table-column prop="status" label="用户状态" width="90">
              </el-table-column>
              <el-table-column prop="reg_time" label="注册时间" width="150">
              </el-table-column>
              <el-table-column
                prop="last_login_time"
                label="最后登录时间"
                width="150"
              >
              </el-table-column>
              <el-table-column prop="reg_ip" label="注册IP" width="150">
              </el-table-column>
              <el-table-column
                prop="last_login_ip"
                label="最后登录IP"
                width="150"
              >
              </el-table-column>
              <el-table-column>
                <template scope="scope">
                  <!--                                    <el-button size="small" @click="handleEdit(scope.$index,scope.row)">修改</el-button>-->
                  <el-button size="small" @click="UserLock(scope.row)"
                    >锁定</el-button
                  >
                  <el-button size="small" @click="UserUnLock(scope.row)"
                    >解锁</el-button
                  >
                  <el-button size="small" @click="check(scope.row)"
                    >审核</el-button
                  >
                  <!--                                    <el-button size="small" @click="get_edit_bug(scope.row) ;  handleGetEditVisble=true">变更日志</el-button>-->
                  <!--                                scope.$index 获取到当前index,scope.row获取到当前一行的内容-->
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              layout="prev,pager,next,sizes,total,jumper"
              :page-size="pagesize3"
              :page-sizes="[10]"
              :total="total3"
              :current-page.sync="currpage3"
              @current-change="handleCurrentChange3"
              @size-change="handleSizeChange"
            >
            </el-pagination>
          </template>
        </el-drawer>
        <div class="user">
          <el-button
            @click="drawerList = true"
            type="primary"
            style="margin-left: 16px;"
            class="user_btn"
          >
            获取文件列表
          </el-button>
        </div>
        <el-drawer
          title="我是标题"
          :visible.sync="drawerList"
          :with-header="false"
          :modal="false"
          size="70%"
        >
          <div class="search">
            <el-input
              type="text"
              size="small"
              class="search_input"
              v-model="searchKey2"
            ></el-input>
            <span class="search_span" @click="getList">搜索</span>
          </div>
          <template>
            <!--  :data="tableData.slice((currpage -1)*pagesize,currpage*pagesize)"-->
            <el-table :data="tableDataList" style="width: 100%">
              <el-table-column prop="uid" label="uid" width="120">
              </el-table-column>
              <el-table-column prop="id" label="用户文件记录id" width="120">
              </el-table-column>
              <el-table-column prop="filename" label="上传文件名" width="150">
              </el-table-column>
              <el-table-column prop="ext" label="后缀名" width="120">
              </el-table-column>
              <el-table-column prop="upload_path" label="上传path" width="90">
              </el-table-column>
              <el-table-column prop="upload_time" label="上传时间" width="90">
              </el-table-column>
              <el-table-column prop="change_path" label="转换path" width="150">
              </el-table-column>
              <el-table-column prop="change_time" label="转换时间" width="120">
              </el-table-column>
              <el-table-column
                prop="optimize_path"
                label="优化path"
                width="120"
              >
              </el-table-column>
              <el-table-column
                prop="optimize_time"
                label="优化时间"
                width="120"
              >
              </el-table-column>
              <el-table-column>
                <template scope="scope">
                  <!--                                                            <el-button size="small" @click="handleEdit(scope.$index,scope.row)">修改</el-button>-->
                  <el-button size="small" @click="deleteList(scope.row)"
                    >删除</el-button
                  >
                  <!--                                                            <el-button size="small" @click="get_edit_bug(scope.row) ;  handleGetEditVisble=true">变更日志</el-button>-->
                  <!--                                scope.$index 获取到当前index,scope.row获取到当前一行的内容-->
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              layout="prev,pager,next,sizes,total,jumper"
              :page-size="pagesize2"
              :page-sizes="[10]"
              :total="total2"
              :current-page="currpage2"
              @current-change="handleCurrentChange2"
              @size-change="handleSizeChange"
            >
            </el-pagination>
          </template>
        </el-drawer>
        <div @click="getInformation" class="bug">
          <el-button
            @click="drawerInformation = true"
            type="primary"
            style="margin-left: 16px;"
            class="bug_btn"
          >
            获取个人信息
          </el-button>
        </div>
        <el-drawer
          title="我是标题"
          :visible.sync="drawerInformation"
          :with-header="false"
          :modal="false"
          size="60%"
        >
          <template>
            <!--  :data="tableData.slice((currpage -1)*pagesize,currpage*pagesize)"-->
            <el-table :data="tableDataInformation" style="width: 100%">
              <el-table-column prop="uid" label="uid" width="90">
              </el-table-column>
              <el-table-column prop="username" label="用户名" width="90">
              </el-table-column>
              <el-table-column prop="email" label="邮箱" width="150">
              </el-table-column>
              <el-table-column prop="name" label="姓名" width="90">
              </el-table-column>
              <el-table-column prop="type" label="用户类别" width="90">
              </el-table-column>
              <el-table-column>
                <template scope="scope">
                  <el-button
                    size="small"
                    @click="
                      changePwd();
                      lookPwdVisble = true;
                    "
                    >查看密码</el-button
                  >
                  <el-button size="small" @click="changePwdVisble = true"
                    >修改密码</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-drawer>
        <div @click="logout" class="bug">
          <el-button type="primary" style="margin-left: 16px;" class="bug_btn">
            用户账号注销
          </el-button>
        </div>
      </div>
    </div>
    <div class="footer">
      <div>
        <el-upload
          class="upload-demo"
          action="http://47.105.182.216:2500/index/upload/upload"
          :headers="headers"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-success="success"
          multiple
          :limit="3"
          :show-file-list="false"
          :on-exceed="handleExceed"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传zip/xlsx/xls文件，且不超过500kb
          </div>
        </el-upload>
      </div>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="changePwdVisble"
      :modal-append-to-body="false"
      width="55%"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="旧密码" prop="oldPwd"
          ><el-input v-model="ruleForm.oldPwd"></el-input
        ></el-form-item>
        <el-form-item label="新密码" prop="pwd"
          ><el-input v-model="ruleForm.pwd"></el-input
        ></el-form-item>
        <el-form-item label="确认密码" prop="pwd2"
          ><el-input v-model="ruleForm.pwd2"></el-input
        ></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >立即创建</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="查看密码"
      :visible.sync="lookPwdVisble"
      :modal-append-to-body="false"
      width="55%"
    >
      <!--            <el-table :data="bugChangeData.slice((currpage - 1)*pagesize ,currpage * pagesize)">-->
      <el-table :data="pwdLookData">
        <el-table-column
          property="username"
          label="用户名"
          width="350"
        ></el-table-column>
        <el-table-column
          property="old_password"
          label="旧密码"
          width="350"
        ></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="漏洞信息变更"
      :visible.sync="handleGetEditVisble"
      :modal-append-to-body="false"
      width="55%"
    >
      <!--            <el-table :data="bugChangeData.slice((currpage - 1)*pagesize ,currpage * pagesize)">-->
      <el-table :data="bugChangeData">
        <el-table-column
          property="id"
          label="漏洞id"
          width="150"
        ></el-table-column>
        <el-table-column
          property="name"
          label="漏洞名称"
          width="200"
        ></el-table-column>
        <el-table-column
          property="edit_uid"
          label="修改人uid"
        ></el-table-column>
        <el-table-column property="edit_name" label="修改人"></el-table-column>
        <el-table-column
          property="create_time"
          label="修改时间"
        ></el-table-column>
        <el-table-column>
          <template scope="scope">
            <el-button
              size="small"
              @click="
                handleGetEdit_detailVisble = true;
                get_log_detail(scope.row);
              "
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev,pager,next,sizes,total,jumper"
        :page-size="pagesize1"
        :page-sizes="[10]"
        :total="total1"
        :current-page="currpage1"
        @current-change="handleCurrentChange1"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </el-dialog>
    <el-dialog
      title="漏洞信息变更记录详情"
      :visible.sync="handleGetEdit_detailVisble"
      :modal-append-to-body="false"
    >
      <el-table :data="bugChangeData_detail">
        <el-table-column
          property="before_data"
          label="变更前数据"
          width="150"
        ></el-table-column>
        <el-table-column
          property="after_data"
          label="变更后数据"
          width="200"
        ></el-table-column>
        <el-table-column property="edit_id" label="修改人uid"></el-table-column>
        <el-table-column property="edit_name" label="修改人"></el-table-column>
        <el-table-column
          property="create_time"
          label="修改时间"
        ></el-table-column>
      </el-table>
      <!--            <el-pagination background layout="prev,pager,next,sizes,total,jumper"-->
      <!--                           :page-size="pagesize2" :page-sizes="[10]" :total="total2"-->
      <!--                           @current-change="handleCurrentChange"  @size-change="handleSizeChange" >-->
      <!--            </el-pagination>-->
    </el-dialog>
    <el-dialog
      title="修改漏洞"
      :visible.sync="editFormVisible"
      :modal-append-to-body="false"
    >
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="漏洞ID" prop="id">
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>
        <el-form-item label="漏洞名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="漏洞描述" prop="description">
          <el-input type="text" v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="修复方案" prop="repair_plan">
          <el-input type="text" v-model="editForm.repair_plan"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="
            edit_bug();
            editFormVisible = false;
          "
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
const Base64 = require("js-base64").Base64;
import qs from "qs";
export default {
  name: "index",
  data() {
    return {
      ruleForm: {
        oldPwd: "",
        pwd: "",
        pwd2: ""
      },
      rules: {
        oldPwd: [{ required: true, message: "密码不能为空", trigger: "blur" }],
        pwd: [{ required: true, message: "密码不能为空", trigger: "blur" }],
        pwd2: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      },
      lookPwdVisble: false,
      drawerInformation: false,
      headers: { token: localStorage.getItem("token") },
      fileList: [{}],
      orderby: "id|desc",
      searchKey3: "",
      searchKey: "",
      searchKey2: "",
      // pwdChangeData:[{
      //     username: '',
      //     old_password: '',
      //     new_password: ''
      // }],
      pwdLookData: [
        {
          username: "",
          old_password: "",
          new_password: ""
        }
      ],
      bugChangeData: [
        {
          id: "",
          name: "",
          edit_uid: "",
          edit_name: "",
          edit_time: ""
        }
      ],
      bugChangeData_detail: [],
      changePwdVisble: false,
      handleGetEditVisble: false,
      handleGetEdit_detailVisble: false,
      editFormVisible: false,
      // get_editForm:[{
      // }],
      editForm: {
        id: "",
        name: "",
        description: "",
        repair_plan: ""
      },

      bug: {
        name: "",
        des: "",
        plan: ""
      },
      token: "",
      drawer: false,
      drawerUser: false,
      drawerList: false,
      innerDrawer: false,
      pagesize: 10,
      currpage: 1,
      pagesize3: 10,
      currpage3: 1,
      currpage1: 1,
      currpage2: 1,
      pagesize2: 10,
      total3: 0,
      total2: 0,
      pagesize1: 10,
      total1: 0,
      total: 0,
      tableDataInformation: [],
      tableDataUser: [{}],
      tableDataList: [{}],
      tableData: [
        {
          id: "",
          name: "",
          create_time: "",
          create_name: "",
          last_update_name: "",
          last_update_time: ""
        }
      ]
    };
  },
  created() {
    console.log(localStorage.getItem("token"));
  },
  methods: {
    //上传
    //         uploadBefore(){
    //             let formData = new FormData() // 声明一个FormData对象
    //             this.formData = new window.FormData() // vue 中使用 window.FormData(),否则会报 'FormData isn't definded'
    //             this.formData.append('file', document.querySelector('input[type=file]').files[0]) // 'userfile' 这个名字要和后台获取文件的名字一样;
    //             let file = document.querySelector('input[type=file]').files[0]
    //             console.log(this.fileName)
    //             let fileName = file.name.substring(file.name.lastIndexOf(".")+1,file.name.length)
    //             const fileType = fileName == 'xls'||fileName == 'xlsx'||fileName == 'zip';
    //             //   console.log(file)
    //             //   console.log(fileName)
    //             //   console.log(fileType)
    //             if (!fileType) {
    //                 this.$message.error('上传文件格式不正确，请检查');
    //                 this.numberValidateForm.fileName = ""
    //             }else{
    //                 this.numberValidateForm.fileName = file.name
    //             }
    //         },
    //         // 保存，上传文件
    //         submitForm() {
    //             this.saveLoading = true
    //             // this.$http({
    //             //     url: this.$store.state.domian+'/bbt-admin/courseware/upload/'+dynamicppt,
    //             //     data: this.formData,
    //             //     method: 'post',
    //             //     headers: {
    //             //         'Content-Type': 'multipart/form-data',
    //             //     }
    //             axios.post('/api//index/upload/upload',{file:this.formData},{headers:{token:localStorage.getItem("token")}}).then((res => {
    //                     if (res.data.code !== 1 ) {
    //                        this.$message.error(res.data.msg)
    //
    //                     }else{
    //                         this.$message({message:'操作成功！',type: 'success'})
    //                         this.dialogTableVisible = false
    //                         this.getFileList(1);
    //                     }
    //                     this.saveLoading = false
    //                     console.log(res)
    //                 })
    //             )
    //
    //
    // },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    success(response, file, fileList) {
      this.$message.success("success");
    },

    formatDate: function(time) {
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let date = time.getDate();
      let hour = time.getHours();
      let minute = time.getMinutes();
      let second = time.getSeconds();
      return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
    typeIsAdmin: function(num) {
      // if( num == 0){
      //     return "admin"
      // }else{
      //     return "普通用户"
      // }
      let stringType = num == 0 ? "admin" : "普通用户";
      return stringType;
    },

    statusIsCanUse: function(num) {
      // if( num == 0){
      //     return "无效"
      // }else if (num == 1){
      //     return "正常"
      // }else {
      //     return "锁定"
      // }
      let stringStatus = num == 0 ? "无效" : num == 1 ? "正常" : "锁定";
      return stringStatus;
    },
    handleCurrentChange(val) {
      this.currpage = val;
      // this.get_edit_bug()
      this.getBug();
    },
    handleCurrentChange1(val) {
      this.currpage1 = val;
      this.get_edit_bug();
      // this.getBug()
    },
    handleCurrentChange2(val) {
      this.currpage2 = val;
      this.getList();
      // this.getBug()
    },
    handleCurrentChange3(val) {
      this.currpage3 = val;
      this.getUser();
      // this.getBug()
    },
    //每条显示数改变时，改变
    handleSizeChange(value) {
      this.pagesize = value;
      // this.getBug()
    },
    getBug: function() {
      axios
        .get("/api/index/bug/get_list", {
          params: { page: this.currpage, per_page: this.pagesize },
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          console.log(res.data);
          if (res.data.code !== 1) {
            this.$message.error("err");
          } else {
            this.$message.success(res.data.msg);
            let list = [];
            this.total = res.data.data.total;
            console.log(this.total);
            for (var i = 0; i < res.data.data.data.length; i++) {
              console.log(res.data.data.data[i].name);
              list.push({
                id: res.data.data.data[i].id,
                name: res.data.data.data[i].name,
                create_time: this.formatDate(
                  new Date(res.data.data.data[i].create_time * 1000)
                ),
                create_name: res.data.data.data[i].create_name,
                last_update_name: res.data.data.data[i].last_update_name,
                last_update_time: this.formatDate(
                  new Date(res.data.data.data[i].last_update_time * 1000)
                )
              });
            }
            this.tableData = list;
            //  this.tableData = res.data.data.data
            //  console.log(this.tableData)
            //  this.tableData.create_time=this.formatDate( new Date(this.tableData.create_time))
            //  this.tableData.last_update_time=this.formatDate(new Date(this.tableData.last_update_time))
            // console.log(this.tableData)
          }
        });
    },
    handleClose(done) {
      this.$confirm("还有未保存的工作哦确定关闭吗？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    get_edit_bug: function(row) {
      let postData = {
        bug_id: row.id
      };
      axios
        .get("/api/index/bug/get_edit_log", {
          params: {
            bug_id: row.id,
            page: this.currpage1,
            per_page: this.pagesize1
          },
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          console.log(res);
          if (res.data.code !== 1) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            let list = [];
            this.total1 = res.data.data.total;
            for (let i = 0; i < res.data.data.data.length; i++) {
              list.push({
                id: res.data.data.data[i].id,
                name: res.data.data.data[i].name,
                edit_uid: res.data.data.data[i].edit_uid,
                edit_name: res.data.data.data[i].edit_name,
                create_time: this.formatDate(
                  new Date(res.data.data.data[i].create_time * 1000)
                )
              });
            }
            this.bugChangeData = list;
          }
        });
    },
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      // this.editForm = Object.assign({}, row);
      axios
        .get("/api/index/bug/get_detail", {
          params: { id: row.id },
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          console.log(res);
          if (res.data.code !== 1) {
            this.$message.error(res.data.msg);
          } else {
            this.editForm.id = res.data.data.id;
            this.editForm.name = res.data.data.name;
            this.editForm.description = res.data.data.description;
            this.editForm.repair_plan = res.data.data.repair_plan;
          }
        });
    },
    // handleDelete:function (index,row) {
    //         this.$confirm('此操作将永久删除文件，是否继续?','提示',{
    //             confirmButtonText:'确定',
    //             cancelButtonText:'取消',
    //             type:'warning'
    //         }).then(this.delete_bug(index,row)).then(()=>{
    //             this.$message({
    //                 type:'success',
    //                 message:'删除成功',
    //                 delete:row.splice(index,1)
    //             });
    //         }).catch(()=>{
    //             this.$message({
    //                 type:'info',
    //                 message:'已取消删除'
    //             })
    //         })
    // },
    deleteBug: function(row) {
      console.log(row);
      let postData = {
        id: row.id,
        name: row.name
      };
      console.log(postData);
      axios
        .post("/api/index/bug/del_bug", postData, {
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          if (res.data.code !== 1) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            this.getBug();
          }
        });
    },
    edit_bug: function(row) {
      let postData = {
        id: this.editForm.id,
        name: this.editForm.name,
        description: this.editForm.description,
        repair_plan: this.editForm.repair_plan
      };
      axios
        .post("/api/index/bug/edit_bug", postData, {
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          if (res.data.code !== 1) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
          }
        });
    },
    addBug: function() {
      let postData = {
        name: this.bug.name,
        description: this.bug.des,
        repair_plan: this.bug.plan
      };
      console.log(postData.name);
      axios
        .post("/api/index/bug/add_bug", postData, {
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          if (res.data.code !== 1) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            this.getBug();
          }
        });
    },
    search_list: function() {
      axios
        .get("/api/index/bug/get_list", {
          params: { keyword: this.searchKey, page: 1, per_page: 10 },
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          console.log(res);
          if (res.data.code !== 1) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            this.tableData = res.data.data.data;
          }
        });
    },
    get_log_detail: function(row) {
      axios
        .get("/api/index/bug/get_edit_log_detail", {
          params: { log_id: row.id },
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          if (res.data.code !== 1) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            console.log(res);
            let list = [];
            list.push({
              edit_id: res.data.data.edit_uid,
              edit_name: res.data.data.edit_name,
              create_time: this.formatDate(
                new Date(res.data.data.create_time * 1000)
              ),
              before_data: res.data.data.before_data.repair_plan,
              after_data: res.data.data.after_data.repair_plan
            });
            this.bugChangeData_detail = list;
          }
        });
    },
    //用户管理
    getUser: function() {
      axios
        .get("/api/index/admin/get_user_list", {
          params: { page: this.currpage3, per_page: this.pagesize3 },
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          if (res.data.code !== 1) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            let list = [];
            console.log(res);
            this.total3 = res.data.data.total;
            for (var i = 0; i < res.data.data.data.length; i++) {
              list.push({
                uid: res.data.data.data[i].uid,
                username: res.data.data.data[i].username,
                reg_time: this.formatDate(
                  new Date(res.data.data.data[i].reg_time * 1000)
                ),
                last_login_time: this.formatDate(
                  new Date(res.data.data.data[i].last_login_time * 1000)
                ),
                email: res.data.data.data[i].email,
                name: res.data.data.data[i].name,
                type: this.typeIsAdmin(res.data.data.data[i].type),
                status: this.statusIsCanUse(res.data.data.data[i].status),
                optimize_path: res.data.data.data[i].optimize_path,
                reg_ip: res.data.data.data[i].reg_ip,
                last_login_ip: res.data.data.data[i].last_login_ip
              });
            }
            this.tableDataUser = list;
          }
        });
    },
    UserLock: function(row) {
      console.log(row);
      axios
        .post(
          "/api/index/admin/lock_user",
          { uid: row.uid },
          { headers: { token: localStorage.getItem("token") } }
        )
        .then(res => {
          if (res.data.code !== 1) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            this.getUser();
          }
        });
    },
    UserUnLock: function(row) {
      axios
        .post(
          "/api/index/admin/unlock_user",
          { uid: row.uid },
          { headers: { token: localStorage.getItem("token") } }
        )
        .then(res => {
          if (res.data.code !== 1) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            this.getUser();
          }
        });
    },
    check: function(row) {
      axios
        .post(
          "/api/index/admin/valid_user",
          { uid: row.uid },
          { headers: { token: localStorage.getItem("token") } }
        )
        .then(res => {
          if (res.data.code !== 1) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            this.getUser();
          }
        });
    }, //用户文件管理
    getList: function() {
      axios
        .get("/api/index/user_file/get_list", {
          params: {
            page: this.currpage2,
            per_page: this.pagesize2,
            keyword: this.searchKey2
          },
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          console.log(res);
          if (res.data.code !== 1) {
            this.$message.error(res.data.msg);
          } else {
            let list = [];
            this.total2 = res.data.data.total;
            for (var i = 0; i < res.data.data.data.length; i++) {
              list.push({
                uid: res.data.data.data[i].uid,
                id: res.data.data.data[i].id,
                upload_time: this.formatDate(
                  new Date(res.data.data.data[i].upload_time * 1000)
                ),
                change_time: this.formatDate(
                  new Date(res.data.data.data[i].change_time * 1000)
                ),
                optimize_time: this.formatDate(
                  new Date(res.data.data.data[i].optimize_time * 1000)
                ),
                filename: res.data.data.data[i].filename,
                ext: res.data.data.data[i].ext,
                upload_path: res.data.data.data[i].upload_path,
                change_path: res.data.data.data[i].change_path,
                optimize_path: res.data.data.data[i].optimize_path
              });
            }
            this.tableDataList = list;
          }
        });
    },
    searchList: function() {
      axios
        .get("/api/index/user_file/get_list", {
          params: {
            page: this.currpage2,
            per_page: this.pagesize2,
            keyword: this.searchKey2
          },
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          console.log(res);
          if (res.data.code !== 1) {
            this.$message.error(res.data.msg);
          } else {
            this.total2 = res.data.data.total;
            this.tableDataList = res.data.data.data;
          }
        });
    },
    deleteList: function(row) {
      console.log(row.uid);
      axios
        .get("/api/index/user_file/del", {
          params: { id: row.uid },
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          if (res.data.code !== 1) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            location.reload();
          }
        });
    },
    getInformation: function() {
      axios
        .get("/api/index/user/get_userinfo", {
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          console.log(res);
          if (res.data.code !== 1) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            let list = [];
            list.push({
              email: res.data.data.email,
              name: res.data.data.name,
              uid: res.data.data.uid,
              username: res.data.data.username,
              type: this.typeIsAdmin(res.data.data.type)
            });
            this.tableDataInformation = list;
          }
        });
    },
    changePwd: function() {
      let list = [];
      list.push({
        username: sessionStorage.getItem("username"),
        old_password: sessionStorage.getItem("oldPwd")
      });
      console.log(list);
      this.pwdLookData = list;
    },
    logout: function() {
      axios
        .get("/api/index/user/logout", {
          headers: { token: localStorage.getItem("token") }
        })
        .then(res => {
          if (res.data.code !== 1) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            this.$router.push("/");
          }
        });
      // changePwd:function (row) {
      //
      // }
    },
    submitForm(formName) {
      let str = "21232f297a57a5a743894a0e4a801fc3" + this.ruleForm.pwd;
      let str2 = "21232f297a57a5a743894a0e4a801fc3" + this.ruleForm.oldPwd;
      let postData = {
        username: sessionStorage.getItem("username"),
        old_password: Base64.encode(str2),
        new_password: Base64.encode(str)
      };
      console.log(postData);
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios
            .post("/api/index/user/change_password", postData, {
              headers: { token: localStorage.getItem("token") }
            })
            .then(res => {
              if (res.data.code !== 1) {
                this.$message.error(res.data.msg);
              } else {
                this.$message.success(res.data.msg);
                this.logout();
              }
            });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped lang="scss">
.box {
  /*background-color: black;*/
  height: 100vh;
  display: flex;
  flex-direction: column;
  .top {
    /*background-color: #e77c8e;*/
    width: 100%;
    height: 150px;
    text-align: center;
    h3 {
      display: inline-block;
      width: 250px;
      height: 50px;
      line-height: 50px;
      font-weight: bold;
      font-size: 35px;
      color: #409eff;
      margin-top: 20px;
    }
  }
  .bottom {
    flex: 1;
    width: 100%;
    /*background-color: #2bae85;*/
    .btn_box {
      margin-left: 150px;
    }
    .bug {
      margin-bottom: 50px;
      width: 150px;
      height: 50px;
      .bug_btn {
        border-radius: 20px;
        font-weight: bold;
        font-size: 16px;
        text-indent: 2px;
        width: 150px;
        height: 50px;
      }
    }
    .user {
      margin-bottom: 50px;
      width: 150px;
      height: 50px;
      .user_btn {
        border-radius: 20px;
        font-weight: bold;
        font-size: 16px;
        text-indent: 2px;
        width: 150px;
        height: 50px;
      }
    }
    .list {
      width: 100%;
      height: 100%;
      padding: 15px;
    }
  }
}
.bug_list {
  width: 100%;
  .bug_list_item {
    height: 100px;
    margin: 10px;
    label {
      padding-bottom: 5px;
      display: inline-block;
    }
  }
}
.btn_bug {
  width: 100px;
  height: 45px;
  border-radius: 20px;
  margin: 0 auto;
  text-align: center;
}
.search {
  width: 600px;
  height: 40px;
  .search_input {
    width: 450px;
  }
  .search_span {
    padding-left: 20px;
    font-size: 18px;
    height: 32px;
    line-height: 32px;
  }
}
.footer {
  width: 100%;
  height: 100px;
  /*background-color: #7a7374;*/
}
</style>
