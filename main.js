mySpace = function(){
'use strict';
const mapsAPIKey = 'AIzaSyBFyC3jDrzJK-9cl0wuWZonC-JpwP5Gaho';
const cityCenters = [
        { city: "NY",
          center: {lat: 40.7829, lng: -73.9654}
        },
        { city: "PHL",
          center: {lat: 39.9526, lng: -75.1652}
        },
        { city: "BSTN",
          center: {lat: 42.3601, lng: -71.0589}
        },
        { city: "DC",
          center: {lat: 38.9072, lng: -77.0369}
        },
        { city: "CHI",
          center: {lat: 41.8781, lng: -87.6298}
        },
];
let map = null;
let marker = null;
let myPlaces = [];
let placeIndex = -1;
let cityCenter = {lat: 40.7829, lng: -73.9654};
// let firstDay = '';
// let lastDay = '';
// let numDays = 0;
// ===================
/* 
  - map is hidden at start
  - default city is NY
  - get selected City and dates from form
  - Call initMap again with the new city and unhide
*/

function initMap() {
  getCity();
  map = new google.maps.Map(document.getElementById('map'), {
    center: cityCenter,
    zoom: 12,
    gestureHandling: 'cooperative'
  });

function getCity(){
  $('#trip-form').submit(function(e){
    e.preventDefault();
    let selectedCity = $('select#city').find('option:selected').val();
    console.log(`city is: ${selectedCity}`);
    let firstDay = new Date($('#arrive').val());
    let lastDay = new Date($('#depart').val());
    let firstDate = `${firstDay.getUTCMonth()}-${firstDay.getUTCDate()}-${firstDay.getUTCFullYear()}`;
    let lastDate = `${lastDay.getUTCFullYear()}-${lastDay.getUTCMonth()}-${lastDay.getUTCDate()}`;
    let numDays = daysCalc(firstDay, lastDay);
    console.log(`firstDay is ${firstDate} lastDay is ${lastDate} that is ${numDays} days`);
    // createItinerary(firstDay, lastDay);
  });
}

function daysCalc(date1, date2){
  return parseInt((date2 - date1) / (24 * 3600 * 1000));
}

// function createItinerary(firstDay, lastDay){
//   //create object with date and array of places
//   for(let i = 0; i<numDays.length; i++){
//     let itinerary = [{date:  Date,
//                     places: [place1, place2, etc]}]

//                     let itinerary = {
//                       '06-19-2018': [ place 1, place 2]
//                     }
//   }
// }

placeSelection();

function placeSelection(){
  let input = document.getElementById('pac-input');

  let autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);  

  autocomplete.addListener('place_changed', function() {
    // infowindow.close();
    let place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    let selected = new Place(place.name, place.formatted_address, place.place_id,
     place.formatted_phone_number, place.website, place.reviews, place.rating, place.price_level);
    //push new place to places array
    myPlaces.push(selected);
    placeIndex++;
    //set the coords for new place object
    setCoords(placeIndex);
    updatePlaces();
    ///clear the autocomplete input
    document.getElementById('pac-input').value = '';
  });
}
}

function Place (name, address, placeID, phone, website, reviews, rating, price){
  this.name = name;
  this.address = address;
  this.placeID = placeID;
  this.phone = phone;
  this.website = website;
  this.reviews = reviews;
  this.rating = rating;
  this.price = price;
}

function updatePlaces(){
  let list = '';
  let i = myPlaces.length - 1;
    $('#place-ul').append( `<li>${myPlaces[i].name}</li>
                            <li>${myPlaces[i].address}</li>
                            <li>${myPlaces[i].phone}</li>
                            <li><a href="${myPlaces[i].website}" target="_blank">${myPlaces[i].website}</a></li> 
                            <br>`);
}

function setCoords(index){
  $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json",
    type: "GET",
    data: {
      address: myPlaces[index].name,
      key: `${mapsAPIKey}`
    },
    success: function(data) {
      let foundLat = data.results[0].geometry.location.lat;
      let foundLng = data.results[0].geometry.location.lng;
      myPlaces[index].lat = foundLat;
      myPlaces[index].lng = foundLng;
      addMarker(index);
    } 
    //add error
  });
}

function addMarker(index){
  let x = myPlaces[index].lat;
  let y = myPlaces[index].lng;
  let coordsObj = {lat:x,lng:y};
  let marker = new google.maps.Marker({
    position: coordsObj,
    map:map
  });
  
  let contentStr = `${myPlaces[index].name}
                    <br>
                    ${myPlaces[index].address}
                    `;
  let infoWindow = new google.maps.InfoWindow({
    content: contentStr
  });

  marker.addListener('click', function(){
    infoWindow.open(map, marker);
  });
}

//==========================
return {initMap:initMap}
}();