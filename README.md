# Pollution Images API
An API to upload images showing polluted areas along with the location cooordinates and a description
<br>
<br>
[Working Sample Form](https://pollution-images-api.herokuapp.com/)

## Docs & Examples

#### API
```
https://pollution-images-api.herokuapp.com/api/
```

### Endpoints

#### Resources
- [/images](#get-a-list-of-all-the-uploaded-images)
- [/places](#get-list-of-all-places)

<br>
<br>

#### Get a list of all the uploaded images
```HTTP
GET /images
```
Query parameters
<table>
    <thead>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th>
    </thead>
    <tbody>
        <tr>
            <td>limit</td>
            <td>number</td>
            <td>Limits the result to the specified number</td>
        </tr>
    </tbody>
</table>

Sample Response
```JSONC
[
  {
    "id": 1,
    "fileName": "/images/<UUID>.jpeg",
    "mimeType": "image/jpeg",
    "size": 69471,
    "dateCreated": 1645634608320,
    "description": "An Image Showing A Polluted Area",
    "placeId": 1
  },
  // ...
]
```

<br>

#### Get one image
```HTTP
GET /images/:id
```

Response
```JSON
{
    "id": 1,
    "fileName": "/images/<UUID>.jpg",
    "mimeType": "image/jpeg",
    "size": 69420,
    "dateCreated": "2022-03-19T21:58:33.000Z",
    "description": "An Image Showing A Polluted Area",
    "placeId": 1
}
```

<br>

#### Upload a new image
```HTTP
POST /images/new
```
The POST request must include `Content-Type: multipart/form-data` and the body must contain the following fields:
```YML
image: file
description: string
placeName: string
latitude: number
longitude: number
```
Basic form
```HTML
<form action="/api/images/new" method="post" enctype="multipart/form-data">
    <input type="file" name="image" accept="image/*" required>
    <textarea name="description" required></textarea>


    <input type="text" name="placeName">
    <input type="number" step="any" name="latitude" required>
    <input type="number" step="any" name="longitude" required>

    <button type="submit">Upload</button>
</form>
```
Response
```JSON
{
  "id": 1,
  "fileName": "/images/<UUID>.jpg",
  "mimeType": "image/jpeg",
  "size": 69420,
  "dateCreated": "2022-03-19T21:58:33.000Z",
  "description": "An Image Showing A Polluted Area",
  "placeId": 1
}
```

<br>

#### Get list of all places
```HTTP
GET /places/
```

Response
```JSONC
[
    {
        "id": 1,
        "name": "Japan",
        "latitude": 35.6291,
        "longitude": 139.757,
        "images": [
            {
                "id": 5,
                "fileName": "/images/<uuid>.jpg",
                "mimeType": "image/jpeg",
                "size": 2449031,
                "dateCreated": "2022-03-19T22:58:33.000Z",
                "description": "A description",
                "placeId": 1
            },
            // ...
        ]
    },
    // ...
]
```

<br>

#### Get one place
```HTTP
GET /places/:id
```

Response
```JSONC
{
    "id": 1,
    "name": "Japan",
    "latitude": 35.6291,
    "longitude": 139.757,
    "images": [
        {
            "id": 5,
            "fileName": "/images/<uuid>.jpg",
            "mimeType": "image/jpeg",
            "size": 2449031,
            "dateCreated": "2022-03-19T22:58:33.000Z",
            "description": "A description",
            "placeId": 1
        },
        // ...
    ]
}
```
