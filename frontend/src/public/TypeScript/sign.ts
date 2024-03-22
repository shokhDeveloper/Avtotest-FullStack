const elForm = document.querySelector(".js-form") as HTMLFormElement;
const elInputs = document.querySelectorAll(".form-input") as NodeList;
const handleInputChange = (evt: Event): void => {
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
elInputs.forEach((elInput) => {
  elInput.addEventListener("blur", handleInputChange);
  elInput.addEventListener("keyup", handleInputChange);
});
const handleSub = async (evt: SubmitEvent): Promise<void> => {
  evt.preventDefault();
  let formData = new FormData(evt.target as HTMLFormElement);
  const user: User = {
    name: formData.get("name") as string,
    firstName: formData.get("firstName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    gender: formData.get("gender") as string
  };
  let values: string[] = Object.values(user);
  let type = values.every((val: string | null) => val !== null || val !== undefined);
  if (type) {
    let req = (await request("/register", "POST", user)) as ServerResponse;
    if (req.statusCode == 201 && req.user.accessToken) {
      setItem("avtotest-token", req.user.accessToken);
      setItem("avtotest-user", req.user.user);
      window.location.replace("/");
    }
  }
};
elForm.addEventListener("submit", handleSub);
handleToCheckTokenUser()