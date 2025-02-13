'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.createTable('movies', (table) => {

            table.increments('id').primary();
            table.string('title').notNull();
            table.string('director').notNull();
            table.date('releaseDate').notNull();
            table.string('genre').notNull();

            table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
            table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
        });
    },

    async down(knex) {

        await knex.schema.dropTableIfExists('movies');
    }
};