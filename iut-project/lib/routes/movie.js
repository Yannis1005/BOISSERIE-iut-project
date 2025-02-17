'use strict';

const Joi = require('joi');

module.exports = [
    {
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
                    genre: Joi.string().required().example('Thriller').description('Genre of the movie'),
                    description: Joi.string().min(1).required().example('Dom Cobb is a thief skilled in the perilous art of extraction: his specialty is to appropriate an individual\'s most precious secrets..').description('Description of the movie')
                })
            }
        },
        handler: async (request, h) => {
            const { movieService } = request.services();
            return await movieService.create(request.payload);
        }
    },
    {
        method: 'get',
        path: '/movies',
        options: {
            auth: false,
            tags: ['api']
        },
        handler: async (request, h) => {
            const { movieService } = request.services();
            return await movieService.findAll();
        }
    },
    {
        method: 'delete',
        path: '/movie/{id}',
        options: {
            tags: ['api'],
            auth: false,
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1)
                })
            }
        },
        handler: async (request, h) => {
            const { movieService } = request.services();
            return await movieService.delete(request.params.id);
        }
    },
    {
        method: 'patch',
        path: '/movie/{id}',
        options: {
            tags: ['api'],
            auth: false,
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1)
                }),
                payload: Joi.object({
                    title: Joi.string().example('Inception').description('Title of the movie'),
                    director: Joi.string().example('Christopher Nolan').description('Director of the movie'),
                    releaseDate: Joi.date().example('2010-07-16').description('Release date of the movie'),
                    genre: Joi.string().example('Thriller').description('Genre of the movie'),
                    description: Joi.string().min(1).required().example('Dom Cobb is a thief skilled in the perilous art of extraction: his specialty is to appropriate an individual\'s most precious secrets..').description('Description of the movie')
                })
            }
        },
        handler: async (request, h) => {
            const { movieService } = request.services();
            return await movieService.update(request.params.id, request.payload);
        }
    }
];