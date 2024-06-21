const mysql = require('mysql');
require('dotenv').config();

class MySqlConnector {
    constructor() {
        // Parse DATABASE_URL for connection details
        const [_, username, password, host, port, database] = process.env.DATABASE_URL.match(/mysql:\/\/(.*?):(.*?)@(.*?):(.*?)\/(.*?)/);
        
        const matches = process.env.DATABASE_URL.match(/mysql:\/\/(.*?):(.*?)@(.*?):(.*?)\/(.*?)/);

        this.connectionDetails = {
            host: host,
            user: username,
            password: password,
            database: "TrueCity",
            port: parseInt(port, 10)
        };


    }

    connect() {
        return new Promise((resolve, reject) => {
            this.connection = mysql.createConnection(this.connectionDetails);
            this.connection.connect(err => {
                if (err) {
                    reject(`Error connecting to the database: ${err.stack}`);
                } else {
                    resolve('Connected to the database.');
                }
            });
        });
    }

    query(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, params, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve('Connection closed.');
                }
            });
        });
    }
}

module.exports = MySqlConnector;
