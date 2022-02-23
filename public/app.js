const imageInput = document.getElementById('image');
const latInput = document.getElementById('latitude');
const lngInput = document.getElementById('longitude');

function getCurrentPosition()
{
    return new Promise((resolve, reject) =>
    {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

imageInput.addEventListener('change', e =>
{
    const previewImg = document.querySelector('form .field.image .preview');
    previewImg.src = URL.createObjectURL(imageInput.files[0]);
    previewImg.classList.add('shown');
});

const map = L.map('map', { zoom: 1 });
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

getCurrentPosition().then(geo => 
{
    map.setView([geo.coords.latitude, geo.coords.longitude], 10);
});

map.addEventListener('click', e =>
{
    const { lat, lng } = e.latlng;
    L.marker([lat, lng]).addTo(map);
    latInput.value = lat;
    lngInput.value = lng;
});


