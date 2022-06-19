import { Request, Response, NextFunction } from "express";
import axios, { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';

import * as admin from "firebase-admin";
import * as ENVIRONMENT_VARIABLES from '../config/env.config';
import * as GLOBAL_VARIABLES from '../config/global_variables.config';
import * as INGRESS_VALIDATOR from '../middleware/validators/ingress.validators';

import { requestValidator } from '../middleware/validators/request.validator';
import { signupSchema } from '../middleware/schema/signup.schema';
import { signupModel } from '../middleware/interfaces/signup.interface';


export async function getCustomToken(req: Request, res: Response, next: NextFunction) {

    try {

        const { uid } = req.body;

        if (!uid) return res.status(400).send({
            message: "missing uid"
        });

        if (!INGRESS_VALIDATOR.IsValidString(uid)) return res.status(400).send({
            message: "invalid uid field, uid must be a string"
        });

        admin.auth().createCustomToken(uid).then((customToken) => {

            return res.status(201).send({
                custom_token: customToken
            });

        }).catch((error) => {

            return res.status(400).send({
                message: error
            });
        });

    } catch (err) {
        return handleError(res, err);
    }

    return;

}

export async function getIDTokens(req: Request, res: Response, next: NextFunction) {

    try {

        const { token } = req.body;
        const uri: string = ENVIRONMENT_VARIABLES.IDENTITY_TOOLKIT_BASE_URL + ENVIRONMENT_VARIABLES.CUSTOM_TOKEN_KEYHOLDER + ENVIRONMENT_VARIABLES.API_KEY_VALUE;

        if (!token) return res.status(400).send({
            message: "missing token"
        });

        if (!INGRESS_VALIDATOR.IsValidString(token)) return res.status(400).send({
            message: "invalid token field, token must be of type string"
        });

        await axios.post(uri, {

            token: token,
            returnSecureToken: true

        }).then((signInResponse) => {
            return res.status(201).send(signInResponse.data);
        }).catch((error) => {

            const err = error as AxiosError;
            return res.status(400).send({
                message: err
            });

        });

    } catch (err) {
        return handleError(res, err);
    }

    return;

}

export async function reAuthenticate(req: Request, res: Response, next: NextFunction) {

    try {

        const { refresh_token } = req.body;
        const uri: string = ENVIRONMENT_VARIABLES.SECURE_API_BASE_URL + ENVIRONMENT_VARIABLES.SECURE_API_KEYHOLDER + ENVIRONMENT_VARIABLES.API_KEY_VALUE;

        if (!refresh_token) return res.status(400).send({
            message: "missing refresh_token field"
        });

        if (!INGRESS_VALIDATOR.IsValidString(refresh_token)) return res.status(400).send({
            message: "invalid refresh_token field, refresh_token must be a string"
        });

        await axios.post(uri, {

            grant_type: "refresh_token",
            refresh_token: refresh_token

        }).then((reAuthResponse) => {
            return res.status(201).send(reAuthResponse.data);
        }).catch((error) => {
            const err = error as AxiosError;
            return res.status(400).send({
                message: err
            });
        });

    } catch (err) {
        const error = err as AxiosError;
        res.status(400).send({
            message: error
        });
    }

    return;

}

export async function signup(req: Request, res: Response, next: NextFunction) {

    try {

        const signupData: signupModel = req.body;
        const userID = uuidv4();
        const uri: string = ENVIRONMENT_VARIABLES.IDENTITY_TOOLKIT_BASE_URL + ENVIRONMENT_VARIABLES.CUSTOM_TOKEN_KEYHOLDER + ENVIRONMENT_VARIABLES.API_KEY_VALUE;

        await requestValidator(req.body, signupSchema, res, next).then(async () => {

            if (res.headersSent) return;

            admin.auth().createCustomToken(userID).then(async (customToken) => {

                await axios.post(uri, {

                    token: customToken,
                    returnSecureToken: true

                }).then(async (signInResponse) => {

                    await GLOBAL_VARIABLES.setHouse.collection('users').doc(userID).create({

                        uid: userID,
                        name: signupData.name,
                        age: signupData.age,
                        city: signupData.city,
                        privateKey: signInResponse.data.idToken,
                        total_distance_run: 0

                    }).then(() => {

                        return res.status(201).send({
                            privateKey: signInResponse.data.idToken,
                            refreshToken: signInResponse.data.refreshToken,
                            expiresIn: signInResponse.data.expiresIn,
                            isNewUser: true,
                            uid: userID
                        });

                    }).catch((error) => {
                        return res.status(400).send({
                            message: error
                        });
                    });

                }).catch((error) => {
                    const err = error as AxiosError;
                    return res.status(400).send({
                        message: err
                    });
                });

            }).catch((error) => {
                return res.status(400).send({
                    message: error
                });
            });

        }).catch((error) => {
            return res.status(400).send({
                message: error
            });
        });

    } catch (err) {
        return handleError(res, err);
    }

}

function handleError(res: Response, err: any) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}
