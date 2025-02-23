'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const lab = exports.lab = Lab.script();
const sinon = require('sinon');
const MovieService = require('../lib/services/movie');
const MailService = require('../lib/services/mail');
const FavoriteMovieService = require('../lib/services/favorite');
const UserService = require('../lib/services/user');

lab.experiment('MovieService', () => {
    let movieService;
    let mailServiceStub;
    let favoriteMovieServiceStub;
    let userServiceStub;
    let serverStub;

    lab.beforeEach(() => {
        mailServiceStub = sinon.stub(MailService.prototype, 'sendNewMovieEmail').resolves();
        favoriteMovieServiceStub = sinon.stub(FavoriteMovieService.prototype, 'getUsersWithFavoriteMovie').resolves([]);
        userServiceStub = sinon.stub(UserService.prototype, 'findAll').resolves([{ email: 'test@example.com' }]);
        serverStub = {
            models: () => ({
                Movie: {
                    query: () => ({
                        insertAndFetch: sinon.stub().resolves({ title: 'Test Movie', director: 'Test Director', releaseDate: '2023-01-01', genre: 'Test Genre', description: 'Test Description' }),
                        findOne: sinon.stub().resolves(null),
                        findById: sinon.stub().resolves({ id: 1, title: 'Test Movie', director: 'Test Director', releaseDate: '2023-01-01', genre: 'Test Genre', description: 'Test Description' }),
                        deleteById: sinon.stub().resolves(1),
                        patch: sinon.stub().resolves()
                    })
                }
            }),
            services: () => ({
                mailService: new MailService(),
                favoriteMovieService: new FavoriteMovieService(),
                userService: new UserService()
            })
        };
        movieService = new MovieService(serverStub);
    });

    lab.afterEach(() => {
        sinon.restore();
    });

    lab.test('create should insert a new movie and send notification emails', async () => {
        const movie = { title: 'Test Movie', director: 'Test Director', releaseDate: '2023-01-01', genre: 'Test Genre', description: 'Test Description' };
        const newMovie = await movieService.create(movie);

        expect(newMovie).to.include(movie);
        expect(mailServiceStub.called).to.be.true();
    });

    lab.test('create should return an error if the movie already exists', async () => {
        const movie = { title: 'Test Movie', director: 'Test Director', releaseDate: '2023-01-01', genre: 'Test Genre', description: 'Test Description' };
        serverStub.models().Movie.query().findOne.resolves(movie);

        try {
            await movieService.create(movie);
        } catch (err) {
            expect(err.isBoom).to.be.true();
            expect(err.output.statusCode).to.equal(409);
            expect(err.message).to.equal('Movie already exists');
        }
    });

    lab.test('delete should delete an existing movie', async () => {
        const result = await movieService.delete(1);

        expect(result.message).to.equal('Movie deleted successfully');
    });

    lab.test('delete should return an error if the movie does not exist', async () => {
        try {
            await movieService.delete(0);
        } catch (err) {
            expect(err.isBoom).to.be.true();
            expect(err.output.statusCode).to.equal(404);
            expect(err.message).to.equal('Movie not found');
        }
    });

    lab.test('delete should return a validation error if the ID is invalid', async () => {
        try {
            await movieService.delete('invalid-id');
        } catch (err) {
            expect(err.isBoom).to.be.true();
            expect(err.output.statusCode).to.equal(400);
        }
    });

});