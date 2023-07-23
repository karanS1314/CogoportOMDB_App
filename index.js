let movieList = [];
let pageNo = 1;
let id = "";
let map = new Map();

if (window.localStorage.getItem("pageNo")) {
  pageNo = JSON.parse(window.localStorage.getItem("pageNo"));
}
function search() {
  let input = document.getElementById("searchbar").value;
  input = input.toLowerCase();
  pageNo = 1;
  window.localStorage.setItem("pageNo", JSON.stringify(pageNo));
  getData(input);
}
const getData = async (input) => {
  console.log(input);
  let res = await fetch(
    `http://www.omdbapi.com/?s=${input}&apikey=ddcedda9&page=${pageNo}&i=${id}`,
    {
      mode: "cors",
    }
  );
  let result = await res.json();
  console.log(result);
  renderMovies(result);
};

function renderMovies(movieList) {
  const moviesDiv = document.getElementById("movies");
  if (movieList.Response == "False") {
    moviesDiv.innerHTML = "No Results Found";
    return;
  }
  moviesDiv.innerHTML = "";
  const movieCol = document.getElementById("movieCol");
  const buttonsBox = document.createElement("div");
  const prevBtn = document.createElement("button");
  prevBtn.classList.add("pageBtn");
  prevBtn.innerHTML = "< PREV";
  prevBtn.onclick = () => {
    pageNo = pageNo - 1;
    window.localStorage.setItem("pageNo", JSON.stringify(pageNo));
    let input = document.getElementById("searchbar").value;
    input = input.toLowerCase();
    getData(input);
  };
  const nextBtn = document.createElement("button");
  nextBtn.classList.add("pageBtn");
  nextBtn.innerHTML = "NEXT >";
  nextBtn.onclick = () => {
    pageNo = pageNo + 1;
    window.localStorage.setItem("pageNo", JSON.stringify(pageNo));
    let input = document.getElementById("searchbar").value;
    input = input.toLowerCase();
    getData(input);
  };
  if (pageNo != 1) {
    buttonsBox.appendChild(prevBtn);
  }
  if (movieList.totalResults > (pageNo - 1) * 10 + movieList.Search.length) {
    buttonsBox.appendChild(nextBtn);
  }
  movieCol.append(buttonsBox);

  for (let i = 0; i < movieList.Search.length; i++) {
    const movie = document.createElement("div");
    movie.classList.add("movie");
    const movieTitle = document.createElement("h3");
    movieTitle.innerHTML = movieList.Search[i].Title;
    movieTitle.onclick = () => {
      displayMovieDetails(movieList.Search[i].imdbID);
    };
    const moviePoster = document.createElement("img");
    moviePoster.src = movieList.Search[i].Poster;

    const movieYear = document.createElement("p");
    movieYear.innerHTML = "Year : " + movieList.Search[i].Year;

    const userRatingLabel = document.createElement("span");
    userRatingLabel.innerHTML = "Your rating : ";
    const userRating = document.createElement("select");
    let option = document.createElement("option");
    option.value = "5";
    option.text = "5 Stars";
    userRating.appendChild(option);
    option = document.createElement("option");
    option.value = "4";
    option.text = "4 Stars";
    userRating.appendChild(option);
    option = document.createElement("option");
    option.value = "3";
    option.text = "3 Stars";
    userRating.appendChild(option);
    option = document.createElement("option");
    option.value = "2";
    option.text = "2 Stars";
    userRating.appendChild(option);
    option = document.createElement("option");
    option.value = "1";
    option.text = "1 Stars";
    userRating.appendChild(option);

    const userCommentLabel = document.createElement("span");
    userCommentLabel.innerHTML = "Your comments : ";
    const userComment = document.createElement("input");
    userComment.type = "text";
    const col1 = document.createElement("div");
    col1.classList.add("colL");
    const col2 = document.createElement("div");
    col2.classList.add("colR");

    const saveBtn = document.createElement("button");
    saveBtn.innerHTML = "Save your response";
    saveBtn.onclick = () => {
      window.localStorage.setItem(
        movieList.Search[i].Title + "*" + movieList.Search[i].Year,
        [userComment.value + "***x***" + userRating.value]
      );
      let input = document.getElementById("searchbar").value;
      input = input.toLowerCase();
      getData(input);
    };
    col1.appendChild(movieTitle);
    col1.appendChild(movieYear);

    if (
      !window.localStorage.getItem(
        movieList.Search[i].Title + "*" + movieList.Search[i].Year
      )
    ) {
      col1.appendChild(document.createElement("br"));
      col1.appendChild(userRatingLabel);
      col1.appendChild(userRating);
      col1.appendChild(document.createElement("br"));
      col1.appendChild(userCommentLabel);
      col1.appendChild(userComment);
      col1.appendChild(document.createElement("br"));
      col1.appendChild(saveBtn);
    } else {
      const savedData = window.localStorage
        .getItem(movieList.Search[i].Title + "*" + movieList.Search[i].Year)
        .split("***x***");
      console.log(savedData);
      const suserComment = document.createElement("p");
      suserComment.innerHTML = "Your Comment : " + savedData[0];
      const suserRating = document.createElement("p");
      suserRating.innerHTML = "Your Rating : " + savedData[1] + " stars";
      suserRating.classList.add("userData");
      suserComment.classList.add("userData");
      col1.appendChild(suserRating);
      col1.appendChild(suserComment);
    }
    col2.appendChild(moviePoster);
    movie.appendChild(col1);
    movie.appendChild(col2);
    moviesDiv.appendChild(movie);
    moviesDiv.appendChild(buttonsBox);
  }
}

const clearBtn = document.getElementById("clear-user");
clearBtn.onclick = () => {
  window.localStorage.clear();
  let input = document.getElementById("searchbar").value;
  input = input.toLowerCase();
  window.localStorage.setItem("pageNo", JSON.stringify(pageNo));
  getData(input);
};

function displayMovieDetails(imdbID) {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");

  fetch(`http://www.omdbapi.com/?apikey=ddcedda9&i=${imdbID}`)
    .then((response) => response.json())
    .then((data) => {
      modalContent.innerHTML = `
            <span class="close" id="close-btn">&times;</span>
            <h2>${data.Title}</h2>
            <div class="modal-container">
            <div class="modal-left">
                <img class="modal-img" src= ${data.Poster}/>
            </div>
            <div class="modal-right">
                <p><strong>Released : </strong>${data.Released}</p>
                <p><strong>Runtime : </strong>${data.Runtime}</p>
                <p><strong>Genre : </strong>${data.Genre}</p>
                <p><strong>Actors : </strong>${data.Actors}</p>
                <p><strong>Director : </strong>${data.Director}</p>
                <p><strong>Plot : </strong>${data.Plot}</p>
                <p><strong>Language : </strong> <span>${data.Language}</span></p>
                <p><strong>Country:</strong> <span>${data.Country}</span></p>
                <p><strong>Awards:</strong> <span>${data.Awards}</span></p>
                <p><strong>IMDb Rating:</strong> <span>${data.imdbRating}</span></p>
            </div>
        </div>
        `;

      modal.style.display = "block";
      if (window.localStorage.getItem(data.Title + "*" + data.Year)) {
        const savedData = window.localStorage
          .getItem(data.Title + "*" + data.Year)
          .split("***x***");

        const col1 = document.createElement("div");
        const suserComment = document.createElement("p");
        suserComment.innerHTML = "Your Comment : " + savedData[0];
        const suserRating = document.createElement("p");
        suserRating.innerHTML = "Your Rating : " + savedData[1] + " stars";
        suserRating.classList.add("userData");
        suserComment.classList.add("userData");
        col1.appendChild(suserRating);
        col1.appendChild(suserComment);
        modalContent.appendChild(col1);
      }
      document.getElementById("close-btn").addEventListener("click", () => {
        modal.style.display = "none";
      });
    })
    .catch((error) => {
      console.error("Error fetching movie details:", error);
    });
}
