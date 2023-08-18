const form = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const result = document.getElementById("result");

let search = "";
let movies = [];

//Pour aller chercher le film: va chercher l'api avec un résultat dynamique de la const{search}, convertis nous le bon format et ensuite joue la fction
const fetchMovies = async () => {
  movies = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=ed82f4c18f2964e75117c2dc65e2161d&query=${search}`
  ).then((res) => res.json());
  console.log(movies);
};

//Affichage des films: à chaque fois qu'on relance le formulaire, on lance moviesDisplay
const moviesDisplay = async () => {
  await fetchMovies();

  //Affichage limité à 12
  movies.results.length = 12;

  //Chaque élément du map est un li
  result.innerHTML = movies.results
    .map(
      (movie) =>
        `
      <li>
        <h2>${movie.original_title}</h2>
        <div class="card-content">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"></img>
          <div class="infos">
            <p>${movie.overview}</p>
            <p>Popularité : ${movie.popularity} ⭐</p>
          </div>
        </div>
      </li>
    `
    )
    .join("");
};

//Evenement quand le formulaire est soumis: on récupère la valeur de searchInput qu'on passe à search
form.addEventListener("submit", (e) => {
  e.preventDefault();
  search = searchInput.value;
  moviesDisplay();
});
