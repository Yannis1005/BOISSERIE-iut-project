'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Movie extends Model {

    static get tableName() {
        return 'movie';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(1).required().example('Inception').description('Title of the movie'),
            director: Joi.string().min(1).required().example('Christopher Nolan').description('Director of the movie'),
            releaseDate: Joi.date().required().example('2010-07-16').description('Release date of the movie'),
            genre: Joi.string().min(1).required().example('Thriller').description('Genre of the movie'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {
        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {
        this.updatedAt = new Date();
    }
};