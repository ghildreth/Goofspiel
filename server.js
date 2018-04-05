"use strict";

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

const deckOfPrize = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const deckOfPlayer1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const deckOfPlayer2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

var player1Pick = getPrizeCard(deckOfPlayer1);
var player2Pick = getPrizeCard(deckOfPlayer2);

var prizeCard = getPrizeCard(deckOfPrize);

var scoreBoard = {
  "p1": 0,
  "p2": 0
}

function getPrizeCard(arrayOfCards) {
  var shuffledCards = shuffleCard(arrayOfCards);
  let prize = shuffledCards.pop();
  return prize;
}

function shuffleCard(arrayOfCards) {
  for (let i = 0; i < arrayOfCards.length - 1; i++) {
    const j = Math.floor(Math.random() * (arrayOfCards.length - 1) + 1);
    [arrayOfCards[i], arrayOfCards[j]] = [arrayOfCards[j], arrayOfCards[i]];
  }
  return arrayOfCards;
}

function selectCardToBet(arrayOfCards, pick) {
  let selectedCard = Number(arrayOfCards[pick - 1]);
  return selectedCard;
}

function updatescoreBoard(p1, p2) {
  if (p1 > p2) {
    scoreBoard["p1"] += prizeCard;
  } else if (p1 < p2) {
    scoreBoard["p2"] += prizeCard;
  } else {
    scoreBoard["p1"] += (prizeCard / 2);
    scoreBoard["p2"] += (prizeCard / 2);
  }
  return scoreBoard;
}

scoreBoard = updatescoreBoard(player1Pick, player2Pick);

console.log(`The prize is: ${prizeCard}`);
console.log(`Player1 selected: ${player1Pick} score ${scoreBoard["p1"]}`);
console.log(`Player2 selected: ${player2Pick} score ${scoreBoard["p2"]}`);



// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page

app.get("/", (req, res) => {
  res.render("game_homepage");
});

app.get("/game_new", (req, res) => {
  res.render("game_new");
});

app.get("/game_play", (req, res) => {


  res.render("game_play");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
