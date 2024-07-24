require("dotenv").config(); // .envファイルを読み込む

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// 'views'ディレクトリのパスを指定
const path = require("path");
console.log(path.join(__dirname, "views"));

// プレイヤーネームとスコアをどこからでも使えるようにする
let playerName = "ランキングから名前を入力してください";
let now_game_score = 0;

// テンプレートエンジンとしてEJSを設定
app.set("view engine", "ejs");

// JSON ボディを解析するミドルウェア
app.use(express.json());

//connection poolを作成
const pool = mysql.createPool({
  //同時接続数
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
//接続プールが動くかチェック
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to database.");
  connection.end();
});

// 静的ファイルの提供 ローカル環境以外でも動くように
app.use(express.static(path.join(__dirname, "public")));

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

//10位までいいスコアをresultsに入れる
app.get("/High_Score_ranking", (req, res) => {
  const query =
    "SELECT id, PlayerName, Score FROM Score ORDER BY Score DESC LIMIT 10";

  pool.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Server Error");
      return;
    }
    res.render("High_Score_ranking.ejs", { scores: results });
  });
});

//元からいる人だったらscoreを更新し、初見さんだったら新しく場所を作る
app.post("/Game_Score_Send", (req, res) => {
  const { PlayerName, Score } = req.body;

  // 既存のスコアを取得
  pool.query(
    "SELECT Score FROM score WHERE PlayerName = ?",
    [PlayerName],
    (error, results) => {
      if (error) {
        console.error("Error fetching data:", error);
        return res.status(500).send("Internal Server Error");
      }

      // 既存のスコアがある場合
      if (results.length > 0) {
        const existingScore = results[0].Score;

        // 現在のスコアが既存のスコアよりも高い場合
        if (Score > existingScore) {
          // スコアを更新
          pool.query(
            "UPDATE score SET Score = ? WHERE PlayerName = ?",
            [Score, PlayerName],
            (error) => {
              if (error) {
                console.error("Error updating data:", error);
                return res.status(500).send("Internal Server Error");
              }
              res.json({ message: "Score updated successfully" });
            }
          );
        } else {
          // スコアが既存のスコア以下の場合
          res.json({ message: "Score not updated" });
        }
      } else {
        // 新しいプレイヤーの場合
        pool.query(
          "INSERT INTO score (PlayerName, Score) VALUES (?, ?)",
          [PlayerName, Score],
          (error) => {
            if (error) {
              console.error("Error inserting data:", error);
              return res.status(500).send("Internal Server Error");
            }
            res.json({ message: "Score inserted successfully" });
          }
        );
      }
    }
  );
});

// サーバーを起動するコード
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
