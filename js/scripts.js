$(document).ready(function() {
    var favorites = [];
    var city, lat, lng;
    var apiSelector;

    //click event listener for event toggles
    $(document).on("click", ".toggle", function() {

        $(this).addClass("is-outlined has-text-primary");
        $(this).removeClass("has-text-white has-text-primary");
        apiSelector = $(this).attr("data-attr");
        console.log(apiSelector);
    });


    $("#search-btn").click(function() {
        city = $("#pac-input").val();
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



            var queryURL = "https://developers.zomato.com/api/v2.1/search?entity_type=city&q=" + city + "&count=10";
            //curl -X GET --header "Accept: application/json" --header "user-key: bf03c64be8ee3a6da3d0cb9bfd69e5e3" "https://developers.zomato.com/api/v2.1/cities?q=seattle"


            $.ajax({
                url: queryURL,
                method: "GET",
                headers: {
                    "user-key": "bf03c64be8ee3a6da3d0cb9bfd69e5e3"
                }
            }).then(function(response) {
                var resultsTable = $("#search-results");
                for (let i = 0; i < response.length; i++) {
                    var resultsRow = $(`<tr>
                    <td id="result${i}" class="has-text-centered">
                        <div class="columns">
                            <div class="column is-4">${respnse.something[i]}</div>
                            <div class="column is-4">${respnse.something[i]}</div>
                            <div class="column is-4">${respnse.something[i]}</div>
                        </div>
                    </td>
                </tr>`);
                    resultsTable.append(resultsRow);


                }






            });


            //all ajax functions should be above this last curly bracket
        }
    }




});