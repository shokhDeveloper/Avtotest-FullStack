"use strict";
const elUserTemp = document.querySelector(".js-user-temp").content;
const elTableBody = document.querySelector(".js-table-body");
const elSearchInput = document.querySelector(".js-search-input");
const myUser = JSON.parse(getItem("avtotest-user"));
let users = [];
const handleRenderUser = (arr) => {
    console.log(arr);
    const docFragmentUser = new DocumentFragment();
    elTableBody.innerHTML = "";
    arr.forEach((user, index) => {
        const clone = elUserTemp.cloneNode(true);
        clone.querySelector(".js-user-name").innerHTML =
            user.userId == myUser.userId ? `<mark>${user.name}</mark>` : user.name;
        clone.querySelector(".js-user-number").textContent = (index + 1).toString();
        clone.querySelector(".js-user-win").textContent =
            user.score.toString();
        clone.querySelector(".js-user-los").textContent =
            user.error.toString();
        clone.querySelector(".js-user-gameCount").textContent =
            user.gameCount.toString();
        docFragmentUser.append(clone);
    });
    elTableBody.appendChild(docFragmentUser);
};
const handleScoreCount = (user, type) => {
    let count = 0;
    if (user) {
        const { win, los } = user;
        let key = type ? win : los;
        let keys = Object.keys(key);
        for (const userKey of keys) {
            if (key[userKey]) {
                count += key[userKey][type ? "score" : "userError"];
            }
        }
    }
    return count;
};
const handleFilterUser = (arr) => {
    let user = arr.map(({ name, gameSettings, userId }) => {
        return {
            name,
            gameCount: gameSettings === null || gameSettings === void 0 ? void 0 : gameSettings.gameCount,
            userId,
            score: handleScoreCount(gameSettings, true),
            error: handleScoreCount(gameSettings, false),
        };
    });
    users = user;
    return user.sort((a, b) => b.score - a.score);
};
const handleGetUsers = async () => {
    const res = (await request("/users", "GET"));
    if (res.length) {
        handleRenderUser(handleFilterUser(res));
    }
};
const handleKey = (evt) => {
    let elTarget = evt.target;
    let regex = new RegExp(elTarget.value, "gi");
    if (elTarget.value.length) {
        let filterUsers = users.filter((user) => user.name.match(regex));
        if (filterUsers.length) {
            handleRenderUser(filterUsers);
        }
        else {
            handleRenderUser(users);
        }
    }
    else {
        handleRenderUser(users);
    }
};
elSearchInput.addEventListener("keyup", handleKey);
handleGetUsers();
