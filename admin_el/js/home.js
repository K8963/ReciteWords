new Vue({
  el: "#app",
  data() {
    return {
      apiUrl: "http://localhost:8181/api",
      token: "",
      // 登录弹窗
      loginDiaV: true,
      // 用户表单
      userForm: {
        user: "",
        pwd: "",
      },
      // 当前标签页
      activeName: "1",
      wordData: [],
      search: "",
      wordForm: {
        word: "",
        mean: "",
        type: "",
        similar: "",
        tag: "",
      },
      // json地址
      jsonPath: "",
    };
  },
  methods: {
    // 效验表单
    validation(form) {
      let user = form.user.toString();
      let pwd = form.pwd.toString();

      if (!(user.length != 0 && pwd.length != 0)) {
        this.$message({
          message: "用户名或密码不能为空",
          type: "warning",
        });
        return false;
      }
      if (user.length < 2 || user.length > 8) {
        this.$message({
          message: "用户名 2 到 8 位",
          type: "warning",
        });
        return false;
      }
      if (pwd.length < 4 || pwd.length > 20) {
        this.$message({
          message: "密码 4 到 20 位",
          type: "warning",
        });
        return false;
      }
      return true;
    },
    // 处理请求参数,请求方法，请求参数，是否需要token
    handleReq(form, isT) {
      let requestOptions = {};
      let urlencoded = new URLSearchParams();
      for (var key in form) {
        urlencoded.append(key, form[key].toString());
      }
      requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlencoded,
        redirect: "follow",
      };
      return requestOptions;
    },
    // 登录
    loginUser(form) {
      if (this.validation(form)) {
        let requestOpt = this.handleReq(form);
        fetch(this.apiUrl + "/login", requestOpt)
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            if (res.code == 0) {
              this.setMsg("success", res.msg);
              this.loginDiaV = false;
              localStorage.setItem("token", res.data.token);
            } else {
              this.setMsg("warning", res.msg);
            }
          });
      }
    },
    // 注册
    registerUser(form) {
      if (this.validation(form)) {
        let requestOpt = this.handleReq(form);
        fetch(this.apiUrl + "/register", requestOpt)
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            if (res.code == 0) {
              this.setMsg("success", res.msg);
            } else {
              this.setMsg("warning", res.msg);
            }
          });
      }
    },
    // 获取单词
    async getWord() {
      let { data } = await fetch(
        this.apiUrl + "/word/get?token=" + this.token,
        {
          method: "GET",
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          // console.log(res);
          if (res.code == 0) {
            this.setMsg("success", res.msg);
          } else if (res.code == 401) {
            this.loginDiaV = true;
            this.setMsg("warning", res.msg);
          } else {
            this.setMsg("warning", res.msg);
          }
          return res;
        });

      this.wordData = data.result;
    },
    // 标签页
    handleClick(tab, event) {
      if (tab.name == 1) {
        this.getWord();
      }
    },
    // 修改单词
    handleEdit(index, row) {
      console.log(index, row);
    },
    // 删除单词
    handleDelete(index, row) {
      let delData = { id: row._id };
      let requestOpt = this.handleReq(delData);
      fetch(this.apiUrl + "/word/del?token=" + this.token, requestOpt)
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.code == 0) {
            this.setMsg("success", res.msg);
            this.getWord();
          } else {
            this.setMsg("warning", res.msg);
          }
        });
    },
    // 添加单词
    addWord(form) {
      let requestOpt = this.handleReq(form);
      fetch(this.apiUrl + "/word/add?token=" + this.token, requestOpt)
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.code == 0) {
            this.setMsg("success", res.msg);
            this.loginDiaV = false;
            this.resetWordForm();
          } else {
            this.setMsg("warning", res.msg);
          }
        });
    },
    // 设置消息弹框
    setMsg(type, msg) {
      this.$message({
        message: msg,
        type: type,
      });
    },
    // 重置表单
    resetWordForm() {
      this.wordForm = {
        mean: "",
        similar: "",
        tag: "",
        type: "",
        word: "",
      };
      // this.$ref[form].resetFields();
    },
    // 导出JSON文件
    getJson() {
      fetch(this.apiUrl + "/word/set?token=" + this.token, {
        method: "GET",
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log(res);
          if (res.code == 0) {
            this.setMsg("success", res.msg);
            this.jsonPath = res.data.resPath;
          } else if (res.code == 401) {
            this.loginDiaV = true;
            this.setMsg("warning", res.msg);
          } else {
            this.setMsg("warning", res.msg);
          }
        });
    },
  },
  created() {
    // token存在无需登录
    this.token = localStorage.getItem("token");
    if (this.token) {
      this.loginDiaV = false;
      this.getWord();
    }
  },
});
