const searchURL = "https://api.rawg.io/api/games?";

function getGames(search, page_size = 21) {
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
  $(".results").empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.results.length; i++) {
    $(".results").append(
      `
      <div class="games">
        <h2>${responseJson.results[i].name}</h2>
        <img src="${responseJson.results[i].background_image}">
        <p>Release Date: ${responseJson.results[i].released}</p>
        <p>Metacritic Score: ${responseJson.results[i].metacritic}</p>
        <a href="#" id="${responseJson.results[i].id}" class="more-info">More Info</a>
      </div>
     `
    );
  }
  $("#results").removeClass("hidden");
}

//$("button").click((e) => {
// e.preventDefault();
// const q = $("#search").val();
//fetch(`https://api.rawg.io/api/games?${q}`)
// .then((res) => res.json())
//  .then((games) => {
//loop through and append to results
//  });
//});

function displayMoreInfo(id) {
  console.log({ id });
  $(".modal .modal-image")
    .css("background-image", `url('${id.background_image}')`)
    .removeClass("loading");
  $(".modal p").text(id.description_raw);
  $(".modal h2").text(id.name);
}

function getMoreInfo(id) {
  fetch(`https://api.rawg.io/api/games/${id}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayMoreInfo(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

$(".close").click(closeModal);
$(".overlay").click(closeModal);

function closeModal(e) {
  e.preventDefault();
  $(".modal").hide();
  $(".overlay").hide();
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    const game = $("#search").val();
    //const searchTerm = $("#js-search-term").val();
    //const maxResults = $("#js-max-results").val();
    getGames(game);
  });
}

function watchMoreInfo() {
  $(".results").on("click", ".more-info", (e) => {
    e.preventDefault();
    $(".modal-image").addClass("loading");
    $(".modal h2").text("Loading...");
    $(".modal").show();
    $(".overlay").show();
    const id = e.target.id;
    getMoreInfo(id);
  });
}

$(watchForm);
$(watchMoreInfo);
