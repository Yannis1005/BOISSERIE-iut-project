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
                return await favoriteMovieService.addFavorite(userId, movieId);
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
                return await favoriteMovieService.removeFavorite(userId, movieId);
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

            request.log(['debug'], `User ID: ${userId}`); // Ajoutez ce log pour vérifier l'ID de l'utilisateur

            try {
                return await favoriteMovieService.getFavorites(userId);
            } catch (err) {
                request.log(['error'], err);
                throw err;
            }
        }
    }
];