import { Application } from "express";
import {
    update,
    mystats
} from "../controllers/users.controller";
import { isAuthenticated } from "../middleware/auth/isAuthenticated";

export function userRoutesConfig(app: Application) {

    /**
     * Update users' running distance
    **/
    app.post('/update', [
        isAuthenticated,
        update
    ]);

    /**
     * Returns users' ranking
    **/
    app.post('/mystats', [
        isAuthenticated,
        mystats
    ]);


}