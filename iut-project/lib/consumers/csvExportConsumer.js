'use strict';

const amqp = require('amqplib');

module.exports = async (server) => {
    const { mailService } = server.services();

    try {
        console.log('Starting consumer...');

        const connection = await amqp.connect('amqp://localhost');
        console.log('Connected to RabbitMQ');

        const channel = await connection.createChannel();
        const queue = 'csv_exports';
        await channel.assertQueue(queue, { durable: true });

        channel.consume(queue, async (msg) => {
            if (msg !== null) {

                const { email, csv } = JSON.parse(msg.content.toString());

                try {
                    console.log('Sending CSV email to:', email);
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