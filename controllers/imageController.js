import { connection } from '../database.js';
import { promisify } from 'util';

const query = promisify(connection.query).bind(connection);

export async function getAllImages(options)
{
    const { limit } = options.query;

    return await query(`SELECT * FROM images ${ limit !== undefined ? 'LIMIT ' + limit : '' }`);
}

export async function getPlaceImages(placeId)
{
    return await query(`SELECT * FROM images WHERE placeId = ${placeId}`);
}

export async function addImage(imageData)
{
    const response = await query(`
        INSERT INTO images 
        (fileName, mimeType, size, dateCreated, description, placeId) 
        VALUES 
        (?, ?, ?, ?, ?, ?)
    `
    , Object.values(imageData));
    
    return { id: response.insertId-1, ...imageData };
}