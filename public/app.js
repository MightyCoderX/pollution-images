const imageInput = document.getElementById('image');
const latInput = document.getElementById('latitude');
const lngInput = document.getElementById('longitude');

imageInput.addEventListener('change', e =>
{
    const previewImg = document.querySelector('form .field.image .preview');
    previewImg.src = URL.createObjectURL(imageInput.files[0]);
    previewImg.classList.add('shown');
});

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
    if(marker) marker.remove();
    const { lat, lng } = e.latlng;
    marker = L.marker([lat, lng]).addTo(map);
    latInput.value = lat;
    lngInput.value = lng;
});

latInput.addEventListener('change', updateView);
lngInput.addEventListener('change', updateView);

function updateView()
{
    const lat = latInput.value;
    const lng = lngInput.value;
    map.flyTo([lat, lng], 10);
}
