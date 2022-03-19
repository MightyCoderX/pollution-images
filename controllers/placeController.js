import { connection } from '../database.js';
import { promisify } from 'util';

const query = promisify(connection.query).bind(connection);

export async function getAllPlaces(options)
{
    const { limit } = options.query;

    const places = await query(`SELECT * FROM places ${ limit !== undefined ? 'LIMIT ' + limit : '' }`);

    await insertImages(places);
    
    return places;
}

export async function getPlace(id)
{
    const places = await query(`SELECT * FROM places WHERE id = ${id}`);
    
    if(!places) return null;

    await insertImages(places);

    return places[0];
}

export async function addPlace(placeData)
{
    const places = await query(`SELECT id FROM places WHERE name = '${placeData.name}'`);

    if(places[0] === undefined)
    {
        const place = await query('INSERT INTO places (name, latitude, longitude) VALUES (?, ?, ?)', 
            Object.values(placeData));
        
        return place;
    }

    return places[0];
}

async function insertImages(places)
{
    for await (let place of places)
    {
        try
        {
            const images = await query('SELECT * FROM images WHERE placeId = ?', [place.id]);

            place.images = images;
        }
        catch(err)
        {
            return;
        }
    }
}