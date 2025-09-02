//
const body = document.body,
    modeText = body.querySelector(".mode .mode-text");

function initTheme() {
    const themeColor = localStorage.getItem("themeColor");

    if (themeColor === "dark") {
        body.classList.add("dark");
        modeText.textContent = "Ночь";
    } else {
        body.classList.remove("dark");
        // Устанавливаем светлую тему по умолчанию, если ничего не сохранено
        localStorage.setItem("themeColor", "light");
        modeText.textContent = "День";
    }
}

export function toggleDarkMode() {
    if (body.classList.contains("dark")) {
        body.classList.remove("dark");
        localStorage.setItem("themeColor", "light");
        modeText.textContent = "День";
    } else {
        body.classList.add("dark");
        localStorage.setItem("themeColor", "dark");
        modeText.textContent = "Ночь";
    }
}

initTheme();
