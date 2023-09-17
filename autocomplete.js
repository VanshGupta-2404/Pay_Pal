$(document).ready(function () {
    var searchInput = $("#productLink");
    var autocompleteSuggestions = $("#autocomplete-suggestions");

    searchInput.on("input", function () {
        var userQuery = searchInput.val();

        // Make an AJAX request to get recommendations
        $.ajax({
            type: "GET",
            url: "/get_recommendations",
            data: { user_query: userQuery },
            dataType: "json",
            success: function (data) {
                // Clear previous suggestions
                autocompleteSuggestions.empty();

                // Display new suggestions
                if (data.length > 0) {
                    data.forEach(function (suggestion) {
                        autocompleteSuggestions.append("<div class='suggestion'>" + suggestion + "</div>");
                    });
                    autocompleteSuggestions.show();
                } else {
                    autocompleteSuggestions.hide();
                }
            },
            error: function (error) {
                console.error("Error fetching recommendations: " + error.statusText);
            }
        });
    });

    // Handle click on a suggestion
    autocompleteSuggestions.on("click", ".suggestion", function () {
        searchInput.val($(this).text());
        autocompleteSuggestions.hide();
    });

    // Hide suggestions on document click
    $(document).on("click", function (e) {
        if (!autocompleteSuggestions.is(e.target) && autocompleteSuggestions.has(e.target).length === 0) {
            autocompleteSuggestions.hide();
        }
    });
});
