import express, { query } from 'express';
import fs, { rename } from 'fs';
import path from 'path';
import cors from 'cors';
import { v4 as uuidV4 } from 'uuid';
import { randomUUID } from 'crypto';
import multer from 'multer';
import { db } from './database.js';

const PORT = process.env.PORT || 3000;
const ORIGIN = `https://localhost:${PORT}`;
const app = express();

app.listen(PORT, () =>
{
    console.log('Listening at', ORIGIN);
});


app.use(express.urlencoded({extended: true}), cors({
    origin: ORIGIN
}));
app.use(express.json());
app.use('/images', express.static('images'));
app.use('/', express.static('public'));


const upload = multer({ dest: 'images' });
app.post('/api/images/new', upload.single('image'), (req, res) =>
{
    if(!req.file && !(req.body.description || req.body.latitude || req.body.longitude))
        return res.status(400).json({ error: `Bad Request: 'image', 'latitude' and 'longitude' must be in the body!` });

    const dir = 'images';
    if(!fs.existsSync(dir))
    {
        fs.mkdirSync(dir, { recursive: true });
    }

    const id = uuidV4();

    const oldPath = `${dir}/${req.file.filename}`;
    const newPath = `${dir}/${id}.${req.file.originalname.split('.')[1]}`;

    fs.rename(oldPath, newPath, err =>
    {
       if(err) throw err;
       console.log('Successfully Renamed File');
    });

    const data = {
        fileName: '/' + newPath,
        mimeType: req.file.mimetype,
        size: req.file.size,
        created: new Date(),
        description: req.body.description,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    };

    const query = 'INSERT INTO images (fileName, mimeType, size, dateCreated, description, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    db.run(query, Object.values(data), (err, result) =>
    {
        if(err)
        {
            console.error(err);
            res.status(400).json({ error: err.message });
            return;
        }
    
        
    });
    res.json(data);
});


app.get('/api/images', (req, res) =>
{
    const { limit } = req.query;

    if(limit && (isNaN(limit) || limit < 1))
        return res.status(400).json({ error: 'Limit parameter must be a number greater than or equal to 1!' });

    const query = `SELECT * FROM images ${ limit ? 'LIMIT ' + limit : '' }`;

    db.all(query, (err, rows) =>
    {
        if(err)
        {
            console.error(err);
            res.status(400).json({ error: err.message });
            return;
        }
        res.json(rows);
    })
});

app.get('/api/images/:id', (req, res) =>
{
    if(isNaN(req.params.id))
        return res.status(400).json({ error: 'Invalid id, it must be a number!' });

    db.get(`SELECT * FROM images WHERE id = ${req.params.id}`, (err, row) =>
    {
        if(err)
        {
            console.error(err);
            res.status(400).json({ error: err.message });
            return;
        }

        if(!row)
        {
            res.status(404).json({ error: `Image with id ${req.params.id} not found` });
        }

        res.json(row);
    })
});