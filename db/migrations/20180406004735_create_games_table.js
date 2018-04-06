exports.up = function(knex, Promise) {
  return knex.schema.createTable('games', function (table) {
    table.increments();
    table.string('session');
    table.json('gameState');
    table.integer('score');

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('games');
};
