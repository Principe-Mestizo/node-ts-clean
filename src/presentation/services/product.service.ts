import { prisma } from "../../data/mysql";
import { CustomError, UserEntity } from "../../domain";
import { CreateProductDto } from "../../domain/dtos/products/create-product.dto";
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { ProductEntity } from "../../domain/entities/producto.entity";

export class ProductService {
    constructor() { }

    public async createProduct(createProductDto: CreateProductDto, user: UserEntity) {
        const productExists = await prisma.product.findFirst({
            where: { name: createProductDto.name }
        });

        if (productExists) throw CustomError.badRequest('Product already exists');

        const categoryExists = await prisma.category.findUnique({
            where: { id: createProductDto.categoryId }
        });

        if (!categoryExists) throw CustomError.badRequest('Category does not exist');

        try {
            const product = await prisma.product.create({
                data: {
                    name: createProductDto.name,
                    available: createProductDto.available,
                    price: createProductDto.price,
                    description: createProductDto.description,
                    category: {
                        connect: { id: createProductDto.categoryId }
                    },
                    user: {
                        connect: { id: user.id }
                    }
                }
            });

            return product;

        } catch (error) {
            console.error(error);
            throw CustomError.internalServe(`${error}`);
        }
    }

    public async gettProducts(paginationDto: PaginationDto) {

        const { page, limit } = paginationDto;


        try {

            // todo : para realizar meticiones await al mismo tiempo

            const [total, products] = await Promise.all([
                prisma.product.count(),
                prisma.product.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: {
                        name: 'asc'
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                emailValidated: true,
                                role: true,
                            }
                        },
                        category: true
                    }
                })
            ]);

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/product?page=${page + 1}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/api/product?page=${(page - 1)}&limit=${limit}` : null,
                // me trae todo  lo que tenga incluido la relacion
                products: products.map(product => ({
                    ...product,
                    user: product.user,
                    category: product.category
                }))

                //  products: products.map( product => ({

                //      id: product.id,
                //      name: product.name,
                //      available: product.available

                //  }))
                // products: products.map(product => ProductEntity.fromObject( product))

            }

        } catch (error) {
            console.log(error);

            throw CustomError.internalServe('Error internal Server');
        }
    }
}