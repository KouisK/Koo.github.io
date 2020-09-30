<template>
  <div class="content">
    <div class="box">
      <div class="right">
        <el-form
          class="loginForm"
          :model="userInformation"
          :rules="rules"
          ref="loginForm"
        >
          <el-form-item prop="username">
            <img src="../assets/images/account.png" />
            <el-input
              type="text"
              v-model="userInformation.username"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <img src="../assets/images/password.png" />
            <el-input
              type="password"
              v-model="userInformation.password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="imgCodeBox">
              <el-input
                type="text"
                v-model="code"
                placeholder="请输入验证码"
                class="imgCode_input"
              ></el-input>
              <div class="imgCodeContent" @click="getImg">
                <img
                  :src="imgCode"
                  alt="验证码"
                  style="width: 180px;height: 50px;"
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item class="switch" style="margin-left: 25px">
            <div class="checkBox">
              <i class="el-icon-check"></i>
            </div>
            <p>记住密码</p>
          </el-form-item>
        </el-form>
      </div>
      <div class="left">
        <el-button type="primary" class="login-btn" @click="submit"
          >登录</el-button
        >
        <el-button
          type="primary"
          class="login-btn position"
          @click="registVisble = true"
          >注册</el-button
        >
        <!--        <el-button type="primary" >注册</el-button>-->
      </div>
    </div>
    <el-dialog
      title="用户注册"
      :visible.sync="registVisble"
      :modal-append-to-body="false"
      width="55%"
    >
      <el-form :model="ruleForm_regist" :rules="rules_regist" ref="ruleForm">
        <el-form-item label="用户名" prop="username"
          ><el-input v-model="ruleForm_regist.username"></el-input
        ></el-form-item>
        <el-form-item label="密码" prop="password"
          ><el-input v-model="ruleForm_regist.password"></el-input
        ></el-form-item>
        <el-form-item label="姓名" prop="name"
          ><el-input v-model="ruleForm_regist.name"></el-input
        ></el-form-item>
        <el-form-item label="邮箱" prop="email"
          ><el-input v-model="ruleForm_regist.email"></el-input
        ></el-form-item>
        <el-form-item label="图形验证码" prop="code"
          ><el-input v-model="ruleForm_regist.code"></el-input
        ></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm_regist('ruleForm')"
            >立即创建</el-button
          >
          <el-button @click="resetForm_regist('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";
axios.defaults.withCredentials = true;
const Base64 = require("js-base64").Base64;
// import { Base64 } from "js-base64";
import qs from "qs";
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      registVisble: false,
      ruleForm_regist: {
        username: "",
        password: "",
        name: "",
        email: "",
        code: ""
      },
      rules_regist: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      },
      userInformation: {
        username: "",
        password: ""
      },
      passwordRemembered: false,
      code: "",
      imgCode: "/api/index/index/get_captcha?",
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    ...mapMutations(["changeLogin"]),
    getImg: function() {
      axios.get("/api/index/index/get_captcha").then(res => {
        console.log(res);
        if (res) {
          // console.log(res);
          // let lj = "111";
          // let ps = Base64.encode(lj);
          // console.log(lj);
          this.imgCode = "/api/index/index/get_captcha?" + Math.random();
        } else {
          alert("err");
        }
      });
    },
    submitForm_regist(formName) {
      let str =
        "21232f297a57a5a743894a0e4a801fc3" + this.ruleForm_regist.password;
      let postData = {
        username: this.ruleForm_regist.username,
        password: Base64.encode(str),
        name: this.ruleForm_regist.name,
        email: this.ruleForm_regist.email,
        code: this.ruleForm_regist.code
      };
      console.log(postData);
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios.post("api/index/index/do_register", postData).then(res => {
            if (res.data.code !== 1) {
              this.$message.error(res.data.msg);
            } else {
              this.$message.success(res.data.msg);
            }
          });
        }
      });
    },
    resetForm_regist(formName) {
      this.$refs[formName].resetFields();
    },
    // regist:function(){
    //   let postData={
    //     username:this.ruleForm_regist.username,
    //     password:this.ruleForm_regist.password,
    //     name	:this.ruleForm_regist.name	,
    //     email:this.ruleForm_regist.email,
    //     code:this.ruleForm_regist.code,
    //   }
    //   axios.post('api/index/index/do_register',postData).then((res)=>{
    //     if (res.data.code !==1){
    //       this.$message.error(res.data.msg)
    //     }else{
    //       this.$message.success(res.data.msg)
    //     }
    //
    //   })
    // },
    submit: function() {
      let { password } = this.userInformation;
      // const str = `21232f297a57a5a743894a0e4a801fc3${password}`;
      let str = `21232f297a57a5a743894a0e4a801fc3${password}`;
      console.log(str);
      let postData = {
        username: this.userInformation.username,
        password: Base64.encode(str),
        action: this.userInformation.username === "admin" ? "admin" : "user",
        code: this.code
      };
      axios
        .post("/api/index/index/do_login", qs.stringify(postData))
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            console.log(res);
            this.$message.success("登录成功");
            // let taken = {
            //     username : this.userInformation.username,
            //     password: this.userInformation.password,
            //     token: this.res.data.data,
            //     passwordRemembered :this.passwordRemembered
            // }
            //   let storage = {
            //       username:this.userInformation.username,
            //       password: this.passwordRemembered?this.passwordRemembered:null,
            //       passwordRemembered: this.passwordRemembered
            //   }
            sessionStorage.setItem("username", this.userInformation.username);
            sessionStorage.setItem("oldPwd", this.userInformation.password);
            sessionStorage.setItem("token", res.data.data);
            // localStorage.setItem("token",res.data.data);
            this.changeLogin({ Authorization: res.data.data });
            this.$router.push({ path: "/index" });
          } else {
            this.$message.error("登录失败");
          }
        });
    },
    //   regist:function () {
    //     let postData = {username:this.userInformation.username , password:this.userInformation.password}
    //     axios.post('http://47.105.182.216:2500/index/index/do_register\n',postData).then((res)=>{
    //
    //     })
    //   }
    // },
    mounted() {}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.content {
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: url("../assets/bg.jpg");
  .box {
    position: fixed;
    width: 840px;
    height: 600px;
    left: calc(50% - 420px);
    top: calc(50% - 300px);
    display: flex;
    .left {
      position: relative;
      width: 300px;
      height: 100%;
      .position {
        top: calc(50% - 150px) !important;
        margin-left: -5px;
      }
      .login-btn {
        color: #e4e4e4;
        padding: 15px;
        text-align: center;
        font-weight: bold;
        font-size: 18px;
        border: 1px solid #ebb563;
        background-color: #ebb563;
        position: absolute;
        width: 100px;
        height: 50px;
        border-radius: 20px;
        top: calc(50% - 25px);
        left: calc(50% - 50px);
      }
    }
    .right {
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: center;
      .loginForm {
        margin: auto;
        width: 500px;
        height: 400px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .el-form-item__content {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          .checkBox {
            width: 21px;
            height: 21px;
            background-color: transparent;
            border: 2px solid rgba(204, 204, 204, 1);
            margin-right: 15px;
            cursor: pointer;
            border-radius: 5px;
            color: rgba(204, 204, 204, 1);
          }
          i {
            width: 21px;
            height: 21px;
            font-size: 21px;
            transition: 0.5s ease-in-out;
          }
          p {
            width: 80px;
            height: 40px;
            font-size: 20px;
            font-family: "Microsoft YaHei", serif;
            font-weight: 400;
            color: rgba(166, 178, 187, 1);
          }
          input {
            outline: none;
            border: none;
            margin-left: 5px;
            margin: 10px;
            width: 100%;
            font-size: 18px;
            line-height: 24px;
            font-family: "Microsoft YaHei", serif;
            font-weight: 400;
            color: black;
            letter-spacing: 2px;
          }
        }
        .el-form-item {
          width: 480px;
          height: 40px;
          line-height: 40px;
          margin: 0 auto;
        }
        .imgCodeBox {
          position: relative;
          width: 100%;
          .imgCodeContent {
            position: absolute;
            right: 0;
            width: 180px;
            height: 50px;
            top: calc(50% - 25px);
          }
          .imgCode_input {
            width: 250px;
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>
