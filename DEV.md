## Development Notes

## 6/16/18
- Clear input window after each selection.
    DONE:   document.getElementById('pac-input').value = '';

- freeze zooming on the map.
    DONE:   gestureHandling: 'cooperative'

- move creation of marker and info window to separate funcitons outside of placeSelection().

- geometry.location doesn't seem to get lat and long. Use geocode API to grab lat and long for marker. 




## Question List:

1) Setting placesIndex to -1 so that I can increment to 0 seems hacky but more efficient that  (if firstElement).

2) 
