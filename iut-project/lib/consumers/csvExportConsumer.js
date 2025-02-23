'use strict';

const amqp = require('amqplib');

module.exports = async (server) => {
    const { mailService } = server.services();

    try {

        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'csv_exports';

        await channel.assertQueue(queue, { durable: true });

        // Consommez les messages de la file d'attente
        channel.consume(queue, async (msg) => {
            if (msg !== null) {

                // Analysez le contenu du message
                const { email, csv } = JSON.parse(msg.content.toString());

                try {
                    // Envoyez l'email avec le CSV
                    await mailService.sendCSVEmail(email, csv);
                    channel.ack(msg);

                } catch (err) {
                    console.error('Failed to send email:', err);
                    channel.nack(msg);
                }
            }
        });
    } catch (err) {
        console.error('Failed to consume messages:', err);
    }
};