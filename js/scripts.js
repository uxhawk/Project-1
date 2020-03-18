$(document).ready(function() {
    var favorites = [];
    var city, lat, lng, lat, lng;
    var apiSelector = 0;
    var searchTerm = "Restaurants";

    $("#results-table").hide();
    $("#weather").hide();

    //click event listener for favorite hearts
    $(document).on("click", ".favorite", function() {
        console.log("you clicked a favorite");
    });

    //click event listener for event toggles
    $(document).on("click", ".toggle", function() {
        apiSelector = parseInt($(this).attr("data-attr"));
        console.log(apiSelector);

        $(this).addClass("is-hovered");
        if (apiSelector === 0) {
            $("#beer, #music").removeClass("is-hovered");
            searchTerm = "Restaurants";
        } else if (apiSelector === 1) {
            $("#restaurant, #music").removeClass("is-hovered");
            console.log("remove hover");
            searchTerm = "Breweries";
        } else if (apiSelector === 2) {
            $("#restaurant, #beer").removeClass("is-hovered");
            searchTerm = "Concerts";
        }


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
        $("#results-table").hide();
        $("#weather").hide();
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

            var queryURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lng}&term=${searchTerm}`;
            console.log(queryURL);

            $.ajax({
                url: queryURL,
                headers: {
                    'Authorization': 'Bearer sP1TEnIO70-vlxbP1_XhMbHHVmAl3E4f6KAxS8-abCdCwdazlP8l6yKj9gPEjUkbFximC8S_AcB9U-WQi87lR28UT613l55rFoLQ2Gis6jBgr2k31TL-pZVrxEFxXnYx',
                },
                method: 'GET',
                dataType: 'json'
            }).then(function(response) {
                console.log(response);
                $("#search-btn").removeClass("is-loading");
                $("#results-table").show();
                $("#event-type-th").text(searchTerm);
                $("#event-city-th").text(city);
                $("#search-results").empty();

                $("#weather").show();
                for (let i = 0; i < 19; i++) {

                    var resultsRow = $(`<tr>
                    <td id="result-${i}">
                    <div class="columns is-mobile is-multiline">
                        <div class="column is-one-third"><img
                                src="${response.businesses[i].image_url}"
                                alt="">
                        </div>
                        <div class="column is-two-thirds has-text-left p-l-md">
                            <div class="level p-b-none m-b-none">
                                <div class="level-left">
                                    <h2 class="is-size-4 has-text-grey-dark">${response.businesses[i].name}</h2>
                                </div>
                                <div class="level-right p-r-md">
                                    <i class="far fa-heart favorite" selected="0"></i>
                                </div>
                            </div>
                            <p class="is-size-6 has-text-grey-light m-b-sm m-t-xxs">
                                ${response.businesses[i].categories[0].title}</p>
                            <p class="is-size-6 has-text-grey-dark m-t-sm">Rating: <span id="rating${i}"
                                    class="p-l-sm p-r-xs">${response.businesses[i].rating}</span><i class="fas fa-star"></i>
                                    </p>
                                    <p class="is-size-6 has-text-grey-dark m-t-xxs">Reviews: <span class="p-l-sm">${response.businesses[i].review_count}</span>
                                    </p>
                            
                            <a target="blank" href="https://maps.google.com/?q=${response.businesses[i].location.address1}">${response.businesses[i].location.address1} <span
                                    class="is-size-4"><i class="fas fa-directions p-l-xs"></i></span></a>
                        </div>
                    </div>
                </td>
                    </tr>`);

                    $("#search-results").append(resultsRow);
                }
            });

            var weatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=imperial&appid=3ccf586db422a1812c96a52bbfafc856`;

            $.ajax({
                url: weatherURL,
                method: 'GET'
            }).then(function(response) {
                $("#weather").empty();
                var iconCode = response.weather[0].icon;
                var iconURL = `https://openweathermap.org/img/wn/${formatIcon(iconCode)}d.png`;
                var p1 = $(`<p class="is-size-5">Current Weather in <span id="city-weather">${city}</span></p>`);
                var p2 = $(`<p id="cur-temp" class="is-size-3 level-item">${Math.round(response.main.temp)}&#730F<img src="${iconURL}" alt="Weather icon"></p>`);
                $("#weather").append(p1);
                $("#weather").append(p2);




            });

            //all ajax functions should be above this last curly bracket
        }
    }

    function formatIcon(code) {
        var arr = code.split("");
        arr.pop();
        iconCode = arr.join("");
        // console.log(iconCode);
        return iconCode;
    }




});