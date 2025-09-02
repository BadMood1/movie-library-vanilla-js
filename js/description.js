export function handleDescr(movieObj) {
    const movieCard = document.querySelector(`[id="${movieObj.id}"]`);
    const movieDescrEl = movieCard.querySelector(".movie-description");
    const minimizeBtn = movieCard.querySelector(".minimize-button");

    // Если выделяем текст, то у нас не сбрасывается выделение
    const selection = window.getSelection();
    if (selection.toString().length > 0) return;

    // Разворачиваем
    if (!movieDescrEl.classList.contains("expanded")) {
        movieDescrEl.classList.add("expanded");
        movieDescrEl.innerText = movieObj.description;
        minimizeBtn.innerText = "Свернуть";
        return;
    }
}

export function truncDescription(description) {
    const maxLength = 200;
    if (description === null) return "";
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength) + "...";
}

export function handleMinimizeBtn(movieObj) {
    const movieCard = document.querySelector(`[id="${movieObj.id}"]`);
    const movieDescrEl = movieCard.querySelector(".movie-description");
    const minimizeBtn = movieCard.querySelector(".minimize-button");

    const truncatedDescr = truncDescription(movieObj.description);
    // Логика
    movieDescrEl.classList.remove("expanded");
    movieDescrEl.innerText = truncatedDescr;
    minimizeBtn.innerText = "";
}
