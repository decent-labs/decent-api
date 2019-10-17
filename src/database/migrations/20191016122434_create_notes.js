
exports.up = function (knex) {
  return knex.schema.createTable("notes", table => {
    table
      .increments("id")
      .unsigned()
      .primary();
    table
      .string("note")
      .notNullable();
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("now()"));
    table
      .timestamp("updated_at")
      .nullable();
    table
      .timestamp("deleted_at")
      .nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("notes");
};
