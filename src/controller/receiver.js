
const express = require('express');
const bodyParser = require('body-parser');
const amqp = require("amqplib");
const app = express();

var connection, channel
connectRabbitMQ()
async function connectRabbitMQ() {
    // Note:- Need to connect rabbitMQ Server, to access the Channel 
    const amqpServer = "amqp://localhost:5672";
        connection = await amqp.connect(amqpServer);
        channel = await connection.createChannel();
        await channel.assertQueue("USERS")
        channel.consume("USERS", (msg) => {
            console.log(`Received:${msg.content}`)
         })
    }
   

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});


