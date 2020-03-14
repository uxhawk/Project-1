
$(document).ready(function() {

    $("#search-btn").click(function() {
        var city = $("#city-val").val();
        if (city === "") {
            alert("Please enter a name for the city.")
        }
        console.log(city);

        //clear after search
        $("#city-val").val("");


    
var search = "Arlington";
var queryURL = "https://developers.zomato.com/api/v2.1/search?entity_type=" + search + "&q=baltimore&count=10&sort=rating&order=asc"
//curl -X GET --header "Accept: application/json" --header "user-key: bf03c64be8ee3a6da3d0cb9bfd69e5e3" "https://developers.zomato.com/api/v2.1/cities?q=seattle"

    $.ajax({
        url: queryURL,
        method: "GET",
        headers: {
            "user-key": "bf03c64be8ee3a6da3d0cb9bfd69e5e3"
        }
      }).then(function(response) {
          console.log(response);
      });
      
        // var queryURL;

        // $.ajax({
        //     url: queryURL,
        //     method: "GET"
        // }).then(function(response) {
        //     $("#topArticles").empty();
        //     var results = response;
        //     console.log(searchTermVal);
        //     console.log(results);

        //     for (let i = 0; i < numArticlesVal; i++) {
        //         var newDiv = $("<div>");
        //         var pAbs = $("<p>");
        //         pAbs.text(results.response.docs[0].abstract)
        //         var pTitle = $("<p>");
        //         var pPubYear = $("<p>");


        //     }
        // });
        //end of ajax
    });




});

