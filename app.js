const express = require("express");
const app = express();

// テンプレートエンジンとしてEJSを設定
app.set("view engine", "ejs");

// 静的ファイルを提供するための設定を追加
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("top.ejs");
});

app.get("/game_page", (req, res) => {
  res.render("game_page.ejs");
});

app.get("/game_rule", (req, res) => {
  res.render("game_rule.ejs");
});

// サーバーを起動するコード
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
//Git接続チェック
