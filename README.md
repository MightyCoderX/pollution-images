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

#### Get a list of all the uploaded images
```HTTP
GET  /images
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
    "latitude": 0.24107697642621,
    "longitude": 0.24979591369629
  },
  // ...
]
```

<br>

#### Get one image
```HTTP
GET  /images/:id
```

Sample Response
```JSON
{
    "id": 1,
    "fileName": "/images/<UUID>.jpeg",
    "mimeType": "image/jpeg",
    "size": 69471,
    "dateCreated": 1645634608320,
    "description": "An Image Showing A Polluted Area",
    "latitude": 0.24107697642621,
    "longitude": 0.24979591369629
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
description: text
latitude: number
longitude: number
```
Basic form
```HTML
<form action="/api/images/new" method="post" enctype="multipart/form-data">
    <input type="file" name="image" accept="image/*" required>
    <textarea name="description" required></textarea>

    <input type="number" step="any" name="latitude" required>
    <input type="number" step="any" name="longitude" required>

    <button type="submit">Upload</button>
</form>
```

