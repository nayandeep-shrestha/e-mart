import HttpException from "../models/http-exception.model"

export const emailValidation = (email: string) => {
    if (!(email).toLowerCase().match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {

        return false
    }
    return true
}
export const passwordValidation = (password: string) => {
    if (!(password)
        .match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
        return false
    }
    return true
}
