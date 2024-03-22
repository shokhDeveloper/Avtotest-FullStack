"use strict";
const elStartBtns = document.querySelectorAll(".js-start-btn");
const elStartSection = document.querySelector(".js-start-section");
const elSettingsSection = document.querySelector(".js-settings-section");
const elErrorBox = document.querySelector(".js-start-error");
const elSettingsForm = document.querySelector(".js-settings-form");
const elGameSection = document.querySelector(".js-game-section");
const elRoadTemp = document.querySelector(".js-roady-symb-temp").content;
const elGameList = document.querySelector(".js-game-list");
const elQuestionText = document.querySelector(".js-question-info");
const elScoreInfo = document.querySelector(".js-score-info");
const elLastSection = document.querySelector(".js-last-section");
const elLastScoreCount = document.querySelector(".js-last-score-count");
const elLastErrorCount = document.querySelector(".js-last-error-count");
const elLastTitle = document.querySelector(".js-last-title");
const elRestartBtn = document.querySelector(".js-restart-btn");
const user = getItem("avtotest-user") ? JSON.parse(getItem("avtotest-user")) : null;
const token = getItem("avtotest-token");
const gameSettingsMenejement = {
    start: "START_GAME",
    settings: "SETTINGS_GAME",
    game: "GAME",
    win: "GAME_WIN",
    over: "GAME_OVER"
};
const gameMenejementObject = {
    easy: {
        type: "easy",
        length: 21
    },
    normal: {
        type: "normal",
        length: 42
    },
    hard: {
        type: "hard",
        length: 62
    }
};
let gameSettings = getItem("avtotest-settings") ? JSON.parse(getItem("avtotest-settings")) : null;
let gameTypeLength = getItem("avtotest-settings") ? gameMenejementObject[JSON.parse(getItem("avtotest-settings")).degree].length : null;
let randomNumArr = [];
let roads;
let res;
let score = 0;
let maxError = 5;
let userError = 0;
elScoreInfo.textContent = "Score: " + score;
const handleToCheckToken = () => {
    if (!token) {
        window.location.replace("/register");
    }
};
const handleShowSection = (showSecton, hideSection) => {
    hideSection.classList.add("remove-section");
    showSecton.classList.remove("remove-section");
};
const handleDisabledBtns = (type) => {
    elStartBtns.forEach(btn => {
        btn.disabled = type;
    });
    setTimeout(() => {
        handleDisabledBtns(!type);
    }, 2000);
};
const handleSettingsBtnDisabled = (type) => {
    elSettingsSection.querySelector("button").disabled = type;
    if (type) {
        setTimeout(() => {
            handleSettingsBtnDisabled(false);
        }, 2000);
    }
};
const handleOpenError = (text, typeSection) => {
    elErrorBox.classList.add("start__error--animation");
    elErrorBox.querySelector(".js-error-discription").textContent = text;
    if (typeSection == gameSettingsMenejement.settings) {
        handleSettingsBtnDisabled(true);
    }
    if (typeSection == gameSettingsMenejement.start) {
        handleDisabledBtns(true);
    }
    setTimeout(() => {
        elErrorBox.classList.remove("start__error--animation");
    }, 2000);
};
const handleStartBtnClick = (evt) => {
    if (evt.target.matches(".start__btn-main")) {
        handleShowSection(elSettingsSection, elStartSection);
    }
    else {
        handleOpenError("Bunday hususiyat dasturga hali qo'shilmagan !", gameSettingsMenejement.start);
    }
};
elStartBtns.forEach(btn => {
    btn.addEventListener("click", handleStartBtnClick);
});
const handleSettingsSubmit = (evt) => {
    evt.preventDefault();
    const formData = new FormData(evt.target);
    let settings = {
        degree: formData.get("type"),
        date: formData.get("date")
    };
    let type = Object.values(settings).every((val) => val.length);
    if (type) {
        setItem("avtotest-settings", settings);
        gameSettings = getItem("avtotest-settings") ? JSON.parse(getItem("avtotest-settings")) : null;
        gameTypeLength = getItem("avtotest-settings") ? gameMenejementObject[JSON.parse(getItem("avtotest-settings")).degree].length : null;
        handleToCheckGameSettings();
        handleShowSection(elGameSection, elSettingsSection);
        handleStartGameSettings();
    }
    else {
        handleOpenError("Vaqt va O'yin darajasini tanlamasdan o'yinni boshlay olmaysiz", gameSettingsMenejement.settings);
    }
};
elSettingsForm.addEventListener("submit", handleSettingsSubmit);
function handleToCheckGameSettings() {
    if (gameSettings && Object.keys(gameSettings).length) {
        handleShowSection(elGameSection, elSettingsSection);
        handleShowSection(elGameSection, elStartSection);
        handleStartGameSettings();
    }
}
async function handleStartGameSettings() {
    roads = await request("/roads", "GET");
    if (roads) {
        handleGetRandomNumbers(roads);
    }
}
function handleRandomNumner() {
    let randomNumber;
    for (let i = 0; i < gameTypeLength; i++) {
        randomNumber = Math.floor(Math.random() * gameTypeLength);
    }
    return randomNumber;
}
function handleGetRandomNumbers(arr) {
    const randoNumber = handleRandomNumner();
    if (randomNumArr.length < gameTypeLength) {
        if ((randoNumber || randoNumber == 0) && !randomNumArr.includes(randoNumber)) {
            randomNumArr.push(randoNumber);
        }
        handleGetRandomNumbers(arr);
    }
    else {
        handleCreateObj(randomNumArr, arr);
    }
}
let idx = 0;
const handleCreateQuestion = () => {
    if (randomNumArr[idx] == 0 || randomNumArr[idx]) {
        console.log(res[randomNumArr[idx]], idx, randomNumArr);
        elQuestionText.textContent = res[randomNumArr[idx]].symbol_title;
    }
    else {
        handleGameEndFn(false);
    }
};
function handleCreateObj(arr, roads) {
    res = [];
    for (let i = 0; i < arr.length; i++) {
        if (roads[arr[i]].id == arr[i]) {
            res.push(roads[arr[i]]);
        }
    }
    handleRenderRoads(res);
    handleCreateQuestion();
}
function handleRenderRoads(arr) {
    const docFragmentRoadSymbol = document.createDocumentFragment();
    elGameList.innerHTML = '';
    arr.forEach((item) => {
        const clone = elRoadTemp.cloneNode(true);
        let elCloneRoadImage = clone.querySelector(".js-result-image");
        elCloneRoadImage.src = item.symbol_img;
        elCloneRoadImage.dataset.id = item.id.toString();
        clone.querySelector(".js-roady-symbol-item").dataset.id = item.id.toString();
        docFragmentRoadSymbol.appendChild(clone);
    });
    elGameList.appendChild(docFragmentRoadSymbol);
}
const handleTrueResponse = (elQuestionBox, item) => {
    try {
        elQuestionBox === null || elQuestionBox === void 0 ? void 0 : elQuestionBox.classList.add("show-result");
        const audio = elQuestionBox === null || elQuestionBox === void 0 ? void 0 : elQuestionBox.querySelector("#gameAudio");
        (elQuestionBox === null || elQuestionBox === void 0 ? void 0 : elQuestionBox.querySelector("img")).src = "./images/checkmark.gif";
        audio.play();
        setTimeout(() => {
            item === null || item === void 0 ? void 0 : item.classList.add("hide");
        }, 2000);
    }
    catch (error) {
        console.log(error);
    }
};
const handleErrorResponse = (elQuestionBox, item) => {
    var _a;
    try {
        elQuestionBox === null || elQuestionBox === void 0 ? void 0 : elQuestionBox.classList.add("show-result");
        (elQuestionBox === null || elQuestionBox === void 0 ? void 0 : elQuestionBox.querySelector("img")).src = "./images/error.png";
        let gameAudio = elQuestionBox === null || elQuestionBox === void 0 ? void 0 : elQuestionBox.querySelector("#gameErrorAudio");
        gameAudio.play();
        (_a = item.classList) === null || _a === void 0 ? void 0 : _a.add("animation-error-response");
        setTimeout(() => {
            elQuestionBox === null || elQuestionBox === void 0 ? void 0 : elQuestionBox.classList.remove("show-result");
        }, 1000);
    }
    catch (error) {
        console.log(error);
    }
};
function handleToCheckAnswer(id, type) {
    let roadsItem = elGameList.querySelectorAll(".js-roady-symbol-item");
    roadsItem.forEach((roadItem) => {
        const dataId = roadItem.dataset.id;
        if (dataId == id) {
            const elQuestionBox = roadItem.querySelector(".js-question-result");
            let elLi = roadItem;
            if (type) {
                handleTrueResponse(elQuestionBox, elLi);
            }
            else {
                handleErrorResponse(elQuestionBox, elLi);
            }
        }
    });
}
const handleRoadClick = (evt) => {
    const elTarget = evt.target;
    const id = elTarget.dataset.id;
    if (userError <= maxError) {
        if (Number(id) || +(id ? id : NaN) == 0) {
            const defRoadySymb = roads.find((road) => road.id == Number(id));
            const resRoadySymb = roads.find((road) => road.symbol_title == elQuestionText.textContent);
            if ((defRoadySymb === null || defRoadySymb === void 0 ? void 0 : defRoadySymb.id) == (resRoadySymb === null || resRoadySymb === void 0 ? void 0 : resRoadySymb.id)) {
                score += 1;
                handleToCheckAnswer(id, true);
                idx++;
                handleCreateQuestion();
            }
            else {
                handleToCheckAnswer(id, false);
                userError += 1;
            }
        }
        elScoreInfo.textContent = "Score: " + score;
    }
    else {
        handleGameEndFn(true);
    }
};
function handleGameEndFn(type) {
    if (type) {
        elLastTitle.textContent = "GAME OVER !";
        elLastScoreCount.textContent = `Score = ${score}`;
        elLastErrorCount.textContent = `Error = ${userError}`;
        elLastSection.classList.add("js-ower");
        handleResRequest(score, userError);
    }
    else {
        elLastSection.classList.add("js-win");
    }
    handleResRequest(score, userError);
    handleShowSection(elLastSection, elGameSection);
}
elGameList.addEventListener("click", handleRoadClick);
const handleReStartGame = () => {
    removeItem("avtotest-settings");
    window.location.reload();
};
elRestartBtn.addEventListener("click", handleReStartGame);
async function handleResRequest(score, userError) {
    let gameRes = {
        type: gameSettings.degree,
        count: userError,
        date: new Date().toLocaleDateString()
    };
    if (userError >= maxError) {
        await request(`/users/${user.userId}/los`, "POST", gameRes);
    }
    else {
        gameRes.count = score;
        await request(`/users/${user.userId}/win`, "POST", gameRes);
    }
}
handleToCheckToken();
handleToCheckGameSettings();
request(`/users/${user.userId}/los`, "POST", { type: "easy", count: 20, date: "2023" }).then(response => console.log(response));
