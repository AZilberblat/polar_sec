import { Request, Response } from "express";

export function isAuthorized(opts: { hasRole: Array<'admin' | 'manager'>, allowSameUser?: boolean }) {

    return (req: Request, res: Response, next: Function) => {

        const { role, email, uid } = res.locals
        const { id } = req.params

        /** 
         * this condition will be removed after testing phase 
        **/
        if (email === 'zustmornah@gmail.com') {
            return next();
        }

        if (opts.allowSameUser && id && uid === id) {
            return next();
        }

        if (!role) {
            return res.status(403).send({
                message: 'no role specified, user role needed for authenticating this request.'
            });
        }

        if (opts.hasRole.includes(role) || opts.allowSameUser) {
            return next();
        }

        return res.status(403).send({
            message: 'Unauthorized'
        });

    }

}