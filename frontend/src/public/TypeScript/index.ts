const token = getItem("avtotest-token");
const handleToCheckToken = () => {
    if(!token){
        window.location.replace("/register")
    }
}
handleToCheckToken()