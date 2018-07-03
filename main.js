mySpace = function(){
'use strict';
const mapsAPIKey = 'AIzaSyBFyC3jDrzJK-9cl0wuWZonC-JpwP5Gaho';
const cityCenters = [
        { city: "NY",
          center: {lat: 40.7549, lng: -73.9840}
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
        { city: "NOLA",
          center: {lat: 29.9511, lng: -90.0715}
        }
];
let map = null;
let marker = null;
let myPlaces = [];
let markers = [];
let placeIndex = -1;
let cityCenter = {lat: 40.7829, lng: -73.9654};
let itinerary =[];

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
    setCenter(selectedCity);
    let first = moment(new Date($('#arrive').val()));
    let last = moment(new Date($('#depart').val()));
    let offset = new Date().getTimezoneOffset();
    let firstDay = moment(first).add(offset, 'minutes');
    let lastDay = moment(last).add(offset, 'minutes');
    createItinerary(firstDay, lastDay);
    $('#splash').fadeOut(600, function(){
      $('#exploration').fadeIn(600);
    });
  });
}

function setCenter(cityAbbrv){
  for(let i = 0; i <cityCenters.length; i++){
    if(cityCenters[i].city === cityAbbrv){
      let Lat = cityCenters[i].center.lat;
      let Lng = cityCenters[i].center.lng;
      console.log(`setting center to ${cityAbbrv}`);
      map.setCenter(cityCenters[i].center);
    }
  }
}

function daysCalc(date1, date2){
  return parseInt((date2 - date1) / (24 * 3600 * 1000));
}

function createItinerary(firstDay, lastDay){
  // let numDays = daysCalc(firstDay, lastDay);
  let numDays = 5;
   //create object with date and array of places
  for(let i = 0; i<numDays; i++){
    let newDate = moment(firstDay).add(i, 'days');
    let placesArray = [];
    let newDay = new cityDay(newDate, placesArray);
    itinerary.push(newDay);
  }
  console.log(itinerary);
  updateSchedule();
}

function cityDay(date, placesArray){
  this.date = date;
  this.places = placesArray
}

//Need date to be a title and add a second div as the dragula target.
function updateSchedule(){
  for(let i = 0; i<itinerary.length; i++){
    let dateCard = `
      <div id="day${i}" class="dayDiv">
        <span class="day">${moment(itinerary[i].date).format("ddd,ll")}:</span>
        <h6>AM:</h6>
        <ul class="am"></ul>
        <h6>PM:</h6>
        <ul class="pm"></ul>
        <h6>Night:</h6>
        <ul class="night"></ul>
      </div>`;
    $('#itinerary').append(dateCard);
  }
}

// function updateSchedule(){
//   for(let i = 0; i<itinerary.length; i++){
//     $('#itinerary').append(`<div id="day${i}" class="dayDiv"><span class="day">${moment(itinerary[i].date).format
//       ("ddd,ll")}:</span></div>`);
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

//new updatePlaces
function updatePlaces(){
  $('#places').html('');
  for(let i = 0; i<myPlaces.length; i++){
    $('#places').append( `
        <div id="${myPlaces[i].placeID}" class="place-card">
          <ul class="place-info:">
            <li><span id="place-name" >${i + 1}. ${myPlaces[i].name}</span></li>
            <li>${myPlaces[i].address}</li>
          </ul>
          <div class="btn-container">
            <button type="button" id="delete-${i}" class="delete">delete<button type="button" id="schedule-${i}" class="schedule">schedule</button>
          </div>
        </div>`);
        addPlaceListeners(i);
  }
}

function addPlaceListeners(index) {
  $(`#delete-${index}`).click(function(e){
    e.preventDefault();
    //remove marker
    removeMarker(index);
    let removed = myPlaces.splice(`${index}`, 1);
    updatePlaces();
  });

  $(`#schedule-${index}`).click(function(e){
    e.preventDefault();
    console.log(`schedule ${myPlaces[index].name} `);
  });
}
function removeMarker(index){
  console.log(`myPlaces[i].name is ${myPlaces[index].name}`);
  let marker = myPlaces[index].name;
  markers[index].setMap(null);
}
// function setMapOnAll(map, index){
//   // for (let i = 0; i < markers.length; i++) {
//     console.log(`deleting ${myPlaces[index].name}`);
//     markers[index].setMap(map);
//   // }
// }

function setCoords(index){
  $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json",
    type: "GET",
    data: {
      address: myPlaces[index].address,
      key: `${mapsAPIKey}`
    },
    success: function(data) {
      console.log(`inside setCoords: ${data}`);
      let foundLat = data.results[0].geometry.location.lat;
      let foundLng = data.results[0].geometry.location.lng;
      myPlaces[index].lat = foundLat;
      myPlaces[index].lng = foundLng;
      myPlaces[index].LatLng = {lat:foundLat,lng:foundLng};
      addMarker(index);
    }, 
    error: function(error){
      console.log(`error is ${error}`);
    }
    //add error
  });
}

function addMarker(index){
  let marker = new google.maps.Marker({
    position: myPlaces[index].LatLng,
    label: `${index + 1}`,
    map:map,
    id: `${index + 1}`
  });

  markers.push(marker);
  
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