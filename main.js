myNameSpace = function(){
// 'use strict';
const mapsAPIKey = 'AIzaSyBFyC3jDrzJK-9cl0wuWZonC-JpwP5Gaho';
let map = null;

// ===================
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7829, lng: -73.9654},
    zoom: 13
  });

  var input = document.getElementById('pac-input');

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: map
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    var place = autocomplete.getPlace();
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

$.ajax({
  url: "https://maps.googleapis.com/maps/api/geocode/json",
  type: "GET",
  data: {
    address: 'Penn Station',
    key: `${mapsAPIKey}`
  },
  success: function(data) {
    let placeID = data.results[0].place_id;
    console.log(`placeID is ${placeID}`);
  }
});
  return{
    initMap:initMap
  }
}();