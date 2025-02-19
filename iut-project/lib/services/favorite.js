'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class FavoriteMovieService extends Service {

    async addFavorite(userId, movieId) {
        try {
            if (!userId || !movieId) {
                throw Boom.badRequest(`User ID and Movie ID are required. Received userId: ${userId}, movieId: ${movieId}`);
            }

            const { Favorite } = this.server.models();

            const existingFavorite = await Favorite.query().findOne({ userId, movieId });
            if (existingFavorite) {
                throw Boom.conflict('Movie is already in favorites');
            }

            return Favorite.query().insertAndFetch({ userId, movieId });
        } catch (err) {
            this.server.log(['error'], err);
            throw err;
        }
    }

    async removeFavorite(userId, movieId) {
        try {
            if (!userId || !movieId) {
                throw Boom.badRequest('User ID and Movie ID are required');
            }

            const { Favorite } = this.server.models();

            const existingFavorite = await Favorite.query().findOne({ userId, movieId });
            if (!existingFavorite) {
                throw Boom.notFound('Movie is not in favorites');
            }

            await Favorite.query().delete().where({ userId, movieId });
            return { message: 'Favorite removed successfully' };
        } catch (err) {
            this.server.log(['error'], err);
            throw err;
        }
    }

    async getFavorites(userId) {
        try {
            if (!userId) {
                throw Boom.badRequest('User ID is required');
            }

            const { Favorite, Movie } = this.server.models();

            return Favorite.query()
                .where('userId', userId)
                .join('movie', 'favorite.movieId', 'movie.id')
                .select('movie.*');
        } catch (err) {
            this.server.log(['error'], err);
            throw err;
        }
    }

    async getUsersWithFavoriteMovie(movieId) {
        try {
            if (!movieId) {
                throw Boom.badRequest('Movie ID is required');
            }

            const { Favorite, User } = this.server.models();

            return Favorite.query()
                .where('movieId', movieId)
                .join('user', 'favorite.userId', 'user.id')
                .select('user.*');
        } catch (err) {
            this.server.log(['error'], err);
            throw err;
        }
    }
};