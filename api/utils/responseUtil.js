export function sendErrorResponse(res, status, err)
{
    console.error(err);
    res.status(status).json({ error: err.message });
}

export function sendServerError(res, message)
{
    sendErrorResponse(res, 400, {message});
}

export function sendNotFoundError(res, resourceName)
{
    sendErrorResponse(res, 404, `404 ${resourceName} not found`);
}

