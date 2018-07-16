mySpace = function(){
'use strict';
const mapsAPIKey = 'AIzaSyBFyC3jDrzJK-9cl0wuWZonC-JpwP5Gaho';
const cityCenters = [
        { city: "NY",
          name: "New York",
          center: {lat: 40.7549, lng: -73.9840},
          img: "https://images.unsplash.com/photo-1482816928022-63fca0c422c9?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d7b0250cda500d99737d49ad8e836778&auto=format&fit=crop&w=1950&q=80"
        },
        { city: "PHL",
          name: "Philadelphia",
          center: {lat: 39.9526, lng: -75.1652},
          img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Philadelphia_skyline_from_the_southwest_2015.jpg/1024px-Philadelphia_skyline_from_the_southwest_2015.jpg"
        },
        { city: "BSTN",
          name: "Boston",
          center: {lat: 42.3601, lng: -71.0589},
          img: "https://images.unsplash.com/photo-1520461589603-5158b75e6663?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3a1c8ae9cb4345a4120d70540a5de145&auto=format&fit=crop&w=1952&q=80"
        },
        { city: "DC",
          name: "Washington, DC",
          center: {lat: 38.9072, lng: -77.0369},
          img: "https://images.unsplash.com/photo-1522986949846-f63066ace3de?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=190cb0973909aaaa24cf678bcbb1d3b6&auto=format&fit=crop&w=1950&q=80"
        },
        { city: "CHI",
          name: "Chicago",
          center: {lat: 41.8781, lng: -87.6298},
          img: "https://images.unsplash.com/photo-1422393462206-207b0fbd8d6b?ixlib=rb-0.3.5&s=b06c1fb67e23344ffc685dccbd6e78d8&auto=format&fit=crop&w=1950&q=80"
        },
        { city: "NOLA",
          name: "New Orleans",
          center: {lat: 29.9511, lng: -90.0715},
          img: "https://images.unsplash.com/photo-1484972759836-b93f9ef2b293?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7d67b595c38bb2dfe8860ac03ea00d5f&auto=format&fit=crop&w=1950&q=80"
        },
        { city: "MTL",
          name: "Montreal",
          center: {lat: 45.5017, lng: -73.5673},
          img: "https://images.unsplash.com/photo-1519178614-68673b201f36?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d1c6e96be62531ec1249e3e921d0c035&auto=format&fit=crop&w=1568&q=80"
        },
        { city: "TO",
          name: "Toronto",
          center: {lat: 43.6532 , lng: -79.3832},
          img: "https://images.unsplash.com/photo-1507992781348-310259076fe0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=06a49e44e78b412a8a23133bdda14e37&auto=format&fit=crop&w=1950&q=80"}
];

let map = null;
let map2 = null;
let marker = null;
let myPlaces = [];
let markers = [];
let markersModal = [];
let placeIndex = -1;  //Hack
let cityCenter = {lat: 40.7829, lng: -73.9654};
let placeCoords = {lat: 40.7829, lng: -73.9654};
let itinerary =[];
let tempPlaces = [];
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

  map2 = new google.maps.Map(document.getElementById('map2'), {
    center: placeCoords,
    zoom: 16,
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
  $('#itinerary').html('<h2>Itinerary:</h2>');
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

placeSelection(map);

function placeSelection(map){
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
    console.log(place);
    let selected = new Place(place.name, place.formatted_address, place.place_id,
     place.formatted_phone_number, place.website, place.reviews, place.rating, place.price_level, place.vicinity);
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

function Place (name, address, placeID, phone, website, reviews, rating, price, vicinity){
  this.name = name;
  this.address = address;
  this.placeID = placeID;
  console.log(`name =${this.name} placeID = ${this.placeID}`);
  this.phone = phone;
  this.url = website;
  if(this.url){
    let x = website.indexOf('//');
    let y = website.slice(x+2);
    this.web = y.substr(0, y.length -1);
  }
  this.reviews = reviews;
  this.rating = rating;
  this.price = price;
  this.vicinity = vicinity;
  this.scheduled = false;
  this.schedDay = ["","","","",""];
}

//new updatePlaces
function updatePlaces(){
  $('#places').html('<h2>My Places in <span id="city">CITY </span></h2>').css('display', 'none');
  for(let i = 0; i<myPlaces.length; i++){
    $('#places').append( `
        <div id="${myPlaces[i].placeID}" class="place-card">
          <ul class="place-info:">
            <li><span id="place-name">${i + 1}.&nbsp ${myPlaces[i].name}</span></li>
            <li>${myPlaces[i].vicinity}</li>
            <li>${myPlaces[i].phone}</li>
            <li><a href="${myPlaces[i].url}" target="_blank">${myPlaces[i].web}</a></li>
          </ul>
          <div class="btn-container">
            <button type="button" id="delete-${i}" class="delete">delete<button type="button" id="schedule-${i}" class="schedule">schedule</button>
            <button type="button" id="unsched-${i}" class="unsched">unschedule</button>
            <button type="button" id="explore-${i}" class="nearby">explore</button>
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
  console.log(myPlaces);
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
  $(`#explore-${index}`).click(function(e){
    e.preventDefault();
    launchModal(index);
  });
}

function launchModal(index){
  map2.setCenter(myPlaces[index].LatLng);
  addMarker(index, map2);
  //hide map - unhide map2
  $('#map').fadeOut(400, function(){
    $('#map2').fadeIn(400);
    $('#places').fadeOut(400);
    $('#itinerary').fadeOut(400);
    $('#nearby-places').fadeIn(400);
    $('#map2-info').fadeIn(400);
    placeSelection(map2);
  });
//Places nearby or text search
addReturnListener();
//show form for Nearby Places and add listener
showNearbyForm(index);
}

//simplify to text search not dropdown
function showNearbyForm(index){
  let nearyFormStr = `<span class="nearby-title"><h4>What's near ${myPlaces[index].name}?</h4></span>
                      <form id="nearby-form-${index}">
                        <label for="nearby-${index}">Search for nearby places (restaurants, shops, etc):</label>
                        <input type="text" onfocus="this.value=''" id="nearby-${index}"  required placeholder="search nearby">
                        <input id="nearby-btn-${index}" type="submit" value="submit">
                        <button type="button" id="reset-${index}">Reset</button>
                      </form>`;
  $('#nearby-places').html(nearyFormStr);
  addNearbyListener(index);
  addResetListener(index);
}

function addNearbyListener(index){
  $(`#nearby-btn-${index}`).click(function(e){
    e.preventDefault();
    let searchTerm = $(`#nearby-${index}`).val();
    console.log(`searchTerm is ${searchTerm}`);
    findNearby(index, searchTerm);
  });
}

function findNearby(index, searchTerm){
  let stuff = new google.maps.LatLng(myPlaces[index].LatLng);
  let service = new google.maps.places.PlacesService(map2);
  service.textSearch({
    location: stuff,
    radius: 0,
    query: searchTerm
  }, callback);
}

function addResetListener(index){
  $(`#reset-${index}`).click(function(e){
    console.log('clearing markers');
    for(let i=0; i<markersModal.length; i++){
      markersModal[i].setMap(null);
    }
    markersModal= [];
    tempPlaces = [];
  });
}

function callback(results, status){
  console.log(status);
  console.log(results);
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      let place = results[i];
      //need to know url before I call createMarker
      getUrl(place.place_id, i);
      createMarker(results[i], i);
    }
  }
}

function createMarker(place, index) {
  let placeLoc = place.geometry.location;
  let marker = new google.maps.Marker({
    map: map2,
    position: place.geometry.location
  });
  markersModal.push(marker);
  let infowindow = new google.maps.InfoWindow();
  google.maps.event.addListener(marker, 'click', function() {
    let contentStr =`${place.name}<br>
                      price: ${place.price_level}<br>
                      rating: ${place.rating}<br>
                      <a href="${tempPlaces[index]}" target="_blank">${tempPlaces[index]}</a>`;
    infowindow.setContent(contentStr);
    infowindow.open(map, this);
  }, function(place, status){
    if (status === google.maps.places.PlacesServiceStatus.OK){
      // do I need this callback for anything?
    }
  });
}


function getUrl(placeID, index){
  let webAddress = '';
  let service = new google.maps.places.PlacesService(map2);
  service.getDetails({
    placeId: placeID
  }, function(place, status){
    if (status === google.maps.places.PlacesServiceStatus.OK){
      webAddress = place.website;
      tempPlaces[index] = webAddress;
    }
  });
}

function addReturnListener(){
  $('#return').click(function(e){
    $('#map2').fadeOut(400, function(){
      $('#map2-info').fadeOut(400);
      $('#nearby-places').fadeOut(400);
      $('#pac-input.controls').fadeIn(400);
      $('#map').fadeIn(400);
      $('#places').fadeIn(400);
      $('#itinerary').fadeIn(400);
    });
    placeSelection(map);
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
    myPlaces[index].schedDay[date] = period;
    addUnschedListener(index);
    // This is a hack to get around putting the place in twice when
    //scheduling after an unschedule runs. 
    if(!itinerary[date].places[period].includes(thisPlace)){
      itinerary[date].places[period].push(thisPlace);
    };
    // console.log(myPlaces);
    // console.log(itinerary);
    $(`#sched-form-${index}`).fadeOut(300, function(){
      $(`#unsched-${index}`).fadeIn(300);
    });
    updateSchedule();
  });
}

function addUnschedListener(index){
  $(`#unsched-${index}`).click(function(e){
    myPlaces[index].scheduled = false;

    //find which day/time scheduled
    let dayTime = findDayTime(index);
    let day = dayTime[0];
    let time = dayTime[1];

    let name = myPlaces[index].name;

    //remove place from itinerary[day].places[time]
    let x = itinerary[day].places[time].indexOf(name);
    //place empty string in myPlaces[index].schedDay
    itinerary[day].places[time].splice(x, 1);
    console.log(`from unsched: x is ${x}`);
    console.log(myPlaces);
    console.log(itinerary);
    //hide unsched, reveal delete and sched
    $(`#unsched-${index}`).fadeOut(200, function(){
      $(`#delete-${index}, #schedule-${index}`).fadeIn(300);
    });
    updateSchedule();
  });
}

function findDayTime(index) {
  let day = null;
  let time ="";
  for(let i=0; i<myPlaces[index].schedDay.length; i++){
    if(myPlaces[index].schedDay[i]){
      day = i;
      time = myPlaces[index].schedDay[i];
      myPlaces[index].schedDay[i] = '';
    }
  };
  return [day, time];
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
      addMarker(index, map);
    }, 
    error: function(error){
      console.log(`error is ${error}`);
    }
    //add error
  });
}

function addMarker(index, map){
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