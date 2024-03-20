import os from "node:os";
const networkInterface = os.networkInterfaces();
export const PORT = process.env.PORT || 2000;
export let IP_ADRESS = '';

try{
    if(networkInterface["Беспроводная сеть 3"]){
        IP_ADRESS += networkInterface["Беспроводная сеть 3"].find(network => network.family == "IPv4").address
    }
}catch(error){
    console.log(error.message)
}
export const host = `http://${IP_ADRESS}:${PORT}`;