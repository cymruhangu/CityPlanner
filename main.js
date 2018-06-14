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
    zoom: 13
  });

  placeSelection();
  getPlaceId();


function placeSelection(){
  let input = document.getElementById('pac-input');

  let autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);  
  
  let infowindow = new google.maps.InfoWindow();
  let infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  marker = new google.maps.Marker({
    map: map
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
    placeIndex++;
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    let place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    // Set the position of the marker using the place ID and location.
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    marker.setVisible(true);

    // infowindowContent.children['place-name'].textContent = place.name;        
    // infowindowContent.children['place-address'].textContent =
    //   place.formatted_address;
    // infowindowContent.children['place-website'].textContent = place.formatted_phone_number; 
    // infowindowContent.children['place-website'].textContent = place.website;
    // infowindow.open(map, marker);

    console.log(`website is ${place.website}`);
    // console.log(`phone # is ${place.formatted_phone_number}`);
    console.log(`geometry: ${place.geometry.location}`);

    let selected = new Place(place.name, place.formatted_address, place.place_id, place.geometry.location, +
       place.formatted_phone_number, place.website, place.reviews, place.rating, place.price_level);

    places.push(selected);
    updatePlaces();
    console.log(places);

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

function updatePlaces(){
  let list = '';
  places.forEach(function(el){

  });


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