
exports.up = function(knex, Promise) {
    return knex.schema.createTable('state', function (table) {
    table.increments();
    table.string('screen_name');
    table.string('gameState');

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('state');
};
