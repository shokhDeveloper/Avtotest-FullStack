const getItem = (key:string) => window.localStorage.getItem(key);
const setItem = (key: string, value: object | string) => window.localStorage.setItem(key, typeof value == "object"? JSON.stringify(value): value)
const removeItem = (key:string) => window.localStorage.removeItem(key);
const clear = () =>  window.localStorage.clear();
let userToken = getItem("avtotest-token")
const handleToCheckTokenUser = () => {
    if(userToken){
        window.location.replace("/")
    }
}