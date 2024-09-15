import { prisma } from "../../data/mysql";
import { CustomError, UserEntity } from "../../domain";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { CategoryEntity } from "../../domain/entities/category.entity";

export class CategoryService {
    constructor(

    ){}

    public async getCategories( paginationDto: PaginationDto){
        
        const  {page, limit } = paginationDto;


        try {

            // todo : para realizar meticiones await al mismo tiempo

            const [total,categories] = await Promise.all([
                prisma.category.count(),
                prisma.category.findMany({
                    skip: (page -1) * limit,
                    take: limit,
                    orderBy: {
                        name: 'asc'
                    }
                })
            ]);

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/categories?page=${ page + 1}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/api/categories?page=${ (page-1)}&limit=${limit}`: null,            

                // categories: categories.map( category => ({
    
                //     id: category.id,
                //     name: category.name,
                //     available: category.available
    
                // }))
                 categories: categories.map(category => CategoryEntity.fromObject(category))

            }

        } catch (error) {
            console.log(error);
            
            throw CustomError.internalServe('Error internal Server');
        }
    }

    public async createCategory( createCategoryDto: CreateCategoryDto, user:UserEntity) {
        
        const categoryExists = await prisma.category.findFirst({
            where: { name: createCategoryDto.name }
        });

        if( categoryExists) throw CustomError.badRequest('Category already exists');

        try {

            const  category = await prisma.category.create({
                data: {
                    ...createCategoryDto,
                    userId: user.id
                }
            })


            return CategoryEntity.fromObject(category);


        } catch (error) {
            throw CustomError.internalServe('Internal error')
        }


    }
}