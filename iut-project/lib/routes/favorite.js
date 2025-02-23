'use strict';

const Joi = require('joi');

module.exports = [
    {
        method: 'post',
        path: '/favorite',
        options: {
            tags: ['api'],
            auth : {
                scope : ['user']
            },
            validate: {
                payload: Joi.object({
                    movieId: Joi.number().integer().required().min(1).description('ID of the movie to add to favorites')
                })
            }
        },
        handler: async (request, h) => {
            const { favoriteMovieService } = request.services();
            const { id: userId } = request.auth.credentials;
            const { movieId } = request.payload;

            try {
                const result = await favoriteMovieService.addFavorite(userId, movieId);
                return h.response(result).code(201);
            } catch (err) {
                request.log(['error'], err);
                throw err;
            }
        }
    },
    {
        method: 'delete',
        path: '/favorite/{movieId}',
        options: {
            tags: ['api'],
            auth : {
                scope : ['user']
            },
            validate: {
                params: Joi.object({
                    movieId: Joi.number().integer().required().min(1).description('ID of the movie to remove from favorites')
                })
            }
        },
        handler: async (request, h) => {
            const { favoriteMovieService } = request.services();
            const { id: userId } = request.auth.credentials;
            const { movieId } = request.params;

            try {
                const result = await favoriteMovieService.removeFavorite(userId, movieId);
                return h.response(result).code(200);
            } catch (err) {
                request.log(['error'], err);
                throw err;
            }
        }
    },
    {
        method: 'get',
        path: '/favorites',
        options: {
            tags: ['api'],
            auth : {
                scope : ['user']
            },
        },
        handler: async (request, h) => {
            const { favoriteMovieService } = request.services();
            const { id: userId } = request.auth.credentials;

            try {
                const result = await favoriteMovieService.getFavorites(userId);
                return h.response(result).code(200);
            } catch (err) {
                request.log(['error'], err);
                throw err;
            }
        }
    }
];