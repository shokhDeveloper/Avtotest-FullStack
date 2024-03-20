"use strict";
const elForm = document.querySelector(".js-form");
const elInputs = document.querySelectorAll(".form-input");
const handleInputChange = (evt) => {
    var _a, _b, _c, _d;
    const elTarget = evt.target;
    if (elTarget.value.length) {
        (_b = (_a = elTarget.parentNode) === null || _a === void 0 ? void 0 : _a.querySelector(`.${elTarget.id}__label`)) === null || _b === void 0 ? void 0 : _b.classList.add("active__label");
    }
    else {
        (_d = (_c = elTarget.parentNode) === null || _c === void 0 ? void 0 : _c.querySelector(`.${elTarget.id}__label`)) === null || _d === void 0 ? void 0 : _d.classList.remove("active__label");
    }
};
elInputs.forEach((elInput) => {
    elInput.addEventListener("blur", handleInputChange);
    elInput.addEventListener("keyup", handleInputChange);
});
const handleSub = async (evt) => {
    evt.preventDefault();
    let formData = new FormData(evt.target);
    const user = {
        name: formData.get("name"),
        firstName: formData.get("firstName"),
        email: formData.get("email"),
        password: formData.get("password"),
        gender: formData.get("gender")
    };
    let values = Object.values(user);
    let type = values.every((val) => val !== null || val !== undefined);
    if (type) {
        let req = (await request("/register", "POST", user));
        if (req.statusCode == 201 && req.user.accessToken) {
            setItem("avtotest-token", req.user.accessToken);
            setItem("avtotest-user", req.user.user);
            window.location.replace("/");
        }
    }
};
elForm.addEventListener("submit", handleSub);
