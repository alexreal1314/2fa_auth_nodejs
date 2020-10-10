const Pool = require('pg').Pool
const { Sequelize } = require('sequelize');
const async = require('async');
let nodeMailer = require("nodemailer");
const connectionString = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`;
const sequelize = new Sequelize(connectionString, {
    dialact: 'postgres',
    logging: false,
    define: {
        freezeTableName: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

let models = {};

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
});

const transporter = nodeMailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    },
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

function initSequelize() {

    sequelize.authenticate()
        .then(() => {
            console.log("Sequelize connected to DB successfully!");
            syncTables();

        }).catch((err) => {
            console.log('Error connecting to DB');
        });

}



function syncTables() {
    var order = [
        'user',
        'verificationToken'
    ];

    async.eachSeries(order, function (file, callback) {
        models[file] = require(`../models/${file}`)
        models[file]
            .sync()
            .then(function () {

                console.log('Force-synced %s', file);
                callback();

            }).catch((err) => {
            });
    });
}

module.exports = {
    pool,
    initSequelize,
    sequelize
}