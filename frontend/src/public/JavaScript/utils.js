"use strict";
const getItem = (key) => window.localStorage.getItem(key);
const setItem = (key, value) => window.localStorage.setItem(key, typeof value == "object" ? JSON.stringify(value) : value);
