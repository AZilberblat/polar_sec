import 'jest';

import { describe, expect, test } from '@jest/globals';
import { starter } from '../src/controllers/users.controller';
import { API_BASE_URL } from '../src/config/env.config';

describe('starter', () => {

    test('should return API specs', async () => {

        const req = {
            body: {

            }
        }
        const res = {
            send: (payload: any) => {
                expect(payload).toBe({
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
                });
            },
            status: (code: any) => {
                expect(code).toBe(200);
            }
        }
        const next = {

        }

        await starter(req as any, res as any, next as any)

    });

});
