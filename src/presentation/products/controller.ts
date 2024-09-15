import { Request, Response } from "express"
import { CustomError } from "../../domain"
import { CreateProductDto } from "../../domain/dtos/products/create-product.dto"
import { ProductService } from "../services/product.service"
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto"



export class ProductController{

    constructor(
        public readonly productService : ProductService
    ){}

    private handleError = (error:unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message})
        }

        return res.status(500).json({ error: 'Internal server error'})
    }

    getProducts = (req: Request, res: Response) => {

        const  { page = 1, limit = 10} = req.query;
        const  [ error, paginationDto] = PaginationDto.create( +page, +limit);
        if (error) return res.status(400).json({ error });


        this.productService.gettProducts( paginationDto!)
            .then( products => res.json( products))
            .catch( error => this.handleError(error, res))
    }


    createProduct = (req: Request, res: Response) => {
        
        const [error, createProductDto] = CreateProductDto.create(req.body);
        if (error) return res.status(400).json({ error });
        this.productService.createProduct(createProductDto!, req.body.user)
            .then(product => res.status(201).json(product))
            .catch(error => this.handleError(error, res));
    }

    getProduct = (req: Request, res: Response) => {
        res.json('Create')
    }



    updateProduct = (req: Request, res: Response) => {
        res.json('Create')
    }


    deleteProduct = (req: Request, res: Response) => {
        res.json('Create')
    }


}