const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// プレイヤーネームをグローバルに管理
let playerName = "ランキングから名前を入力してください";

// テンプレートエンジンとしてEJSを設定
app.set("view engine", "ejs");
app.set("views", "views");

// 静的ファイルを提供するための設定を追加
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("top.ejs", { playerName });
});

app.get("/game_page", (req, res) => {
  res.render("game_page.ejs", { playerName });
});

app.get("/game_rule", (req, res) => {
  res.render("game_rule.ejs", { playerName });
});

app.get("/ranking", (req, res) => {
  res.render("ranking.ejs", { playerName });
});

app.post("/submit_username", (req, res) => {
  playerName =
    req.body.input_playerName.trim() || "ランキングから名前を入力してください"; // プレイヤーネームが空なら'Guest'
  res.redirect("/"); // トップ画面にリダイレクト
});

// サーバーを起動するコード
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
//Git接続チェック
