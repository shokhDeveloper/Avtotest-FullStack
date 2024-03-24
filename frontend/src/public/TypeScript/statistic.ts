const elUserTemp = (
  document.querySelector(".js-user-temp") as HTMLTemplateElement
).content;
const elTableBody = document.querySelector(
  ".js-table-body"
) as HTMLTableElement;
const elSearchInput = document.querySelector(
  ".js-search-input"
) as HTMLInputElement;
const myUser: User = JSON.parse(getItem("avtotest-user")!);
let users: UserFilter[] = [];
const handleRenderUser = (arr: UserFilter[]): void => {
  console.log(arr);
  const docFragmentUser = new DocumentFragment();
  elTableBody.innerHTML = "";
  arr.forEach((user: UserFilter, index: number) => {
    const clone = elUserTemp.cloneNode(true) as DocumentFragment;
    (clone.querySelector(".js-user-name") as HTMLElement).innerHTML =
      user.userId == myUser.userId ? `<mark>${user.name}</mark>` : user.name;
    (clone.querySelector(".js-user-number") as HTMLElement).textContent = (
      index + 1
    ).toString();
    (clone.querySelector(".js-user-win") as HTMLElement).textContent =
      user.score.toString();
    (clone.querySelector(".js-user-los") as HTMLElement).textContent =
      user.error.toString();
    (clone.querySelector(".js-user-gameCount") as HTMLElement).textContent =
      user.gameCount.toString();
    docFragmentUser.append(clone);
  });
  elTableBody.appendChild(docFragmentUser);
};
const handleScoreCount = (
  user: MainGenericsType<GameSettingsServer>,
  type: boolean
): number => {
  let count = 0;
  if (user) {
    const { win, los } = user;
    let key = type ? win : los;
    let keys: string[] = Object.keys(key);
    for (const userKey of keys) {
      if (key[userKey]) {
        count += key[userKey][type ? "score" : "userError"];
      }
    }
  }
  return count;
};
const handleFilterUser = (arr: User[]): UserFilter[] => {
  let user = arr.map(({ name, gameSettings, userId }: User) => {
    return {
      name,
      gameCount: gameSettings?.gameCount,
      userId,
      score: handleScoreCount(gameSettings, true),
      error: handleScoreCount(gameSettings, false),
    };
  });
  users = user as UserFilter[];
  return (user as UserFilter[]).sort(
    (a: UserFilter, b: UserFilter) => b.score - a.score
  );
};
const handleGetUsers = async (): Promise<any> => {
  const res: User[] = (await request("/users", "GET")) as User[];
  if (res.length) {
    handleRenderUser(handleFilterUser(res));
  }
};
const handleKey = (evt: KeyboardEvent): void => {
  let elTarget = evt.target as HTMLInputElement;
  let regex = new RegExp(elTarget.value, "gi");
  if (elTarget.value.length) {
    let filterUsers = users.filter((user: UserFilter) =>
      user.name.match(regex)
    );
    if (filterUsers.length) {
      handleRenderUser(filterUsers);
    } else {
      handleRenderUser(users);
    }
  } else {
    handleRenderUser(users);
  }
};
elSearchInput.addEventListener("keyup", handleKey);
handleGetUsers();
