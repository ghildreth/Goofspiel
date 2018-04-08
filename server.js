"use strict";

// require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
// const morgan = require('morgan');
const knexLogger = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
// app.use(morgan('dev'));

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


const state = {
  games: {

  }
};

const bots = ['Julius Ceasar', 'Mickey', 'Dave', 'Homer Simpson'];
function getRandomBotNumber() {
return Math.floor(Math.random()*bots.length);
}

function drawCard(arrayOfCards) {
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

function getSuitedCards(suit) {
  return ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king' ]
    .map(x=>`${x}_of_${suit.toLowerCase()}`);
}

function getValueOf(card) {
  const value = card.split('_')[0]; //

  // console.log(`getValueOf(${card}) => ${value}`);
  switch(value) {
    case 'ace': return 1;
    case 'jack': return 11;
    case 'queen': return 12;
    case 'king': return 13;
    default: return Number(value);
  }
}


// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("game_homepage");
});

app.get('/games', (req, res) => {
  res.send(state); // entire state of all possible games ever played
});

app.get('/game/:gameId', (req, res) => {

  const gameId = req.params.gameId;
  const game = state.games[gameId];

  if(!game) {
    res.redirect('/');
    return;
  }
  res.render('game_new', { game, gameId });
});

app.get('/game/war/:gameId', (req, res) => {
  const gameId = req.params.gameId;
  const game = state.games[gameId];
  if(!game) {
    res.redirect('/');
    return;
  }
  res.render('game_war', { game, gameId });
});

app.post("/game/new", (req, res) => {
  const gameId = new Date().getTime().toString(36);

  const pile = shuffleCard(getSuitedCards('hearts'));

  var valueCard = pile.pop();
  state.games[gameId] = {
    hand1: getSuitedCards('spades'), 
    hand2: getSuitedCards('diamonds'),
    pile,
    valueCard,
    bet1: null,
    bet2: null,
    score1: 0,
    score2: 0,
    username: req.body.username,
    botname: bots[getRandomBotNumber()],
  }

  res.redirect(`/game/${gameId}`);
});

app.post("/game/war", (req, res) => {

  
  const gameId = new Date().getTime().toString(36) + "W"; 
  let war1pile = shuffleCard(getSuitedCards('spades'));
  let war2pile = shuffleCard(getSuitedCards('hearts'));

  state.games[gameId] = {
    score1: 0,
    score2: 0,
    username: req.body.username,
    botname: bots[getRandomBotNumber()],
    war1: war1pile.pop(),
    war2: war2pile.pop(),
    war2pile,
    war1pile,

  }
  res.redirect(`/game/war/${gameId}`);
});

app.post('/game/war/:gameId/', (req, res) => {
  const { gameId } = req.params;
  const game = state.games[gameId];

  if(!game) {
    res.redirect('/');
    return;
  }

  if(game.war1){
    if(getValueOf(game.war1) === getValueOf(game.war2)) {
      game.score1 += getValueOf(game.war1) / 2;
      game.score2 += getValueOf(game.war2) / 2;
    } else if (getValueOf(game.war1) > getValueOf(game.war2)){
      game.score1 += getValueOf(game.war1);
    } else if (getValueOf(game.war2) > getValueOf(game.war1)) {
      game.score2 += getValueOf(game.war2);
    }
    game.over = !game.war1;
  }
  if (game.score1 > game.score2) {
      game.winner = game.botname;
  } else {
    game.winner = game.username;
  }
  game.war1 = game.war1pile.pop();
  game.war2 = game.war2pile.pop();
  res.redirect(`/game/war/${gameId}`);
});

app.post('/game/:gameId/play', (req, res) => {
  const { gameId } = req.params;
  const { card } = req.body;

  const game = state.games[gameId];

  if(!game) {
    res.redirect('/');
    return;
  }

  const opponentBet = drawCard(game.hand2); // reduces the Bots array of cards by 1 and gives one bet card
  game.hand1 = game.hand1.filter(x=> x != card);
  game.bet1 = opponentBet;
  game.bet2 = card;
  game.winner = game.username;
  if(!game.over){
    if(getValueOf(game.bet1) === getValueOf(game.bet2)) {
      // console.log(`Player 1 wins with ${getValueOf(game.valueCard)} with ${card} vs ${opponentBet}`);
      game.score1 += getValueOf(game.valueCard) / 2;
      game.score2 += getValueOf(game.valueCard) / 2;
    } else if (getValueOf(game.bet1) > getValueOf(game.bet2)){
      // console.log(`Player 2 wins with ${getValueOf(game.valueCard)} with ${opponentBet} vs ${card}`);
      game.score1 += getValueOf(game.valueCard);
    } else if (getValueOf(game.bet2) > getValueOf(game.bet1)) {
      game.score2 += getValueOf(game.valueCard);
    }
    game.valueCard = game.pile.pop();
    game.over = !game.valueCard;
  }
  if (game.score1 > game.score2) {
      game.winner = game.botname;
  }

var temp = state.games;

var winner;
var username;
console.log("temp");
for(var key in temp){
  winner = temp[key].winner;
  username = temp[key].username;
}

// state.games[key].score1,
// state.games[key].score2,

if (game.over){
  knex('state').insert({
    // req.body.user_name
    screen_name: game.winner,
    gameState:  temp[key].score1 > temp[key].score2 ? temp[key].score1 : temp[key].score2,
  }).returning('id')
  .then((id)=>{
    console.log("Record inserted into the database");

  });
}


res.redirect(`/game/${gameId}`);
});



app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
