import { getMovieHTML, pageMovieMap, showOnlySection } from "./renderMovies.js";
import { handleDescr, handleMinimizeBtn, truncDescription } from "./description.js";

const mainPage = document.querySelector(".home");

export let libraryMovies = [];
if (localStorage.getItem("libraryMovies")) {
    libraryMovies = JSON.parse(decodeURIComponent(localStorage.getItem("libraryMovies")));
}

mainPage.addEventListener("click", (event) => {
    const addBtn = event.target.closest(".add-to-library");
    if (!addBtn) return;
    const movieCard = addBtn.closest(".movie-card");
    const id = Number(movieCard.id);

    // Если уже в библиотеке
    if (libraryContainsID(id)) {
        // Удаляем объект по айди
        const index = libraryMovies.findIndex((movie) => movie.id === id);
        libraryMovies.splice(index, 1);
        addBtn.textContent = "Удалено";

        // Если действие внутри библиотеки
        const librarySection = addBtn.closest(".library-section");
        if (librarySection) {
            movieCard.remove();
            isLibraryEmpty(librarySection);
        }

        updateLibraryStorage();
        return;
    }

    // Добавляем в библиотеку
    const movieFromMap = pageMovieMap.get(id);
    if (movieFromMap) {
        movieFromMap.isAddedToLibrary = true;
        libraryMovies.push(movieFromMap);
        addBtn.textContent = "В библиотеке";
    }

    updateLibraryStorage();
});

function updateLibraryStorage() {
    localStorage.setItem("libraryMovies", encodeURIComponent(JSON.stringify(libraryMovies)));
}

export function libraryContainsID(id) {
    return libraryMovies.some((movie) => movie.id === id); // returns true\false
}

export function renderLibrary() {
    showOnlySection("library-section");
    const librarySection = document.querySelector(".library-section");

    const paginationOld = document.querySelector(".pagination-container");
    if (paginationOld) paginationOld.remove();

    // Если библиотека пуста, то показываем это и НЕ рендерим
    if (isLibraryEmpty(librarySection)) return;

    libraryMovies.forEach((movieObj) => {
        const movieHTML = getMovieHTML(movieObj);

        librarySection.insertAdjacentHTML("beforeend", movieHTML);

        const movieCard = librarySection.querySelector(`[id="${movieObj.id}"]`);
        const addToLibraryBtn = movieCard.querySelector(".add-to-library");
        if (movieObj.isAddedToLibrary) addToLibraryBtn.textContent = "В библиотеке";
        const movieDescrEl = movieCard.querySelector(".movie-description");
        const minimizeBtn = movieCard.querySelector(".minimize-button");

        // Логика описания карточек
        movieDescrEl.addEventListener("click", () => handleDescr(movieObj));
        minimizeBtn.addEventListener("click", () => handleMinimizeBtn(movieObj));
    });
}

export function isLibraryEmpty(librarySection) {
    if (libraryMovies.length === 0 && !librarySection.hasChildNodes()) {
        const emptyLibraryHTML = '<div class="empty-library">Библиотека пуста</div>';
        librarySection.insertAdjacentHTML("afterbegin", emptyLibraryHTML);
        return true;
    }
    return false;
}
