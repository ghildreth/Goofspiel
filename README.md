# MidTerm Project: CARD GAME
Game name: Goofspiel
We created a fully functional verison of Goofspiel wherein a user faces computer in an intense 13 round match. Whoever bids the higher card wins the prize card in the middle.

Game name: War
A simple game wherein the user and computer are dealt random cards whoever has the higher wins that card's points, this game is blazing fast!


## Screen shots
![screenshot from 2018-04-20 00-52-52](https://user-images.githubusercontent.com/34799149/39037594-cc159dc2-4435-11e8-9955-50cc0932a134.png)
![screenshot from 2018-04-20 00-53-27](https://user-images.githubusercontent.com/34799149/39037639-f05966fa-4435-11e8-89c2-b7c1efc0ab46.png)


## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Create base DB in your DB app of choice and make sure your DB name aligns with your DB_NAME in the .env file
6. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
7. Run the seed: `npm run knex seed:run`
  - Check the seeds file to see what gets seeded in the DB
8. Run the server: `npm run local`
9. Visit `http://localhost:8080/`

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
- body-parser
- dotenv
- ejs
- express
- knex
- knex-logger
- node-sass-middleware
- pg
REMINDER: Must have running DB (PostgreSQL preferred)
