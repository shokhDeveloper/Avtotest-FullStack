import { readFile, userType } from "../lib/readFile.js";

const handleToCheckKeys = (keys, user) => {
  let userKeys = Object.keys(user);
  let res = [];
  for (let i = 0; i < userKeys.length; i++) {
    if (keys[i] == userKeys[i] && user[userKeys[i]]) {
      res = [...res, userKeys[i]];
    }
  }
  return keys.length == res.length;
};

const handleReplaceEmailToGmail = (email) => {
  return email.replace("@email", "@gmail");
};

export const authController = {
  POST: {
    REGISTER: async (req, res) => {
      const users = await readFile("users", true);
      const reqBody = await req.body;
      let userKeys = Object.keys(userType);
      let type = handleToCheckKeys(userKeys, reqBody);
      try {
        if (!users.length) {
          if (type) {
            return res.register(reqBody, users);
          } else {
            return res.setJson(400, {
              message: "User data is invalid",
              userData: reqBody,
              statusCode: 400,
            });
          }
        } else {
          if (type) {
            let usersValues = users
              .map((item) =>
                Object.values(item.user).filter((item) => item.toString().includes("@"))
              )
              .flat();
            let toCheckUser = usersValues.includes(reqBody.email);
            let toCheckUserGmail = usersValues.some(
              (email) =>
                handleReplaceEmailToGmail(email) ===
                handleReplaceEmailToGmail(reqBody.email)
            );
            if (toCheckUser || toCheckUserGmail)
              return res.setJson(400, {
                message: "Cannot user has been created !",
                statusCode: 400,
                reqBody,
              });
            if (!toCheckUser) return res.register(reqBody, users);
          } else {
            res.setJson(400, {message: `Invalid keys ${Object.keys(reqBody).join(", ")}, Server keys should be exactly that ${Object.keys(userType).join(", ")} `, statusCode: 400})
        }
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    LOGIN: async (req, res) => {
      const users = await readFile("users", true);
      const reqBody = await req.body;
      let reqBodyKeys = Object.keys(reqBody);
      if (reqBodyKeys.includes("email") && reqBodyKeys.includes("password")) {
        const type = users.some(
          (item) =>
            item.user.email == reqBody.email ||
            handleReplaceEmailToGmail(item.user.email) ==
              handleReplaceEmailToGmail(reqBody.email)
        );
        if (type) {
          const { accessToken, user, user: { password } } = users.find( (item) => item.user.email == reqBody.email ||
                handleReplaceEmailToGmail(item.user.email) ==
                handleReplaceEmailToGmail(reqBody.email)
          );
          if (password == reqBody.password) {
            return res.setJson(200, {
              message: "User successfull login",
              accessToken,
              user,
              statusCode: 200,
            });
          } else {
            return res.setJson(400, {
              message: "User password its invalid",
              user: reqBody,
              statusCode: 400,
            });
          }
        } else {
          return res.setJson(404, {
            message: "User not found",
            statusCode: 404,
          });
        }
      } else {
        res.setJson(400, {
          message: "Password and email required",
          statusCode: 400,
        });
      }
    },
  },
  DELETE: async (req, res) => {
    const users = Array.from(await readFile("users", true)).map(({user}) => user);
    let params = req.params;
    if(Object.keys(params).length){
      const delUserIndex = users.findIndex((user) => user.userId == params.userId);
      if(delUserIndex >= 0 || delUserIndex == 0){
        let delUser = users.splice(delUserIndex, 1)
        res.addToDatabase("users", users);
        res.setJson(200, {message: "User deleted successfull", user: delUser, statusCode: 200})
      }else{
        res.setJson(404, {message: "User not found", statusCode: 404})
      }
    }else{
      res.setJson(404, {message: "User not found", statusCode: 404})
    }
}
};

