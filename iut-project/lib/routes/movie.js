'use strict';

const Joi = require('joi');
const { parse } = require('json2csv');

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
                    title: Joi.string().min(1).required().example('Prisoners').description('Title of the movie'),
                    director: Joi.string().min(1).required().example('Denis Villeneuve').description('Director of the movie'),
                    releaseDate: Joi.date().required().example('2013-09-20').description('Release date of the movie'),
                    genre: Joi.string().min(1).required().example('Thriller').description('Genre of the movie'),
                    description: Joi.string().min(1).required().example('Keller Dover faces a parent\'s worst nightmare when his 6-year-old daughter and her friend go missing.').description('Description of the movie')
                })
            }
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            try {
                const result = await movieService.create(request.payload);
                return h.response(result).code(201);

            } catch (err) {
                return h.response({ error: err.message }).code(err.isBoom ? err.output.statusCode : 500);
            }
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

            try {
                const result = await movieService.findAll();
                return h.response(result).code(200);

            } catch (err) {
                return h.response({ error: err.message }).code(err.isBoom ? err.output.statusCode : 500);
            }
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

            try {
                const result = await movieService.delete(request.params.id);
                return h.response(result).code(200);

            } catch (err) {
                return h.response({ error: err.message }).code(err.isBoom ? err.output.statusCode : 500);
            }
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

            try {
                const result = await movieService.update(request.params.id, request.payload);
                return h.response(result).code(200);

            } catch (err) {
                return h.response({ error: err.message }).code(err.isBoom ? err.output.statusCode : 500);
            }
        }
    },
    {
        method: 'post',
        path: '/movies/export',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            }
        },
        handler: async (request, h) => {
            try {
                const { movieService, messageBrokerService } = request.services();
                const { email } = request.auth.credentials;

                const movies = await movieService.findAll();
                const csv = parse(movies);

                await messageBrokerService.sendCSVExport(email, csv);

                return h.response({ message: 'CSV export requested successfully' }).code(202);

            } catch (err) {
                return h.response({ error: err.message }).code(err.isBoom ? err.output.statusCode : 500);
            }
        }
    }
];