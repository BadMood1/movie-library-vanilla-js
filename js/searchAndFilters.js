import { handleFilteredSearch } from "./renderMovies.js";

const filtersBtn = document.querySelector(".searchWrapper .searchFilters");

filtersBtn.addEventListener("click", () => {
    showFiltersPanel();
});

const searchBtn = document.querySelector(".searchWrapper .searchSubmit");

searchBtn.addEventListener("click", (event) => {
    event.preventDefault();
    handleFilteredSearch(1);
});

export function showFiltersPanel() {
    const panelWrapper = document.querySelector(".home .panel-wrapper");

    //

    const filtersExistingEl = document.querySelector(".user-panel .filters-wrapper");

    if (filtersExistingEl) {
        filtersExistingEl.classList.toggle("hide");
        if (panelWrapper) panelWrapper.classList.toggle("hide");

        return;
    }

    const filtersWrapper = `
                <div class="filters-wrapper">
                    <div class="panel-column">
                        <div class="panel-row">
                            <label>Сортировать: </label>
                            <select class="sorting-select-filter">
                                <option value="">---</option>
                                <option value="rating.kp">По рейтингу</option>
                                <option value="votes.kp">По кол-ву отзывов</option>
                                <option value="year">По году выпуска</option>
                            </select>
                        </div>
                        <div class="panel-row">
                            <label for="min-year">Год от</label>
                            <input id="min-year" type="text" class="year yearBefore-input-filter" inputmode="numeric"
                            />
                            <span>до</span>
                            <input type="text" class="year yearAfter-input-filter" inputmode="numeric"  />
                        </div>
                    </div>
                    <div class="panel-column">
                        <div class="panel-row">
                            <label for="">Тип: </label>
                            <select class="type-select-filter">
                                <option value="">---</option>
                                <option value="movie">Фильм</option>
                                <option value="tv-series">ТВ Сериал</option>
                                <option value="cartoon">Мультфильм</option>
                                <option value="anime">Аниме</option>
                            </select>
                        </div>
                        <div class="panel-row">
                            <label for="">Рейтинг от</label>
                            <input type="text" class="ratingBefore-input-filter" value="7" inputmode="numeric" />
                            <span>до</span>
                            <input type="text" class="ratingAfter-input-filter" value="10" inputmode="numeric" />
                        </div>
                    </div>
                </div>
            `;

    const userPanel = document.querySelector(".home .user-panel");
    userPanel.insertAdjacentHTML("afterbegin", filtersWrapper);

    if (panelWrapper) panelWrapper.classList.toggle("hide");
}

//
export function filteredURLConstructor() {
    const filtersEl = document.querySelector(".filters-wrapper");
    if (!filtersEl) {
        return null;
    }

    const yearFrom = filtersEl.querySelector(".yearBefore-input-filter").value;
    const yearTo = filtersEl.querySelector(".yearAfter-input-filter").value;

    const ratingFrom = filtersEl.querySelector(".ratingBefore-input-filter").value;
    const ratingTo = filtersEl.querySelector(".ratingAfter-input-filter").value;

    let year = "";
    if (yearFrom && yearTo) year = `${yearFrom}-${yearTo}`;

    let rating = "";
    if (ratingFrom && ratingTo) rating = `${ratingFrom}-${ratingTo}`;

    const filters = {
        sortField: filtersEl.querySelector(".sorting-select-filter").value,

        year: year,
        type: filtersEl.querySelector(".type-select-filter").value,
        "rating.kp": rating,
    };

    let filtersStringTags = "";
    for (const key in filters) {
        const value = filters[key];

        if (value === "") continue;

        filtersStringTags += `&${key}=${value}`;
    }

    const sortType = 1;
    if (filters.sortField !== "") filtersStringTags += `&sortType=${sortType}`;

    // page=${page}
    let filtersURL = `https://api.kinopoisk.dev/v1.4/movie?limit=20`;
    filtersURL += filtersStringTags;

    return filtersURL;
}

export function keywordURLConstructor(keyword) {
    return `https://api.kinopoisk.dev/v1.4/movie/search?&limit=20&query=${keyword}`;
}
