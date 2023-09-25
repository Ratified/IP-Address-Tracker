const ipAddr = document.getElementById('ip');
const locationElement = document.getElementById('location');
const timezone = document.getElementById('timezone');
const isp = document.getElementById('isp');
const form = document.getElementById('form');
const button = document.getElementById('button');
let lat;
let logn;
let map; //global variable to store map object

console.log(ipAddr, locationElement, timezone, isp, form, button);

function createMap(lat, logn) {
  map = L.map('map').setView([lat, logn], 13);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  var marker = L.marker([lat, logn]).addTo(map);
}

function updateMap(lat, logn) {
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });
  var marker = L.marker([lat, logn]).addTo(map);
  map.setView([lat, logn], 13);
}

fetch('http://ip-api.com/json')
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    logn = data.lon;
    lat = data.lat;
    ipAddr.innerText = data.query;
    locationElement.innerText = `${data.city}, ${data.regionName} ${data.zip}`;
    timezone.innerText = `UTC ${data.timezone}`;
    isp.innerText = data.isp;

    createMap(lat, logn); 
  })
  .catch((error) => {
    console.log("Error: ", error);
  });

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('input').value;
  if (validateIP(input) == true) {
    fetch(`http://ip-api.com/json/${input}`)
      .then((response) => response.json())
      .then((data) => {
        logn = data.lon;
        lat = data.lat;
        ipAddr.innerText = data.query;
        locationElement.innerText = `${data.city}, ${data.regionName} ${data.zip}`;
        timezone.innerText = `UTC ${data.timezone}`;
        isp.innerText = data.isp;

        updateMap(lat, logn); 

        console.log("Updated map with new coordinates:", lat, logn);
      })
      .catch((error) => {
        console.log("Error fetching IP data: ", error);
      });
  } else {
    alert("Please enter a valid IP address");
  }
});

function validateIP(ip) {
  const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipPattern.test(ip);
}
