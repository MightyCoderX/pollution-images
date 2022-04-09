import mysql from 'mysql';
import { config } from 'dotenv';
config();

export const connection = new mysql.createConnection(process.env.CONNECTION_STRING);

function onConnect(error, results, fields)
{
    if(error)
    {
        console.error(error);
        return;
    }

    // console.log(results, fields);
}

connection.query(`

CREATE TABLE IF NOT EXISTS places (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT,
    latitude FLOAT,
    longitude FLOAT
);

`, onConnect);

connection.query(`

CREATE TABLE IF NOT EXISTS images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fileName TEXT,
    mimeType TEXT,
    size INT,
    dateCreated DATETIME,
    description TEXT,
    placeId INT REFERENCES places(id)
);

`, onConnect);