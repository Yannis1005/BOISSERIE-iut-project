'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.createTable('favorites', (table) => {

            table.increments('id').primary();
            table.integer('userId').unsigned().notNull().references('id').inTable('user').onDelete('CASCADE');
            table.integer('movieId').unsigned().notNull().references('id').inTable('movie').onDelete('CASCADE');

            table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
        });
    },

    async down(knex) {

        await knex.schema.dropTableIfExists('favorites');
    }
};