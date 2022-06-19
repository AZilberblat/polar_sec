import * as dotenv from 'dotenv';

dotenv.config();

export const API_KEY_VALUE = process.env.API_KEY_VALUE!;
export const API_BASE_URL = process.env.API_BASE_URL!;
export const IDENTITY_TOOLKIT_BASE_URL = process.env.IDENTITY_TOOLKIT_BASE_URL!;
export const IDENTITY_TOOLKIT_KEYHOLDER = process.env.IDENTITY_TOOLKIT_KEYHOLDER!;
export const SECURE_API_BASE_URL = process.env.SECURE_API_BASE_URL!;
export const SECURE_API_KEYHOLDER = process.env.SECURE_API_KEYHOLDER!;
export const CUSTOM_TOKEN_KEYHOLDER = process.env.CUSTOM_TOKEN_KEYHOLDER!;
export const RESET_API_KEYHOLDER = process.env.RESET_API_KEYHOLDER!;
export const SALT = process.env.SALT!;