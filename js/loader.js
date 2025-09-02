import { throwNotification } from "./notification.js";
import { renderPagination } from "./pagination.js";
import { showOnlySection } from "./renderMovies.js";

export async function fetchWithLoader(url, options) {
    console.log("LOADING...");

    const loader = document.getElementById("loader");

    if (!loader) {
        console.warn("Лоадер не найден в DOM");
        return fetch(url, options);
    }

    // Show Loader
    loader.style.display = "block";

    // try...catch block so loader don't stay forever
    try {
        const response = await fetch(url, options);

        // HTTP status check
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (err) {
        console.error("Fetch error: ", err);
        document.querySelector(".pagination-container").remove();
        showOnlySection("movies-section");
        throwNotification("Ошибка соединения!", "Попробуйте повторить попытку позже", 3000);
        throw err; // Чтобы вызывающий код узнал об ошибке
    } finally {
        loader.style.display = "none";
    }
}
