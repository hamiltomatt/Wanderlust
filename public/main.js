// Foursquare API Info
const clientId = 'PYIOX5PDENZQXRQWIJ01PBXHQHECC4WVSXF11VHAXDA1SWQN';
const clientSecret = 'LONDSFJMBMEQ0CIHHE2ZKZMUWE21LC0A0DSWUKNF0MFJQJ0F';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';

// OpenWeather Info
const openWeatherKey = '6f208af4dcc5f4dd451df7b60fa5d5f2';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Add AJAX functions here:
const getVenues = async () => {
  const city = $input.val();
  const urlToFetch = `${url}${city}&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20200807`;

  try {
    const response = await fetch(urlToFetch);
    if(response.ok) {
      const jsonResponse = await response.json();
      const venues = await jsonResponse.response.groups[0].items.map(item => item.venue);
      console.log(venues);
      return venues;
    }
  } catch(e) {
    console.log(e);
  }

}

const getForecast = async () => {
  const urlToFetch = `${weatherUrl}?&q=${$input.val()}&APPID=${openWeatherKey}`;

  try {
    const response = await fetch(urlToFetch);
    if(response.ok) {
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      return jsonResponse;
    }
  } catch(e) {
    console.log(e);
  }
}


// Render functions
const renderVenues = (venues) => {
  $venueDivs.forEach(($venue, index) => {
    // Add your code here:
    const venue = venues[index];
    const venueIcon = venue.categories[0].icon;
    const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;
    let venueContent = `<h2>${venue.name}</h2>
<img class="venueimage" src="${venueImgSrc}"/>
<h3>Address:</h3>
<p>${venue.location.address}</p>
<p>${venue.location.city}</p>
<p>${venue.location.country}</p>`;
    //venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
    $venue.append(venueContent);
  });
  $destination.append(`<h2>${venues[0].location.city}</h2>`);
}

const renderForecast = (day) => {
  // Add your code here:

	let weatherContent = `<h2> High: ${((day.main.temp_max - 273.15) * 9 / 5 + 32).toFixed(0)}</h2>
  <h2> Low: ${((day.main.temp_min - 273.15) * 9 / 5 + 32).toFixed(0)}</h2>
<img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" class="weathericon" />
<h2>${weekDays[new Date().getDay()]}</h2>`;

  //weatherContent = createWeatherHTML(day);
  $weatherDiv.append(weatherContent);
}

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues().then(venues => renderVenues(venues));
  getForecast().then(forecast => renderForecast(forecast));
  return false;
}

$submit.click(executeSearch)
