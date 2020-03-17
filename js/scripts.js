$(document).ready(function() {
    var favorites = [];
    var city, lat, lng, apiSelector, lat, lng;

    $("#results-table").hide();
    //click event listener for event toggles
    $(document).on("click", ".toggle", function() {

        $(this).addClass("is-outlined has-text-primary");
        $(this).removeClass("has-text-white ");
        apiSelector = $(this).attr("data-attr");
        console.log(apiSelector);
    });

    //places auto complete
    var input = document.getElementById("pac-input");
    var options = {
        types: ['(cities)'],
    };


    $("#search-btn").click(function() {
        city = $("#pac-input").val();

        if (city === "") {
            return
        }
        $("#search-btn").addClass("is-loading");
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

            var queryURL = "https://developers.zomato.com/api/v2.1/search?count=10&lat=" + lat + "&lon=" + lng + "&sort=rating&order=asc";

            $.ajax({
                url: queryURL,
                method: "GET",
                headers: {
                    "user-key": "bf03c64be8ee3a6da3d0cb9bfd69e5e3"
                }
            }).then(function(response) {
                $("#search-btn").removeClass("is-loading");
                $("#results-table").show();
                $("#search-results").empty();
                console.log(response);

                for (let i = 0; i < response.restaurants.length; i++) {

                    var resultsRow = $(`<tr>
                    <td id="result${i}">
                    <div class="columns is-mobile is-multiline">
                        <div class="column is-one-quarter"><img
                                src="${response.restaurants[i].restaurant.thumb}"
                                alt="">
                        </div>
                        <div class="column is-three-quarters has-text-left p-l-xl">
                            <h2 class="is-size-4 has-text-grey-dark">${response.restaurants[i].restaurant.name}
                            </h2>
                            <p class="is-size-5 has-text-grey-dark m-t-sm">Rating: <span id=rating${i}
                                    class="p-l-md p-r-xs">${response.restaurants[i].restaurant.user_rating.aggregate_rating}</span><i class="fas fa-star"></i>
                            </p>
                            <p class="is-size-6 has-text-grey-light m-b-md">
                                ${response.restaurants[i].restaurant.cuisines}</p>
                            <a target="blank" href="https://maps.google.com/?q=${response.restaurants[i].restaurant.location.address}">${response.restaurants[i].restaurant.location.address} <span
                                    class="is-size-4"><i class="fas fa-directions"></i></span></a>
                        </div>
                    </div>
                </td>
                    </tr>`);

                    $("#search-results").append(resultsRow);
                }
            });


            //all ajax functions should be above this last curly bracket
        }
    }




});