export class CreateProductDto {
    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly categoryId: string,
        public readonly description?: string,
    ){}

    static create(object: {[key:string]: any}): [string?, CreateProductDto?] {
        const {name, available, price, description, categoryId} = object;
        let availableBoolean = available;

        if (!name) return ['Missing name'];
        if (!categoryId) return ['Missing category id'];
        if (typeof price !== 'number' || isNaN(price)) return ['Price must be a valid number'];
        
        if (typeof available !== 'boolean') {
            availableBoolean = (available === 'true');
        }

        return [undefined, new CreateProductDto(name, availableBoolean, price, categoryId, description)];
    }
}