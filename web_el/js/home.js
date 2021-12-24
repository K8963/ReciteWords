new Vue({
  el: "#app",
  data() {
    return {
      // 当前标签页
      activeName: "1",
      wordData: [],
      // 已选中的单词
      multipleSelection: [],
      // 学习单词列表
      wordList: [],
      // 学习顺序
      radio: "",
      // 中英显示
      radio2: "3",
      // 隐藏 单词 or 中文
      hiddenType: "",
      // 当前测试项
      testItem: "",
      // 测试列表
      testList: [],
      // 当前测试项索引
      nowTest: 0,
    };
  },
  methods: {
    getWord() {
      fetch("/data/word.json")
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          this.wordData = res.result;
        });
    },
    // 导航标签切换
    handleClick(tab, event) {
      // if (tab.name == 1) {
      //   this.getWord();
      // }
    },
    // 设置消息弹框
    setMsg(type, msg) {
      this.$message({
        message: msg,
        type: type,
      });
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    studyBtn() {
      if (this.multipleSelection) {
        this.activeName = "2";
        this.wordList = this.multipleSelection;
      }
    },
    selecRadio(v) {
      switch (v) {
        case "1":
          this.handleList(this.wordList, "1");
          break;
        case "2":
          this.handleList(this.wordList, "2");
          break;
      }
    },
    // status: 1 升序，2 乱序
    handleList(list, status) {
      if (status == 1) {
        list.sort((a, b) => {
          let aW = a.word.toUpperCase();
          let bW = b.word.toUpperCase();
          if (aW < bW) {
            return -1;
          }
          if (bW > aW) {
            return 1;
          }
          return 0;
        });
      }
      if (status == 2) {
        list.sort((a, b) => {
          return Math.random() > 0.5 ? -1 : 1;
        });
      }
    },
    selecHidden(v) {
      if (v == "1") {
        this.hiddenType = "mean";
      }
      if (v == "2") {
        this.hiddenType = "word";
      }
      if (v == "3") {
        this.hiddenType = "";
      }
    },
    testWM(t) {
      this.activeName = "3";
      document.getElementsByClassName("remind")[0].innerHTML = "提示";
      document.getElementsByClassName("answer")[0].innerHTML = "答案";
      this.testList = [];
      if (t == "mean") {
        this.wordList.forEach((e) => {
          this.testList.push({
            q: e.word,
            a: e.mean,
            r: e.type,
          });
        });
        this.testItem = this.testList[0];
      }
      if (t == "word") {
        this.wordList.forEach((e) => {
          this.testList.push({
            q: e.mean,
            a: e.word,
            r: e.type,
          });
        });
        this.testItem = this.testList[0];
      }
    },
    // 提示
    remindBtn() {
      document.getElementsByClassName("remind")[0].innerHTML = this.testItem.r;
    },
    // 答案
    answerBtn() {
      document.getElementsByClassName("answer")[0].innerHTML =
        this.testItem.a + "," + this.testItem.r;
    },
    nextBtn() {
      if (this.nowTest < this.testList.length - 1) {
        this.nowTest += 1;
        this.testItem = this.testList[this.nowTest];
        document.getElementsByClassName("remind")[0].innerHTML = "提示";
        document.getElementsByClassName("answer")[0].innerHTML = "答案";
      } else {
        document.getElementsByClassName("nextBtn")[0].innerHTML = "测试完成";
      }
    },
  },
  created() {
    this.getWord();
  },
});
