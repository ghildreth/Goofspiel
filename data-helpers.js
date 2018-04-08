function dataHelperMaker(knex){
  function getNamesAndScores(){
    const queryPrms = knex('state')
      .select('screen_name', 'gameState')

    const formattedPrms = queryPrms
      .then((records) => {
        return records.map((record) => {
          return {
            screenName: record.screen_name,
            gameState: record.gameState
          };
        });
      });

    return formattedPrms
  }
  function insertWinnerData(screen_name, gameState){
    const insertPrms = knex('state')
      .insert({screen_name, gameState})
      .returning('*')

    const formattedPrms = insertPrms
      .then((records) => {
        return records.map((record) => {
        return {
          screenName: record.screen_name,
          gameState: record.gameState
        };
      });
    });

      return formattedPrms
  }

  return {
    getNamesAndScores: getNamesAndScores,
    insertWinnerData
  }
}

module.exports = dataHelperMaker;

// var temp = state.games;

// var winner;
// var username;
// console.log("temp");
// for(var key in temp){
//   winner = temp[key].winner;
//   username = temp[key].username;
// }

// // state.games[key].score1,
// // state.games[key].score2,

// if (game.over){
//   knex('state').insert({
//     // req.body.user_name
//     screen_name: game.winner,
//     gameState:  temp[key].score1 > temp[key].score2 ? temp[key].score1 : temp[key].score2,
//   }).returning('id')
//   .then((id)=>{
//     console.log("Record inserted into the database");

//   });
// }
