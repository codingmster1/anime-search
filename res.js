const resultsList = document.querySelector(".results__list");
const loading = document.querySelector(".results__loading");

function handleResponse(response) {
    return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
    });
  }
  
  function handleError(error) {
    alert("Error, check console");
    console.error(error);
  }

  /*clears current results and returns you to home screen */
  async function search(event) {
    
    resultsList.innerHTML = "";
  
    event.preventDefault();
    const form = event.target; 
    const formData = new FormData(form);
  
    
    const searchTerm = formData.get("search__term");
  
    localStorage.setItem("searchTerm", searchTerm);
  
    await main();
  }

  /* results displaying with filter box */
  async function filterAnime(event) {
    let data = await getData()
    if (event.target.value === "new") {
      resultsList.innerHTML = data.data.Page.media
        .sort((a, b) => b.startDate.year - a.startDate.year)
        .map((res) => {
          return animeHTML(res);
        })
        .join("");
  
      console.log(data.data.Page.media);
    } else if (event.target.value === "old") {
      resultsList.innerHTML = data.data.Page.media
        .sort((a, b) => a.startDate.year - b.startDate.year)
        .map((res) => {
          return animeHTML(res);
        })
        .join("");

        console.log(data.data.Page.media);
    } else if (event.target.value === "trending") {
      resultsList.innerHTML = data.data.Page.media
        .sort((a, b) => b.trending - a.trending)
        .map((res) => {
          return animeHTML(res);
        })
        .join("");
  
      console.log(data.data.Page.media);
    } else if (event.target.value === "popular") {
      resultsList.innerHTML = data.data.Page.media
        .sort((a, b) => b.popularity - a.popularity)
        .map((res) => {
          return animeHTML(res);
        })
        .join("");
  
      console.log(data.data.Page.media);
    }
  }
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

  async function getData() {
    // Here we define our query as a multi-line string
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
              media (id: $id, search: $search, type: ANIME, isAdult: false) {
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

    const variables = {
        search: `${localStorage.getItem("searchTerm")}`,
        page: 1,
        perPage: 8,
      };

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
    
      return data;
    }

    async function main() {
        loading.classList.add("loading");
        let data = await getData();
        loading.classList.remove("loading");
      
        resultsList.innerHTML = data.data.Page.media
          .sort((a, b) => b.popularity - a.popularity)
          .map((res) => {
            return animeHTML(res);
          })
          .join("");
      
        console.log(data.data.Page.media);
      }
      
      main();