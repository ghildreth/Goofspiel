"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
    });
  router.get("/game/:gameId/play", (req, res) => {
    knex
      .insert("state")
      .into("gameState")
      .then((results) => {
        res.json(results);
    });

  });

  return router;
}


