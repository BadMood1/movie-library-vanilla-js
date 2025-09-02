import { handleTop250 } from "./renderMovies.js";
import { throwNotification } from "./notification.js";

export function showUserPanel(type) {
    // type: 'main', 'library'

    // Delete OLD user panel (reRender)
    const old = document.querySelector(".user-panel");
    if (old) old.remove();

    const header = document.querySelector(".home-header");

    if (type === "main") {
        const userPanel = `<div class="user-panel">
            <div class="panel-wrapper">
                <button class="loadMovies">Лучшие Фильмы 250</button>
            </div>  
            <div class="textWrapper"><span class="text">Главная</span></div>
        </div>`;

        header.insertAdjacentHTML("afterend", userPanel);

        // Load Top 250

        const loadMoviesBtn = document.querySelector(".loadMovies");

        loadMoviesBtn.addEventListener("click", () => {
            handleTop250(1).then(() =>
                throwNotification("Уведомление", "Топ 250 кинопоиска загружен успешно!", 2500)
            );
        });
    }

    if (type === "library") {
        const userPanel = `<div class="user-panel">
                <div class="panel-wrapper">
                
                </div>
                <div class="textWrapper"><span class="text">Библиотека</span></div>
            </div>`;

        header.insertAdjacentHTML("afterend", userPanel);
    }
}
