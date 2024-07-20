const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// プレイヤーネームをグローバルに管理
let playerName = "Guest";

// テンプレートエンジンとしてEJSを設定
app.set("view engine", "ejs");
app.set("views", "views");

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

app.get("/ranking", (req, res) => {
  res.render("ranking.ejs", { playerName });
});

// サーバーを起動するコード
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
//Git接続チェック
