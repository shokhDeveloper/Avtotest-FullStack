"use strict";
const elFormLogin = document.querySelector(".js-form");
const elInputsLogin = document.querySelectorAll(".form-input");
console.log(elFormLogin);
const handleInputLoginChange = (evt) => {
    var _a, _b, _c, _d;
    const elTarget = evt.target;
    if (elTarget.value.length) {
        (_b = (_a = elTarget.parentNode) === null || _a === void 0 ? void 0 : _a.querySelector(`.${elTarget.id}__label`)) === null || _b === void 0 ? void 0 : _b.classList.add("active__label");
    }
    else {
        (_d = (_c = elTarget.parentNode) === null || _c === void 0 ? void 0 : _c.querySelector(`.${elTarget.id}__label`)) === null || _d === void 0 ? void 0 : _d.classList.remove("active__label");
    }
};
elInputsLogin.forEach((elInput) => {
    elInput.addEventListener("blur", handleInputLoginChange);
    elInput.addEventListener("keyup", handleInputLoginChange);
});
const handleSubmit = async (evt) => {
    evt.preventDefault();
    const formData = new FormData(evt.target);
    const userLogin = {
        email: formData.get("email"),
        password: formData.get("password")
    };
    const values = Object.values(userLogin);
    const type = values.every((val) => val !== "");
    if (type) {
        const req = await request("/login", "POST", userLogin);
        if (req.statusCode == 200) {
            console.log(req);
            setItem("avtotest-token", req.accessToken ? req.accessToken : "");
            setItem("avtotest-user", req.user);
            window.location.replace("/");
        }
    }
};
elFormLogin.addEventListener("submit", handleSubmit);
handleToCheckTokenUser();
