import { Schema } from '../validators/ingress.validators';

export const signupSchema: Schema = {
    fields: {
        name: "string",
        age: "number",
        city: "string"
    },
    required: ['name', 'age', 'city']
}