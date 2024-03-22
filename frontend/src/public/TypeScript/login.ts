const elFormLogin = document.querySelector(".js-form") as HTMLFormElement;
const elInputsLogin = document.querySelectorAll(".form-input") as NodeList;
console.log(elFormLogin)
const handleInputLoginChange = (evt: Event): void => {
  const elTarget = evt.target as HTMLInputElement;
  if (elTarget.value.length) {
    elTarget.parentNode
      ?.querySelector(`.${elTarget.id}__label`)
      ?.classList.add("active__label");
  } else {
    elTarget.parentNode
      ?.querySelector(`.${elTarget.id}__label`)
      ?.classList.remove("active__label");
  }
};
elInputsLogin.forEach((elInput) => {
  elInput.addEventListener("blur", handleInputLoginChange);
  elInput.addEventListener("keyup", handleInputLoginChange);
}); 
const handleSubmit = async (evt:SubmitEvent):Promise<void> => {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement)
    const userLogin:UserLogin = {
        email: formData.get("email") as string,
        password: formData.get("password") as string
    }
    const values: string[] = Object.values(userLogin);
    const type = values.every((val:string) => val !== "");
    if(type){
        const req = await request("/login", "POST", userLogin) as ServerResponse;
        if(req.statusCode == 200){
            console.log(req)
            setItem("avtotest-token", req.accessToken ? req.accessToken: "");
            setItem("avtotest-user", req.user)
            window.location.replace("/");
        }
    }
}
elFormLogin.addEventListener("submit", handleSubmit)
handleToCheckTokenUser()