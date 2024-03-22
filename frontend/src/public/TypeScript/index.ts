const elStartBtns = document.querySelectorAll(".js-start-btn") as NodeList;
const elStartSection = document.querySelector(".js-start-section") as HTMLElement;
const elSettingsSection = document.querySelector(".js-settings-section") as HTMLElement;
const elErrorBox = document.querySelector(".js-start-error") as HTMLDivElement;
const elSettingsForm = document.querySelector(".js-settings-form") as HTMLFormElement;
const elGameSection = document.querySelector(".js-game-section") as HTMLDivElement;
const elRoadTemp = (document.querySelector(".js-roady-symb-temp") as HTMLTemplateElement).content;
const elGameList = document.querySelector(".js-game-list") as HTMLUListElement;
const elQuestionText = document.querySelector(".js-question-info") as HTMLParagraphElement;
const elScoreInfo = document.querySelector(".js-score-info") as HTMLHeadElement;
const elLastSection = document.querySelector(".js-last-section") as HTMLElement;
const elLastScoreCount = document.querySelector(".js-last-score-count") as HTMLSpanElement;
const elLastErrorCount = document.querySelector(".js-last-error-count") as HTMLSpanElement;
const elLastTitle = document.querySelector(".js-last-title") as HTMLHeadingElement;
const elRestartBtn = document.querySelector(".js-restart-btn") as HTMLButtonElement;
const user:User = getItem("avtotest-user") ? JSON.parse(getItem("avtotest-user")!): null;
const token = getItem("avtotest-token");
const gameSettingsMenejement:GameSettingsMenejement = {
    start: "START_GAME",
    settings: "SETTINGS_GAME",
    game: "GAME",
    win: "GAME_WIN",
    over: "GAME_OVER"
}
const gameMenejementObject:GameMenejement = {
    easy: {
        type: "easy",
        length: 21
    },
    normal: {
        type: "normal",
        length: 42
    },
    hard: {
        type: "hard",
        length: 62
    }
}
let gameSettings:GameSettings = getItem("avtotest-settings") ? JSON.parse(getItem("avtotest-settings")!): null;
let gameTypeLength = getItem("avtotest-settings") ? gameMenejementObject[JSON.parse(getItem("avtotest-settings")!).degree].length: null;
let randomNumArr:number[] = []
let roads:ServerResponse | undefined | Roads[];
let res: Roads[];
let score:number = 0;
let maxError:number = 5;
let userError: number = 0;
elScoreInfo.textContent = "Score: " + score;
const handleToCheckToken = () => {
    if(!token){
        window.location.replace("/register")
    }
}
const handleShowSection = (showSecton:HTMLElement, hideSection:HTMLElement):void => {
    hideSection.classList.add("remove-section");
    showSecton.classList.remove("remove-section")
}
const handleDisabledBtns = (type: boolean):void => {
    elStartBtns.forEach(btn => {
        (btn as HTMLButtonElement).disabled = type
    })
    setTimeout(() => {
        handleDisabledBtns(!type)
    }, 2000);
}
const handleSettingsBtnDisabled = (type:boolean):void => {
    (elSettingsSection.querySelector("button") as HTMLButtonElement).disabled = type;
    if(type){
        setTimeout(() => {
            handleSettingsBtnDisabled(false)
        }, 2000);
    }
}
const handleOpenError = (text: string, typeSection?:string): void => {
    elErrorBox.classList.add("start__error--animation");
    (elErrorBox.querySelector(".js-error-discription") as HTMLParagraphElement).textContent = text;
    if(typeSection == gameSettingsMenejement.settings){
        handleSettingsBtnDisabled(true);
    }
    if(typeSection == gameSettingsMenejement.start){
        handleDisabledBtns(true)
    }
    setTimeout(() => {
        elErrorBox.classList.remove("start__error--animation")
    }, 2000);
}
const handleStartBtnClick = (evt:Event) => {
    if((evt.target as HTMLButtonElement).matches(".start__btn-main")){
        handleShowSection(elSettingsSection, elStartSection)
    }else{
        handleOpenError("Bunday hususiyat dasturga hali qo'shilmagan !", gameSettingsMenejement.start)
    }
}
elStartBtns.forEach(btn => {
    btn.addEventListener("click", handleStartBtnClick)
})

const handleSettingsSubmit = (evt:SubmitEvent):void => {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);
    let settings:GameSettings = {
        degree: formData.get("type") as string,
        date: formData.get("date") as string
    }
    let type: boolean = Object.values(settings).every((val:string) => val.length );
    if(type){
        setItem("avtotest-settings", settings);
        gameSettings =getItem("avtotest-settings") ? JSON.parse(getItem("avtotest-settings")!): null;
        gameTypeLength = getItem("avtotest-settings") ? gameMenejementObject[JSON.parse(getItem("avtotest-settings")!).degree].length: null;
        handleToCheckGameSettings()
        handleShowSection(elGameSection, elSettingsSection)
        handleStartGameSettings();
        
    }else{
        handleOpenError("Vaqt va O'yin darajasini tanlamasdan o'yinni boshlay olmaysiz", gameSettingsMenejement.settings)
    }
}
elSettingsForm.addEventListener("submit", handleSettingsSubmit)

function handleToCheckGameSettings () {
    if(gameSettings && Object.keys(gameSettings).length){
        handleShowSection(elGameSection, elSettingsSection)
        handleShowSection( elGameSection,elStartSection)
        handleStartGameSettings()
    }
}

async function handleStartGameSettings () {
 roads = await request("/roads", "GET") as Roads[]
 if(roads){
     handleGetRandomNumbers(roads)   
 }
}
function handleRandomNumner() {
    let randomNumber;
    for(let i = 0; i<gameTypeLength; i++){
        randomNumber = Math.floor(Math.random() * gameTypeLength)
    }
    return randomNumber;
}
function handleGetRandomNumbers(arr: Roads[]){
    const randoNumber: number | undefined = handleRandomNumner();
    if(randomNumArr.length < gameTypeLength){
        if ((randoNumber || randoNumber == 0) && !randomNumArr.includes(randoNumber)){
            randomNumArr.push(randoNumber)
        }
        handleGetRandomNumbers(arr)
    }else{
        handleCreateObj(randomNumArr, arr)
    }
}
let idx = 0;
const handleCreateQuestion = ():void => {
    if(randomNumArr[idx] == 0 || randomNumArr[idx]){
        console.log(res[randomNumArr[idx]], idx, randomNumArr)
        elQuestionText.textContent = res[randomNumArr[idx]].symbol_title;
    }else{
        handleGameEndFn(false)
    }
}

function handleCreateObj(arr: number[], roads:Roads[]):void {
    res = []
    for(let i = 0; i<arr.length; i++){
        if(roads[arr[i]].id == arr[i]){
            res.push(roads[arr[i]])
        }   
    }
    handleRenderRoads(res)
    handleCreateQuestion()
}

function handleRenderRoads(arr:Roads[]):void{
    const docFragmentRoadSymbol = document.createDocumentFragment();
    elGameList.innerHTML = '';
    arr.forEach((item) => {
      const clone = elRoadTemp.cloneNode(true) as DocumentFragment;
      let elCloneRoadImage = clone.querySelector(".js-result-image") as HTMLImageElement;
      elCloneRoadImage.src = item.symbol_img;
      elCloneRoadImage.dataset.id = item.id.toString();
      (clone.querySelector(".js-roady-symbol-item") as HTMLElement).dataset.id = item.id.toString();
  
      docFragmentRoadSymbol.appendChild(clone);
    });
    elGameList.appendChild(docFragmentRoadSymbol);
}

const handleTrueResponse = (elQuestionBox: genericsType<Element>, item:HTMLLIElement ):void => {
    try{
        elQuestionBox?.classList.add("show-result")
        const audio = elQuestionBox?.querySelector("#gameAudio") as HTMLAudioElement;
        (elQuestionBox?.querySelector("img") as HTMLImageElement).src = "./images/checkmark.gif";
        audio.play()
        setTimeout(() =>  {
            item?.classList.add("hide")
        }, 2000)
    }catch(error){
        console.log(error)
    }
}

const handleErrorResponse = (elQuestionBox: genericsType<Element>, item:HTMLLIElement):void => {
    try{
        elQuestionBox?.classList.add("show-result");
        (elQuestionBox?.querySelector("img") as HTMLImageElement).src = "./images/error.png";
        let gameAudio = elQuestionBox?.querySelector("#gameErrorAudio") as HTMLAudioElement
        gameAudio.play()
        item.classList?.add("animation-error-response");
        setTimeout(() => {
          elQuestionBox?.classList.remove("show-result");
        }, 1000);
    }catch(error){
        console.log(error)
    }
  };
function handleToCheckAnswer (id:MainGenericsType<string>, type: boolean):void {
    let roadsItem = elGameList.querySelectorAll(".js-roady-symbol-item") as NodeList;
    roadsItem.forEach((roadItem) => {
        const dataId:MainGenericsType<string> = (roadItem as HTMLLIElement).dataset.id;
        if(dataId == id){
            const elQuestionBox = (roadItem as HTMLLIElement).querySelector(".js-question-result")
            let elLi = roadItem as HTMLLIElement
            if(type){
                handleTrueResponse(elQuestionBox, elLi)
            }else{
                handleErrorResponse(elQuestionBox, elLi)
            }
        }
    })
}
const handleRoadClick = (evt:Event):void => {
    const elTarget = evt.target as HTMLLIElement;
    const id:MainGenericsType<string> = elTarget.dataset.id
    if(userError <= maxError){
        if(Number(id) || +(id ? id: NaN) == 0){
            const defRoadySymb:MainGenericsType<Roads> = (roads as Roads[]).find((road: Roads) => road.id == Number(id))
            const resRoadySymb:MainGenericsType<Roads> = (roads as Roads[]).find((road: Roads) => road.symbol_title == elQuestionText.textContent)
            if(defRoadySymb?.id == resRoadySymb?.id){
                score += 1
                handleToCheckAnswer(id, true)
                idx ++ 
                handleCreateQuestion();
            }else{
                handleToCheckAnswer(id, false);
                userError += 1;
            }
        }
        elScoreInfo.textContent = "Score: " + score
    }else{
        handleGameEndFn(true)
    }
}
function handleGameEndFn(type:boolean):void{
    if(type){
        elLastTitle.textContent = "GAME OVER !";
        elLastScoreCount.textContent = `Score = ${score}`;
        elLastErrorCount.textContent = `Error = ${userError}`;
        elLastSection.classList.add("js-ower")
        handleResRequest(score, userError)
    }else{
        elLastSection.classList.add("js-win")
    }
    handleResRequest(score, userError)
    handleShowSection(elLastSection, elGameSection )
}
elGameList.addEventListener("click", handleRoadClick)
const handleReStartGame = ():void => {
    removeItem("avtotest-settings")
    window.location.reload();
}
elRestartBtn.addEventListener("click", handleReStartGame)
async function handleResRequest (score: number, userError:number):Promise<void> {
    let gameRes:GameResultInterface = {
        type: gameSettings.degree,
        count: userError,
        date: new Date().toLocaleDateString()
    }
    if(userError >= maxError){        
        await request(`/users/${user.userId}/los`, "POST", gameRes)
    }else{
        gameRes.count = score
        await request(`/users/${user.userId}/win`, "POST", gameRes)     
    }
}
handleToCheckToken()
handleToCheckGameSettings()
 request(`/users/${user.userId}/los`, "POST", {type: "easy", count: 20, date: "2023"}).then(response => console.log(response))