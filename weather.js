const apiKey = 'e4ad7d099853402cbc8142112232305';
const username = 'awacado'; // Replace with your GeoNames username
const form = document.getElementById('search-form');
const locationInput = document.getElementById('location-input');
const weatherInfo = document.getElementById('weather-info');
const dropdown = document.getElementById('dropdown');

let timeoutId;

form.addEventListener('submit', e => {
  e.preventDefault();
  const location = locationInput.value;
  fetchWeather(location);
});

locationInput.addEventListener('input', () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    const searchTerm = locationInput.value;
    if (searchTerm.length >= 2) {
      fetchCitySuggestions(searchTerm);
    } else {
      hideDropdown();
    }
  }, 300);
});



function fetchCitySuggestions(searchTerm) {
  const url = `https://secure.geonames.org/searchJSON?q=${searchTerm}&maxRows=5&username=${username}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch city suggestions');
      }
      return response.json();
    })
    .then(data => {
      console.log('API Response:', data);
      const citySuggestions = data.geonames.map(city => city.name);
      console.log('City Suggestions:', citySuggestions);
      showDropdown(citySuggestions);
    })
    .catch(error => {
      console.error('Error fetching city suggestions:', error);
      hideDropdown();
    });
}



function showDropdown(suggestions) {
  dropdown.innerHTML = '';
  suggestions.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    dropdown.appendChild(option);
  });
  dropdown.style.display = 'block';
}

function hideDropdown() {
  dropdown.innerHTML = '';
  dropdown.style.display = 'none';
}

function fetchWeather(location) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Invalid city name or city not found');
      }
      return response.json();
    })
    .then(data => {
      // Process the weather data and update the weather-info section
      const temperature = data.current.temp_c;
      const condition = data.current.condition.text;
      const humidity = data.current.humidity;
      const conditionIconUrl = data.current.condition.icon; // Use condition.icon URL provided by the API
      const localTime = data.location.localtime; // Local time provided by the API
     
      
      const weatherHtml = `
        <h2>${location}</h2>
        <p>Local Time: ${localTime}</p>
        <p>Temperature: ${temperature}°C</p>
        <p>Condition: ${condition} <img src="${conditionIconUrl}" alt="${condition}" width="20" height="20" /></p>
        <p>Humidity: ${humidity}%</p>
      `;
      
      weatherInfo.innerHTML = weatherHtml;
      
      // Add the "show" class to trigger the animation
      weatherInfo.classList.add('show');
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      weatherInfo.innerHTML = '<p>Error: Invalid city name or city not found.</p>';
      
      // Remove the "show" class in case it was previously added
      weatherInfo.classList.remove('show');
    });
}





