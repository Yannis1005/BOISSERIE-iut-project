'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');


module.exports = class UserService extends Service {

    async create(user) {
        const { User } = this.server.models();

        // Vérifiez si l'utilisateur existe déjà par email
        const existingUser = await User.query().findOne({ email: user.email });

        if (existingUser) {
            throw Boom.conflict('Email already in use');
        }

        const newUser = await User.query().insertAndFetch(user);

        // Envoyer un email de bienvenue
        const { mailService } = this.server.services();

        await mailService.sendWelcomeEmail(newUser);

        return newUser;
    }

    findAll(){

        const { User } = this.server.models();

        return User.query();
    }

    async delete(id) {

        const {User} = this.server.models();

        // Supprimer l'utilisateur par ID
        const rowsDeleted = await User.query().deleteById(id);

        if (rowsDeleted === 0) {
            throw Boom.notFound('User not found');
        }

        return {message: 'User deleted successfully'};
    }

    async update(id, user) {

        const {User} = this.server.models();

        // Mettre à jour l'utilisateur par ID
        const rowsUpdated = await User.query().findById(id).patch(user);

        if (rowsUpdated === 0) {
            throw Boom.notFound('User not found');
        }

        return {message: 'User updated successfully', user : user};
    }

    async login(email, password) {

        const { User } = this.server.models();

        // Trouver l'utilisateur par email et mot de passe
        const user = await User.query().findOne({ email, password });

        if (!user) {
            throw Boom.unauthorized('Invalid credentials');
        }

        // Générer un token JWT pour l'utilisateur
        const token = Jwt.token.generate(
            {
                id: user.id, // Ajout de l'id de l'utilisateur pour les favoris
                aud: 'urn:audience:iut',
                iss: 'urn:issuer:iut',
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                scope: user.roles
            },
            {
                key: 'random_string', // La clé qui est définit dans lib/auth/strategies/jwt.js
                algorithm: 'HS512'
            },
            {
                ttlSec: 14400 // 4 hours
            }
        );

        return token;
    }
}
