import mysql from "mysql";

export const connection = new mysql.createConnection('mysql://tbxm1qqumm2042ib:isu82nb88f28icp2@i54jns50s3z6gbjt.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/o9xctk7eg0mzfcjs');

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