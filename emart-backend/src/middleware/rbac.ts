import { Request, Response, NextFunction } from "express"
import HttpException from "../models/http-exception.model";

export const allow = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const lowerCaseRoles = roles.map(role => role.toLowerCase());
        let role = req.role;
        if (lowerCaseRoles.includes(role.toLowerCase())) {
            next();
        } else {
            next(new HttpException(401, "Unauthorized"));
        }
    }
}

export const restrict = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const lowerCaseRoles = roles.map(role => role.toLowerCase());
        let role = req.role;
        if (lowerCaseRoles.includes(role)) {
            next(new HttpException(401, "Unauthorized"));
        } else {
            next();
        }
    }
}
