$(document).ready(function() {
    var city, lat, lng, lat, lng, rating;
    var apiSelector = 0;
    var searchTerm = "Restaurants";
    var showSearch = false;

    //instantiate gsap timeline
    var tl = gsap.timeline();

    //define the animation after user clicks "show me cool things"
    tl.to(".landing-el", {
        duration: .2,
        y: -900,
        ease: 'Power2.easeInOut',
        stagger: 0.05,
    }).from(".section-2", {
        y: 500,
        opacity: 0,
        duration: .3,
        ease: 'Power2.easeInOut',
    });
    tl.pause();

    //format the landing page for initial view
    $("#pac-input").hide();
    $("#search-btn").hide();
    $("#landing").css("z-index", "99");
    $("#section-2").css("z-index", "-1");

    //click event listener so users can conduct another searh
    $(document).on("click", ".search-again", function() {
        tl.reverse();
        $("#landing").css("z-index", "99");
        $("#section-2").css("z-index", "-1");
        $("#section-2").hide();
    });

    //click event listener for event toggles
    $(document).on("click", ".toggle", function() {
        apiSelector = parseInt($(this).attr("data-attr"));

        if (showSearch === false) {
            animateInputsIn();
            showSearch = true;
        }

        $(this).addClass("is-hovered");
        if (apiSelector === 0) {
            $("#beer, #music").removeClass("is-hovered");
            searchTerm = "Restaurants";
        } else if (apiSelector === 1) {
            $("#restaurant, #music").removeClass("is-hovered");
            searchTerm = "Breweries";
        } else if (apiSelector === 2) {
            $("#restaurant, #beer").removeClass("is-hovered");
            searchTerm = "Concerts";
        }
    });

    //set up the input field to only show search results for cities
    var options = {
        types: ['(cities)'],
    };

    //add event listener to the Show Me Cool Things button
    $("#search-btn").click(function() {
        city = $("#pac-input").val();

        if (city === "") {
            return
        }

        $("#section-2").show();
        $("#search-btn").addClass("is-loading");

        //define the request object that will be sent to the Places API
        var request = {
            query: city
        };

        var service = new google.maps.places.PlacesService(document.getElementById("service"));

        //send the request to places API, then a callback function is executed
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


    //callback function where all the magic happens
    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {

            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();

            var queryURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lng}&term=${searchTerm}`;

            var eventURL = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&apikey=nlha7A86hmR12YOlaa17AwPtVyVRCa0B&latlong=${lat},${lng}`;


            if (apiSelector === 0 || apiSelector === 1) {

                //Yelp API Call
                $.ajax({
                    url: queryURL,
                    headers: {
                        'Authorization': 'Bearer sP1TEnIO70-vlxbP1_XhMbHHVmAl3E4f6KAxS8-abCdCwdazlP8l6yKj9gPEjUkbFximC8S_AcB9U-WQi87lR28UT613l55rFoLQ2Gis6jBgr2k31TL-pZVrxEFxXnYx',
                    },
                    method: 'GET',
                    dataType: 'json'
                }).then(function(response) {
                    console.log(response);




                    $("#query-results").empty();
                    $("#search-btn").removeClass("is-loading");

                    var cardHeader = $(`<div id="card-header" class="columns">
                                <div class="column is-8 is-offset-2 test cards-container has-text-centered has-background-primary has-text-white has-text-weight-bold">
                                    <p>${searchTerm} in ${city}</p>
                                </div>
                                </div>`);
                    var searchAgain = $(`<div id="search-again" class="has-text-centered anim-4 m-t-md m-b-lg">
                                <button class="button is-primary is-inverted is-outlined is-rounded search-again">Search Again</button>
                                </div>`);

                    $("#query-results").append(searchAgain);
                    $("#query-results").append(cardHeader);

                    //only display 10 search results
                    for (var i = 0; i < 10; i++) {
                        rating = response.businesses[i].rating;

                        function printStars(id) {

                            var halfStarIcon = $(`<i class="fas fa-star-half">`);

                            if (rating % 1 === .5) {
                                rating -= .5;

                                for (let j = 1; j <= rating; j++) {
                                    var starIcon = $(`<i class="fas fa-star">`);
                                    $(`#rating-${id}`).append(starIcon);
                                }
                                $(`#rating-${id}`).append(halfStarIcon);

                            } else {
                                for (let k = 1; k <= rating; k++) {
                                    var starIcon = $(`<i class="fas fa-star">`);
                                    $(`#rating-${id}`).append(starIcon);
                                }
                            }
                        }
                        //Use Bulma CSS to style search results; populate based on API response
                        var resultsCard = $(`<div class="columns cards-containers">
                        <div class="column is-8 is-offset-2 test cards-container ">
                            <div class="columns is-mobile border">
                                <div class="column is-one-third "><img class="event-img"
                                        src="${response.businesses[i].image_url}"
                                        alt="">
                                </div>
                                <div class="column is-two-thirds has-text-left p-l-md">
                                    <div class=" p-b-none m-b-none">
                                        <div class="columns is-mobile ">
                                            <div class="column is-four-fifths">
                                                <h2 class="is-size-4 has-text-grey-dark results-card">${response.businesses[i].name}</h2>
                                            </div>
                                            <div class="column is-one-fifth has-text-right p-r-lg">
                                            </div>
                                        </div>
                                    </div>
                                    <p class="is-size-6 has-text-grey-light m-b-sm m-t-xxs"> ${response.businesses[i].categories[0].title}</p>
                                    <p id="rating-${i}">
                                        </p>
                                        <p class="is-size-6 has-text-grey-dark m-t-xxs">Reviews: <span class="p-l-sm">${response.businesses[i].review_count}</span>
                                        </p>
                                        <a target="blank" href="https://maps.google.com/?q=${response.businesses[i].location.address1}">${response.businesses[i].location.address1} <span
                                        class="is-size-4"><i class="fas fa-directions p-l-xs"></i></span></a>
                                </div>
                            </div>
                        </div>
                    </div>`);

                        //Add the UI element to the DOM
                        $("#query-results").append(resultsCard);
                        printStars(i);

                        if (i === 9) {
                            resultsCard.css("margin-bottom", "40px");
                        }
                    }

                    tl.play();
                    $("#landing").css("z-index", "-1");
                    $("#section-2").css("z-index", "99");
                });
            } else if (apiSelector === 2) {
                $.ajax({
                    url: eventURL,
                    method: 'GET',
                    async: true,
                    dataType: "json",
                }).then(function(response) {
                    $("#query-results").empty();
                    $("#search-btn").removeClass("is-loading");
                    var cardHeader = $(`<div id="card-header" class="columns">
                                <div class="column is-8 is-offset-2 test cards-container has-text-centered has-background-primary has-text-white has-text-weight-bold">
                                    <p>${searchTerm} in ${city}</p>
                                </div>
                                </div>`);
                    var searchAgain = $(`<div id="search-again" class="has-text-centered anim-4 m-t-md m-b-lg">
                                <button class="button is-primary is-inverted is-outlined is-rounded search-again">Search Again</button>
                                </div>`);


                    $("#query-results").append(searchAgain);
                    $("#query-results").append(cardHeader);

                    for (let i = 0; i < 10; i++) {

                        //define the styles for the display of search results
                        var resultsCard = $(`<div class="columns">
                        <div class="column is-8 is-offset-2 test cards-container ">
                            <div class="columns is-mobile border">
                                <div class="column is-one-third "><img class="event-img"
                                        src="${response._embedded.events[i].images[2].url}"
                                        alt="">
                                </div>
                                <div class="column is-two-thirds has-text-left p-l-md">
                                    <div class=" p-b-none m-b-none">
                                        <div class="columns is-mobile ">
                                            <div class="column is-four-fifths">
                                                <h2 class="is-size-4 has-text-grey-dark results-card">${response._embedded.events[i].name}</h2>
                                            </div>
                                            <div class="column is-one-fifth has-text-right p-r-lg">
                                            </div>
                                        </div>
                                    </div>
                                    <p class="is-size-6 has-text-grey-light m-b-sm m-t-xxs"> ${response._embedded.events[i].classifications[0].genre.name}</p>
                                    Date: <span id="date-${i}"
                                    class="p-l-sm p-r-xs">${response._embedded.events[i].dates.start.localDate}</span>
                                    </p>
                                    <a target="blank" href="${response._embedded.events[i].url}"> Get Tickets<span
                                        class="is-size-4 p-l-xs"><i class="fas fa-ticket-alt p-l-sm rotate"></i></span></a>
                                </div>
                            </div>
                        </div>
                    </div>`);

                        $("#query-results").append(resultsCard);
                        if (i === 9) {
                            resultsCard.css("margin-bottom", "40px");
                        }
                    }
                });
                tl.play();
                $("#landing").css("z-index", "-1");
                $("#section-2").css("z-index", "99");
            }

            //get and display weather data for the current city's lat/lng
            var weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=imperial&appid=3ccf586db422a1812c96a52bbfafc856`;

            $.ajax({
                url: weatherURL,
                method: 'GET'
            }).then(function(response) {
                $("#weather").empty();

                var iconCode = response.weather[0].icon;

                //Interpolate function into icon URL to return daytime icons only
                var iconURL = `https://openweathermap.org/img/wn/${formatIcon(iconCode)}d.png`;

                //Use Bulma CSS to style weather display; populate based on API response
                var weatherDiv = $(`<div id="weather" class="weather-container has-text-centered has-text-white m-b-md anim-4">
                <p class="is-size-5"></i>Current Weather in <span id="city-weather">${city}</span></p>
                <p id="cur-temp" class="is-size-3 level-item">${Math.round(response.main.temp)}&#730F<img src="${iconURL}" alt="Weather icon"></p>
                </div>`);

                //Display in DOM
                $("#section-2").prepend(weatherDiv);
            });
            //all ajax functions should be above this last curly bracket
        }
    }

    function formatIcon(code) {
        var arr = code.split("");
        //remove the last item from the icon code; always a letter to denote time of day
        arr.pop();
        iconCode = arr.join("");
        return iconCode;
    }

    //GSAP Animations
    //header
    gsap.from(".anim-1", {
        opacity: 0,
        duration: 1,
        x: -500,
        ease: 'Elastic.easeInOut',
        stagger: 0.3
    });

    //value prop
    gsap.from(".anim-2", {
        opacity: 0,
        duration: .65,
        y: 500,
        ease: 'Power2.easeInOut',
        delay: .3,
        stagger: 0.15
    });

    //input fields after toggle click
    function animateInputsIn() {
        $("#pac-input").show();
        $("#search-btn").show();
        gsap.from(".anim-3", {
            opacity: 0,
            duration: .3,
            y: 900,
            ease: 'Power2.easeInOut',
            stagger: 0.1
        });
    }



});