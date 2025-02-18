'use strict';

const Joi = require('joi');

module.exports = [
    {
        method: 'post',
        path: '/movie',
        options: {
            tags: ['api'],
            auth : {
                scope : ['admin']
            },
            validate: {
                payload: Joi.object({
                    title: Joi.string().required().example('Prisoners').description('Title of the movie'),
                    director: Joi.string().required().example('Denis Villeneuve').description('Director of the movie'),
                    releaseDate: Joi.date().required().example('2013-09-20').description('Release date of the movie'),
                    genre: Joi.string().required().example('Thriller').description('Genre of the movie'),
                    description: Joi.string().min(1).required().example('Keller Dover faces a parent\'s worst nightmare when his 6-year-old daughter and her friend go missing.').description('Description of the movie')
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
            auth : {
                scope : ['admin']
            },
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
            auth : {
                scope : ['admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1)
                }),
                payload: Joi.object({
                    title: Joi.string().example('Prisoners').description('Title of the movie'),
                    director: Joi.string().example('Denis Villeneuve').description('Director of the movie'),
                    releaseDate: Joi.date().example('2013-09-20').description('Release date of the movie'),
                    genre: Joi.string().example('Thriller').description('Genre of the movie'),
                    description: Joi.string().min(1).required().example('Keller Dover faces a parent\'s worst nightmare when his 6-year-old daughter and her friend go missing.').description('Description of the movie')
                })
            }
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            return await movieService.update(request.params.id, request.payload);
        }
    }
];