(function(){
'use strict';
const mapsAPIKey = 'AIzaSyBFyC3jDrzJK-9cl0wuWZonC-JpwP5Gaho';
const placesAPIKey = ''

$.ajax({
  url: "https://maps.googleapis.com/maps/api/distancematrix/json",
  type: "GET",
  data: {
    origins: $("#origin").val(),
    destination: $("#destinations").val(),
    libraries: 'places'
    key: mapsAPIKey
  },
  success: function(data) {
    console.log(data);
  }
});




})();