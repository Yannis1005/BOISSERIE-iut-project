'use strict';

const Joi = require('joi');

module.exports = {
    method: 'post',
    path: '/movie',
    options: {
        auth: false,
        tags: ['api'],
        validate: {
            payload: Joi.object({
                title: Joi.string().required().example('Inception').description('Title of the movie'),
                director: Joi.string().required().example('Christopher Nolan').description('Director of the movie'),
                releaseDate: Joi.date().required().example('2010-07-16').description('Release date of the movie'),
                genre: Joi.string().required().example('Thriller').description('Genre of the movie')
            })
        }
    },
    handler: async (request, h) => {
        const { Movie } = request.models();

        // Objection returns promises, so don't forget to await them.
        const movie = await Movie.query().insertAndFetch({
            title: request.payload.title,
            director: request.payload.director,
            releaseDate: request.payload.releaseDate,
            genre: request.payload.genre
        });

        return movie;
    }
};