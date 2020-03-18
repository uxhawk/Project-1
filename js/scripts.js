$(document).ready(function() {
    var favorites = [];
    var city, lat, lng, lat, lng;
    var apiSelector = 0;
    var yelpTerm = "restaurant";

    $("#results-table").hide();

    //click event listener for event toggles
    $(document).on("click", ".toggle", function() {
        apiSelector = parseInt($(this).attr("data-attr"));
        console.log(apiSelector);

        $(this).addClass("is-hovered");
        if (apiSelector === 0) {
            $("#beer, #music").removeClass("is-hovered");
            yelpTerm = "restaurant";
        } else if (apiSelector === 1) {
            $("#restaurant, #music").removeClass("is-hovered");
            console.log("remove hover");
            yelpTerm = "brewery";
        } else if (apiSelector === 2) {
            $("#restaurant, #beer").removeClass("is-hovered");
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

            var queryURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lng}&term=${yelpTerm}`;
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
                $("#search-results").empty();



                for (let i = 0; i < 19; i++) {

                    var resultsRow = $(`<tr>
                    <td id="result${i}">
                    <div class="columns is-mobile is-multiline">
                        <div class="column is-one-third"><img
                                src="${response.businesses[i].image_url}"
                                alt="">
                        </div>
                        <div class="column is-two-thirds has-text-left p-l-md">
                            <h2 class="is-size-4 has-text-grey-dark">${response.businesses[i].name}
                            </h2>
                            <p class="is-size-5 has-text-grey-dark m-t-sm">Rating: <span id="rating${i}"
                                    class="p-l-md p-r-xs">${response.businesses[i].rating}</span><i class="fas fa-star"></i>
                                    ${response.businesses[i].review_count} Reviews</p>
                            <p class="is-size-6 has-text-grey-light m-b-md m-t-xs">
                                ${response.businesses[i].categories[0].title}</p>
                            <a target="blank" href="https://maps.google.com/?q=${response.businesses[i].location.address1}">${response.businesses[i].location.address1} <span
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