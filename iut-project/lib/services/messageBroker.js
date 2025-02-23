'use strict';

const { Service } = require('@hapipal/schmervice');
const amqp = require('amqplib');

const startConsumer = require('../consumers/csvExportConsumer');

module.exports = class MessageBrokerService extends Service {

    async sendCSVExport(email, csv) {
        try {
            // Connectez-vous au serveur RabbitMQ
            const connection = await amqp.connect('amqp://localhost');

            const channel = await connection.createChannel();

            // Déclarez une file d'attente pour les exports CSV
            const queue = 'csv_exports';
            await channel.assertQueue(queue, { durable: true });

            // Créez un message avec les données de l'email et du CSV
            const message = JSON.stringify({ email, csv });

            // Envoyez le message à la file d'attente
            channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

            setTimeout(() => {
                connection.close();
            }, 500);

            // Démarrez le consommateur pour traiter les messages de la file d'attente
            startConsumer(this.server);

        } catch (err) {
            console.error('Failed to send CSV export:', err);
            throw err;
        }
    }
};