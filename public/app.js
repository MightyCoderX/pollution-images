const imageInput = document.getElementById('image');
const latInput = document.getElementById('latitude');
const lngInput = document.getElementById('longitude');
const placeNameInput = document.getElementById('placeName');
const placesDataList = document.getElementById('places');

updateImagePreview();

fetch('/api/places')
.then(res => res.json())
.then(places =>
{
    for(let place of places)
    {
        const placeOpt = document.createElement('option');
        placeOpt.value = place.name;
        placesDataList.appendChild(placeOpt);
    }

    const placeNames = places.map(place => place.name);

    console.log(placeNames);

    placeNameInput.addEventListener('change', e =>
    {
        console.log('place input changed');

        if(!placeNames.map(name => name.toLowerCase()).includes(placeNameInput.value.toLowerCase())) return;
        
        const place = places.filter(place => place.name.toLowerCase() === placeNameInput.value.toLowerCase())[0];
        latInput.value = place.latitude;
        lngInput.value = place.longitude;

        updateMapCoords();
        createMarker(place.latitude, place.longitude);
    });
});

imageInput.addEventListener('change', updateImagePreview);

function updateImagePreview()
{
    console.log(imageInput, document.querySelector('form .field.image .preview'));
    if(!imageInput.files[0]) return;
    console.log('Showing image preview');
    const previewImg = document.querySelector('form .field.image .preview');
    previewImg.src = URL.createObjectURL(imageInput.files[0]);
    previewImg.classList.add('shown');
}

const map = L.map('map', { center: [0, 0], zoom: 1 });
map.locate({ 
    setView: true,
    enableHighAccuracy: true
});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let marker;
map.addEventListener('click', e =>
{
    createMarker(e.latlng.lat, e.latlng.lng);
});

function createMarker(lat, lng)
{
    if(marker) marker.remove();
    marker = L.marker([lat, lng]).addTo(map);
    latInput.value = lat;
    lngInput.value = lng;
}

latInput.addEventListener('change', updateMapCoords);
lngInput.addEventListener('change', updateMapCoords);

function updateMapCoords(instant)
{
    const lat = latInput.value;
    const lng = lngInput.value;

    if(instant === false)
    {
        map.flyTo([lat, lng], 10);
    }
    else
    {
        map.setView([lat, lng], 10);
    }
}