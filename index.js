const trendingList = document.querySelector(".trending__list");
const popularList = document.querySelector(".popular__list");

const variables = {
  page: 1,
  perPage: 8,
};


function showSearchRes(event) {
    event.preventDefault();
    const form = event.target; 
    const formData = new FormData(form); 
  
    
    const searchTerm = formData.get("search__term");
  
    localStorage.setItem("searchTerm", searchTerm);
  
    window.location.href = "./res.html";
  }



  function handleResponse(response) {
    return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
    });
  }
  
  function handleError(error) {
    alert("Error, check console");
    console.error(error);
  }

/* INNER HTML TO DISPLAY FROM FETCH */

  function animeHTML(res) {
    return `
      <div class="anime">
        <a href="${res.siteUrl}" class="anime__list--anchor" target="_blank">
          <figure class="anime__img--wrapper">
            <img src="${res.coverImage.extraLarge}" class="anime__img" alt="" />
          </figure>
          <h3 class="anime__name">${res.title.english}</h3>
        </a>
      </div>
    `;
  }

  async function trending() {
    trendingList.classList.add("loading");
    const query = `
      query ($id: Int, $page: Int, $perPage: Int, $search: String) {
          Page (page: $page, perPage: $perPage) {
              pageInfo {
                  total
                  currentPage
                  lastPage
                  hasNextPage
                  perPage
              }
              media (id: $id, search: $search, type: ANIME, isAdult: false, sort: TRENDING_DESC) {
                  title {
                      english
                  }
                  coverImage {
                      extraLarge
                  }
                  popularity
                  trending
                  description
                  siteUrl
                  startDate {
                    year
                    month
                    day
                  }
              }
          }
      }
    `;
    /* Post request to use API */
  const url = "https://graphql.anilist.co";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  };

  let data = await fetch(url, options).then(handleResponse).catch(handleError);

  trendingList.classList.remove("loading");

  trendingList.innerHTML = data.data.Page.media
    .sort((a, b) => b.trending - a.trending)
    .map((res) => {
      return animeHTML(res);
    })
    .join("");

  console.log(data.data.Page.media);
}

trending();

async function popular() {
    popularList.classList.add("loading");
    const query = `
      query ($id: Int, $page: Int, $perPage: Int, $search: String) {
          Page (page: $page, perPage: $perPage) {
              pageInfo {
                  total
                  currentPage
                  lastPage
                  hasNextPage
                  perPage
              }
              media (id: $id, search: $search, type: ANIME, isAdult: false, sort: POPULARITY_DESC) {
                  title {
                      english
                  }
                  coverImage {
                      extraLarge
                  }
                  popularity
                  trending
                  description
                  siteUrl
                  startDate {
                    year
                    month
                    day
                  }
              }
          }
      }
    `;
const url = "https://graphql.anilist.co";

const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  };

  let data = await fetch(url, options).then(handleResponse).catch(handleError);

  popularList.classList.remove("loading");

  popularList.innerHTML = data.data.Page.media
    .sort((a, b) => b.popularity - a.popularity)
    .map((res) => {
      return animeHTML(res);
    })
    .join("");

  console.log(data.data.Page.media);
}

popular();
