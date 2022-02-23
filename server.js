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
app.post('/api/images/new', upload.single('file'), (req, res) =>
{
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
        desc: req.body.description,
        lat: req.body.latitude,
        lon: req.body.longitude
    };

    const query = 'INSERT INTO images (fileName, mimeType, size, dateCreated, description, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    db.run(query, Object.values(data), (err, result) =>
    {
        if(err)
        {
            console.log(err);
            res.status(400).json({ error: err.message });
            return;
        }
    
        res.json(req.file);
    });
});


app.get('/api/images', (req, res) =>
{
    db.all('SELECT * FROM images', (error, rows) =>
    {
        res.json(rows);
    })
});
