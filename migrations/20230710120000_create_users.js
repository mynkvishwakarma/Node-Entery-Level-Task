exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('mobile', 15).unique().notNullable();
    table.timestamps(true, true);
  });
};

//export function

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};