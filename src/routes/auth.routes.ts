import { Application } from "express";
import {
    getCustomToken,
    getIDTokens,
    reAuthenticate,
    signup
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middleware/auth/isAuthenticated";
import { isAuthorized } from "../middleware/auth/isAuthorized";

export function authRoutesConfig(app: Application) {

    /**
     * Auth - Create Custom Token
    **/
    app.post('/custom_token', [
        getCustomToken
    ]);

    /**
     * Auth - Get Signin Token for Custom Token
    **/
    app.post('/signin_id', [
        getIDTokens
    ]);

    /**
     * reAuthenticate
    **/
    app.post('/reAuthenticate', [
        reAuthenticate
    ]);

    /**
     * reAuthenticate
    **/
    app.post('/signup', [
        signup
    ]);

}