const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// プレイヤーネームとスコアをどこからでも使えるようにする
let playerName = "ランキングから名前を入力してください";
let now_game_score = 0;

// テンプレートエンジンとしてEJSを設定
app.set("view engine", "ejs");
app.set("views", "views");

// JSON ボディを解析するミドルウェア
app.use(express.json());

//connection poolを作成
const pool = mysql.createPool({
  //同時接続数
  connectionLimit: 10,
  host: "localhost",
  user: "kusa",
  password: "kusawokoshitemori",
  database: "Even_Odd_Check_Game_Score",
});

/* 接続プールが動くかチェック
pool.getConnection((err, connection) => {
  if (err) {
    console.error("データベースへの接続に失敗しました:", err);
    return;
  }
  console.log("データベースに接続しました");
  // 接続を解放
  connection.release();
});*/

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

//とりあえず入れたやつ。後で消してもいい
app.get("/game_result", (req, res) => {
  res.render("game_rusult.ejs");
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

app.post("/Game_Score_Send", (req, res) => {
  console.log("Request body:", req.body);
  const { PlayerName, Score } = req.body; // 変数名を一致させる
  console.log("Received PlayerName:", PlayerName);
  console.log("Received Score:", Score);

  // MySQLの接続プールを使用してデータを挿入
  pool.query(
    "INSERT INTO score (PlayerName, Score) VALUES (?, ?)",
    [PlayerName, Score], // ここも一致させる
    (error, results) => {
      if (error) {
        console.error("Error inserting data:", error);
        return res.status(500).send("Internal Server Error");
      }
      res.redirect("/gameresult.ejs"); // データ挿入後にリダイレクト
    }
  );
});

// サーバーを起動するコード
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
//Git接続チェック
