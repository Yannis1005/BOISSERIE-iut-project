'use strict';

const Joi = require('joi')

module.exports = [
    {
        method: 'post',
        path: '/user',
        options: {
            tags:['api'],
            auth : false,
            validate: {
                payload: Joi.object({
                    firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                    email: Joi.string().required().email().example('john@doe.fr').description('Email of the user'),
                    password: Joi.string().min(8).required().example('password').description('Password of the user'),
                    username: Joi.string().required().example('johndoe').description('Username of the user')
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            try {
                const result = await userService.create(request.payload);
                return h.response(result).code(201);

            } catch (err) {
                return h.response({ error: err.message }).code(err.output.statusCode);
            }
        }
    },
    {
        method: 'get',
        path: '/users',
        options: {
            tags:['api'],
            auth : {
                scope: ['user']
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            try {
                const result = await userService.findAll();
                return h.response(result).code(200);

            } catch (err) {
                return h.response({ error: err.message }).code(err.output.statusCode);
            }
        }
    },
    {
        method: 'delete',
        path: '/user/{id}',
        options: {
            tags:['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1)
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            try {
                const result = await userService.delete(request.params.id);
                return h.response(result).code(200);

            } catch (err) {
                return h.response({ error: err.message }).code(err.output.statusCode);
            }
        }
    },
    {
        method: 'patch',
        path: '/user/{id}',
        options: {
            tags:['api'],
            auth : {
                scope : ['admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1)
                }),
                payload: Joi.object({
                    firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
                    email: Joi.string().email().example('john@doe.fr').description('Email of the user'),
                    password: Joi.string().min(8).example('password').description('Password of the user'),
                    username: Joi.string().example('johndoe').description('Username of the user')
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            try {
                const result = await userService.update(request.params.id, request.payload);
                return h.response(result).code(200);

            } catch (err) {
                return h.response({ error: err.message }).code(err.output.statusCode);
            }
        }
    },
    {
        method: 'post',
        path: '/user/login',
        options: {
            tags:['api'],
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required().example('john@doe.fr').description('Email of the user'),
                    password: Joi.string().min(8).required().example('password').description('Password of the user')
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            try {
                const result = await userService.login(request.payload.email, request.payload.password);
                return h.response(result).code(200);

            } catch (err) {
                return h.response({ error: err.message }).code(err.output.statusCode);
            }
        }
    }
];
