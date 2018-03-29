// Locations to be viewed on the map
var locations = [
          {title: 'Lake Elizabeth', location: {lat: 37.548271, lng: -121.988571}},
          {title: 'Googleplex', location: {lat: 37.422000, lng: -122.084057}},
          {title: 'Facebook main campus', location: {lat: 37.481029, lng: -122.154329}},
          {title: 'Mitchell park', location: {lat: 37.421486, lng: -122.114865}},
          {title: 'Happy hollow park & zoo', location: {lat: 37.325745, lng: -121.861383}},
          {title: 'California\'s Great America', location: {lat: 37.398405, lng: -121.975157}},
          {title: 'Levies stadium ', location: {lat: 37.403197, lng: -121.969807}},
          {title: 'Shorline Lake', location: {lat: 37.432785, lng: -122.091743}},
          {title: 'Dish Dash Restaurant', location: {lat: 37.428933, lng: -121.919994}},
          {title: 'Olive Garden Resturant', location: {lat: 37.249873, lng: -121.864573}},
        ];

// Create a map variable
var map;

// Foursquare Developers client Id and client secret Variables
var clientId = "U4ISGXKY4EZHP5OJ3ZQP1IMFZBBQMVZZHR4JM3VBEG4OHCYT";
var clientSecret = "O3TDDTX3QC1CENWY4THZQ3VUAEJ4SWVWD3EVV3FKXTKE4GRV";
     
// Function to initialize the map within the map div
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.386051, lng: -122.083855},
    zoom: 10
    });
    ko.applyBindings(new ViewModel());
  }   

// handle map error
function googleMapsError() {
    alert('OPPs! Google Maps cannot load at the momment.');
}  

// Single Location Model
var place = function(data){
  var self = this;
  this.title = data.title;
  this.position = data.location;
  this.street = '',
  this.city = '';
  // Create the content msg that appers in the Info window
  this.contentMsg = '' ; 
  this.visible = ko.observable(true);

  // Send the JSON REquest to FOURSQUARE
  var fourSquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + 
      this.position.lat + ',' + this.position.lng + '&client_id=' + clientId + 
      '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + this.title;
      $.getJSON(fourSquareURL).done(function(data) {
            var results = data.response.venues[0];
            self.street = results.location.formattedAddress[0];
            self.city = results.location.formattedAddress[1];
            }).fail(function() {
            // Handel Error
               alert(
                   "OOPS! Something went wrong with Foursquare."
                   );
             });
  
                      

  // Create the Infowindow content      
  this.infowindow = new google.maps.InfoWindow({
      content: self.contentString
      
    });    

  // Create a marker on the map
  this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(data.location),
      map: map,
      title: data.title
    });
      
  //Create an event lisiner to open the marker when clicked
  this.marker.addListener('click', function() {
    self.contentMsg = '<div id="content"><div id="title"><b>' + data.title + '</b></div>'+
                       '<div id="bodyContent">' + self.street + '</div>' +
                       '<div id="bodyContent">' + self.city + '</div></div>' ;
                       
      self.infowindow.setContent(self.contentMsg);
      self.infowindow.open(map, this);
      self.marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
      self.marker.setAnimation(null);
      }, 2100)
    }); 

  // Make it bounce when clicked 
  this.bounce = function(place) {
      google.maps.event.trigger(self.marker, 'click');
  };   

  // filter the markers on the map
  this.showMarker = ko.computed(function() {
    if(this.visible() === true) {
      this.marker.setMap(map);
    } else {
      this.marker.setMap(null);
    }
    return true;
  }, this);     

};


// View Model
var ViewModel = function(){
  var self = this; 
  // Create an observable variable to hold the serachbox input
  this.searchInput = ko.observable("");

  // Create an observabole Array to hold the locations
  this.locationList = ko.observableArray([]);
  
  // Fill in the observable array with a location marker foreach place
  locations.forEach(function(locationItem){
    self.locationList.push( new place(locationItem));
  });

  // Computed Variable to filter according to the searchInput
  this.filteredLocations = ko.computed( function() {
    var filter = self.searchInput().toLowerCase();
    if (!filter) {
      self.locationList().forEach(function(locationItem){
        locationItem.visible(true);
      });
      return self.locationList();
    } else {
      return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
        
        var string = locationItem.title.toLowerCase();
        var result = (string.search(filter) >= 0);
        locationItem.visible(result);
        return result;
      });
    }
  }, self);
}
