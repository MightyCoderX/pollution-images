import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 3000;
const ORIGIN = `https://localhost:${PORT}`;
const app = express();

import placesRoutes from './routes/placeRoutes.js';
import newImageRoutes from './routes/imageRoutes.js';

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

// API routes
app.use('/api', placesRoutes);
app.use('/api', newImageRoutes);