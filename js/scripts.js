console.log("hello world");
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