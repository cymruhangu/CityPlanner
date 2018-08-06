mySpace = function(){
'use strict';
const mapsAPIKey = 'AIzaSyBFyC3jDrzJK-9cl0wuWZonC-JpwP5Gaho';
const cityCenters = {
         "NY":{
          name: "New York",
          center: {lat: 40.7549, lng: -73.9840},
          img: "https://images.unsplash.com/photo-1482816928022-63fca0c422c9?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d7b0250cda500d99737d49ad8e836778&auto=format&fit=crop&w=1950&q=80"
        },
        "PHL":{
          name: "Philadelphia",
          center: {lat: 39.9526, lng: -75.1652},
          img: "./assets/philadelphia-70850_1280.jpg"
        },
        "BSTN":{
          name: "Boston",
          center: {lat: 42.3601, lng: -71.0589},
          img: "./assets/boston-1775870_1280.jpg"
        },
        "DC":{
          name: "Washington DC",
          center: {lat: 38.9072, lng: -77.0369},
          img: "https://images.unsplash.com/photo-1522986949846-f63066ace3de?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=190cb0973909aaaa24cf678bcbb1d3b6&auto=format&fit=crop&w=1950&q=80"
        },
        "CHI":{
          name: "Chicago",
          center: {lat: 41.8781, lng: -87.6298},
          img: "./assets/chicago-1791002_1280.jpg"
        },
        "NOLA": {
          name: "New Orleans",
          center: {lat: 29.9511, lng: -90.0715},
          img: "https://images.unsplash.com/photo-1484972759836-b93f9ef2b293?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7d67b595c38bb2dfe8860ac03ea00d5f&auto=format&fit=crop&w=1950&q=80"
        },
        "MTL":{
          name: "Montreal",
          center: {lat: 45.5017, lng: -73.5673},
          img: "https://images.unsplash.com/photo-1519178614-68673b201f36?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d1c6e96be62531ec1249e3e921d0c035&auto=format&fit=crop&w=1568&q=80"
        },
        "TO": {
          name: "Toronto",
          center: {lat: 43.6532 , lng: -79.3832},
          img: "https://images.unsplash.com/photo-1507992781348-310259076fe0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=06a49e44e78b412a8a23133bdda14e37&auto=format&fit=crop&w=1950&q=80"}
      };

let map = null;
let marker = null;
const myPlaces = [];
const markers = [];
let markersNearby = [];
let placeIndex = 0; 
let thisCity = {};
const cityCenter = {lat: 40.7829, lng: -73.9654};
// const placeCoords = {lat: 40.7829, lng: -73.9654};
let cityImg ="";
let itinerary =[];
let tempPlaces = [];
let hotelSelected = false;
//ensure that today is the min date
let today = new Date().toISOString().split('T')[0];
$('#arrive').attr('min', today);

//function called by Google maps API call index.html
function initMap() {
  handleCitySubmission();
  map = new google.maps.Map(document.getElementById('map'), {
    center: cityCenter,
    zoom: 12,
    gestureHandling: 'cooperative'
  });

  //reveal splash page and city select form
  function showSplash(){
    $('#intro1').fadeIn(1500, function(){
      $('#intro1').fadeOut(1500, function(){
        $('#intro2').fadeIn(1500, function(){
          $('#intro2').fadeOut(1500, function(){
            $('#intro3').fadeIn(1200, function(){
              $('#intro3').fadeOut(1200, function(){
                $('#intro4, #trip-form').fadeIn(1200);
              });
            });
          });
        });
      });
    });
  }

  //Add listener for the city selection form. Get value from form.
  //handleCitySubmission
  function handleCitySubmission(){
    $('#trip-form').submit(function(e){
      e.preventDefault();
      const selectedCity = $('select#city').find('option:selected').val();
      setCenter(selectedCity);
      showDatePicker();
    });
  }

  function showDatePicker(){
    $('#splash').fadeOut(600, function(){
      $('#splash-2').fadeIn(600);
      handleArrivalDateSubmission();
    });
  }

  //Set the center of the map based on city selected
  function setCenter(cityAbbrv){
    thisCity = cityCenters[cityAbbrv];
    map.setCenter(cityCenters[cityAbbrv].center);
    setCityParms(cityAbbrv);
  }
  
  function setCityParms(cityAbbrv){
    cityImg = `url('${cityCenters[cityAbbrv].img}')`;
    $('.selected-city').html(`${cityCenters[cityAbbrv].name}`);
    $('#splash-2, #exploration').css("background-image", "" + cityImg );
  }

//User selects arrival date, handle date
function handleArrivalDateSubmission(){
  $('#date-form').submit(function(e){
    e.preventDefault();
    const first = moment(new Date($('#arrive').val()));
    const offset = new Date().getTimezoneOffset();
    const firstDay = moment(first).add(offset, 'minutes');
    const firstDate = moment(firstDay).format("ddd,ll");
    setDateHTML(firstDate);
    createItinerary(firstDay);
    revealSplash2();
  });
} 

function setDateHTML(firstDate){
  $('#firstday').html(`${firstDate}`);
}

//reveal 2nd splash page
function revealSplash2(){
$('#date-form').fadeOut(900, function(){
      $('#splash2-3').fadeIn(900, function(){
        $('#splash2-3').fadeOut(900, function(){
          $('#splash2-4, #splash2-5').fadeIn(1400, function(){
            $('#splash2-4, #splash2-5').fadeOut(1400, function(){
              $('#splash2-6').fadeIn(1200, function(){
                $('#splash2-6').fadeOut(1200, function(){
                  $('#splash2-7').fadeIn(900, function(){
                    $('#splash-2').fadeOut(1600, function(){
                      $('#exploration').fadeIn(600);
                    });
                  });
                });
              });
            });    
          });
        });
      });
    });
  }

//create the 5 day itinerary array of day objects
function createItinerary(firstDay){
  const numDays = 5;
   //create object with date and array of places
  for(let i = 0; i<numDays; i++){
    const newDate = moment(firstDay).add(i, 'days');
    const placesObj = {
      am: [],
      pm: [],
      eve: []
    };
    const newDay = {
      date: newDate, 
      places: placesObj
    };
    itinerary.push(newDay);
  }
  updateSchedule();
}
//create and update itinerary when place is scheduled
function updateSchedule(){
  $('#itinerary').html('<h2>Itinerary:</h2>');
  itinerary.forEach(function(day, i){ 
    //below to different function
    let dateCard = createItineraryHTML(i);
    $('#itinerary').append(dateCard);
  }
  );}

//create itinerary HTML
function createItineraryHTML(i){
  let tmpStr = `
      <div id="day${i}" class="wrap-collapsible">
        <input id="collapsible2-${i}" class="toggle" type="checkbox">
        <label for="collapsible2-${i}" class="lbl-toggle">${moment(itinerary[i].date).format("ddd,ll")}</label>
        <div class="collapsible-content">
          <div class="content-inner">
            <ul class="am">`;
    itinerary[i].places.am.forEach(function(e){
      tmpStr+=`<li>AM:     ${e}</li>`;
    });
    tmpStr+=`</ul> 
        <ul class="pm">`;
    itinerary[i].places.pm.forEach(function(e){
      tmpStr+=`<li>PM:   ${e}</li>`;
    });
    tmpStr+=`</ul>
        <ul class="night">`;
    itinerary[i].places.eve.forEach(function(e){
    tmpStr+=`<li>EVE:   ${e}</li>`;
    });
    tmpStr +=`</ul>
          </div>
        </div>
      </div>`;
    return tmpStr;
}

//call AC function
placeSelection(map);

//adds listener to AC input and calls google place,  creates place Object
function placeSelection(map){
  let input = '';
  input = document.getElementById('pac-input');
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
     place.formatted_phone_number, place.website, place.reviews, place.rating, place.price_level, place.vicinity);
    //Below to new function
    if(hotelSelected){
      myPlaces.push(selected);
      placeIndex++;
      setCoords(placeIndex);
    }else {
      myPlaces[0] = selected;
      setCoords(0);
      hotelSelected = true;
      $('#pac-input').attr('placeholder', 'Enter place of interest');
    } 
    updatePlaces();
    ///clear the autocomplete input
    document.getElementById('pac-input').value = '';
  });
}

//Place object constructor
function Place (name, address, placeID, phone, website, reviews, rating, price, vicinity){
  this.name = name;
  this.address = address;
  this.placeID = placeID;
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

//Update the places div from myPlaces array 
function updatePlaces(){
  $('#places').html('').css('display', 'none');
  $('#places').html('<h2>Places to See:</h2>');
  
  myPlaces.forEach(function(place, i){  
    if(place.name === undefined){
      return;
    }
    const placeHTML = generatePlacesHTML(place, i);
    $('#places').append(placeHTML);
    setButtonDisplay(i);
    bindEventListeners(i);
  });
  $('#places').fadeIn(600);
}

//generate HTML for each place
function generatePlacesHTML(place,i){
  return  `
    <div id="wrap-collapsible-${i}" class="wrap-collapsible">
        <input id="collapsible-${i}" class="toggle" type="checkbox">
        <label for="collapsible-${i}" class="lbl-toggle">${i === 0?'H':i}. ${myPlaces[i].name}</label>
        <div class="collapsible-content">
          <ul class="place-info:">
            <li>${place.vicinity!==undefined?place.vicinity:''}</li>
            <li>${place.phone !==undefined?place.phone:''}</li>
            <li><a href="${place.url}" target="_blank">${place.url !==undefined?place.web:''}</a></li>
          </ul>
          <div class="btn-container">
            <button type="button" id="delete-${i}" class="delete" aria-label="delete">${i===0?'change':'<i class="fas fa-trash-alt"></i>'}</button>
            <button type="button" id="schedule-${i}" class="schedule" ${i ===0?'hidden':''}>schedule</button>
            <button type="button" id="unsched-${i}" class="unsched">unschedule</button>
            <button type="button" id="explore-${i}" class="explore" aria-label="explore"><i class="fas fa-search-plus"></i></button>
            <button id="return-${i}" class="return" type="button">return</button>
          </div>
          <form id="sched-form-${i}" class="sched-form">
            <select id="day-time-${i}" size=1 required>
              <option value="" disabled selected>choose day</option>
              <option value="0">${moment(itinerary[0].date).format("ddd,ll")}</option>
              <option value="1">${moment(itinerary[1].date).format("ddd,ll")}</option>
              <option value="2">${moment(itinerary[2].date).format("ddd,ll")}</option>
              <option value="3">${moment(itinerary[3].date).format("ddd,ll")}</option>
              <option value="4">${moment(itinerary[4].date).format("ddd,ll")}</option>
            </select>
            <select class="period" size=1 required>
              <option value="" disabled selected>time of day</option>
              <option value="am">morning</option>
              <option value="pm">afternoon</option>
              <option value="eve">evening</option>
            </select>
            <input id="sched-btn-${i}" type="submit" value="submit">
          </form>
          <div id="nearbydiv-${i}" class="nearbydiv"></div>
        </div>
      </div>
    </div>`;
}

function setButtonDisplay(index){  
  $('.return').css('display', 'none');
    if(myPlaces[index].scheduled){
      $(`#schedule-${index}, #delete-${index}`).css('display', 'none');
      $(`#unsched-${index}`).css('display', 'inline-block');
      addUnschedListener(index);
    } else {
      $(`#schedule-${index},#delete-${index} `).css('display', 'inline-block');
      $(`#unsched-${index}`).css('display', 'none');
    }
}
//---------
// Should be 3 separate functions
function bindEventListeners(index){
  bindDelete(index);
  bindSchedule(index);
  //bindUnschedule(index);
  bindExplore(index);
}

function bindDelete(index){
  $(`#delete-${index}`).click(function(e){
    e.preventDefault();
    //if index = 0, c
    if(index === 0){
      removeMarker(0);
      alert('find new hotel');
      $('#pac-input').attr('placeholder', 'Enter hotel');;
      hotelSelected = false;
    } else {
    //remove marker
      removeMarker(index);
      myPlaces[index]={};
      updatePlaces();
    }
  });
}

//bind schedule
function bindSchedule(index){
  $(`#schedule-${index}`).click(function(e){
    e.preventDefault();
    $(`#schedule-${index}, #delete-${index}`).fadeOut(400, function(){ 
        $(`#sched-form-${index}`).fadeIn(400, function(){
          bindSchedFormListener(index);
        });
    });
  });
}

//bind Explore
function bindExplore(index){
  $(`#explore-${index}`).click(function(e){
    e.preventDefault();
    launchNearby(index);
  });
}

//Zoom in on place and reveal Nearby form underneath.
function launchNearby(index){
  map.panTo(myPlaces[index].LatLng);
  map.setZoom(16);
  $(`#delete-${index}, #schedule-${index}, #explore-${index}`).fadeOut(400);
  $(`#return-${index}, #nearbydiv-${index}, #nearby-form-${index}`).fadeIn(400);
  addReturnListener();
  showNearbyForm(index);
}

//show form for Nearby Places and add listener
function showNearbyForm(index){ 
  let nearyFormStr = createNearbyFormHTML(index);
  $(`#nearbydiv-${index}`).append(nearyFormStr);
  addNearbyListener(index);
  addResetListener(index);
}

function createNearbyFormHTML(index){
  return `<form id="nearby-form-${index}" class="nearby-form>
            <label for="nearby-${index}">Nearby places:</label>
            <input type="text" onfocus="this.value=''" id="nearby-${index}"  required placeholder="eg italian restaurant, museum, drug store">
            <input id="nearby-btn-${index}" type="submit" value="submit">
            <button type="button" id="reset-${index}" class="reset">Reset</button>
          </form>`;
}

//adds listener gets search term
function addNearbyListener(index){
  $(`#nearby-btn-${index}`).click(function(e){
    e.preventDefault();
    let searchTerm = $(`#nearby-${index}`).val();
    findNearby(index, searchTerm);
  });
}

//call to google maps nearby service based on center coordinates
function findNearby(index, searchTerm){
  let nearbyCtr = new google.maps.LatLng(myPlaces[index].LatLng);
  let service = new google.maps.places.PlacesService(map);
  service.textSearch({
    location: nearbyCtr,
    radius: 0,
    query: searchTerm
  }, callback);
}

//adds reset listener
function addResetListener(index){
  $(`#reset-${index}`).click(function(){
    removeNearbyMarkers();
 });
}

//clear nearby markers if reset clicked
function removeNearbyMarkers(){
  markersNearby.forEach(function(element){
    element.setMap(null);
  });
  markersNearby= [];
  tempPlaces = [];
}

//callback function from nearby service call
function callback(results, status){
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      let place = results[i];
      //need to know url before I call createMarker
      getUrl(place.place_id, i);
      createMarker(results[i], i);
    }
  }
}

//create nearby marker
function createMarker(place, index) {
  // let nearbyPlace = place.geometry.location;
  let marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  markersNearby.push(marker);
  let infowindow = new google.maps.InfoWindow();
  google.maps.event.addListener(marker, 'click', function() {  //MAYBE REFACTOR INTO SEPARATE FUNCTION
    let contentStr =`${place.name}<br>
                      price: ${place.price_level}<br>
                      rating: ${place.rating}<br>
                      <a href="${tempPlaces[index]}" target="_blank">${tempPlaces[index]}</a>`;
    infowindow.setContent(contentStr);
    infowindow.open(map, this);
  }, function(place, status){
    if (status === google.maps.places.PlacesServiceStatus.OK){
      //? 
    }
  });
}

//get the place's URL based on placeID
function getUrl(placeID, index){
  let webAddress = '';
  let service = new google.maps.places.PlacesService(map);
  service.getDetails({
    placeId: placeID
  }, function(place, status){
    if (status === google.maps.places.PlacesServiceStatus.OK){
      webAddress = place.website;
      tempPlaces[index] = webAddress;
    }
  });
}

//add listener to return the map from zoomed nearby state
function addReturnListener(){
  $('.return').click(function(e){
    $('.explore, .return').fadeOut(400, function(){
      map.panTo(thisCity.center);
      map.setZoom(12);
      $('.nearby, .delete').fadeIn(400);
    });
    removeNearbyMarkers();
    updatePlaces();
  });
}

//add schedule button listener & get input
function bindSchedFormListener(index){
  $(`#sched-form-${index}`).submit(function(e){
    e.preventDefault();
    const date = $(`#sched-form-${index} select#day-time-${index}`).find('option:selected').val();
    const period = $(`#sched-form-${index} select#period`).find('option:selected').val();
    //set schedule
    schedulePlace(index, date, period);
  });
}

function schedulePlace(index, date, period){
  const thisPlace = myPlaces[index].name;
    myPlaces[index].scheduled = true;
    myPlaces[index].schedDay[date] = period;
    if(!itinerary[date].places[period].includes(thisPlace)){
      itinerary[date].places[period].push(thisPlace);
    };
    $(`#sched-form-${index}`).fadeOut(300, function(){
      //bind unsched listener here?
      addUnschedListener(index);
      $(`#unsched-${index}`).fadeIn(300);
    });
    updateSchedule();
  }

//unschedule Place  REFACTOR?
function addUnschedListener(index){
  $(`#unsched-${index}`).click(function(e){
    console.log(`#unsched-${index} clicked`);
    myPlaces[index].scheduled = false;
    //find which day/time scheduled
    let dayTime = findDayTime(index);
    const day = dayTime[0];
    const time = dayTime[1];
    const name = myPlaces[index].name;
    //remove place from itinerary[day].places[time]
    console.log(`day is ${day} time is ${time} name is ${name}`);
    console.log(itinerary[day].places[time]);
    const x = itinerary[day].places[time].indexOf(name); //???????
    //place empty string in myPlaces[index].schedDay
    itinerary[day].places[time].splice(x, 1);
    //hide unsched, reveal delete and sched
    $(`#unsched-${index}`).fadeOut(200, function(){
      $(`#delete-${index}, #schedule-${index}`).fadeIn(300);
    });
    updateSchedule();
  });
}

//finds the Day and period a place is scheduled
//REFACTOR
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

//remove place marker 
function removeMarker(index){
  let marker = myPlaces[index].name;
  markers[index].setMap(null);
}

//Sets the Lat and Long of a new place in myPlaces
function setCoords(index){
  $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json",
    type: "GET",
    data: {
      address: myPlaces[index].address,
      key: `${mapsAPIKey}`
    },
    success: function(data) {
      const foundLat = data.results[0].geometry.location.lat;
      const foundLng = data.results[0].geometry.location.lng;
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

//Add a marker for a new place
function addMarker(index){
  const label = index === 0 ? 'H': `${index}`;
  let marker = new google.maps.Marker({
    position: myPlaces[index].LatLng,
    label: {text: label, color: "yellow"},
    map:map,
    id: `${index}`
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
showSplash();
}
//==========================
return {initMap:initMap}
}();