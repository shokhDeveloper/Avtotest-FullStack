import { readFile } from "../lib/readFile.js";

export const userController = {
  GET: async (req, res) => {
    const users = Array.from(await readFile("users", true)).map(
      ({ user }) => user
    );
    const searchParams = req.searchParams;
    if (!!searchParams && typeof searchParams == "object") {
      const store = [];
      for (const user of users) {
        let counter = 0;
        for (let key in searchParams) {
          if (searchParams[key] == user[key]) counter++;
        }
        if (Object.keys(searchParams).length == counter) store.push(user);
      }
      if (store.length) {
        res.setJson(200, store);
      } else {
        res.setJson(400, {
          message: "Users or user Not found, search params invalid !",
          statusCode: 400,
          search: searchParams,
        });
      }
    } else {
      res.setJson(200, users);
    }
  },
  POST: async (req, res) => {
    try{
        const users = await readFile("users", true);
        const gameData = await req.body;
        const params = req.params;
        let idx = users.findIndex((user) => user.user.userId == params.userId);
        let user = users[idx].user;
        if (params.gameType == "los") {
          user.gameSettings = {
            ...user.gameSettings,
            gameCount: (user.gameSettings.gameCount += 1),
            los: {
              ...user.gameSettings.los,
              [gameData.type]: {
                userError: user.gameSettings.los[gameData.type].userError || user.gameSettings.los[gameData.type].userError == 0 ? user.gameSettings.los[gameData.type].userError  += gameData.userError: gameData.userError,
              score: user.gameSettings.los[gameData.type].score || user.gameSettings.los[gameData.type].score == 0 ? user.gameSettings.los[gameData.type].score  += gameData.score: gameData.score, 
              dateLose: user.gameSettings.los[gameData.type].dateLose || user.gameSettings.los[gameData.type].dateLose == 0 ? user.gameSettings.los[gameData.type].dateLose  += gameData.dateLose: user.gameSettings.los[gameData.type].dateLose,
              date: gameData.date + " Update Game."
              },  
            },
          };
          res.addToDatabase("users", users);
          console.log(JSON.stringify(user, null, 4), gameData)
          res.setJson(200, { message: "Success created game data", user: gameData, statusCode: 200 })

        }else if (params.gameType == "win") {
          user.gameSettings = {
            ...user.gameSettings,
            gameCount: (user.gameSettings.gameCount += 1),
            win: {
              ...user.gameSettings.win,
              [gameData.type]: {
                userError: user.gameSettings.win[gameData.type].userError || user.gameSettings.win[gameData.type].userError == 0 ? user.gameSettings.win[gameData.type].userError  += gameData.userError: gameData.userError,
              score: user.gameSettings.win[gameData.type].score || user.gameSettings.win[gameData.type].score == 0 ? user.gameSettings.win[gameData.type].score  += gameData.score: gameData.score, 
              dateLose: user.gameSettings.win[gameData.type].dateLose || user.gameSettings.win[gameData.type].dateLose == 0 ? user.gameSettings.win[gameData.type].dateLose  += gameData.dateLose: user.gameSettings.win[gameData.type].dateLose,
              date: gameData.date + " Update Game."
              },
            },
          };
          res.addToDatabase("users", users);
          res.setJson(200, { message: "Success created game data", user: gameData, statusCode: 200 });
        }else {
            res.setJson(400, {message: "It is possible to send a request to the server only with win and los as additional parameters"})
        }
    }catch(error){
        console.log(error)
    }
  },
};
