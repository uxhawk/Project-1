$(document).ready(function() {

    $("#search-btn").click(function() {
        var city = $("#city-val").val();
        if (city === "") {
            alert("Please enter a name for the city.")
        }
        console.log(city);

        //clear after search
        $("#city-val").val("");


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