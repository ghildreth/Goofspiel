function dataHelperMaker(knex){
  function getNamesAndScores(){
    const queryPrms = knex('state')
      .select('screen_name', 'gameState')
      .orderBy('gameState', 'desc')

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

