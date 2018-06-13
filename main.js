myNameSpace = function(){
// 'use strict';
const mapsAPIKey = 'AIzaSyBFyC3jDrzJK-9cl0wuWZonC-JpwP5Gaho';
let map = null;
let marker = null;

// ===================
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7829, lng: -73.9654},
    zoom: 13
  });

  addMarker();
  getPlaceId();
  getPlaceDetail();

function addMarker(){
  let input = document.getElementById('pac-input');

  let autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
//=======================
//Where do the marker's coords come from?  
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

    infowindowContent.children['place-name'].textContent = place.name;
    // infowindowContent.children['place-id'].textContent = place.place_id;
    infowindowContent.children['place-address'].textContent =
      place.formatted_address;
    infowindow.open(map, marker);
  });
}
}

function removeMarker(markerIndex){

}
//CORS issue getting this data
// function getPlaceDetail(){
//   $.ajax({
//   url: "https://maps.googleapis.com/maps/api/place/details/",
//   type: "GET",
//   dataType: 'jsonp',
//   data: {
//     placeid: 'ChIJS_7f3yT2wokR4dsAb0bTwDo'
//     // key: `${mapsAPIKey}`
//   },
//   success: function(data) {
//     // let placeDetails = data.results[0].place_id;
//     console.log(data);
//   },
//   error: function(error){
//     console.log(error);
//   }
// });
// }



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