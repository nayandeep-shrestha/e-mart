"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordValidation = exports.emailValidation = void 0;
const emailValidation = (email) => {
    if (!(email).toLowerCase().match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        return false;
    }
    return true;
};
exports.emailValidation = emailValidation;
const passwordValidation = (password) => {
    if (!(password)
        .match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
        return false;
    }
    return true;
};
exports.passwordValidation = passwordValidation;
