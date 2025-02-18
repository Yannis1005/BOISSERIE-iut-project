'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class MovieService extends Service {

    async create(movie) {
        const { Movie } = this.server.models();
        const newMovie = await Movie.query().insertAndFetch(movie);

        const { mailService, userService } = this.server.services();
        const users = await userService.findAll();

        for (const user of users) {
            await mailService.sendNewMovieEmail(user, newMovie);
        }

        return newMovie;
    }

    findAll() {
        const { Movie } = this.server.models();
        return Movie.query();
    }

    delete(id) {
        const { Movie } = this.server.models();
        return Movie.query().deleteById(id);
    }

    update(id, movie) {
        const { Movie } = this.server.models();
        return Movie.query().findById(id).patch(movie);
    }
};