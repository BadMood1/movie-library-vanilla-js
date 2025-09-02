import { handleDescr, handleMinimizeBtn, truncDescription } from "./description.js";
import { renderPagination } from "./pagination.js";
import { throwNotification } from "./notification.js";
import { libraryContainsID } from "./library.js";
import { fetchWithLoader } from "./loader.js";
import { filteredURLConstructor, keywordURLConstructor } from "./searchAndFilters.js";
let currentPage = 1;

export const pageMovieMap = new Map();

async function renderMovies(moviesJSON) {
    console.log("Loading movies...");

    const moviesArr = moviesJSON.docs;
    const totalPages = moviesJSON.pages;

    moviesArr.forEach((data, index) => {
        setTimeout(() => {
            const movieObj = {
                id: data.id,
                nameRu: data.name,
                nameOrig: data.alternativeName,
                img: data && data.poster && data.poster.previewUrl ? data.poster.previewUrl : null,
                description: data.description,
                truncatedDescr: truncDescription(data.description),
                genres: parseGenres(data.genres),
                rating: data.rating.kp,
                year: data.year,
                isAddedToLibrary: libraryContainsID(data.id),
            };

            pageMovieMap.set(movieObj.id, movieObj);

            //
            const movieHTML = getMovieHTML(movieObj);

            const moviesSection = document.querySelector(".movies-section");
            moviesSection.insertAdjacentHTML("beforeend", movieHTML);

            const movieCard = moviesSection.querySelector(`[id="${movieObj.id}"]`);
            const addToLibraryBtn = movieCard.querySelector(".add-to-library");
            if (movieObj.isAddedToLibrary) addToLibraryBtn.textContent = "В библиотеке";
            const movieDescrEl = movieCard.querySelector(".movie-description");
            const minimizeBtn = movieCard.querySelector(".minimize-button");

            // Логика описания карточек
            movieDescrEl.addEventListener("click", () => handleDescr(movieObj));
            minimizeBtn.addEventListener("click", () => handleMinimizeBtn(movieObj));
        }, index * 100); // Interval 200 miliseconds so not too many requests
    });
    console.log(pageMovieMap);

    return totalPages;
}

function parseGenres(genres) {
    const genresStr = [];
    const genresLength = 3;
    genres.forEach((obj) => {
        genresStr.push(obj.name);
    });

    return genresStr.slice(0, genresLength).join(", ");
}

function parseSecondInfoStr(movieObj) {
    // RETURN "nameOrig, year" OR "year"
    const { nameOrig, year } = movieObj;
    return nameOrig ? `${nameOrig}, ${year}` : String(year);
}

export async function handleTop250(page) {
    let currentPage = page;

    const response = await fetchWithLoader(
        `https://api.kinopoisk.dev/v1.4/movie?limit=20&sortField=rating.kp&sortType=-1&lists=top250&page=${page}`,
        {
            method: "GET",
            headers: {
                "X-API-KEY": "B71AS27-Q9CMCW8-HXMVCB7-2K8AWZB",
                "Content-Type": "application/json",
            },
        }
    );
    const json = await response.json();
    console.log(json);

    // Очищаем перед новым рендером
    showOnlySection("movies-section");
    // Рендер
    const pages = await renderMovies(json);
    renderPagination(pages, handleTop250, currentPage);
}

export async function handleFilteredSearch(page) {
    //
    const keyword = encodeURIComponent(document.querySelector(".searchWrapper .searchMovie").value);
    let url;
    if (keyword !== "") {
        url = keywordURLConstructor(keyword);
    } else {
        url = filteredURLConstructor();
    }

    if (url === null) return;

    // Очищаем перед новым рендером
    showOnlySection("movies-section");

    console.log(`SEARCHING FOR ${url}&page=${page}`);
    const response = await fetchWithLoader(`${url}&page=${page}`, {
        method: "GET",
        headers: {
            "X-API-KEY": "B71AS27-Q9CMCW8-HXMVCB7-2K8AWZB",
            "Content-Type": "application/json",
        },
    });
    const json = await response.json();

    console.log(json);

    // Рендер
    const pages = await renderMovies(json);
    renderPagination(pages, handleFilteredSearch, currentPage);
}

export function showOnlySection(className) {
    const section = document.createElement("section");
    section.classList.add(className);

    const main = document.querySelector(".home");
    const mainUserPanel = main.querySelector(".user-panel");

    const oldSections = main.querySelectorAll("section");
    oldSections.forEach((s) => s.remove());

    mainUserPanel.insertAdjacentElement("afterend", section);

    window.scrollTo(0, 0);
}

export function getMovieHTML(movieObj) {
    const movieHTML = `<div class="movie-card" id="${movieObj.id}">
        <img
        src="${movieObj.img}"
        alt="No image for ${movieObj.id} movie :("
        />
        <div class="movie-info">
        <h3 class="movie-title">${movieObj.nameRu}</h3>
        <p class="movie-second-info">${parseSecondInfoStr(movieObj)}</p>
        <p class="movie-description">${movieObj.truncatedDescr}\n</p>
        <span class="minimize-button"></span>
        <p class="movie-genres">Жанры: ${movieObj.genres}</p>
        <p class="movie-rating">Рейтинг: ${movieObj.rating}</p>
        </div>
        <nav class="movie-nav">
        <a class="add-to-library">Добавить</a>
        <a
        href="https://www.kinopoisk.ru/film/${movieObj.id}/"
        class="go-to-kinopoisk"
        target="_blank"
        >Кинопоиск</a
        >
        </nav>
        
        </div>`;

    return movieHTML;
}
