exports.up = function(knex) {
  return knex.schema.table('tasks', function(table) {
    table.date('last_date').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('tasks', function(table) {
    table.dropColumn('last_date');
  });
};