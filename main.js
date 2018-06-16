mySpace = function(){
'use strict';
const mapsAPIKey = 'AIzaSyBFyC3jDrzJK-9cl0wuWZonC-JpwP5Gaho';
let map = null;
let marker = null;
let myPlaces = [];
let placeIndex = -1;
// ===================

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7829, lng: -73.9654},
    zoom: 12,
    gestureHandling: 'cooperative'
  });

  placeSelection();
  // getPlaceId();
  // addMarker();

function placeSelection(){
  let input = document.getElementById('pac-input');

  let autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);  
  
  let infowindow = new google.maps.InfoWindow();
  let infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  marker = new google.maps.Marker({
    map: map
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
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
    
    let selected = new Place(place.name, place.formatted_address, place.place_id,
     place.formatted_phone_number, place.website, place.reviews, place.rating, place.price_level);
    //push new place to places array
    myPlaces.push(selected);
    placeIndex++;
    //set the coords for new place object
    setCoords(placeIndex);
    console.log(`myPlaces lat: ${myPlaces[placeIndex].lat}`);
    //create marker and infowindow
    // newMarker(placeIndex);
    
    updatePlaces();
    console.log(myPlaces[placeIndex]);
    console.log(myPlaces[placeIndex].lat);
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

// function addMarker(index){
//   let x = places[index].name;
//   let y = places[index].lng;
//   console.log(` coords: {lat: ${x}, lng:${y}}`);
  // let marker = new google.maps.Marker({
  //   position: `{lat: ${places[index].lat}, lng:${places[index].lng}}`,
  //   map:map
  // });
  
  // let infoWindow = new google.maps.InfoWindow({
  //   content: 'blah'
  // });

  // marker.addListener('click', function(){
  //   infoWindow.open(map, marker);
  // });
// s}

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
      // console.log(data);
      console.log(`Coordinates are lat: ${foundLat} long: ${foundLng}`);
      myPlaces[index].lat = foundLat;
      myPlaces[index].lng = foundLng;
    }
  });
}

return {initMap:initMap}
}();