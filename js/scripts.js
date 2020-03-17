$(document).ready(function() {

    var lat;
    var lng;


     //places auto complete
     var input = document.getElementById("pac-input");
     var options = {
         types: ['(cities)'],
     };
     var autocomplete = new google.maps.places.Autocomplete(input, options);
 
     function callback(results, status) {
         if (status == google.maps.places.PlacesServiceStatus.OK) {
 
             lat = results[0].geometry.location.lat();
             lng = results[0].geometry.location.lng();
 
             console.log(lat, lng);

             var queryURL = "https://developers.zomato.com/api/v2.1/search?count=10&lat=" + lat + "&lon=" + lng + "&sort=rating&order=asc";     
     
             $.ajax({
                 url: queryURL,
                 method: "GET",
                 headers: {
                     "user-key": "bf03c64be8ee3a6da3d0cb9bfd69e5e3"
                 }
             }).then(function(response) {
                 console.log(response);
             });
         }
     }
 
     

    $("#search-btn").click(function() {
        var city = $("#pac-input").val();
        if (city === "") {
            return
        }

        var request = {
            query: city
        };

        var service = new google.maps.places.PlacesService(document.getElementById("service"));
        service.textSearch(request, callback);

        //clear after search
        $("#pac-input").val("");

        
      


    });

   


});