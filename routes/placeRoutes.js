import express from 'express';
import * as placeController from '../controllers/placeController.js';
import { sendNotFoundError, sendServerError } from '../utils/responseUtil.js';

const router = express.Router();

export default router;

router.get('/places', async (req, res) =>
{
    const { limit } = req.query;

    if(limit && (isNaN(limit) || limit < 1))
        return sendServerError(res, 'Limit parameter must be a number greater than or equal to 1!');

    try
    {
        const places = await placeController.getAllPlaces({ query: req.query });
        res.json(places);
    }
    catch(err)
    {
        console.log(err);
        sendServerError(res, err.message);
    }
});

router.get('/places/:id', async (req, res) =>
{
    if(isNaN(req.params.id))
        return sendServerError(res, 'Invalid id, it must be a number!');

    try
    {
        const place = await placeController.getPlace(req.params.id);

        if(place == null)
        {
            return sendNotFoundError(res, 'Place');
        }

        res.json(place);
    }
    catch(err)
    {
        res.sendServerError(res, err.message);
    }
});
