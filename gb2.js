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
        <a href="#" id="${responseJson.results[i].id}" class="more-info">More Info and YouTube Review Videos!</a>
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
function searchYoutube(gameName) {
  console.log(gameName);
  var params = {
    part: "snippet",
    key: "AIzaSyBuCHW7S1hpnmSS5jgfK3jqQcn7OTQocKQ",
    q: gameName + "IGN game review",
    maxResults: 3,
    type: "video",
    order: "Relevance",
    safeSearch: "strict",
    relevanceLanguage: "en",
  };
  url = "https://www.googleapis.com/youtube/v3/search";
  $.getJSON(url, params, function (data) {
    showYoutube(gameName, data.items);
  });
}

function showYoutube(gameName, results) {
  $(".youtube").empty();
  var html = "";
  //Error msg for no search results
  if (results.length === 0) {
    html +=
      '<div class="center"><dt class="youtube_color">Sorry, no YouTube clips were found.</dt><hr><dd class="tips">- Check for correct spelling, spacing and punctunations.<br />- Avoid using other search engine tricks in your search term.<br />- If the YouTube API server is down, try again at a later time.</dd>';
    $(".youtube").append(html);
  } else {
    $.each(results, function (index, value) {
      let title = value.snippet.title;
      if (title.length > 70) {
        title = title.substring(0, 70).trim() + "...";
      }

      html +=
        '<table><tr><td><a href="https://www.youtube.com/watch?v=' +
        value.id.videoId +
        '?vq=hd1080" data-lity>' +
        '<div class="thumbnailWrap"><img class="thumbnail" src="' +
        value.snippet.thumbnails.medium.url +
        '"><p class="play"><i class="fa fa-play-circle" aria-hidden="true"></i><br><span class="popup">Play here</span></p></div></a></td>' +
        '<td class="tdtext"><a href="https://www.youtube.com/watch?v=' +
        value.id.videoId +
        '?vq=hd1080" data-lity><p class="videotitle">' +
        title +
        '</p></a><p class="videochannel">' +
        value.snippet.publishedAt
          .substring(0, value.snippet.publishedAt.length - 14)
          .replace(/-/g, "/") +
        ' &middot; <a href="https://www.youtube.com/channel/' +
        value.snippet.channelId +
        '" target="_blank">' +
        value.snippet.channelTitle +
        '</a></p><a class="read_description" href="#v' +
        index +
        '" rel="modal:open"><i class="fa fa-question-circle" aria-hidden="true"></i> Read description</a><p class="fulldescription" id="v' +
        index +
        '" style="display: none;"><span class="fd_title"><i class="fa fa-question-circle" aria-hidden="true"></i> ' +
        value.snippet.title +
        '</span><span class="fd_by">Posted by <a href="https://www.youtube.com/channel/' +
        value.snippet.channelId +
        '" target="_blank">' +
        value.snippet.channelTitle +
        "</a> on " +
        value.snippet.publishedAt
          .substring(0, value.snippet.publishedAt.length - 14)
          .replace(/-/g, "/") +
        "</span>" +
        value.snippet.description +
        '<a class="fd_link" href="https://www.youtube.com/watch?v=' +
        value.id.videoId +
        '?vq=hd1080" data-lity rel="modal:close"> Watch the video to learn more<i>!</i></a></p><p class="videodescription">' +
        value.snippet.description.substring(0, 130).trim() +
        "..." +
        "</p></td></tr></table>";
    });
    $(".youtube").append(html);
    $(".youtube").append(
      '<hr class="youtubehr"><p class="ext_link"><a href="https://www.youtube.com/results?search_query=' +
        gameName +
        `" target="_blank"><i class="fa fa-external-link-square" aria-hidden="true"></i> &nbsp;More on YouTube</a></p>
      <p style="text-align: center; margin-bottom: 0; margin-top: 10px; font-weight: 400; color: #555;">
          <a class="mobile_link" href="https://www.youtube.com/t/terms" target="_blank">YouTube Terms of Services</a>
          <span class="mobile_hide" style="font-weight: 100; padding: 0 10px;">•</span>
          <a class="mobile_link" href="https://www.google.com/policies/privacy" target="_blank">Google Privacy Policy</a>
      </p>
      `
    );
  }
}

function displayMoreInfo(id) {
  console.log({ id });
  $(".modal .modal-image")
    .css("background-image", `url('${id.background_image}')`)
    .removeClass("loading");
  $(".modal p").html(id.description);
  $(".modal h2").text(id.name);
  const gameName = id.name;
  searchYoutube(gameName);
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
