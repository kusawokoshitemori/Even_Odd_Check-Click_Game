const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
const mysql = require("mysql");

app.use(bodyParser.urlencoded({ extended: true }));

// プレイヤーネームをグローバルに管理
let playerName = "ランキングから名前を入力してください";

// テンプレートエンジンとしてEJSを設定
app.set("view engine", "ejs");
app.set("views", "views");

//connection poolを作成
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "",
  user: "",
  passward: "",
  database: "Even_Odd_Check_Game_Score",
});

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

//名前を変更するプログラム
app.post("/submit_username", (req, res) => {
  playerName =
    req.body.input_playerName.trim() || "ランキングから名前を入力してください"; // プレイヤーネームが空なら'Guest'
  res.redirect("/"); // トップ画面にリダイレクト
});

app.get("/High_Score_ranking", (req, res) => {
  res.render("High_Score_ranking.ejs", { playerName });
});

// サーバーを起動するコード
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
//Git接続チェック
