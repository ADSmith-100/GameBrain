const apiKey = "913dc9d5b9932248ab18e59a3559278f";
const searchURL = "https://api.rawg.io/api/games?";

function getGames(search, page_size = 10) {
  const params = {
    search: search,
    page_size: page_size,
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + queryString;

  console.log(url);

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-list").empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.results.length; i++) {
    $("#results-list").append(
      `<li><h3>${responseJson.results[i].name}</h3>
      
      <p>${responseJson.results[i].summary}</p>
      `
      //<img src="${responseJson.data[i].background_image}">
      //<p>${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode}</p>
      // <p>${responseJson.data[i].addresses[0].postalCode}</p>
      // <p>${responseJson.data[i].addresses[0].type}</p>
      // </li>
    );
  }
  //display the results section
  $("#results").removeClass("hidden");
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    const game = $("#js-search-keyword").val();
    //const searchTerm = $("#js-search-term").val();
    //const maxResults = $("#js-max-results").val();
    getGames(game);
  });
}

$(watchForm);
