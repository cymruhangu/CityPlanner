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
//ensure that today is the min date
let today = new Date().toISOString().split('T')[0];
$('#arrive').attr('min', today);

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
    let offset = new Date().getTimezoneOffset();
    let firstDay = moment(first).add(offset, 'minutes');
    createItinerary(firstDay);
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

function createItinerary(firstDay){
  let numDays = 5;
   //create object with date and array of places
  for(let i = 0; i<numDays; i++){
    let newDate = moment(firstDay).add(i, 'days');
    let placesObj = {
                        am: [],
                        pm: [],
                        eve: []
    };
    let newDay = new cityDay(newDate, placesObj);
    itinerary.push(newDay);
  }
  updateSchedule();
}

function cityDay(date, placesObj){
  this.date = date;
  this.places = placesObj
}

function updateSchedule(){
  $('#itinerary').html('');
  for(let i = 0; i<itinerary.length; i++){
    let dateCard = `
      <div id="day${i}" class="dayDiv">
        <span class="day">${moment(itinerary[i].date).format("ddd,ll")}:</span>`;
    //forEach through events
    dateCard+=`
        <p class="period">AM:</p>
        <ul class="am">`;
    itinerary[i].places.am.forEach(function(e){
      dateCard+=`<li>${e}</li>`;
    });
    dateCard+=`</ul> 
        <p class="period">PM:</p>
        <ul class="pm">`;
    itinerary[i].places.pm.forEach(function(e){
      dateCard+=`<li>${e}</li>`;
    });
    dateCard+=`</ul>
        <p class="period">Night:</p>
        <ul class="night">`;
    itinerary[i].places.eve.forEach(function(e){
      dateCard+=`<li>${e}</li>`;
    });
    dateCard+= `</ul>
      </div>`;
    $('#itinerary').append(dateCard);
  }
}

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
// }// end of initMap()

function Place (name, address, placeID, phone, website, reviews, rating, price){
  this.name = name;
  this.address = address;
  this.placeID = placeID;
  this.phone = phone;
  this.website = website;
  this.reviews = reviews;
  this.rating = rating;
  this.price = price;
  this.scheduled = false;
  this.schedDay = [];
}

//new updatePlaces
function updatePlaces(){
  $('#places').html('').css('display', 'none');
  for(let i = 0; i<myPlaces.length; i++){
    $('#places').append( `
        <div id="${myPlaces[i].placeID}" class="place-card">
          <ul class="place-info:">
            <li><span id="place-name" >${i + 1}. ${myPlaces[i].name}</span></li>
            <li>${myPlaces[i].address}</li>
          </ul>
          <div class="btn-container">
            <button type="button" id="delete-${i}" class="delete">delete<button type="button" id="schedule-${i}" class="schedule">schedule</button>
            <button type="button" id="unsched-${i}" class="unsched">unschedule</button>
          </div>
          <form id="sched-form-${i}">
            <select id="day-time" size=1 required>
              <option value="" disabled selected>choose day</option>
              <option value="0">${moment(itinerary[0].date).format("ddd,ll")}</option>
              <option value="1">${moment(itinerary[1].date).format("ddd,ll")}</option>
              <option value="2">${moment(itinerary[2].date).format("ddd,ll")}</option>
              <option value="3">${moment(itinerary[3].date).format("ddd,ll")}</option>
              <option value="4">${moment(itinerary[4].date).format("ddd,ll")}</option>
            </select>
            <select id="period" size=1 required>
              <option value="" disabled selected>time of day</option>
              <option value="am">morning</option>
              <option value="pm">afternoon</option>
              <option value="eve">evening</option>
            </select>
            <input id="sched-btn-${i}" type="submit" value="submit">
          </form>
        </div>`);
        setButtonStatus(i);
        addPlaceListeners(i);
  }
  $('#places').fadeIn(600);
}

function setButtonStatus(index){
    if(myPlaces[index].scheduled){
      $(`#schedule-${index}`).css('display', 'none');
      $(`#delete-${index}`).css('display', 'none');
      $(`#unsched-${index}`).css('display', 'inline-block');
    } else {
      $(`#schedule-${index}`).css('display', 'inline-block');
      $(`#delete-${index}`).css('display', 'inline-block');
      $(`#unsched-${index}`).css('display', 'none');
    }
}
//---------

function addPlaceListeners(index) {
  $(`#delete-${index}`).click(function(e){
    e.preventDefault();
    //remove marker
    removeMarker(index);
    let removed = myPlaces.splice(`${index}`, 1);
    updatePlaces();
    placeIndex--;
  });

  $(`#schedule-${index}`).click(function(e){
    e.preventDefault();
    $(`#schedule-${index}`).fadeOut(400, function(){
      $(`#delete-${index}`).fadeOut(400, function(){
        $(`#sched-form-${index}`).fadeIn(400, function(){
          addSchedListener(index);
        });
      });
    });
  });
}

function addSchedListener(index){
  $(`#sched-form-${index}`).submit(function(e){
    e.preventDefault();
    let date = $(`#sched-form-${index} select#day-time`).find('option:selected').val();
    let period = $(`#sched-form-${index} select#period`).find('option:selected').val();
    console.log(`period is ${period}`);
    
    //set schedule
    let thisPlace = myPlaces[index].name;
    myPlaces[index].scheduled = true;
    myPlaces[index].schedDay.push(index);
    addUnschedListener(index);
    itinerary[date].places[period].push(thisPlace);
    console.log(`putting ${thisPlace} into ${itinerary[date].places} on ${date} in ${period}`);
    console.log(itinerary);
    updateSchedule();
  });
}

function addUnschedListener(index){
  //remove place from schedule
  //How do I know where it is scheduled?
  //updateSchedule();
  //hide unsched button and reveal delete and sched buttons
}

function removeMarker(index){
  console.log(`myPlaces[i].name is ${myPlaces[index].name}`);
  let marker = myPlaces[index].name;
  markers[index].setMap(null);
}

function setCoords(index){
  $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json",
    type: "GET",
    data: {
      address: myPlaces[index].address,
      key: `${mapsAPIKey}`
    },
    success: function(data) {
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
}//new end of initMap
//==========================
return {initMap:initMap}
}();