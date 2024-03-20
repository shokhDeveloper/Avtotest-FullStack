import {v4} from "uuid";
let arr = Array.from({length: 10}, (_, index) => index + 1)
const RandomValues = () => {
    let str = '';
    for(let i = 0,  j = arr.length; i<arr.length; i++, j--)[
        str += Math.ceil(Math.random() * ((i + j) + (j - i)) )
    ]
    return str + Date.now()
}
export const createToken = () => {
    let randomNumbers = RandomValues();
    return v4() + randomNumbers
}