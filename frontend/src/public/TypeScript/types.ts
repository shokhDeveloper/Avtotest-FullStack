type genericsType<T> = T | null;

interface User {
    name: string,
    firstName: string,
    email: string,
    gender: string, 
    password: string,
    userId?: number
}
interface ServerResponse {
    message: string,
    accessToken?: string, 
    statusCode: number,
    user: {
        accessToken: string,
        user: User
    }
}
interface UserLogin {
    email: string,
    password: string
}
interface GameSettings {
    degree: string,
    date: string
}
interface GameSettingsMenejement {
    start: string,
    settings: string,
    game: string,
    win: string,
    over: string
}
interface Game {
    type: string,
    length: number
}   
interface GameMenejement {
    [key:string]: string | any;
    easy: Game,
    normal: Game,
    hard: Game
}
interface Roads {
    id: number,
    symbol_title: string,
    symbol_img: string
}

interface GameResultInterface {
    type: string,
    count: number,
    date: number | string,
}
type ServerResponseType = ServerResponse | void | Roads[]
type MainGenericsType<T> = T | undefined