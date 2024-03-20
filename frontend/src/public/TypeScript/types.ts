type genericsType<T> = T | null;

interface User {
    name: string,
    firstName: string,
    email: string,
    gender: string, 
    password: string
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