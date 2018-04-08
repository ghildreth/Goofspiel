
exports.up = function(knex, Promise) {
    return knex.schema.createTable('war', function (table) {
    table.increments();
    table.string('screen_name');
    table.string('gameState');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('war');
};
