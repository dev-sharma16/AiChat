const { createClient } = require('redis')

const client = createClient({
        url: process.env.REDIS_URL
});

function connectRedisDb(){
    client.on('error', err => console.log('Redis Client Error', err));

    client.connect()
    .then(() => console.log("Connected to RedisDb.!"))
    .catch((error) => console.log("Can,t connect to RedisDb.!", error))

    return client;
}

module.exports = {connectRedisDb, client}