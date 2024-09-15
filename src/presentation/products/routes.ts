import { Router } from "express";
import { ProductController } from "./controller";
import { ProductService } from "../services/product.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";




export class ProductRoutes{
    static get routes():Router {

        const router = Router();
         
        const productService = new ProductService;
        const controller = new ProductController(productService);

        router.get('/', [AuthMiddleware.validateJWT],controller.getProducts);
        router.post('/', [AuthMiddleware.validateJWT], controller.createProduct);
        router.get('/:id', controller.getProduct);
        router.put('/:id', controller.updateProduct);
        router.delete('/:id', controller.deleteProduct);


        return router;
    }
}