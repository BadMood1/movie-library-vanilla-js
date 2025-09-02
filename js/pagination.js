"use strict";

export function renderPagination(totalPages, callBackFunc, currentPage) {
    // Удаляем старый элемент пагинации
    const paginationOld = document.querySelector(".pagination-container");
    if (paginationOld) paginationOld.remove();

    console.log("totalPages", totalPages);

    if (totalPages === 1) return;

    // Создаём элемент пагинации

    const paginationElHTML = `<div class="pagination-container">
                                <nav class="pagination"></nav>
                              </div>`;
    const moviesSection = document.querySelector(".movies-section");
    moviesSection.insertAdjacentHTML("afterend", paginationElHTML);
    const paginationEl = document.querySelector(".pagination-container nav");

    let pagination = getPagination(currentPage, totalPages);

    // LEFT stroke ---------
    if (currentPage !== 1) {
        const leftStrokeHTML = `<i class="back-page bxr bx-arrow-left-stroke"></i>`;
        paginationEl.insertAdjacentHTML("afterbegin", leftStrokeHTML);

        paginationEl.firstChild.addEventListener("click", () => {
            if (currentPage === 1) return;
            callBackFunc(currentPage - 1);
        });
    }
    // LEFT stroke --------- END

    // MAIN pages ------------------------------------
    pagination.forEach((text, index) => {
        const btn = document.createElement("a");
        btn.textContent = text;
        if (text === currentPage) btn.classList.add("current"); // Текущая страница
        paginationEl.insertAdjacentElement("beforeend", btn);

        // Обработчики
        btn.addEventListener("click", () => {
            // Обработка троеточий
            if (btn.textContent === "...") {
                if (pagination[index - 1] === 1) {
                    callBackFunc(pagination[index + 1] - 1);
                } else if (pagination[index + 1] === totalPages) {
                    callBackFunc(pagination[index - 1] + 1);
                }
                return;
            }

            // Обработка обычной нумерации
            if (currentPage === text) return;
            callBackFunc(text);
        });
    });
    // MAIN pages ------------------------------------ END

    // RIGHT stroke ---------
    if (currentPage !== totalPages) {
        const rightStrokeHTML = `<i class="back-page bxr bx-arrow-right-stroke"></i>`;
        paginationEl.insertAdjacentHTML("beforeend", rightStrokeHTML);

        paginationEl.lastChild.addEventListener("click", () => {
            if (currentPage === totalPages) return;
            callBackFunc(currentPage + 1);
        });
    }
    // RIGHT stroke --------- END
}

function getPagination(currentPage = 1, totalPages = 20, delta = 2) {
    let pagesNums = [];
    const left = currentPage - delta;
    let right = currentPage + delta;
    pagesNums.push(1, totalPages);
    // Случай первых страниц
    if (currentPage <= 2) right += 2;
    // Случай последних страниц

    // Общий случай
    for (let i = left; i <= right; i++) {
        if (pagesNums.includes(i) || i < 1 || i > totalPages) continue;
        pagesNums.push(i);
    }

    pagesNums.sort((a, b) => a - b);

    let pagination = [];

    for (let i = 0; i < pagesNums.length; i++) {
        pagination.push(pagesNums[i]);
        if (pagesNums[i + 1] && pagesNums[i + 1] - pagesNums[i] > 1) pagination.push("...");
    }

    return pagination;
}
