import { CustomError } from "../errors/custom.error";

export class CategoryEntity {

    constructor(
        public id: string,
        public name: string,
        public available:boolean,


    ) { }

    static fromObject( object: { [key:string]:any}) :CategoryEntity{

        const { id , name, available,} = object;
        let availableBoolean = available;

        if( !id ) throw CustomError.badRequest('Missing id');
        if( !name ) throw CustomError.badRequest('Missing name');
        if (typeof available !== 'boolean') {
            availableBoolean = (available === 'true');
        }
    
        return new CategoryEntity( id, name, availableBoolean);

    }
}