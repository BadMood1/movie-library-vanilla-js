"use strict";

const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box");

import { handleTop250 } from "./renderMovies.js";
import { throwNotification } from "./notification.js";
import { showUserPanel } from "./userPanel.js";
import { renderLibrary } from "./library.js";
import { showFiltersPanel } from "./searchAndFilters.js";
// DEFAULT load

//

const mainPageBtn = sidebar.querySelector(".main-page");
console.log(mainPageBtn);
mainPageBtn.addEventListener("click", () => {
    showUserPanel("main");
    handleTop250(1).then(() =>
        throwNotification("Уведомление", "Топ 250 кинопоиска загружен успешно!", 2500)
    );
});

const libraryBtn = sidebar.querySelector(".library-page");
libraryBtn.addEventListener("click", () => {
    showUserPanel("library");
    renderLibrary();
});

document.addEventListener("DOMContentLoaded", () => {
    showUserPanel("main");
    throwNotification(
        "Внимание!",
        "Поиск по ключевым словам не использует фильтры из-за ограничений API",
        13000
    );
});
