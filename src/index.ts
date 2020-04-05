import axios from 'axios';

const form = document.querySelector('form')!;
const { google } = window;
const addressInput = document.getElementById('address') as HTMLInputElement;
const resP = document.getElementById('response') as HTMLParagraphElement;

type GoogleGeocodingResponse = {
  results: { 'geometry': { location:{ lat: number, lng: number} }, 'formatted_address': string }[],
  staus: 'OK' | 'ZERO_RESULT'
}

form.addEventListener('submit', async (event) => {
  // Step 1: Prevent default
  event.preventDefault();

  const enteredAddress = addressInput.value;

  // Send address to google
  const response = await axios.get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${process.env.GOOGLE_GEOCODE_API}`);

  if (response.data.staus === 'ZERO_RESULT') {
    resP.textContent = 'No results found';
    return;
  }
  resP.innerText = response.data.results[0].formatted_address;
  const coordinates = response.data.results[0].geometry.location;
  const map = new google.maps.Map(document.getElementById('map') as HTMLLIElement, {
    center: coordinates,
    zoom: 16,
  });
  const ignored = new google.maps.Marker({ position: coordinates, map });
});

// https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
