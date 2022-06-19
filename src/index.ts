import express, { Express, Request, Response, RequestHandler } from 'express';

import * as admin from 'firebase-admin';
import cors from 'cors';
import dotenv from 'dotenv';
import * as serviceAccount from './certificate/permissions.json';

const ServiceAccountPARAMS = {

    type: serviceAccount.type,
    projectId: serviceAccount.project_id,
    privateKeyId: serviceAccount.private_key_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    clientId: serviceAccount.client_id,
    authUri: serviceAccount.auth_uri,
    tokenUri: serviceAccount.token_uri,
    authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
    clientC509CertUrl: serviceAccount.client_x509_cert_url

}

admin.initializeApp({

    credential: admin.credential.cert(ServiceAccountPARAMS),
    databaseURL: "https://polar-sec-task.firebaseio.com",
    storageBucket: "polar-sec-task.appspot.com"

});

import { authRoutesConfig } from './routes/auth.routes';
import { userRoutesConfig } from './routes/user.routes';
import { API_BASE_URL } from './config/env.config';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;
app.use(express.json() as RequestHandler);
app.use(express.urlencoded({
    extended: true
}) as RequestHandler);
app.use(cors({ origin: true }));

authRoutesConfig(app);
userRoutesConfig(app);

app.get('/', (req: Request, res: Response) => {

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

});

app.listen(port, () => {
    console.log('Server is running on port', port);
});