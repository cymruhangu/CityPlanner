## CityPlanner Synopsis
This application is a planning and itinerary tool that allows the user to research, visualize, and plan a trip to a city or region. The Google Map API is used along with Google Places and autocomplete functionality to accomplish this.  If time and project scope allow an additional restaurant API (Yelp, OpenTable) will also be integrated.

Technology:
---------
HTML5, CSS, Javascript, jQuery, Google Maps API

App Flow:
---------
Select a city from the dropdown menu:
![screenshot of the dashboard](assets/CityPlanner1.png)
Select an arrival date:
![screenshot of the dashboard](assets/CityPlanner2.png)
Choose a hotel first then choose places you'd like to visit:
![screenshot of the dashboard](assets/CityPlanner3.png)
Schedule a visit to place, zoom in on the surrounding area to see or search for nearby places, or delete the place:
![screenshot of the dashboard](assets/CityPlanner4.png)

## Code Example
Calls to the Google Maps IP are made as follows:
   
https://maps.googleapis.com/maps/api/js?key=MYKEY&libraries=places&callback=mySpace.initMap   

mySpace is a "revealing module pattern" which is used to avoid the use of global variables.

## Motivation
The motivation behind this project is twofold.  One, there is a desire by the development team to gain experience using the Google Maps API for future projects.  Two, the development team's wife is planning on traveling to a few cities on business and will be visiting a number of retail locations within each.  This app will provide the ability to plan her visit to a city, visualize the proximity of each store, and locate restaurants or points of interest in the vicinity of each. 

## Installation
TBD

## API Reference
https://developers.google.com/maps/documentation/javascript/tutorial

https://developers.google.com/maps/documentation/javascript/places-autocomplete

https://developers.google.com/places/web-service/details#PlaceDetailsRequests

## Tests
TBD

## Contributors
NA

## License
NA
