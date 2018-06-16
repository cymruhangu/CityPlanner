mySpace = function(){
'use strict';
const mapsAPIKey = 'AIzaSyBFyC3jDrzJK-9cl0wuWZonC-JpwP5Gaho';
let map = null;
let marker = null;
let places = [];
let placeIndex = -1;
// ===================

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7829, lng: -73.9654},
    zoom: 12,
    gestureHandling: 'cooperative'
  });

  placeSelection();
  getPlaceId();
  addMarker();

function placeSelection(){
  let input = document.getElementById('pac-input');

  let autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);  
  
  // let infowindow = new google.maps.InfoWindow();
  // let infowindowContent = document.getElementById('infowindow-content');
  // infowindow.setContent(infowindowContent);
  // marker = new google.maps.Marker({
  //   map: map
  // });
  // marker.addListener('click', function() {
  //   infowindow.open(map, marker);
  // });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    let place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    // Set the position of the marker using the place ID and location.
    // marker.setPlace({
    //   placeId: place.place_id,
    //   location: place.geometry.location
    // });
    // marker.setVisible(true);


    // console.log(`website is ${place.website}`);
    // console.log(`phone # is ${place.formatted_phone_number}`);
    // console.log(`geometry: ${place.geometry.location}`);

    let selected = new Place(place.name, place.formatted_address, place.place_id, place.geometry.location,
     place.formatted_phone_number, place.website, place.reviews, place.rating, place.price_level);

    //push new place to places array
    places.push(selected);
    placesIndex++;
    //new place is created. Now we can create marker and info
    newMarker(selected);
    updatePlaces();
    console.log(places);
    ///clear the autocomplete input
    document.getElementById('pac-input').value = '';
  });
}
}

function Place (name, address, placeID, coords, phone, website, reviews, rating, price){
  this.name = name;
  this.address = address;
  this.placeID = placeID;
  this.coords = coords; 
  this.phone = phone;
  this.website = website;
  this.reviews = reviews;
  this.rating = rating;
  this.price = price;
}

function addMarker(newPlace){
  var marker = new google.maps.Marker({
    position:{lat: 40.7794, lng: -73.9632},
    map:map
  });
  
  let infoWindow = new google.maps.InfoWindow({
    content: 'blah'
  });

  marker.addListener('click', function(){
    infoWindow.open(map, marker);
  });
}

function updatePlaces(){
  let list = '';
  let i = places.length - 1;
    $('#place-ul').append( `<li>${places[i].name}</li>
                            <li>${places[i].address}</li>
                            <li>${places[i].phone}</li>
                            <li><a href="${places[i].website}" target="_blank">${places[i].website}</a></li> 
                            <br>`);
}


function getPlaceId(){
  $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json",
    type: "GET",
    data: {
      address: 'Hotel Vermont',
      key: `${mapsAPIKey}`
    },
    success: function(data) {
      let placeID = data.results[0].place_id;
      console.log(data);
    }
  });
}

return {initMap:initMap}
}();