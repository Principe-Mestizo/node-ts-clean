import { NextFunction, Request, Response } from "express";


export class TypeMiddleware {

    static validTypes( validTpes: string[]) {
        return ( req:Request, res: Response, next: NextFunction) => {
            const type = req.url.split('/').at(2) ?? '' ;
            
            if ( !validTpes.includes( type )) {
                return res.status(400)
                    .json( {error: `Invalid type: ${type}, valid ones ${validTpes}`})
            }

            next();

        }

    }

}