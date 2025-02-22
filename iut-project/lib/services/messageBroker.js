'use strict';

const { Service } = require('@hapipal/schmervice');
const amqp = require('amqplib');

const startConsumer = require('../consumers/csvExportConsumer');

module.exports = class MessageBrokerService extends Service {

    async sendCSVExport(email, csv) {
        try {
            const connection = await amqp.connect('amqp://localhost');

            console.log('Connected to RabbitMQ');

            const channel = await connection.createChannel();

            const queue = 'csv_exports';
            await channel.assertQueue(queue, { durable: true });

            const message = JSON.stringify({ email, csv });

            channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

            setTimeout(() => {
                connection.close();
                console.log('Connection closed');
            }, 500);

            startConsumer(this.server);
        } catch (err) {
            console.error('Failed to send CSV export:', err);
            throw err;
        }
    }
};