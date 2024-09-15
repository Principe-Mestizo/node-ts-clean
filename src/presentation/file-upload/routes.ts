import { Router } from "express";
import { FileUploadController } from "./controller";
import { FileUploadService } from "../services/file.service";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";
import { TypeMiddleware } from "../middlewares/type-file.middleware";




export class FileUploadRoutes{
    static get routes():Router {

        const router = Router();
         
        const uploadService = new FileUploadService;
        const controller = new FileUploadController(uploadService);

        router.use( FileUploadMiddleware.containFiles )
        router.use( TypeMiddleware.validTypes(['users', 'products', 'categoiries']));
        
        router.post('/single/:type',controller.uploadFile);
        router.post('/multiple/:type', controller.uploadMultipleFile);
  
        return router;
    }
}