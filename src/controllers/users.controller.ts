import { Request, Response, NextFunction } from "express";

import * as admin from "firebase-admin";
import * as INGRESS_VALIDATOR from '../middleware/validators/ingress.validators';
import * as GLOBAL_VARIABLES from '../config/global_variables.config';
import { API_BASE_URL } from '../config/env.config';

export async function update(req: Request, res: Response, next: NextFunction) {

    try {

        const {
            userID,
            distance
        } = req.body;

        if (!userID) return res.status(400).send({
            message: "missing userID field, userID field is required"
        });

        if (!distance) return res.status(400).send({
            message: "missing distance field, distance field is required"
        });

        if (!INGRESS_VALIDATOR.IsValidString(userID)) return res.status(400).send({
            message: "invalid userID field datatype, userID must be of type string"
        });

        if (!INGRESS_VALIDATOR.IsValidNumber(distance)) return res.status(400).send({
            message: "invalid distance field datatype, distance must be of type number"
        });

        await GLOBAL_VARIABLES.setHouse.collection('users').doc(userID).update({
            total_distance_run: admin.firestore.FieldValue.increment(distance)
        }).then(async () => {

            await GLOBAL_VARIABLES.setHouse.collection('users').doc(userID).get().then((userDoc) => {

                const user = userDoc.data();
                if (user) return res.status(200).send({
                    totalDistanceRun: user.total_distance_run
                });

                return res.status(400).send({
                    message: "could not retrieve user data"
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

export async function mystats(req: Request, res: Response, next: NextFunction) {

    try {

        const {
            userID,
            type
        } = req.body;

        const usersNumberArray = new Array();
        const usersDocIDArray = new Array();
        const usersDataArray = new Array();
        const usersAgeArray = new Array();

        if (!userID) return res.status(400).send({
            message: "missing userID field, userID field is required"
        });

        if (!type) return res.status(400).send({
            message: "missing type field, type field is required"
        });

        if (!INGRESS_VALIDATOR.IsValidString(userID)) return res.status(400).send({
            message: "invalid userID field datatype, userID must be of type string"
        });

        if (!INGRESS_VALIDATOR.IsValidString(type)) return res.status(400).send({
            message: "invalid type field datatype, type must be of type string"
        });

        if (type === "city" || type === "age" || type === "overall") {

            if (type === "city") {

                await GLOBAL_VARIABLES.setHouse.collection('users').where('uid', '==', userID).get().then(async (snapshot) => {

                    if (snapshot.empty) return res.status(400).send({
                        message: "could not retrieve any user data with userID: " + userID
                    });

                    snapshot.forEach(async (userDoc) => {

                        const userDocData = userDoc.data();
                        if (userDocData) {

                            const userRunNumber = userDocData.total_distance_run;
                            await returnUserCityFilteredData(userDocData.city).then((usersNumberArr) => {

                                usersNumberArr.sort(function (a, b) {
                                    return b - a;
                                });

                                usersNumberArr.forEach((rankPreIndex) => {

                                    if (rankPreIndex === userRunNumber) {

                                        const rank = usersNumberArr.indexOf(rankPreIndex);
                                        return res.status(200).send({
                                            ranking: rank + 1
                                        });

                                    }

                                });

                            }).catch((error) => {
                                return res.status(400).send({
                                    message: error
                                });
                            });

                            return;

                        }

                        return res.status(400).send({
                            message: "could not retrieve any user data with userID: " + userID
                        });

                    });

                });

            }

            if (type === "age") {

                await GLOBAL_VARIABLES.setHouse.collection('users').where('uid', '==', userID).get().then(async (snapshot) => {

                    if (snapshot.empty) return res.status(400).send({
                        message: "could not retrieve any user data with userID: " + userID
                    });

                    snapshot.forEach(async (userDoc) => {

                        const userDocData = userDoc.data();
                        if (userDocData) {

                            const userRunNumber = userDocData.total_distance_run;
                            await returnUserAgeFilteredData(userDocData.age).then((usersNumberArr) => {

                                usersNumberArr.sort(function (a, b) {
                                    return b - a;
                                });

                                usersNumberArr.forEach((rankPreIndex) => {

                                    if (rankPreIndex === userRunNumber) {

                                        const rank = usersNumberArr.indexOf(rankPreIndex);
                                        return res.status(200).send({
                                            ranking: rank + 1
                                        });

                                    }

                                });

                            }).catch((error) => {
                                return res.status(400).send({
                                    message: error
                                });
                            });

                            return;

                        }

                        return res.status(400).send({
                            message: "could not retrieve any user data with userID: " + userID
                        });

                    });

                });

            }

            if (type === "overall") {

                await GLOBAL_VARIABLES.setHouse.collection('users').where('uid', '==', userID).get().then(async (snapshot) => {

                    if (snapshot.empty) return res.status(400).send({
                        message: "could not retrieve any user data with userID: " + userID
                    });

                    snapshot.forEach(async (userDoc) => {

                        const userDocData = userDoc.data();
                        if (userDocData) {

                            const userRunNumber = userDocData.total_distance_run;
                            await returnUserOverallFilteredData().then((usersNumberArr) => {

                                usersNumberArr.sort(function (a, b) {
                                    return b - a;
                                });

                                usersNumberArr.forEach((rankPreIndex) => {

                                    if (rankPreIndex === userRunNumber) {

                                        const rank = usersNumberArr.indexOf(rankPreIndex);
                                        return res.status(200).send({
                                            ranking: rank + 1
                                        });

                                    }

                                });

                            }).catch((error) => {
                                return res.status(400).send({
                                    message: error
                                });
                            });

                            return;

                        }

                        return res.status(400).send({
                            message: "could not retrieve any user data with userID: " + userID
                        });

                    });

                });

            }

            async function returnUserCityFilteredData(userCity: string) {

                await GLOBAL_VARIABLES.setHouse.collection('users').where('city', '==', userCity).get().then(async (querySnapshot) => {

                    if (querySnapshot.empty) return res.status(200).send({
                        message: "no users found for city: " + userCity
                    });

                    const docs = querySnapshot.docs;
                    docs.forEach(async (doc) => {

                        const userDocData = doc.data();
                        if (userDocData) {

                            const data = ({
                                userID: doc.id,
                                userData: userDocData
                            });

                            usersNumberArray.push(userDocData.total_distance_run);
                            usersDataArray.push(data);

                        }

                    });

                    return;

                }).catch((error) => {
                    return res.status(400).send({
                        message: error
                    });
                });

                return usersNumberArray;

            }

            async function returnUserAgeFilteredData(userAge: string) {

                await GLOBAL_VARIABLES.setHouse.collection('users').where('age', '==', userAge).get().then(async (querySnapshot) => {

                    if (querySnapshot.empty) return res.status(200).send({
                        message: "no users found for age " + userAge
                    });

                    const docs = querySnapshot.docs;
                    docs.forEach(async (doc) => {

                        const userDocData = doc.data();
                        if (userDocData) {

                            const data = ({
                                userID: doc.id,
                                userData: userDocData
                            });

                            usersNumberArray.push(userDocData.total_distance_run);
                            usersDataArray.push(data);

                        }

                    });

                    return;

                }).catch((error) => {
                    return res.status(400).send({
                        message: error
                    });
                });

                return usersNumberArray;

            }

            async function returnUserOverallFilteredData() {

                await GLOBAL_VARIABLES.setHouse.collection('users').get().then(async (querySnapshot) => {

                    if (querySnapshot.empty) return res.status(200).send({
                        message: "no users found"
                    });

                    const docs = querySnapshot.docs;
                    docs.forEach(async (doc) => {

                        const userDocData = doc.data();
                        if (userDocData) {

                            const data = ({
                                userID: doc.id,
                                userData: userDocData
                            });

                            usersNumberArray.push(userDocData.total_distance_run);
                            usersDataArray.push(data);

                        }

                    });

                    return;

                }).catch((error) => {
                    return res.status(400).send({
                        message: error
                    });
                });

                return usersNumberArray;

            }

            return;

        }

        return res.status(400).send({
            message: "invalid type option - type must be one of the following: city, age, overall"
        });

    } catch (err) {
        return handleError(res, err);
    }

}

export async function starter(req: Request, res: Response, next: NextFunction) {

    try {

        const data = {
            name: 'Polarsec task API',
            author: 'abrahamzilberbl',
            docs: '',
            endpoints: [
                {
                    signup: {
                        link:
                            API_BASE_URL + '/signup',
                        description:
                            'Signs the user up to the application',
                        requestMethods: [
                            'POST /signup'
                        ]
                    },
                    update: {
                        link:
                            API_BASE_URL + '/update',
                        description:
                            'Updates the users total running distance',
                        requestMethods: [
                            'POST /update'
                        ]
                    },
                    mystats: {
                        link:
                            API_BASE_URL + '/mystats',
                        description:
                            "Returns the users' ranking",
                        requestMethods: [
                            'POST /mystats'
                        ]
                    }
                },
            ],
        };

        return res.json(data);

    } catch (err) {
        return handleError(res, err);
    }

}

function handleError(res: Response, err: any) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}