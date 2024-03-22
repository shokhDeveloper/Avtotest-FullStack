"use strict";
const getItem = (key) => window.localStorage.getItem(key);
const setItem = (key, value) => window.localStorage.setItem(key, typeof value == "object" ? JSON.stringify(value) : value);
const removeItem = (key) => window.localStorage.removeItem(key);
const clear = () => window.localStorage.clear();
let userToken = getItem("avtotest-token");
const handleToCheckTokenUser = () => {
    if (userToken) {
        window.location.replace("/");
    }
};
