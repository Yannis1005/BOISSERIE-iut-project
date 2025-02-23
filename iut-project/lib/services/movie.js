'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class MovieService extends Service {

    async create(movie) {
        const { Movie } = this.server.models();

        // Vérifiez si le film existe déjà par titre et date de sortie
        const formattedReleaseDate = new Date(movie.releaseDate).toISOString().split('T')[0];
        const existingMovie = await Movie.query().findOne({ title: movie.title, releaseDate: formattedReleaseDate });

        if (existingMovie) {
            throw Boom.conflict('Movie already exists');
        }

        const newMovie = await Movie.query().insertAndFetch(movie);

        const { mailService, userService } = this.server.services();
        const users = await userService.findAll();

        // Envoyer des emails de notification à tous les utilisateurs concernant le nouveau film
        for (const user of users) {
            await mailService.sendNewMovieEmail(user, newMovie);
        }

        return newMovie;
    }

    findAll() {
        const { Movie } = this.server.models();

        return Movie.query();
    }

    async delete(id) {

        const { Movie } = this.server.models();

        // Vérifiez si le film existe
        const movie = await Movie.query().findById(id);

        if (!movie) {
            throw Boom.notFound('Movie not found');
        }

        // Supprimer le film par son ID
        await Movie.query().deleteById(id);

        return { message: 'Movie deleted successfully' };
    }

    async update(id, movie) {
        const { Movie } = this.server.models();

        // Vérifiez si le film existe
        const existingMovie = await Movie.query().findById(id);

        if (!existingMovie) {
            throw Boom.notFound('Movie not found');
        }

        // Mettre à jour les détails du film par son ID
        await Movie.query().findById(id).patch(movie);

        const updatedMovie = await Movie.query().findById(id);

        const { mailService, favoriteMovieService } = this.server.services();
        const favoriteUsers = await favoriteMovieService.getUsersWithFavoriteMovie(id);


        // Envoyer des emails de notification de mise à jour aux utilisateurs qui ont ce film en favori
        for (const user of favoriteUsers) {
            await mailService.sendMovieUpdateEmail(user, updatedMovie);
        }

        return { message: 'Movie updated successfully', movie: updatedMovie };
    }
};