const express = require("express");
const app = express();

// テンプレートエンジンとしてEJSを設定
app.set("view engine", "ejs");

// 静的ファイルを提供するための設定を追加
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("top.ejs");
});

// サーバーを起動するコード
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
