require('dotenv').config()
const express = require('express');
let pgtools = require('pgtools');
const middleware = require('./middleware');
let app = express();
const port = process.env.SERVER_PORT;
const { initSequelize } = require('./services/initService');
const authController = require('./controllers/authorization/auth');
const verificationController = require('./controllers/authorization/verification');


middleware(app);
authController(app);
verificationController(app);

const config = {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    host: process.env.POSTGRES_HOST

}

console.log(`User: ${process.env.POSTGRES_USER}`);
console.log(`Password: ${process.env.POSTGRES_PASSWORD}`);
console.log(`Host: ${process.env.POSTGRES_HOST}`);
console.log(`Port: ${process.env.POSTGRES_PORT}`);
console.log(`DB: ${process.env.POSTGRES_DATABASE}`);


pgtools.createdb(config, process.env.POSTGRES_DATABASE, function (err, res) {
    if (err) {
        if(err.name === 'duplicate_database'){
            console.log('Database already exists');
        }
        else{
            console.log(err);
        }
    }
    else {
        console.log('Database has been created successfully!');
    }

    initSequelize();

});

console.log(`Website Server listening on port: ${port}`);
app.listen(port);
