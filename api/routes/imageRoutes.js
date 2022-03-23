import express from 'express';
import { v4 as uuidV4 } from 'uuid';
import fs from 'fs';
import multer from 'multer';
import { sendErrorResponse, sendNotFoundError, sendServerError } from '../utils/responseUtil.js';
import { getAllImages, getImage, addImage } from '../controllers/imageController.js';
import { addPlace } from '../controllers/placeController.js';

const router = express.Router();

export default router;

router.get('/images', async (req, res) =>
{
    const { limit } = req.query;

    if(limit && (isNaN(limit) || limit < 1))
        return sendServerError(res, 'Limit parameter must be a number greater than or equal to 1!');

    try
    {
        const images = await getAllImages({ query: req.query });

        res.json(images);
    }
    catch(err)
    {
        sendErrorResponse(res, 400, err);
    }
});

router.get('/images/:id', async (req, res) =>
{
    if(isNaN(req.params.id))
        return sendServerError(res, 'Invalid id, it must be a number!');

    try
    {
        const image = await getImage(req.params.id);

        if(image == null)
        {
            return sendNotFoundError(res, 'Image');
        }

        res.json(image);
    }
    catch(err)
    {
        sendServerError(res, err.message);
    }
});

const upload = multer({ dest: 'images' });
router.post('/images/new', upload.single('image'), async (req, res) =>
{
    if(!req.file && !(req.body.description || req.body.latitude || req.body.longitude))
        return res.status(400).json({ error: `Bad Request: 'image', 'description', 'latitude' and 'longitude' must be in the body!` });
    
    if(isNaN(req.body.latitude) || isNaN(req.body.longitude))
        return res.status(400).json({ error: `Bad Request: 'latitude' and 'longitude' must be numbers!` });
    
    const dir = './images';
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
    });

    const imageData = {
        fileName: '/' + newPath,
        mimeType: req.file.mimetype,
        size: req.file.size,
        dateCreated: new Date().toISOString().slice(0, -1).replace('T', ' '),
        description: req.body.description,
        placeId: null,
    };

    const placeData = {
        name: req.body.placeName,
        latitude: Number(req.body.latitude),
        longitude: Number(req.body.longitude)
    };

    try
    {
        const place = await addPlace(placeData);

        imageData.placeId = place.id;
    }
    catch(err)
    {
        sendServerError(res, err.message);
    }

    try
    {
        const response = await addImage(imageData);

        res.json(response);
    }
    catch(err)
    {
        sendServerError(res, err.message);
    }
});