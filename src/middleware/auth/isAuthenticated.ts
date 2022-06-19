import { Request, Response } from "express";
import * as admin from 'firebase-admin'

export async function isAuthenticated(req: Request, res: Response, next: Function) {

    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).send({
            message: 'unauthorized: no auth in header'
        });
    }

    if (!authorization.startsWith('Bearer')) {
        return res.status(401).send({
            message: 'unauthorized: no bearer token in header'
        });
    }

    const split = authorization.split('Bearer ')
    if (split.length !== 2) {
        return res.status(401).send({
            message: 'Unauthorized: Bearer token length too short'
        });
    }

    const token = split[1]
    try {

        const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(token);
        res.locals = {

            ...res.locals,
            uid: decodedToken.uid,
            role: decodedToken.role,
            email: decodedToken.email

        }

        return next();

    }
    catch (err) {

        if (err instanceof Error) {
            return res.status(401).send({
                message: `unauthorized: ${err.message}`
            });
        }

    }
}