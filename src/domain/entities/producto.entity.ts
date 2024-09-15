import { CustomError } from "../errors/custom.error";

export class ProductEntity {
    constructor(
        public id: string,
        public name: string,
        public available: boolean,
        public price: number,
        public description: string | null,
        public userId: string,
        public categoryId: string
    ) {}

    static fromObject(object: { [key: string]: any }): ProductEntity {
        const { id, name, available, price, description, userId, categoryId } = object;
        
        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');
        if (typeof price !== 'number' || isNaN(price)) throw CustomError.badRequest('Invalid price');
        if (!userId) throw CustomError.badRequest('Missing userId');
        if (!categoryId) throw CustomError.badRequest('Missing categoryId');

        let availableBoolean = available;
        if (typeof available !== 'boolean') {
            availableBoolean = (available === 'true');
        }

        return new ProductEntity(
            id,
            name,
            availableBoolean,
            price,
            description || null,
            userId,
            categoryId
        );
    }
}