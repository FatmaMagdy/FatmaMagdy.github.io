// LOcations to be viewed on the map
var locations = [
          {title: 'Golden Gate Park', location: {lat: 37.769421, lng: -122.486214}},
          {title: 'Googleplex', location: {lat: 37.422000, lng: -122.084057}},
          {title: 'Facebook main campus', location: {lat: 37.481029, lng: -122.154329}},
          {title: 'Mitchell park', location: {lat: 37.421486, lng: -122.114865}},
          {title: 'Happy hollow park & zoo', location: {lat: 37.325745, lng: -121.861383}},
          {title: 'California\'s Great America', location: {lat: 37.398405, lng: -121.975157}},
          {title: 'Levies stadium ', location: {lat: 37.403197, lng: -121.969807}},
          {title: 'GIlroy Gardens', location: {lat: 37.004996, lng: -121.629061}},
          {title: 'Dish Dash Restaurant', location: {lat: 37.428933, lng: -121.919994}},
          {title: 'Olive Garden Resturant', location: {lat: 37.249873, lng: -121.864573}},
        ];

// Create a map variable
     var map;
     // Function to initialize the map within the map div
     function initMap() {
       map = new google.maps.Map(document.getElementById('map'), {
         center: {lat: 37.8272, lng: -122.2913},
         zoom: 9
       });
       ko.applyBindings(new ViewModel());
    }   

// View Model
var ViewModel = function(){
 
  var self = this;

  locations.forEach(function(locationInfo){
    console.log(locationInfo.location);
    console.log(locationInfo.title);
    console.log(map);
   var marker = new google.maps.Marker({
      position: locationInfo.location,
      map: map,
      title: locationInfo.title

    });
    
    var infowindow = new google.maps.InfoWindow({
      content: 'I am feeling happy'
    });

    marker.addListener('click', function(){
      infowindow.open(map, marker);
    });
  });

  
}
